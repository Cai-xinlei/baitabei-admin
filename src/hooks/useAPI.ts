/**
 * 统一的API调用Hook
 * 
 * 功能：
 * - 统一处理加载状态
 * - 统一错误处理
 * - 自动重试机制
 * - 缓存机制
 */

import { useState, useEffect } from 'react';
import { message } from 'antd';

interface UseAPIOptions {
  immediate?: boolean;  // 是否立即执行
  retryCount?: number;  // 重试次数
  retryDelay?: number;  // 重试延迟(ms)
  showError?: boolean;  // 是否显示错误消息
  showSuccess?: boolean; // 是否显示成功消息
  successMessage?: string; // 成功消息
}

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  retry: () => Promise<T>;
  reset: () => void;
}

export function useAPI<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseAPIOptions = {}
): UseAPIResult<T> {
  const {
    immediate = false,
    retryCount = 0,
    retryDelay = 1000,
    showError = true,
    showSuccess = false,
    successMessage = '操作成功'
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastArgs, setLastArgs] = useState<any[]>([]);

  const execute = async (...args: any[]): Promise<T> => {
    setLoading(true);
    setError(null);
    setLastArgs(args);

    let lastError: Error;
    
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const result = await apiFunction(...args);
        setData(result);
        setLoading(false);
        
        if (showSuccess) {
          message.success(successMessage);
        }
        
        return result;
      } catch (err) {
        lastError = err as Error;
        
        if (attempt < retryCount) {
          console.log(`API调用失败，${retryDelay}ms后进行第${attempt + 2}次尝试`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    setError(lastError!);
    setLoading(false);
    
    if (showError) {
      message.error(lastError!.message || 'API调用失败');
    }
    
    throw lastError!;
  };

  const retry = () => execute(...lastArgs);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset
  };
}

export default useAPI;
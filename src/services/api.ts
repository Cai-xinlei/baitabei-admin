/**
 * API 服务层 - 与Java后端对接
 * 
 * 说明：
 * - 当前使用Mock数据进行展示
 * - 所有API接口都预留了与Java Spring Boot后端对接的位置
 * - 后续只需要修改baseURL和取消Mock数据即可
 */

import axios from 'axios';
import { message } from 'antd';

// API基础配置
const API_CONFIG = {
  // TODO: 替换为Java后端实际地址
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://api.baitabei.com'
    : 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建axios实例
const apiClient = axios.create(API_CONFIG);

// 请求拦截器 - 添加认证Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理通用错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);

    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录');
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      message.error('权限不足，无法访问');
    } else if (error.response?.status >= 500) {
      message.error('服务器内部错误，请稍后重试');
    } else {
      message.error(error.response?.data?.message || '请求失败');
    }

    return Promise.reject(error);
  }
);

// 用户相关API接口
export const userAPI = {
  // 用户登录
  login: async (credentials: { username: string; password: string }) => {
    // TODO: 连接Java后端 POST /api/auth/login
    // return apiClient.post('/api/auth/login', credentials);

    // Mock数据
    console.log('🔌 API调用 - 用户登录:', credentials);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟

    const mockUsers = {
      'admin': { id: '1', username: 'admin', realName: '超级管理员', role: 'admin' },
      'content': { id: '2', username: 'content', realName: '内容管理员', role: 'content' },
      'judge': { id: '3', username: 'judge', realName: '评委专家', role: 'judge' },
    };

    const user = mockUsers[credentials.username as keyof typeof mockUsers];
    if (user && credentials.password.includes('123')) {
      return {
        success: true,
        data: {
          user,
          token: 'mock_token_' + Date.now(),
          expiresIn: 7200
        }
      };
    } else {
      throw new Error('用户名或密码错误');
    }
  },

  // 获取用户列表
  getUserList: async (params: { page?: number; size?: number; search?: string; role?: string }) => {
    // TODO: 连接Java后端 GET /api/users
    // return apiClient.get('/api/users', { params });

    console.log('🔌 API调用 - 获取用户列表:', params);
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUsers = [
      {
        id: '1',
        username: 'zhangsan001',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        realName: '张三',
        role: 'participant',
        status: 'active',
        avatar: '/images/default-avatar.jpg',
        registrationDate: '2025-01-15',
        lastLogin: '2025-01-29',
        participationCount: 3
      },
      // ... 更多mock数据
    ];

    return {
      success: true,
      data: {
        list: mockUsers,
        total: mockUsers.length,
        page: params.page || 1,
        size: params.size || 10
      }
    };
  },

  // 创建用户
  createUser: async (userData: any) => {
    // TODO: 连接Java后端 POST /api/users
    console.log('🔌 API调用 - 创建用户:', userData);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: '用户创建成功' };
  },

  // 更新用户
  updateUser: async (id: string, userData: any) => {
    // TODO: 连接Java后端 PUT /api/users/{id}
    console.log('🔌 API调用 - 更新用户:', id, userData);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: '用户更新成功' };
  },

  // 删除用户
  deleteUser: async (id: string) => {
    // TODO: 连接Java后端 DELETE /api/users/{id}
    console.log('🔌 API调用 - 删除用户:', id);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: '用户删除成功' };
  },
};

export default {
  userAPI,
};
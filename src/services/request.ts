import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const service = axios.create({
    // baseURL: 'http://www.baitabei.com', // 代理地址
    // baseURL: 'http://39.106.56.69:8080', // 代理地址
    timeout: 15000,
    withCredentials: true
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 从localStorage中获取token
        const token = localStorage.getItem('token');
        if (token) {
            // 确保headers对象存在
            // config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        if (response.data.code === 200) {
            return response.data;
        } else {
            message.error(response.data.message);
        }

        // 直接返回完整响应数据，包含code, data, message等
    },
    (error) => {
        const { response } = error;
        console.log(response, '错误信息');
        if (response) {
            const { code } = response.data || {};
            // token过期或无效
            if (code === 401) {
                // 清除本地存储的token
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenType');
                localStorage.removeItem('user');
                // 跳转到登录页或执行其他操作
                window.location.href = '/login';
                message.error(response?.message ?? '登录已过期，请重新登录');
                return Promise.reject(new Error('登录已过期，请重新登录'));
            }
            // 其他业务错误
            const errorMsg = response?.message || '请求失败';
            message.error(errorMsg);
            return Promise.reject(new Error(errorMsg));
        } else {
            // 网络错误
            if (!window.navigator.onLine) {
                message.error('网络已断开，请检查网络连接');
                return Promise.reject(new Error('网络已断开，请检查网络连接'));
            }
            message.error('网络错误');
            return Promise.reject(new Error('网络错误'));
        }
    }
);

// 封装通用请求方法
export const request = {
    // 优化get请求参数传递方式
    get: async (url, params = {}, config = {}) => {
        try {
            // 将params参数合并到config中，确保参数正确传递
            const response: any = await service.get(url, { ...config, params });
            return response;
        } catch (error) {
            throw error;
        }
    },
    post: async (url, data = {}, config = {}) => {
        try {
            const response: any = await service.post(url, data, config);
            return response;
        } catch (error) {
            throw error;
        }
    },
    put: async (url, data = {}, config = {}) => {
        try {
            const response: any = await service.put(url, data, config);
            return response;
        } catch (error) {
            throw error;
        }
    },
    delete: async (url, params = {}, config = {}) => {
        try {
            const response: any = await service.delete(url, { ...config, params });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default service;
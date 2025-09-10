import request from './request';
import axios from 'axios';


// 用户列表
export const getUserList = async (params) => {
    const response: any = await request.get('/api/user/page', { params });
    return response;
};

// 用户列表 - 删除
export const deleteUser = async (userId) => {
    const response: any = await request.delete(`/api/user/delete/${userId}`);
    return response;
};

// 用户列表 -更新
export const updateUser = async (params) => {
    const response: any = await request.put('/api/user/update', params);
    return response;
};
// 用户列表 -更新
export const createUser = async (params) => {
    const response: any = await request.put('/api/user/create', params);
    return response;
};


// 项目列表
export const getProjectList = async (params) => {
    const response: any = await request.get('/api/project/page', { params });
    return response;
};
// 项目列表
export const getPreview = async (params) => {
    const response: any = await request.get('/api/file/preview', { params });
    return response;
};

// 项目列表 - 删除
export const deleteProject = async (projectId) => {
    const response: any = await request.delete(`/api/project/delete/${projectId}`);
    return response;
};
// 项目列表 - 项目详情
export const detailProject = async (projectId) => {
    const response: any = await request.get(`/api/project/detail/${projectId}`);
    return response;
};


// 内容管理-新闻资讯列表
export const queryZixunList = async (params) => {
    const response: any = await request.get('/api/news', { params });
    return response;
};
export const queryZixunDelete = async (params) => {
    const response: any = await request.get(`/api/news/${params}`,);
    return response;
};
// **接口地址**: `GET /news/{id}`

// ### 6.3 创建新闻

// **接口地址**: `POST /news`

// ### 6.4 更新新闻

// **接口地址**: `PUT /news/{id}`

// ### 6.5 发布新闻

// **接口地址**: `POST /news/{id}/publish`

// ### 6.6 删除新闻

// **接口地址**: `DELETE /news/{id}`



// 登出
export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await request.post('/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    } finally {
        // 清除本地存储的token
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('user');
    }
    return true;
};

// 获取用户信息
export const getUserInfo = async () => {
    const response = await request.get('/api/user/profile');
    const { data } = response;
    return data.userInfo;
};

// 检查token是否过期，如果过期则刷新
export const checkAndRefreshToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('未登录');
    }

    // 这里可以添加检查token是否过期的逻辑
    // 例如解析JWT token获取过期时间
    // 为了简化示例，我们直接尝试刷新token
    await refreshToken();
};


// 项目提交
export const projectsSubmit = async (submitData) => {
    const response = await request.post('/api/project/submit', submitData);
    console.log(response, '提交的信息');
    return response;
};


// 文件上传
export const uploadFile = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    // 配置上传参数
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',

        },
        // 如果需要上传进度回调
        onUploadProgress: onProgress
    };

    try {
        const response = await request.post('/api/files/upload', formData, config);
        const { data } = response;
        return data;
    } catch (error) {
        throw error;
    }
};


// 文件上传方法
export const customUpload = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    try {
        // 创建 FormData 对象
        const formData = new FormData();
        formData.append('file', file);

        // 设置上传配置
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                // 添加 Authorization 头
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'token': localStorage.getItem('token')
            },
            // 监听上传进度
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percent = Math.round((loaded / total) * 100);
                onProgress({ percent });
            },
            withCredentials: true
        };

        // 发送 POST 请求
        const response = await axios.post(
            'http://39.106.56.69:8080/api/file/upload',
            formData,
            config
        );
        console.log(response, 'responseresponse');
        // 处理响应
        if (response.data.code === 200) {
            onSuccess({
                name: response.data.data.fileName,
                url: response.data.data,
                status: 'done',
                fileId: response.data.data.fileId,
                fileSize: response.data.data.fileSize,
                fileType: response.data.data.fileType
            });

            return {
                success: true,
                data: {
                    name: response.data.data.fileName,
                    url: response.data.data,
                    fileId: response.data.data.fileId,
                    fileSize: response.data.data.fileSize,
                    fileType: response.data.data.fileType
                }
            };
        } else {
            const errorMessage = response.data.message || '上传失败';
            onError(new Error(errorMessage));
            return {
                success: false,
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error.response?.data?.message || error.message || '文件上传失败';
        onError(error);
        return {
            success: false,
            error: errorMessage
        };
    }
};
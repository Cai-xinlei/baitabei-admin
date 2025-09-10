import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import defaultAvatar from '@/assets/images/default-avatar.jpg';
import request from '@/services/request'
interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'content_manager' | 'judge_manager' | 'judge';
  avatar?: string;
  realName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: ({ username, password }) => Promise<boolean>;
  logout: () => void;
  // hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查本地存储的登录信息
    const savedUser = localStorage.getItem('baitabei_admin_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('baitabei_admin_user');
      }
    }
  }, []);

  const login = async (loginData) => {
    const response: any = await request.post('/api/auth/login', loginData);
    const { success, data } = response;
    console.log(response, 'responseresponse');

    if (!success) {
      message.error(response.message)
      return false;

    }
    const { accessToken, refreshToken } = data;
    // 存储token到localStorage
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(data)
    localStorage.setItem('baitabei_admin_user', JSON.stringify(data));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('baitabei_admin_user');
    message.success('退出成功');
    navigate('/login')
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // 超级管理员拥有所有权限
    if (user.role === 'super_admin') return true;

    // 根据角色判断权限
    const rolePermissions = {
      content_manager: ['content:read', 'content:write', 'users:read', 'registrations:read'],
      judge_manager: ['judges:read', 'judges:write', 'evaluation:read', 'evaluation:write'],
      judge: ['evaluation:read', 'evaluation:write']
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      // hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

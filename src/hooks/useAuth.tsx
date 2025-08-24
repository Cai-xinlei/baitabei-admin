import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { message } from 'antd';

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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@baitabei.com',
    role: 'super_admin' as const,
    realName: '系统管理员',
    avatar: './images/default-avatar.jpg'
  },
  {
    id: '2',
    username: 'content',
    password: 'content123',
    email: 'content@baitabei.com',
    role: 'content_manager' as const,
    realName: '内容管理员',
    avatar: './images/default-avatar.jpg'
  },
  {
    id: '3',
    username: 'judge',
    password: 'judge123',
    email: 'judge@baitabei.com',
    role: 'judge' as const,
    realName: '评委专家',
    avatar: './images/default-avatar.jpg'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查本地存储的登录信息
    const savedUser = localStorage.getItem('baitabei_admin_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('baitabei_admin_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 模拟登录请求
      const user = mockUsers.find(u => u.username === username && u.password === password);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('baitabei_admin_user', JSON.stringify(userWithoutPassword));
        message.success('登录成功');
        return true;
      } else {
        message.error('用户名或密码错误');
        return false;
      }
    } catch (error) {
      message.error('登录失败，请稍后重试');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('baitabei_admin_user');
    message.success('退出成功');
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
      hasPermission
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

import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Alert, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, TrophyOutlined } from '@ant-design/icons';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const testAccounts = [
    { username: 'admin', password: 'admin123', role: '超级管理员' },
    { username: 'content', password: 'content123', role: '内容管理员' },
    { username: 'judge', password: 'judge123', role: '评委专家' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <TrophyOutlined className="text-2xl text-white" />
          </div>
          <Title level={2} className="text-gray-800 mb-2">
            2025年白塔杯
          </Title>
          <Text className="text-gray-600">
            管理后台系统
          </Text>
        </div>

        {/* 登录表单 */}
        <Card className="shadow-lg border-0">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Button
                  type="link"
                  className="p-0"
                  onClick={() => setShowTestAccounts(!showTestAccounts)}
                >
                  测试账号
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-base font-medium"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          {/* 测试账号信息 */}
          {showTestAccounts && (
            <Alert
              message="测试账号"
              description={
                <Space direction="vertical" className="w-full">
                  {testAccounts.map((account, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <Text className="text-sm">
                        <Text strong>{account.role}:</Text> {account.username} / {account.password}
                      </Text>
                    </div>
                  ))}
                </Space>
              }
              type="info"
              showIcon
              className="mt-4"
            />
          )}
        </Card>

        {/* 底部信息 */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <Text>版权所有 © 2025 白塔杯组委会</Text>
        </div>
      </div>
    </div>
  );
};

export default Login;

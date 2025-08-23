import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Drawer,
  Form,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  DatePicker,
  Switch
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAPI } from '../hooks/useAPI';
import { userAPI } from '../services/api';
import { USER_ROLES, USER_ROLE_NAMES, USER_STATUS } from '../utils/constants';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  realName: string;
  role: string;
  status: string;
  avatar?: string;
  registrationDate: string;
  lastLogin?: string;
  participationCount: number;
}

const UserManagement: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [form] = Form.useForm();
  
  // 获取用户列表
  const {
    data: userListData,
    loading,
    execute: loadUsers
  } = useAPI(() => userAPI.getUserList({
    search: searchText,
    role: roleFilter
  }), { immediate: true });
  
  // 用户操作 API
  const { execute: createUser, loading: createLoading } = useAPI(
    userAPI.createUser, 
    { showSuccess: true, successMessage: '用户创建成功' }
  );
  
  const { execute: updateUser, loading: updateLoading } = useAPI(
    userAPI.updateUser,
    { showSuccess: true, successMessage: '用户更新成功' }
  );
  
  const { execute: deleteUser } = useAPI(
    userAPI.deleteUser,
    { showSuccess: true, successMessage: '用户删除成功' }
  );

  // 从API获取的用户数据
  const users = userListData?.data?.list || [];
  const total = userListData?.data?.total || 0;
  
  // 统计数据
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    participants: users.filter(u => u.role === 'participant').length,
    judges: users.filter(u => u.role === 'judge').length
  };

  // 表格列配置
  const columns: ColumnsType<User> = [
    {
      title: '用户信息',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.realName}</div>
            <div className="text-gray-500 text-sm">{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div className="flex items-center mb-1">
            <MailOutlined className="mr-1 text-gray-400" />
            <Text className="text-sm">{record.email}</Text>
          </div>
          <div className="flex items-center">
            <PhoneOutlined className="mr-1 text-gray-400" />
            <Text className="text-sm">{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={
          role === 'admin' ? 'red' :
          role === 'judge' ? 'blue' : 'green'
        }>
          {role === 'admin' ? '管理员' :
           role === 'judge' ? '评委' : '参赛者'}
        </Tag>
      ),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '评委', value: 'judge' },
        { text: '参赛者', value: 'participant' }
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'active' ? 'green' :
          status === 'inactive' ? 'orange' : 'red'
        }>
          {status === 'active' ? '正常' :
           status === 'inactive' ? '非活跃' : '已禁用'}
        </Tag>
      ),
      filters: [
        { text: '正常', value: 'active' },
        { text: '非活跃', value: 'inactive' },
        { text: '已禁用', value: 'banned' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '注册时间',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.registrationDate).unix() - dayjs(b.registrationDate).unix(),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date?: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
      sorter: (a, b) => {
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return dayjs(a.lastLogin).unix() - dayjs(b.lastLogin).unix();
      },
    },
    {
      title: '参赛次数',
      dataIndex: 'participationCount',
      key: 'participationCount',
      sorter: (a, b) => a.participationCount - b.participationCount,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      registrationDate: dayjs(user.registrationDate)
    });
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '确认删除',
      content: '您确定要删除这个用户吗？此操作不可恢复。',
      async onOk() {
        try {
          await deleteUser(id);
          loadUsers(); // 重新加载用户列表
        } catch (error) {
          console.error('删除用户失败:', error);
        }
      },
    });
  };

  const handleSave = async (values: any) => {
    try {
      const userData = {
        ...values,
        registrationDate: values.registrationDate?.format ? values.registrationDate.format('YYYY-MM-DD') : values.registrationDate
      };
      
      if (editingUser) {
        // 编辑用户
        await updateUser(editingUser.id, userData);
      } else {
        // 新增用户
        await createUser(userData);
      }
      
      setDrawerVisible(false);
      setEditingUser(null);
      form.resetFields();
      loadUsers(); // 重新加载用户列表
    } catch (error) {
      console.error('保存用户失败:', error);
    }
  };

  const handleExport = () => {
    message.success('导出成功，文件正在下载...');
  };

  // 当搜索条件变化时重新加载数据
  const handleSearch = () => {
    loadUsers();
  };
  
  // 使用原始用户列表，筛选在后端完成
  const filteredUsers = users;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>用户管理</Title>
        <Text className="text-gray-600">
          管理系统中的所有用户账号，包括参赛者、评委和管理员
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="用户总数" value={stats.total} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="活跃用户" value={stats.active} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="参赛者" value={stats.participants} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="评委专家" value={stats.judges} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* 操作区域 */}
      <Card>
        <div className="table-operations">
          <Space>
            <Input.Search
              placeholder="搜索用户名、姓名或邮箱"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={handleSearch}
              onPressEnter={handleSearch}
              style={{ width: 250 }}
              enterButton
            />
            <Select
              placeholder="选择角色"
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                // 筛选条件变化时自动搜索
                setTimeout(handleSearch, 100);
              }}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="admin">管理员</Option>
              <Option value="judge">评委</Option>
              <Option value="participant">参赛者</Option>
            </Select>
            <Select
              placeholder="选择状态"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                // 筛选条件变化时自动搜索
                setTimeout(handleSearch, 100);
              }}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="active">正常</Option>
              <Option value="inactive">非活跃</Option>
              <Option value="banned">已禁用</Option>
            </Select>
          </Space>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setDrawerVisible(true);
              }}
            >
              新增用户
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出数据
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: total,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => {
              console.log('🔌 分页变化:', { page, pageSize });
              // TODO: 实现分页API调用
            }
          }}
        />
      </Card>

      {/* 编辑抽屉 */}
      <Drawer
        title={editingUser ? '编辑用户' : '新增用户'}
        width={600}
        onClose={() => {
          setDrawerVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>取消</Button>
            <Button 
              type="primary" 
              loading={createLoading || updateLoading} 
              onClick={() => form.submit()}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="role"
            label="用户角色"
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select placeholder="请选择用户角色">
              <Option value="participant">参赛者</Option>
              <Option value="judge">评委</Option>
              <Option value="admin">管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="用户状态"
            rules={[{ required: true, message: '请选择用户状态' }]}
          >
            <Select placeholder="请选择用户状态">
              <Option value="active">正常</Option>
              <Option value="inactive">非活跃</Option>
              <Option value="banned">已禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="registrationDate"
            label="注册时间"
            rules={[{ required: true, message: '请选择注册时间' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserManagement;

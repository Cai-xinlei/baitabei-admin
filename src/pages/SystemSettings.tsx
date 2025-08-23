import React, { useState } from 'react';
import {
  Tabs,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Upload,
  message,
  Divider,
  Row,
  Col,
  Table,
  Modal,
  Tag,
  Space,
  TimePicker,
  InputNumber,
  Alert
} from 'antd';
import {
  SettingOutlined,
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  SecurityScanOutlined,
  UserOutlined,
  BellOutlined,
  DatabaseOutlined,
  MailOutlined,
  CloudServerOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  autoBackup: boolean;
  emailNotifications: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  module: string;
  action: string;
  user: string;
  details: string;
}

const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // 系统配置
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    siteName: '2025年白塔杯文化创意大赛',
    siteDescription: '以“文化传承与创新融合”为主题的文化创意大赛',
    contactEmail: 'contact@baitabei.com',
    contactPhone: '400-123-4567',
    registrationEnabled: true,
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    maxFileSize: 50,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'png', 'mp4']
  });

  // 权限列表
  const permissions: Permission[] = [
    { id: '1', name: 'users:read', description: '查看用户', module: '用户管理' },
    { id: '2', name: 'users:write', description: '编辑用户', module: '用户管理' },
    { id: '3', name: 'content:read', description: '查看内容', module: '内容管理' },
    { id: '4', name: 'content:write', description: '编辑内容', module: '内容管理' },
    { id: '5', name: 'evaluation:read', description: '查看评审', module: '评审系统' },
    { id: '6', name: 'evaluation:write', description: '执行评审', module: '评审系统' },
    { id: '7', name: 'system:read', description: '查看系统设置', module: '系统管理' },
    { id: '8', name: 'system:write', description: '修改系统设置', module: '系统管理' }
  ];

  // 角色列表
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '超级管理员',
      description: '系统最高权限，可以访问所有功能',
      permissions: permissions.map(p => p.id),
      userCount: 2
    },
    {
      id: '2',
      name: '内容管理员',
      description: '负责内容管理和用户管理',
      permissions: ['1', '3', '4'],
      userCount: 5
    },
    {
      id: '3',
      name: '评委管理员',
      description: '管理评委和评审流程',
      permissions: ['1', '5', '6'],
      userCount: 3
    },
    {
      id: '4',
      name: '评委',
      description: '参与项目评审',
      permissions: ['5', '6'],
      userCount: 35
    }
  ]);

  // 系统日志
  const systemLogs: SystemLog[] = [
    {
      id: '1',
      timestamp: '2025-01-30 10:30:25',
      level: 'info',
      module: '用户管理',
      action: '用户登录',
      user: '管理员',
      details: '用户成功登录系统'
    },
    {
      id: '2',
      timestamp: '2025-01-30 10:25:15',
      level: 'warning',
      module: '评审系统',
      action: '评审超时',
      user: '李评委',
      details: '评审任务超过截止时间'
    },
    {
      id: '3',
      timestamp: '2025-01-30 09:45:30',
      level: 'error',
      module: '文件系统',
      action: '文件上传失败',
      user: '张参赛者',
      details: '文件大小超出限制'
    },
    {
      id: '4',
      timestamp: '2025-01-30 09:30:12',
      level: 'info',
      module: '系统维护',
      action: '自动备份',
      user: '系统',
      details: '数据备份成功完成'
    }
  ];

  // 角色表格列
  const roleColumns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限数量',
      key: 'permissionCount',
      render: (_, record) => (
        <Tag color="blue">{record.permissions.length}个权限</Tag>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Tag color="green">{count}人</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEditRole(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteRole(record.id)}
            size="small"
            disabled={record.id === '1'} // 不能删除超级管理员
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 日志表格列
  const logColumns: ColumnsType<SystemLog> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={
          level === 'error' ? 'red' :
          level === 'warning' ? 'orange' : 'blue'
        }>
          {level.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 100,
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
    },
  ];

  const handleSaveConfig = async (values: any) => {
    setLoading(true);
    try {
      setSystemConfig({ ...systemConfig, ...values });
      message.success('系统配置保存成功');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    roleForm.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setRoleModalVisible(true);
  };

  const handleDeleteRole = (id: string) => {
    confirm({
      title: '确认删除',
      content: '您确定要删除这个角色吗？此操作不可恢复。',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setRoles(roles.filter(r => r.id !== id));
        message.success('角色删除成功');
      },
    });
  };

  const handleSaveRole = async (values: any) => {
    setLoading(true);
    try {
      if (editingRole) {
        // 更新角色
        setRoles(roles.map(r => 
          r.id === editingRole.id 
            ? { ...r, ...values }
            : r
        ));
        message.success('角色更新成功');
      } else {
        // 新增角色
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
          userCount: 0
        };
        setRoles([...roles, newRole]);
        message.success('角色创建成功');
      }
      setRoleModalVisible(false);
      setEditingRole(null);
      roleForm.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const handleSystemMaintenance = () => {
    confirm({
      title: '系统维护',
      content: '您确定要开启系统维护模式吗？开启后用户将无法访问系统。',
      onOk() {
        message.success('系统维护模式已开启');
      },
    });
  };

  const handleBackupData = () => {
    message.loading('正在备份数据...', 0);
    setTimeout(() => {
      message.destroy();
      message.success('数据备份成功');
    }, 3000);
  };

  const handleClearLogs = () => {
    confirm({
      title: '清空日志',
      content: '您确定要清空所有系统日志吗？此操作不可恢复。',
      onOk() {
        message.success('系统日志已清空');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>系统设置</Title>
        <Text className="text-gray-600">
          管理系统配置、用户权限和系统维护
        </Text>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 基本设置 */}
          <TabPane tab={<span><SettingOutlined />基本设置</span>} key="basic">
            <Form
              form={form}
              layout="vertical"
              initialValues={systemConfig}
              onFinish={handleSaveConfig}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="siteName"
                    label="网站名称"
                    rules={[{ required: true, message: '请输入网站名称' }]}
                  >
                    <Input placeholder="请输入网站名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="contactEmail"
                    label="联系邮箱"
                    rules={[
                      { required: true, message: '请输入联系邮箱' },
                      { type: 'email', message: '请输入正确的邮箱格式' }
                    ]}
                  >
                    <Input placeholder="请输入联系邮箱" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="siteDescription"
                label="网站描述"
                rules={[{ required: true, message: '请输入网站描述' }]}
              >
                <TextArea rows={3} placeholder="请输入网站描述" />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                  <Form.Item name="registrationEnabled" label="开放报名" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item name="emailNotifications" label="邮件通知" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item name="autoBackup" label="自动备份" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="maxFileSize"
                    label="最大文件大小(MB)"
                    rules={[{ required: true, message: '请输入最大文件大小' }]}
                  >
                    <InputNumber min={1} max={500} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="allowedFileTypes"
                    label="允许的文件类型"
                    rules={[{ required: true, message: '请选择允许的文件类型' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="选择允许的文件类型"
                      options={[
                        { label: 'PDF', value: 'pdf' },
                        { label: 'Word', value: 'doc' },
                        { label: 'Word (docx)', value: 'docx' },
                        { label: 'PowerPoint', value: 'ppt' },
                        { label: 'PowerPoint (pptx)', value: 'pptx' },
                        { label: 'JPEG', value: 'jpg' },
                        { label: 'PNG', value: 'png' },
                        { label: 'MP4', value: 'mp4' }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Form>
          </TabPane>

          {/* 权限管理 */}
          <TabPane tab={<span><SecurityScanOutlined />权限管理</span>} key="permissions">
            <div className="mb-4 flex justify-between items-center">
              <Title level={4}>角色管理</Title>
              <Button
                type="primary"
                onClick={() => {
                  setEditingRole(null);
                  roleForm.resetFields();
                  setRoleModalVisible(true);
                }}
              >
                新增角色
              </Button>
            </div>
            
            <Table
              columns={roleColumns}
              dataSource={roles}
              rowKey="id"
              pagination={false}
            />
          </TabPane>

          {/* 系统维护 */}
          <TabPane tab={<span><DatabaseOutlined />系统维护</span>} key="maintenance">
            <Alert
              message="系统维护功能"
              description="请谨慎操作以下功能，建议在低峰时段进行系统维护。"
              type="warning"
              showIcon
              className="mb-6"
            />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Card title="数据备份" className="h-full">
                  <Paragraph>
                    定期备份系统数据，确保数据安全。
                  </Paragraph>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      上次备份：2025-01-30 02:00:00
                    </div>
                    <Button 
                      type="primary" 
                      icon={<CloudServerOutlined />}
                      onClick={handleBackupData}
                      block
                    >
                      立即备份
                    </Button>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card title="系统维护" className="h-full">
                  <Paragraph>
                    开启维护模式，用户将无法访问系统。
                  </Paragraph>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      状态：正常运行
                    </div>
                    <Button 
                      danger 
                      icon={<ExclamationCircleOutlined />}
                      onClick={handleSystemMaintenance}
                      block
                    >
                      开启维护模式
                    </Button>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card title="系统重启" className="h-full">
                  <Paragraph>
                    重新启动系统服务，清理缓存。
                  </Paragraph>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      上次重启：2025-01-29 03:30:00
                    </div>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={() => message.info('系统重启功能正在开发中...')}
                      block
                    >
                      重启系统
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 系统日志 */}
          <TabPane tab={<span><BellOutlined />系统日志</span>} key="logs">
            <div className="mb-4 flex justify-between items-center">
              <Title level={4}>系统操作日志</Title>
              <Button danger onClick={handleClearLogs}>
                清空日志
              </Button>
            </div>
            
            <Table
              columns={logColumns}
              dataSource={systemLogs}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 角色编辑模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={roleModalVisible}
        onCancel={() => {
          setRoleModalVisible(false);
          setEditingRole(null);
          roleForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setRoleModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => roleForm.submit()}>
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={roleForm}
          layout="vertical"
          onFinish={handleSaveRole}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          
          <Form.Item
            name="permissions"
            label="权限设置"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Select
              mode="multiple"
              placeholder="选择权限"
              options={permissions.map(p => ({
                label: `${p.description} (${p.name})`,
                value: p.id
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemSettings;

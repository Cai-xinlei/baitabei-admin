import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  Drawer,
  Descriptions,
  Steps,
  Upload,
  List,
  Avatar,
  Progress
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const { Step } = Steps;

interface Registration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  track: string;
  projectTitle: string;
  projectDescription: string;
  teamName?: string;
  teamMembers?: string[];
  submissionDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewDate?: string;
  reviewerId?: string;
  documents: { name: string; url: string; size: string }[];
}

const RegistrationManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [searchText, setSearchText] = useState('');
  const [trackFilter, setTrackFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 模拟报名数据
  const mockRegistrations: Registration[] = [
    {
      id: '1',
      userId: '1',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      userPhone: '13800138001',
      track: '创意设计',
      projectTitle: 'AI智能设计助手',
      projectDescription: '一个基于AI的设计辅助工具，能够帮助设计师快速生成创意方案...',
      teamName: '创意工厂',
      teamMembers: ['张三', '李四', '王五'],
      submissionDate: '2025-01-28',
      status: 'pending',
      documents: [
        { name: '项目计划书.pdf', url: '/files/plan1.pdf', size: '2.5MB' },
        { name: '作品演示.mp4', url: '/files/demo1.mp4', size: '15.2MB' }
      ]
    },
    {
      id: '2',
      userId: '2',
      userName: '李四',
      userEmail: 'lisi@example.com',
      userPhone: '13800138002',
      track: '技术创新',
      projectTitle: '区块链溃通系统',
      projectDescription: '基于区块链技术的新一代溃通系统，实现更高效、更安全的交通管理...',
      submissionDate: '2025-01-27',
      status: 'approved',
      reviewNotes: '项目技术方案可行，创新点突出，建议进入下一轮评审。',
      reviewDate: '2025-01-29',
      reviewerId: 'reviewer1',
      documents: [
        { name: '技术方案.pdf', url: '/files/tech2.pdf', size: '3.1MB' },
        { name: '系统架构图.png', url: '/files/arch2.png', size: '1.8MB' }
      ]
    },
    {
      id: '3',
      userId: '3',
      userName: '王五',
      userEmail: 'wangwu@example.com',
      userPhone: '13800138003',
      track: '文化传播',
      projectTitle: '数字博物馆体验平台',
      projectDescription: '运用VR/AR技术打造沉浸式文化体验，让用户可以远程参观博物馆...',
      teamName: '文化探索者',
      teamMembers: ['王五', '赵六'],
      submissionDate: '2025-01-26',
      status: 'reviewing',
      documents: [
        { name: '项目介绍.pdf', url: '/files/intro3.pdf', size: '4.2MB' },
        { name: 'VR演示视频.mp4', url: '/files/vr3.mp4', size: '28.5MB' }
      ]
    },
    {
      id: '4',
      userId: '4',
      userName: '赵六',
      userEmail: 'zhaoliu@example.com',
      userPhone: '13800138004',
      track: '商业模式',
      projectTitle: '绿色物流平台',
      projectDescription: '打造低碳环保的现代物流体系，通过智能化管理降低运输成本...',
      submissionDate: '2025-01-25',
      status: 'rejected',
      reviewNotes: '商业模式不够清晰，市场分析不够充分，建议完善后重新提交。',
      reviewDate: '2025-01-29',
      reviewerId: 'reviewer2',
      documents: [
        { name: '商业计划书.pdf', url: '/files/business4.pdf', size: '1.9MB' }
      ]
    }
  ];

  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);

  // 统计数据
  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    reviewing: registrations.filter(r => r.status === 'reviewing').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length
  };

  // 赛道列表
  const tracks = ['创意设计', '技术创新', '文化传播', '商业模式', '社会公益', '综合创新'];

  // 表格列配置
  const columns: ColumnsType<Registration> = [
    {
      title: '项目信息',
      key: 'project',
      render: (_, record) => (
        <div>
          <div className="font-medium text-blue-600 mb-1">{record.projectTitle}</div>
          <div className="text-gray-500 text-sm">
            {record.projectDescription.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      title: '参赛者',
      key: 'participant',
      render: (_, record) => (
        <div>
          <div className="flex items-center mb-1">
            <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
            <Text strong>{record.userName}</Text>
          </div>
          {record.teamName && (
            <div className="flex items-center text-sm text-gray-500">
              <TeamOutlined className="mr-1" />
              {record.teamName} ({record.teamMembers?.length || 0}人)
            </div>
          )}
        </div>
      ),
    },
    {
      title: '赛道',
      dataIndex: 'track',
      key: 'track',
      render: (track: string) => (
        <Tag color="blue">{track}</Tag>
      ),
      filters: tracks.map(track => ({ text: track, value: track })),
      onFilter: (value, record) => record.track === value,
    },
    {
      title: '提交时间',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      render: (date: string) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-1 text-gray-400" />
          {dayjs(date).format('YYYY-MM-DD')}
        </div>
      ),
      sorter: (a, b) => dayjs(a.submissionDate).unix() - dayjs(b.submissionDate).unix(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'orange', text: '待审核' },
          reviewing: { color: 'blue', text: '审核中' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' }
        };
        return (
          <Tag color={statusConfig[status as keyof typeof statusConfig]?.color}>
            {statusConfig[status as keyof typeof statusConfig]?.text}
          </Tag>
        );
      },
      filters: [
        { text: '待审核', value: 'pending' },
        { text: '审核中', value: 'reviewing' },
        { text: '已通过', value: 'approved' },
        { text: '已拒绝', value: 'rejected' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                size="small"
                style={{ color: '#52c41a' }}
              >
                通过
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
                size="small"
                danger
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleView = (registration: Registration) => {
    setSelectedRegistration(registration);
    setDrawerVisible(true);
  };

  const handleApprove = (id: string) => {
    confirm({
      title: '确认通过',
      content: '您确定要通过这个报名申请吗？',
      onOk() {
        setRegistrations(registrations.map(r =>
          r.id === id
            ? { ...r, status: 'approved', reviewDate: dayjs().format('YYYY-MM-DD') }
            : r
        ));
        message.success('审核通过');
      },
    });
  };

  const handleReject = (id: string) => {
    confirm({
      title: '确认拒绝',
      content: '您确定要拒绝这个报名申请吗？请输入拒绝理由：',
      onOk() {
        setRegistrations(registrations.map(r =>
          r.id === id
            ? { ...r, status: 'rejected', reviewDate: dayjs().format('YYYY-MM-DD') }
            : r
        ));
        message.success('已拒绝申请');
      },
    });
  };

  const handleExport = () => {
    message.success('导出成功，文件正在下载...');
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = !searchText ||
      registration.projectTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      registration.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      registration.teamName?.toLowerCase().includes(searchText.toLowerCase());

    const matchesTrack = !trackFilter || registration.track === trackFilter;
    const matchesStatus = !statusFilter || registration.status === statusFilter;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>报名管理</Title>
        <Text className="text-gray-600">
          管理和审核所有参赛项目的报名申请
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="总报名数" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="待审核" value={stats.pending} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="审核中" value={stats.reviewing} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div className="flex justify-between">
              <Statistic title="已通过" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
              <Statistic title="已拒绝" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 操作区域 */}
      <Card>
        <div className="table-operations">
          <Space>
            <Input
              placeholder="搜索项目名、参赛者或团队名"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="选择赛道"
              value={trackFilter}
              onChange={setTrackFilter}
              style={{ width: 150 }}
              allowClear
            >
              {tracks.map(track => (
                <Option key={track} value={track}>{track}</Option>
              ))}
            </Select>
            <Select
              placeholder="选择状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="pending">待审核</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Space>
          <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出数据
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRegistrations}
          tableLayout="fixed"
          scroll={{ x: 'max-content' }}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredRegistrations.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title="报名详情"
        width={800}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedRegistration(null);
        }}
        open={drawerVisible}
      >
        {selectedRegistration && (
          <div className="space-y-6">
            {/* 状态步骤 */}
            <Steps
              current={
                selectedRegistration.status === 'pending' ? 0 :
                  selectedRegistration.status === 'reviewing' ? 1 :
                    selectedRegistration.status === 'approved' ? 2 : 1
              }
              status={
                selectedRegistration.status === 'rejected' ? 'error' : 'process'
              }
            >
              <Step title="已提交" description="申请已提交" />
              <Step title="审核中" description="等待审核" />
              <Step
                title={selectedRegistration.status === 'approved' ? '已通过' : '完成'}
                description={selectedRegistration.status === 'approved' ? '审核通过' : '审核完成'}
              />
            </Steps>

            {/* 项目信息 */}
            <Card title="项目信息">
              <Descriptions column={2}>
                <Descriptions.Item label="项目名称" span={2}>
                  {selectedRegistration.projectTitle}
                </Descriptions.Item>
                <Descriptions.Item label="赛道">
                  <Tag color="blue">{selectedRegistration.track}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={
                    selectedRegistration.status === 'pending' ? 'orange' :
                      selectedRegistration.status === 'reviewing' ? 'blue' :
                        selectedRegistration.status === 'approved' ? 'green' : 'red'
                  }>
                    {
                      selectedRegistration.status === 'pending' ? '待审核' :
                        selectedRegistration.status === 'reviewing' ? '审核中' :
                          selectedRegistration.status === 'approved' ? '已通过' : '已拒绝'
                    }
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="项目描述" span={2}>
                  {selectedRegistration.projectDescription}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 参赛者信息 */}
            <Card title="参赛者信息">
              <Descriptions column={2}>
                <Descriptions.Item label="姓名">
                  {selectedRegistration.userName}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  {selectedRegistration.userEmail}
                </Descriptions.Item>
                <Descriptions.Item label="手机">
                  {selectedRegistration.userPhone}
                </Descriptions.Item>
                <Descriptions.Item label="提交时间">
                  {dayjs(selectedRegistration.submissionDate).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                {selectedRegistration.teamName && (
                  <>
                    <Descriptions.Item label="团队名称">
                      {selectedRegistration.teamName}
                    </Descriptions.Item>
                    <Descriptions.Item label="团队成员">
                      {selectedRegistration.teamMembers?.join('、')}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </Card>

            {/* 提交文件 */}
            <Card title="提交文件">
              <List
                dataSource={selectedRegistration.documents}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => message.info('正在下载...')}
                      >
                        下载
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined className="text-blue-500" />}
                      title={item.name}
                      description={`文件大小：${item.size}`}
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* 审核信息 */}
            {selectedRegistration.reviewDate && (
              <Card title="审核信息">
                <Descriptions column={2}>
                  <Descriptions.Item label="审核时间">
                    {dayjs(selectedRegistration.reviewDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Descriptions.Item>
                  <Descriptions.Item label="审核结果">
                    <Tag color={
                      selectedRegistration.status === 'approved' ? 'green' : 'red'
                    }>
                      {selectedRegistration.status === 'approved' ? '通过' : '拒绝'}
                    </Tag>
                  </Descriptions.Item>
                  {selectedRegistration.reviewNotes && (
                    <Descriptions.Item label="审核意见" span={2}>
                      {selectedRegistration.reviewNotes}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            )}

            {/* 操作按钮 */}
            {selectedRegistration.status === 'pending' && (
              <Card title="审核操作">
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      handleApprove(selectedRegistration.id);
                      setDrawerVisible(false);
                    }}
                  >
                    通过审核
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      handleReject(selectedRegistration.id);
                      setDrawerVisible(false);
                    }}
                  >
                    拒绝申请
                  </Button>
                </Space>
              </Card>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RegistrationManagement;

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
  Form,
  Rate,
  Progress,
  List,
  Avatar,
  Divider,

  Badge,
  Timeline
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TrophyOutlined,
  StarOutlined,
  FileTextOutlined,
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import useAuth from '../hooks/useAuth';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface EvaluationTask {
  id: string;
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  track: string;
  author: string;
  judgeId: string;
  judgeName: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedDate: string;
  deadline: string;
  submittedDate?: string;
  scores?: {
    creativity: number;
    practicality: number;
    technical: number;
    market: number;
    culture: number;
  };
  comments?: string;
  totalScore?: number;
}

interface EvaluationCriteria {
  name: string;
  weight: number;
  description: string;
}

const EvaluationSystem: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<EvaluationTask | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [trackFilter, setTrackFilter] = useState<string>('');
  const [form] = Form.useForm();

  // 评分标准
  const evaluationCriteria: EvaluationCriteria[] = [
    { name: '创意性', weight: 30, description: '创新程度、独特性、原创性' },
    { name: '实用性', weight: 25, description: '实际应用价值、解决问题能力' },
    { name: '技术实现', weight: 20, description: '技术难度、实现质量、可行性' },
    { name: '市场潜力', weight: 15, description: '商业价值、市场前景、推广可能' },
    { name: '文化内涵', weight: 10, description: '文化价值、社会意义、教育作用' }
  ];

  // 模拟评审任务数据
  const mockTasks: EvaluationTask[] = [
    {
      id: '1',
      projectId: 'p1',
      projectTitle: 'AI智能设计助手',
      projectDescription: '一个基于AI的设计辅助工具，能够帮助设计师快速生成创意方案...',
      track: '创意设计',
      author: '张三',
      judgeId: '3',
      judgeName: '王五',
      status: 'pending',
      assignedDate: '2025-01-28',
      deadline: '2025-02-05'
    },
    {
      id: '2',
      projectId: 'p2',
      projectTitle: '区块链溃通系统',
      projectDescription: '基于区块链技术的新一代溃通系统...',
      track: '技术创新',
      author: '李四',
      judgeId: '3',
      judgeName: '王五',
      status: 'completed',
      assignedDate: '2025-01-25',
      deadline: '2025-02-02',
      submittedDate: '2025-01-30',
      scores: {
        creativity: 4,
        practicality: 5,
        technical: 5,
        market: 4,
        culture: 3
      },
      comments: '项目技术方案可行，创新点突出，建议进入下一轮评审。技术实现方面考虑得比较全面，但在文化内涵方面可以进一步加强。',
      totalScore: 4.2
    },
    {
      id: '3',
      projectId: 'p3',
      projectTitle: '数字博物馆体验平台',
      projectDescription: '运用VR/AR技术打造沉浸式文化体验...',
      track: '文化传播',
      author: '王五',
      judgeId: '3',
      judgeName: '王五',
      status: 'in_progress',
      assignedDate: '2025-01-26',
      deadline: '2025-02-03'
    },
    {
      id: '4',
      projectId: 'p4',
      projectTitle: '绿色物流平台',
      projectDescription: '打造低碳环保的现代物流体系...',
      track: '商业模式',
      author: '赵六',
      judgeId: '3',
      judgeName: '王五',
      status: 'completed',
      assignedDate: '2025-01-24',
      deadline: '2025-02-01',
      submittedDate: '2025-01-29',
      scores: {
        creativity: 3,
        practicality: 3,
        technical: 2,
        market: 2,
        culture: 3
      },
      comments: '商业模式不够清晰，市场分析不够充分，建议完善后重新提交。技术实现方面存在一些问题，需要进一步深入研究。',
      totalScore: 2.6
    }
  ];

  // 根据用户角色过滤任务
  const userTasks = user?.role === 'judge'
    ? mockTasks.filter(task => task.judgeId === user.id)
    : mockTasks;

  const [tasks, setTasks] = useState<EvaluationTask[]>(userTasks);

  // 统计数据
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    avgScore: tasks.filter(t => t.totalScore).length > 0
      ? (tasks.reduce((sum, t) => sum + (t.totalScore || 0), 0) / tasks.filter(t => t.totalScore).length).toFixed(1)
      : '0'
  };

  // 表格列配置
  const columns: ColumnsType<EvaluationTask> = [
    {
      title: '项目信息',
      key: 'project',
      width: 300,
      render: (_, record) => (
        <div>
          <div className="font-medium text-blue-600 mb-1">{record.projectTitle}</div>
          <div className="text-gray-500 text-sm mb-1">
            {record.projectDescription.substring(0, 50)}...
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserOutlined className="mr-1" />
            {record.author}
          </div>
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
    },
    {
      title: '评委',
      dataIndex: 'judgeName',
      key: 'judgeName',
      render: (name: string) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
          {name}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record) => {
        const isOverdue = dayjs().isAfter(dayjs(record.deadline)) && status !== 'completed';
        const statusConfig = {
          pending: { color: 'orange', text: '待评审' },
          in_progress: { color: 'blue', text: '评审中' },
          completed: { color: 'green', text: '已完成' }
        };
        return (
          <Space>
            <Tag color={isOverdue ? 'red' : statusConfig[status as keyof typeof statusConfig]?.color}>
              {isOverdue ? '已超时' : statusConfig[status as keyof typeof statusConfig]?.text}
            </Tag>
            {record.totalScore && (
              <Tag color="purple">{record.totalScore.toFixed(1)}分</Tag>
            )}
          </Space>
        );
      },
      filters: [
        { text: '待评审', value: 'pending' },
        { text: '评审中', value: 'in_progress' },
        { text: '已完成', value: 'completed' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '时间进度',
      key: 'timeline',
      render: (_, record) => {
        const total = dayjs(record.deadline).diff(dayjs(record.assignedDate), 'day');
        const used = dayjs().diff(dayjs(record.assignedDate), 'day');
        const progress = record.status === 'completed' ? 100 : Math.min((used / total) * 100, 100);
        const isOverdue = dayjs().isAfter(dayjs(record.deadline)) && record.status !== 'completed';

        return (
          <div>
            <Progress
              percent={progress}
              status={isOverdue ? 'exception' : record.status === 'completed' ? 'success' : 'active'}
              size="small"
            />
            <div className="text-xs text-gray-500 mt-1">
              截止：{dayjs(record.deadline).format('MM-DD')}
            </div>
          </div>
        );
      },
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
          {(record.status !== 'completed' && user?.role === 'judge') && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEvaluate(record)}
              size="small"
            >
              评分
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleView = (task: EvaluationTask) => {
    setSelectedTask(task);
    setDrawerVisible(true);
  };

  const handleEvaluate = (task: EvaluationTask) => {
    setSelectedTask(task);
    if (task.scores) {
      form.setFieldsValue({
        ...task.scores,
        comments: task.comments
      });
    }
    setDrawerVisible(true);
  };

  const handleSubmitEvaluation = async (values: any) => {
    if (!selectedTask) return;

    setLoading(true);
    try {
      // 计算总分
      const totalScore = evaluationCriteria.reduce((sum, criteria) => {
        const key = {
          '创意性': 'creativity',
          '实用性': 'practicality',
          '技术实现': 'technical',
          '市场潜力': 'market',
          '文化内涵': 'culture'
        }[criteria.name] as keyof typeof values;
        return sum + (values[key] * criteria.weight / 100);
      }, 0);

      // 更新任务状态
      setTasks(tasks.map(t =>
        t.id === selectedTask.id
          ? {
            ...t,
            status: 'completed',
            submittedDate: dayjs().format('YYYY-MM-DD'),
            scores: values,
            comments: values.comments,
            totalScore: totalScore
          }
          : t
      ));

      message.success('评审提交成功');
      setDrawerVisible(false);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchText ||
      task.projectTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      task.author.toLowerCase().includes(searchText.toLowerCase()) ||
      task.judgeName.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesTrack = !trackFilter || task.track === trackFilter;

    return matchesSearch && matchesStatus && matchesTrack;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>评审系统</Title>
        <Text className="text-gray-600">
          {user?.role === 'judge' ? '管理您的评审任务和评分记录' : '管理所有评审任务和进度'}
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="评审任务" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="待评审" value={stats.pending} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="已完成" value={stats.completed} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="平均评分" value={stats.avgScore} valueStyle={{ color: '#1890ff' }} prefix={<StarOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* 评分标准 */}
      <Card title="评分标准">
        <Row gutter={[16, 16]}>
          {evaluationCriteria.map((criteria, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <Card size="small" className="h-full">
                <div className="text-center">
                  <Title level={5}>{criteria.name}</Title>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{criteria.weight}%</div>
                  <Text className="text-gray-600 text-sm">{criteria.description}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 操作区域 */}
      <Card>
        <div className="table-operations">
          <Space>
            <Input
              placeholder="搜索项目名、作者或评委"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="选择状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="pending">待评审</Option>
              <Option value="in_progress">评审中</Option>
              <Option value="completed">已完成</Option>
            </Select>
            <Select
              placeholder="选择赛道"
              value={trackFilter}
              onChange={setTrackFilter}
              style={{ width: 150 }}
              allowClear
            >
              <Option value="创意设计">创意设计</Option>
              <Option value="技术创新">技术创新</Option>
              <Option value="文化传播">文化传播</Option>
              <Option value="商业模式">商业模式</Option>
              <Option value="社会公益">社会公益</Option>
              <Option value="综合创新">综合创新</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredTasks}
          tableLayout="fixed"
          scroll={{ x: 'max-content' }}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredTasks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 评审详情/评分抽屉 */}
      <Drawer
        title={selectedTask?.status === 'completed' ? '评审详情' : '项目评审'}
        width={800}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedTask(null);
          form.resetFields();
        }}
        open={drawerVisible}
        extra={
          selectedTask?.status !== 'completed' && user?.role === 'judge' && (
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>取消</Button>
              <Button type="primary" loading={loading} onClick={() => form.submit()}>
                提交评审
              </Button>
            </Space>
          )
        }
      >
        {selectedTask && (
          <div className="space-y-6">
            {/* 项目信息 */}
            <Card title="项目信息">
              <Title level={4}>{selectedTask.projectTitle}</Title>
              <Paragraph>{selectedTask.projectDescription}</Paragraph>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text strong>赛道：</Text>
                  <Tag color="blue">{selectedTask.track}</Tag>
                </Col>
                <Col span={8}>
                  <Text strong>作者：</Text>
                  <Text>{selectedTask.author}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>评委：</Text>
                  <Text>{selectedTask.judgeName}</Text>
                </Col>
              </Row>
            </Card>

            {/* 评审进度 */}
            <Card title="评审进度">
              <Timeline>
                <Timeline.Item
                  color="blue"
                  dot={<CalendarOutlined />}
                >
                  <div>
                    <Text strong>任务分配</Text>
                    <div className="text-gray-500">{dayjs(selectedTask.assignedDate).format('YYYY-MM-DD')}</div>
                  </div>
                </Timeline.Item>
                <Timeline.Item
                  color={selectedTask.status === 'pending' ? 'gray' : 'green'}
                  dot={selectedTask.status === 'pending' ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
                >
                  <div>
                    <Text strong>开始评审</Text>
                    <div className="text-gray-500">
                      {selectedTask.status === 'pending' ? '待开始' : '评审中'}
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item
                  color={selectedTask.status === 'completed' ? 'green' : 'gray'}
                  dot={selectedTask.status === 'completed' ? <TrophyOutlined /> : <ClockCircleOutlined />}
                >
                  <div>
                    <Text strong>完成评审</Text>
                    <div className="text-gray-500">
                      {selectedTask.submittedDate
                        ? dayjs(selectedTask.submittedDate).format('YYYY-MM-DD')
                        : `截止时间：${dayjs(selectedTask.deadline).format('YYYY-MM-DD')}`
                      }
                    </div>
                  </div>
                </Timeline.Item>
              </Timeline>
            </Card>

            {/* 评分表单或结果展示 */}
            {selectedTask.status === 'completed' ? (
              /* 评审结果 */
              <>
                <Card title="评审结果">
                  <Row gutter={[16, 16]} className="mb-6">
                    <Col span={12}>
                      <Statistic
                        title="总分"
                        value={selectedTask.totalScore}
                        precision={1}
                        valueStyle={{ color: '#1890ff', fontSize: '2rem' }}
                      />
                    </Col>
                    <Col span={12}>
                      <div className="text-center">
                        <Rate disabled value={selectedTask.totalScore} allowHalf />
                        <div className="text-gray-500 mt-1">总体评价</div>
                      </div>
                    </Col>
                  </Row>

                  <Divider />

                  <Row gutter={[16, 16]}>
                    {evaluationCriteria.map((criteria) => {
                      const key = {
                        '创意性': 'creativity',
                        '实用性': 'practicality',
                        '技术实现': 'technical',
                        '市场潜力': 'market',
                        '文化内涵': 'culture'
                      }[criteria.name] as keyof NonNullable<typeof selectedTask.scores>;
                      const score = selectedTask.scores?.[key] || 0;

                      return (
                        <Col key={criteria.name} xs={24} sm={12} lg={8}>
                          <Card size="small">
                            <div className="text-center">
                              <Title level={5}>{criteria.name}</Title>
                              <Rate disabled value={score} />
                              <div className="text-lg font-bold text-blue-600">
                                {score.toFixed(1)}分 ({criteria.weight}%)
                              </div>
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>

                {selectedTask.comments && (
                  <Card title="评审意见">
                    <Paragraph>{selectedTask.comments}</Paragraph>
                  </Card>
                )}
              </>
            ) : (
              /* 评分表单 */
              user?.role === 'judge' && (
                <Card title="项目评分">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitEvaluation}
                  >
                    {evaluationCriteria.map((criteria) => {
                      const key = {
                        '创意性': 'creativity',
                        '实用性': 'practicality',
                        '技术实现': 'technical',
                        '市场潜力': 'market',
                        '文化内涵': 'culture'
                      }[criteria.name];

                      return (
                        <Card key={criteria.name} size="small" className="mb-4">
                          <Form.Item
                            name={key}
                            label={
                              <div>
                                <Text strong>{criteria.name} ({criteria.weight}%)</Text>
                                <div className="text-sm text-gray-500">{criteria.description}</div>
                              </div>
                            }
                            rules={[{ required: true, message: `请为${criteria.name}评分` }]}
                          >
                            <Rate allowHalf />
                          </Form.Item>
                        </Card>
                      );
                    })}

                    <Form.Item
                      name="comments"
                      label="评审意见"
                      rules={[{ required: true, message: '请输入评审意见' }]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="请输入对该项目的详细评价和建议..."
                      />
                    </Form.Item>
                  </Form>
                </Card>
              )
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default EvaluationSystem;

import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Progress,
  Tag,
  List,
  Avatar,
  Typography,
  Space,
  Button,
  Timeline
} from 'antd';
import { dashboard } from '@/services/authService'
import {
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import useAuth from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import defaultAvatar from '@/assets/images/default-avatar.jpg';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // 获取仪表板统计数据
  const {
    data: dashboardData,
    loading: statsLoading,
    execute: loadDashboardData
  } = useAPI(async () => {
    // TODO: 连接Java后端获取真实统计数据
    console.log('🔌 加载仪表板数据');
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      totalRegistrations: 1248,
      todayRegistrations: 156,
      pendingProjects: 89,
      completedEvaluations: 67.5,
      trendData: [
        { date: '01-01', registrations: 45 },
        { date: '01-02', registrations: 78 },
        { date: '01-03', registrations: 123 },
        { date: '01-04', registrations: 156 },
        { date: '01-05', registrations: 189 },
        { date: '01-06', registrations: 234 },
        { date: '01-07', registrations: 289 }
      ],
      trackData: [
        { track: '创意设计', count: 245 },
        { track: '技术创新', count: 198 },
        { track: '文化传播', count: 167 },
        { track: '商业模式', count: 134 },
        { track: '社会公益', count: 112 },
        { track: '综合创新', count: 89 }
      ]
    };
  }, { immediate: true });


  useEffect(() => {
    dashboard().then(res => {
      console.log(res, 'wqwqwq');

    })
  }, [])
  // 统计数据
  const statsData = [
    {
      title: '总报名人数',
      value: dashboardData?.totalRegistrations || 0,
      precision: 0,
      prefix: <UserOutlined />,
      suffix: '人',
      change: 12.5,
      color: '#1890ff'
    },
    {
      title: '今日新增',
      value: dashboardData?.todayRegistrations || 0,
      precision: 0,
      prefix: <ProjectOutlined />,
      suffix: '人',
      change: 8.2,
      color: '#52c41a'
    },
    {
      title: '待审核项目',
      value: dashboardData?.pendingProjects || 0,
      precision: 0,
      prefix: <CheckCircleOutlined />,
      suffix: '个',
      change: -3.1,
      color: '#faad14'
    },
    {
      title: '已完成评审',
      value: dashboardData?.completedEvaluations || 0,
      precision: 1,
      prefix: <TrophyOutlined />,
      suffix: '%',
      change: 5.7,
      color: '#722ed1'
    }
  ];

  // 从API获取的数据
  const trendData = dashboardData?.trendData || [];
  const trackData = dashboardData?.trackData || [];

  // 最近动态
  const recentActivities = [
    {
      id: 1,
      type: 'registration',
      user: '张三',
      action: '提交了新的报名申请',
      time: '2分钟前',
      avatar: defaultAvatar
    },
    {
      id: 2,
      type: 'evaluation',
      user: '李教授',
      action: '完成了项目评审',
      time: '15分钟前',
      avatar: defaultAvatar
    },
    {
      id: 3,
      type: 'approval',
      user: '王管理员',
      action: '审核通过了一个项目',
      time: '1小时前',
      avatar: defaultAvatar
    },
    {
      id: 4,
      type: 'content',
      user: '赵编辑',
      action: '发布了新的赛事公告',
      time: '2小时前',
      avatar: defaultAvatar
    }
  ];

  // 待办事项
  const todoItems = [
    { id: 1, title: '审核新提交的项目资料', urgent: true, count: 12 },
    { id: 2, title: '处理评委申请', urgent: false, count: 5 },
    { id: 3, title: '更新赛事时间表', urgent: true, count: 1 },
    { id: 4, title: '回复参赛者咨询', urgent: false, count: 8 }
  ];

  const lineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'registrations',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 4,
      shape: 'circle',
    },
    tooltip: {
      showTitle: true,
      title: '日期',
      formatter: (datum: any) => {
        return { name: '报名数量', value: `${datum.registrations}人` };
      },
    },
    meta: {
      registrations: {
        alias: '报名数量',
        formatter: (value: number) => `${value}人`,
      },
      date: {
        alias: '日期',
      },
    },
  };

  const columnConfig = {
    data: trackData,
    xField: 'track',
    yField: 'count',
    color: '#52c41a',
    tooltip: {
      showTitle: true,
      title: '赛道',
      formatter: (datum: any) => {
        return { name: '报名数量', value: `${datum.count}人` };
      },
    },
    meta: {
      count: {
        alias: '报名数量',
        formatter: (value: number) => `${value}人`,
      },
      track: {
        alias: '赛道',
      },
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>
          仪表板
        </Title>
        <Text className="text-gray-600">
          欢迎回来，{user?.realName}！今天是 {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </Text>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
              <div className="mt-2 flex items-center">
                {stat.change > 0 ? (
                  <ArrowUpOutlined className="text-green-500 mr-1" />
                ) : (
                  <ArrowDownOutlined className="text-red-500 mr-1" />
                )}
                <Text
                  className={stat.change > 0 ? 'text-green-500' : 'text-red-500'}
                  style={{ fontSize: '12px' }}
                >
                  {Math.abs(stat.change)}% 较上月
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 报名趋势 */}
        <Col xs={24} lg={12}>
          <Card
            title="报名趋势"
            className="h-80"
            loading={statsLoading}
            extra={
              <Button
                type="link"
                icon={<ReloadOutlined />}
                onClick={() => loadDashboardData()}
                size="small"
              >
                刷新
              </Button>
            }
          >
            {!statsLoading && trendData.length > 0 && (
              <Line {...lineConfig} height={200} />
            )}
          </Card>
        </Col>

        {/* 赛道分布 */}
        <Col xs={24} lg={12}>
          <Card
            title="赛道分布"
            className="h-80"
            loading={statsLoading}
          >
            {!statsLoading && trackData.length > 0 && (
              <Column {...columnConfig} height={200} />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近动态 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近动态"
            extra={<Button type="link" icon={<EyeOutlined />}>查看更多</Button>}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} icon={<UserOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{item.user}</Text>
                        <Tag
                          color={
                            item.type === 'registration' ? 'blue' :
                              item.type === 'evaluation' ? 'green' :
                                item.type === 'approval' ? 'orange' : 'purple'
                          }
                        >
                          {
                            item.type === 'registration' ? '报名' :
                              item.type === 'evaluation' ? '评审' :
                                item.type === 'approval' ? '审核' : '内容'
                          }
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>{item.action}</div>
                        <Text className="text-gray-400 text-xs">{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 待办事项 */}
        <Col xs={24} lg={12}>
          <Card title="待办事项">
            <List
              dataSource={todoItems}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">处理</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{item.title}</Text>
                        {item.urgent && <Tag color="red">紧急</Tag>}
                        <Tag color="blue">{item.count}</Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

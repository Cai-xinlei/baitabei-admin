import React, { useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Space,
  Button,
  Table,
  Progress,
  List,
  Avatar,
  Tag
} from 'antd';
import {
  UserOutlined,
  ProjectOutlined,
  TrophyOutlined,
  EyeOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExportOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DataStatistics: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // 模拟统计数据
  const overallStats = {
    totalRegistrations: 1248,
    totalProjects: 890,
    totalJudges: 45,
    avgScore: 4.2,
    registrationGrowth: 15.3,
    projectGrowth: 12.8,
    judgeGrowth: 8.5,
    scoreGrowth: 2.1
  };

  // 报名趋势数据
  const registrationTrend = [
    { date: '2025-01-01', registrations: 45, projects: 12 },
    { date: '2025-01-02', registrations: 78, projects: 23 },
    { date: '2025-01-03', registrations: 123, projects: 45 },
    { date: '2025-01-04', registrations: 156, projects: 67 },
    { date: '2025-01-05', registrations: 189, projects: 89 },
    { date: '2025-01-06', registrations: 234, projects: 123 },
    { date: '2025-01-07', registrations: 289, projects: 156 },
    { date: '2025-01-08', registrations: 345, projects: 189 },
    { date: '2025-01-09', registrations: 398, projects: 234 },
    { date: '2025-01-10', registrations: 456, projects: 267 }
  ];

  // 赛道分布数据
  const trackDistribution = [
    { track: '创意设计', count: 245, percentage: 19.6 },
    { track: '技术创新', count: 198, percentage: 15.9 },
    { track: '文化传播', count: 167, percentage: 13.4 },
    { track: '商业模式', count: 134, percentage: 10.7 },
    { track: '社会公益', count: 112, percentage: 9.0 },
    { track: '综合创新', count: 89, percentage: 7.1 }
  ];

  // 地域分布数据
  const regionDistribution = [
    { region: '北京', count: 234, percentage: 18.8 },
    { region: '上海', count: 198, percentage: 15.9 },
    { region: '广东', count: 167, percentage: 13.4 },
    { region: '浙江', count: 134, percentage: 10.7 },
    { region: '江苏', count: 112, percentage: 9.0 },
    { region: '其他', count: 403, percentage: 32.3 }
  ];

  // 评审进度数据
  const evaluationProgress = [
    { judge: '王教授', assigned: 25, completed: 22, progress: 88 },
    { judge: '李博士', assigned: 23, completed: 19, progress: 83 },
    { judge: '张研究员', assigned: 20, completed: 18, progress: 90 },
    { judge: '刘专家', assigned: 22, completed: 15, progress: 68 },
    { judge: '陈教授', assigned: 18, completed: 16, progress: 89 }
  ];

  // 热门项目数据
  const popularProjects = [
    {
      id: 1,
      title: 'AI智能设计助手',
      author: '张三',
      track: '创意设计',
      viewCount: 1250,
      score: 4.8,
      status: '入围'
    },
    {
      id: 2,
      title: '区块链溃通系统',
      author: '李四',
      track: '技术创新',
      viewCount: 1150,
      score: 4.6,
      status: '入围'
    },
    {
      id: 3,
      title: '数字博物馆体验平台',
      author: '王五',
      track: '文化传播',
      viewCount: 980,
      score: 4.5,
      status: '入围'
    },
    {
      id: 4,
      title: '绿色城市规划方案',
      author: '赵六',
      track: '社会公益',
      viewCount: 876,
      score: 4.3,
      status: '通过'
    },
    {
      id: 5,
      title: '智能家居控制系统',
      author: '孙七',
      track: '技术创新',
      viewCount: 745,
      score: 4.2,
      status: '通过'
    }
  ];

  // 图表配置
  const trendConfig = {
    data: registrationTrend,
    xField: 'date',
    yField: 'registrations',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 4,
      shape: 'diamond',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: '报名数量', value: `${datum.registrations}人` };
      },
    },
  };

  const trackConfig = {
    data: trackDistribution,
    xField: 'track',
    yField: 'count',
    color: '#52c41a',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: '报名数量', value: `${datum.count}人 (${datum.percentage}%)` };
      },
    },
  };

  const regionPieConfig = {
    data: regionDistribution,
    angleField: 'count',
    colorField: 'region',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}%',
    },
    interactions: [{ type: 'element-active' }],
  };

  const areaConfig = {
    data: registrationTrend,
    xField: 'date',
    yField: 'projects',
    smooth: true,
    color: '#722ed1',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#722ed1 1:#722ed1',
      opacity: 0.6,
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: '项目数量', value: `${datum.projects}个` };
      },
    },
  };

  // 评审进度表格列
  const progressColumns = [
    {
      title: '评委姓名',
      dataIndex: 'judge',
      key: 'judge',
      render: (name: string) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
          {name}
        </div>
      ),
    },
    {
      title: '分配任务',
      dataIndex: 'assigned',
      key: 'assigned',
    },
    {
      title: '已完成',
      dataIndex: 'completed',
      key: 'completed',
    },
    {
      title: '进度',
      key: 'progress',
      render: (_, record: any) => (
        <div className="flex items-center space-x-2">
          <Progress 
            percent={record.progress} 
            size="small" 
            style={{ minWidth: 100 }}
            status={record.progress >= 80 ? 'success' : 'active'}
          />
          <Text className="text-sm">{record.progress}%</Text>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>数据统计</Title>
        <Text className="text-gray-600">
          全面的数据分析和统计报告
        </Text>
      </div>

      {/* 筛选条件 */}
      <Card>
        <div className="flex justify-between items-center">
          <Space>
            <Text strong>筛选条件：</Text>
            <RangePicker 
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            />
            <Select
              value={selectedTrack}
              onChange={setSelectedTrack}
              style={{ width: 150 }}
              placeholder="选择赛道"
            >
              <Option value="all">全部赛道</Option>
              <Option value="创意设计">创意设计</Option>
              <Option value="技术创新">技术创新</Option>
              <Option value="文化传播">文化传播</Option>
              <Option value="商业模式">商业模式</Option>
              <Option value="社会公益">社会公益</Option>
              <Option value="综合创新">综合创新</Option>
            </Select>
          </Space>
          <Button icon={<ExportOutlined />} type="primary">
            导出报告
          </Button>
        </div>
      </Card>

      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总报名数"
              value={overallStats.totalRegistrations}
              prefix={<UserOutlined />}
              suffix={
                <div className="flex items-center text-sm">
                  <ArrowUpOutlined className="text-green-500 mr-1" />
                  <span className="text-green-500">+{overallStats.registrationGrowth}%</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="提交项目"
              value={overallStats.totalProjects}
              prefix={<ProjectOutlined />}
              suffix={
                <div className="flex items-center text-sm">
                  <ArrowUpOutlined className="text-green-500 mr-1" />
                  <span className="text-green-500">+{overallStats.projectGrowth}%</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="评委专家"
              value={overallStats.totalJudges}
              prefix={<TrophyOutlined />}
              suffix={
                <div className="flex items-center text-sm">
                  <ArrowUpOutlined className="text-green-500 mr-1" />
                  <span className="text-green-500">+{overallStats.judgeGrowth}%</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={overallStats.avgScore}
              precision={1}
              prefix={<BarChartOutlined />}
              suffix={
                <div className="flex items-center text-sm">
                  <ArrowUpOutlined className="text-green-500 mr-1" />
                  <span className="text-green-500">+{overallStats.scoreGrowth}%</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="报名趋势" extra={<CalendarOutlined />}>
            <Line {...trendConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="项目提交趋势" extra={<ProjectOutlined />}>
            <Area {...areaConfig} height={250} />
          </Card>
        </Col>
      </Row>

      {/* 分布统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="赛道分布">
            <Column {...trackConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="地域分布">
            <Pie {...regionPieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 评审进度和热门项目 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="评审进度">
            <Table
              columns={progressColumns}
              dataSource={evaluationProgress}
              rowKey="judge"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="热门项目 TOP 5">
            <List
              dataSource={popularProjects}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <Text className="text-blue-600 font-bold">{index + 1}</Text>
                      </div>
                    }
                    title={item.title}
                    description={
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Text>作者：{item.author}</Text>
                          <Tag color="blue">{item.track}</Tag>
                          <Tag color={item.status === '入围' ? 'gold' : 'green'}>
                            {item.status}
                          </Tag>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <EyeOutlined className="mr-1" />
                            {item.viewCount}
                          </span>
                          <span>评分：{item.score}</span>
                        </div>
                      </div>
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

export default DataStatistics;

import React, { useEffect, useState } from 'react';
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
  Upload,
  List,
  Progress,
  Rate,
  Timeline,
  Image
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getProjectList } from '@/services/authService'
import { TRACKS } from '@/constants/index'
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface Project {
  id: string;
  title: string;
  description: string;
  track: string;
  author: string;
  authorEmail: string;
  teamMembers?: string[];
  submissionDate: string;
  lastModified: string;
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'finalist';
  evaluationScore?: number;
  evaluationCount: number;
  files: {
    documents: { name: string; url: string; size: string }[];
    images: { name: string; url: string; size: string }[];
    videos: { name: string; url: string; size: string }[];
  };
  tags: string[];
  viewCount: number;
  downloadCount: number;
}

const ProjectManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchText, setSearchText] = useState('');
  const [trackFilter, setTrackFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState<string>(null);

  // 模拟项目数据
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'AI智能设计助手',
      description: '一个基于AI的设计辅助工具，能够帮助设计师快速生成创意方案，提供智能的色彩搭配、布局建议和元素推荐。通过深度学习算法，系统能够学习用户的设计习惯，提供个性化的设计建议。',
      track: '创意设计',
      author: '张三',
      authorEmail: 'zhangsan@example.com',
      teamMembers: ['张三', '李四', '王五'],
      submissionDate: '2025-01-28',
      lastModified: '2025-01-29',
      status: 'submitted',
      evaluationCount: 3,
      evaluationScore: 4.2,
      files: {
        documents: [
          { name: '项目计划书.pdf', url: '/files/plan1.pdf', size: '2.5MB' },
          { name: '技术方案.docx', url: '/files/tech1.docx', size: '1.8MB' }
        ],
        images: [
          { name: '系统界面.png', url: './images/ui1.png', size: '3.2MB' },
          { name: '架构图.jpg', url: './images/arch1.jpg', size: '1.5MB' }
        ],
        videos: [
          { name: '作品演示.mp4', url: '/videos/demo1.mp4', size: '15.2MB' }
        ]
      },
      tags: ['AI', '设计工具', '机器学习'],
      viewCount: 156,
      downloadCount: 23
    },
    {
      id: '2',
      title: '区块链溃通系统',
      description: '基于区块链技术的新一代溃通系统，实现更高效、更安全的交通管理。系统包括智能合约、去中心化身份验证和透明的费用结算机制。',
      track: '技术创新',
      author: '李四',
      authorEmail: 'lisi@example.com',
      submissionDate: '2025-01-27',
      lastModified: '2025-01-29',
      status: 'approved',
      evaluationCount: 5,
      evaluationScore: 4.6,
      files: {
        documents: [
          { name: '技术方案.pdf', url: '/files/tech2.pdf', size: '3.1MB' },
          { name: '白皮书.pdf', url: '/files/whitepaper2.pdf', size: '2.8MB' }
        ],
        images: [
          { name: '系统架构图.png', url: './images/arch2.png', size: '1.8MB' }
        ],
        videos: []
      },
      tags: ['区块链', '智能合约', '溃通'],
      viewCount: 234,
      downloadCount: 45
    },
    {
      id: '3',
      title: '数字博物馆体验平台',
      description: '运用VR/AR技术打造沉浸式文化体验，让用户可以远程参观博物馆，与文物进行互动。平台提供多种游览模式，包括自由探索、导览讲解和互动游戏。',
      track: '文化传播',
      author: '王五',
      authorEmail: 'wangwu@example.com',
      teamMembers: ['王五', '赵六'],
      submissionDate: '2025-01-26',
      lastModified: '2025-01-28',
      status: 'finalist',
      evaluationCount: 4,
      evaluationScore: 4.8,
      files: {
        documents: [
          { name: '项目介绍.pdf', url: '/files/intro3.pdf', size: '4.2MB' }
        ],
        images: [
          { name: 'VR体验截图.jpg', url: './images/vr3.jpg', size: '2.1MB' }
        ],
        videos: [
          { name: 'VR演示视频.mp4', url: '/videos/vr3.mp4', size: '28.5MB' }
        ]
      },
      tags: ['VR', 'AR', '数字博物馆', '文化传承'],
      viewCount: 189,
      downloadCount: 67
    },
    {
      id: '4',
      title: '绿色物流平台',
      description: '打造低碳环保的现代物流体系，通过智能化管理降低运输成本和碳排放。平台集成物流跟踪、路线优化和环保监测功能。',
      track: '商业模式',
      author: '赵六',
      authorEmail: 'zhaoliu@example.com',
      submissionDate: '2025-01-25',
      lastModified: '2025-01-27',
      status: 'rejected',
      evaluationCount: 2,
      evaluationScore: 2.8,
      files: {
        documents: [
          { name: '商业计划书.pdf', url: '/files/business4.pdf', size: '1.9MB' }
        ],
        images: [],
        videos: []
      },
      tags: ['绿色物流', '智能化', '低碳'],
      viewCount: 98,
      downloadCount: 12
    }
  ];

  useEffect(() => {
    const params = {
      page: 1,
      size: 10,
      keyword: searchText,
      status: statusFilter,
      trackId: trackFilter
    }
    getProjectList(params).then(res => {
      console.log(res, '获取项目列表');

    })
  }, [searchText, searchText, trackFilter])

  const [projects, setProjects] = useState<Project[]>(mockProjects);

  // 统计数据
  const stats = {
    total: projects.length,
    submitted: projects.filter(p => p.status === 'submitted').length,
    approved: projects.filter(p => p.status === 'approved').length,
    finalist: projects.filter(p => p.status === 'finalist').length,
    avgScore: (projects.reduce((sum, p) => sum + (p.evaluationScore || 0), 0) / projects.filter(p => p.evaluationScore).length).toFixed(1)
  };
  // 表格列配置
  const columns: ColumnsType<Project> = [
    {
      title: '项目信息',
      key: 'project',
      width: 350,
      render: (_, record) => (
        <div>
          <div className="font-medium text-blue-600 mb-1">{record.title}</div>
          <div className="text-gray-500 text-sm mb-2">
            {record.description.substring(0, 80)}...
          </div>
          <div className="flex flex-wrap gap-1">
            {record.tags.slice(0, 3).map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {record.tags.length > 3 && (
              <Tag>+{record.tags.length - 3}</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '作者',
      key: 'author',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.author}</div>
          <div className="text-gray-500 text-sm">{record.authorEmail}</div>
          {record.teamMembers && (
            <div className="text-gray-500 text-sm">
              团队 {record.teamMembers.length} 人
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
      filters: TRACKS.map(track => ({ text: track.label, value: track.value })),
      onFilter: (value, record) => record.track === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          draft: { color: 'default', text: '草稿' },
          submitted: { color: 'blue', text: '已提交' },
          reviewing: { color: 'orange', text: '评审中' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
          finalist: { color: 'gold', text: '入围作品' }
        };
        return (
          <Tag color={statusConfig[status as keyof typeof statusConfig]?.color}>
            {statusConfig[status as keyof typeof statusConfig]?.text}
          </Tag>
        );
      },
      filters: [
        { text: '草稿', value: 'draft' },
        { text: '已提交', value: 'submitted' },
        { text: '评审中', value: 'reviewing' },
        { text: '已通过', value: 'approved' },
        { text: '已拒绝', value: 'rejected' },
        { text: '入围作品', value: 'finalist' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '评分',
      key: 'score',
      render: (_, record) => (
        <div>
          {record.evaluationScore ? (
            <>
              <Rate disabled value={record.evaluationScore} allowHalf />
              <div className="text-sm text-gray-500">
                {record.evaluationScore.toFixed(1)} ({record.evaluationCount}人评分)
              </div>
            </>
          ) : (
            <Text className="text-gray-400">未评分</Text>
          )}
        </div>
      ),
      sorter: (a, b) => (a.evaluationScore || 0) - (b.evaluationScore || 0),
    },
    {
      title: '统计',
      key: 'stats',
      render: (_, record) => (
        <div className="text-sm">
          <div>👁 {record.viewCount}</div>
          <div>⬇️ {record.downloadCount}</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size='small'>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info('编辑功能开发中...')}
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

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '确认删除',
      content: '您确定要删除这个项目吗？',
      onOk() {
        setProjects(projects.filter(p => p.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleExport = () => {
    message.success('导出成功，文件正在下载...');
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchText ||
      project.title.toLowerCase().includes(searchText.toLowerCase()) ||
      project.author.toLowerCase().includes(searchText.toLowerCase()) ||
      project.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesTrack = !trackFilter || project.track === trackFilter;
    const matchesStatus = !statusFilter || project.status === statusFilter;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>项目管理</Title>
        <Text className="text-gray-600">
          管理和查看所有参赛项目的详细信息和文件
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="项目总数" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="已提交" value={stats.submitted} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="入围作品" value={stats.finalist} valueStyle={{ color: '#fa8c16' }} prefix={<TrophyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="平均评分" value={stats.avgScore} valueStyle={{ color: '#52c41a' }} prefix={<StarOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* 操作区域 */}
      <Card>
        <div className="table-operations">
          <Space>
            <Input
              placeholder="搜索项目名、作者或关键词"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="选择赛道"
              value={trackFilter}
              onChange={setTrackFilter}
              style={{ width: 200 }}
              options={TRACKS}
            />

            <Select
              placeholder="选择状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 200 }}
              allowClear
            >
              <Option value="submitted">已提交</Option>
              <Option value="reviewing">评审中</Option>
              <Option value="approved">已通过</Option>
              <Option value="finalist">入围作品</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Space>
          {/* <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出数据
            </Button>
          </Space> */}
        </div>

        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          tableLayout="fixed"
          scroll={{ x: 'max-content' }}
          loading={loading}
          pagination={{
            total: filteredProjects.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 项目详情拽屉 */}
      <Drawer
        title="项目详情"
        width={900}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedProject(null);
        }}
        open={drawerVisible}
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* 项目基本信息 */}
            <Card title="项目信息">
              <Descriptions column={2}>
                <Descriptions.Item label="项目名称" span={2}>
                  <Title level={4}>{selectedProject.title}</Title>
                </Descriptions.Item>
                <Descriptions.Item label="赛道">
                  <Tag color="blue">{selectedProject.track}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={
                    selectedProject.status === 'submitted' ? 'blue' :
                      selectedProject.status === 'reviewing' ? 'orange' :
                        selectedProject.status === 'approved' ? 'green' :
                          selectedProject.status === 'finalist' ? 'gold' : 'red'
                  }>
                    {
                      selectedProject.status === 'submitted' ? '已提交' :
                        selectedProject.status === 'reviewing' ? '评审中' :
                          selectedProject.status === 'approved' ? '已通过' :
                            selectedProject.status === 'finalist' ? '入围作品' : '已拒绝'
                    }
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="作者">
                  {selectedProject.author}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  {selectedProject.authorEmail}
                </Descriptions.Item>
                <Descriptions.Item label="提交时间">
                  {dayjs(selectedProject.submissionDate).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="最后修改">
                  {dayjs(selectedProject.lastModified).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
                {selectedProject.teamMembers && (
                  <Descriptions.Item label="团队成员" span={2}>
                    {selectedProject.teamMembers.join('、')}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="项目描述" span={2}>
                  <Paragraph>{selectedProject.description}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="标签" span={2}>
                  {selectedProject.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 评分信息 */}
            {selectedProject.evaluationScore && (
              <Card title="评审结果">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="平均评分"
                      value={selectedProject.evaluationScore}
                      precision={1}
                      suffix={<div><Rate disabled value={selectedProject.evaluationScore} allowHalf /></div>}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic title="评审人数" value={selectedProject.evaluationCount} suffix="人" />
                  </Col>
                </Row>
              </Card>
            )}

            {/* 文件管理 */}
            <Card title="项目文件">
              {/* 文档文件 */}
              {selectedProject.files.documents.length > 0 && (
                <div className="mb-6">
                  <Title level={5}>📄 文档文件</Title>
                  <List
                    dataSource={selectedProject.files.documents}
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
                          avatar={<FileTextOutlined className="text-blue-500 text-lg" />}
                          title={item.name}
                          description={`文件大小：${item.size}`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}

              {/* 图片文件 */}
              {selectedProject.files.images.length > 0 && (
                <div className="mb-6">
                  <Title level={5}>🖼️ 图片文件</Title>
                  <Row gutter={[16, 16]}>
                    {selectedProject.files.images.map((item, index) => (
                      <Col key={index} xs={24} sm={12} md={8}>
                        <Card
                          hoverable
                          cover={
                            <Image
                              height={150}
                              src={`./images/news-placeholder.jpg`}
                              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L0s2jL"
                            />
                          }
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
                          <Card.Meta
                            title={item.name}
                            description={item.size}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* 视频文件 */}
              {selectedProject.files.videos.length > 0 && (
                <div className="mb-6">
                  <Title level={5}>🎥 视频文件</Title>
                  <List
                    dataSource={selectedProject.files.videos}
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
                          avatar={<VideoCameraOutlined className="text-red-500 text-lg" />}
                          title={item.name}
                          description={`文件大小：${item.size}`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Card>

            {/* 统计信息 */}
            <Card title="项目统计">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic title="查看次数" value={selectedProject.viewCount} prefix={<EyeOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="下载次数" value={selectedProject.downloadCount} prefix={<DownloadOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="文件数量" value={
                    selectedProject.files.documents.length +
                    selectedProject.files.images.length +
                    selectedProject.files.videos.length
                  } prefix={<FileTextOutlined />} />
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ProjectManagement;

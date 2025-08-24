import React, { useState } from 'react';
import {
  Tabs,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Card,
  Typography,
  Modal,
  message,
  Drawer,
  Form,
  Upload,
  Image,
  Switch,
  DatePicker,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  PictureOutlined,
  UserOutlined,
  CalendarOutlined,
  LinkOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import newsPlaceholder from '@/assets/images/news-placeholder.jpg';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  publishDate: string;
  lastModified: string;
  viewCount: number;
  featured: boolean;
  category: string;
  tags: string[];
  coverImage?: string;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: number;
  active: boolean;
  startDate: string;
  endDate: string;
}

interface ExpertInfo {
  id: string;
  name: string;
  title: string;
  institution: string;
  expertise: string[];
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  active: boolean;
}

const ContentManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('news');
  const [form] = Form.useForm();

  // 模拟新闻数据
  const mockNews: NewsArticle[] = [
    {
      id: '1',
      title: '2025年白塔杯文化创意大赛正式启动',
      summary: '本届大赛以\u201c文化传承与创新融合\u201d为主题，面向全球征集优秀作品。',
      content: '详细内容...',
      author: '组委会',
      status: 'published',
      publishDate: '2025-01-15',
      lastModified: '2025-01-15',
      viewCount: 1250,
      featured: true,
      category: '赛事公告',
      tags: ['大赛启动', '报名开放'],
      coverImage: newsPlaceholder
    },
    {
      id: '2',
      title: '专家评委阵容公布，权威专家亦师亦友',
      summary: '本届大赛邀请了来自不同领域的知名专家担任评委。',
      content: '详细内容...',
      author: '张编辑',
      status: 'published',
      publishDate: '2025-01-20',
      lastModified: '2025-01-21',
      viewCount: 890,
      featured: false,
      category: '专家介绍',
      tags: ['专家评委', '权威专家'],
      coverImage: newsPlaceholder
    },
    {
      id: '3',
      title: '报名指南：如何提交一份出色的参赛作品',
      summary: '为帮助参赛者更好地准备作品，我们特别准备了详细的报名指南。',
      content: '详细内容...',
      author: '李编辑',
      status: 'draft',
      publishDate: '2025-01-25',
      lastModified: '2025-01-24',
      viewCount: 0,
      featured: false,
      category: '参赛指南',
      tags: ['报名指南', '作品准备'],
      coverImage: newsPlaceholder
    }
  ];

  // 模拟轮播图数据
  const mockBanners: Banner[] = [
    {
      id: '1',
      title: '2025白塔杯主视觉',
      description: '大赛主要宣传图片',
      imageUrl: newsPlaceholder,
      linkUrl: '/registration',
      position: 1,
      active: true,
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    },
    {
      id: '2',
      title: '专家评委介绍',
      description: '权威专家阵容展示',
      imageUrl: newsPlaceholder,
      linkUrl: '/experts',
      position: 2,
      active: true,
      startDate: '2025-01-15',
      endDate: '2025-12-31'
    }
  ];

  // 模拟专家数据
  const mockExperts: ExpertInfo[] = [
    {
      id: '1',
      name: '王教授',
      title: '清华大学美术学院教授',
      institution: '清华大学',
      expertise: ['工业设计', '交互设计', '用户体验'],
      bio: '王教授是国内知名的设计学者，在工业设计领域有着丰富的经验。',
      avatar: defaultAvatar,
      email: 'wang.prof@tsinghua.edu.cn',
      phone: '138****1234',
      active: true
    },
    {
      id: '2',
      name: '李博士',
      title: '北京大学计算机科学技术研究所研究员',
      institution: '北京大学',
      expertise: ['人工智能', '机器学习', '数据挺掘'],
      bio: '李博士专注于人工智能的理论研究和应用实践。',
      avatar: defaultAvatar,
      email: 'li.dr@pku.edu.cn',
      phone: '139****5678',
      active: true
    }
  ];

  const [news, setNews] = useState<NewsArticle[]>(mockNews);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [experts, setExperts] = useState<ExpertInfo[]>(mockExperts);

  // 统计数据
  const contentStats = {
    totalNews: news.length,
    publishedNews: news.filter(n => n.status === 'published').length,
    totalBanners: banners.length,
    activeBanners: banners.filter(b => b.active).length,
    totalExperts: experts.length,
    activeExperts: experts.filter(e => e.active).length
  };

  // 新闻表格列
  const newsColumns: ColumnsType<NewsArticle> = [
    {
      title: '文章信息',
      key: 'article',
      render: (_, record) => (
        <div className="flex items-start space-x-3">
          {record.coverImage && (
            <Image
              width={80}
              height={60}
              src={record.coverImage}
              className="rounded object-cover"
            />
          )}
          <div className="flex-1">
            <div className="font-medium text-blue-600 mb-1">{record.title}</div>
            <div className="text-gray-500 text-sm mb-2">
              {record.summary}
            </div>
            <div className="flex flex-wrap gap-1">
              {record.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record) => (
        <Space>
          <Tag color={
            status === 'published' ? 'green' :
              status === 'draft' ? 'orange' : 'gray'
          }>
            {status === 'published' ? '已发布' :
              status === 'draft' ? '草稿' : '已归档'}
          </Tag>
          {record.featured && <Tag color="red">置顶</Tag>}
        </Space>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record, 'view')}
            size="small"
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record, 'edit')}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, 'news')}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 轮播图表格列
  const bannerColumns: ColumnsType<Banner> = [
    {
      title: '预览',
      key: 'preview',
      width: 120,
      render: (_, record) => (
        <Image
          width={100}
          height={60}
          src={record.imageUrl}
          className="rounded object-cover"
        />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '位置',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.active ? 'green' : 'gray'}>
          {record.active ? '激活' : '停用'}
        </Tag>
      ),
    },
    {
      title: '有效期',
      key: 'period',
      render: (_, record) => (
        <div>
          <div>{dayjs(record.startDate).format('YYYY-MM-DD')}</div>
          <div>至 {dayjs(record.endDate).format('YYYY-MM-DD')}</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record, 'edit')}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, 'banner')}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 专家表格列
  const expertColumns: ColumnsType<ExpertInfo> = [
    {
      title: '专家信息',
      key: 'expert',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Image
            width={60}
            height={60}
            src={record.avatar}
            className="rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-gray-500 text-sm">{record.title}</div>
            <div className="text-gray-500 text-sm">{record.institution}</div>
          </div>
        </div>
      ),
    },
    {
      title: '专业领域',
      key: 'expertise',
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.expertise.map(skill => (
            <Tag key={skill} color="blue">{skill}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div className="text-sm">{record.email}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.active ? 'green' : 'gray'}>
          {record.active ? '激活' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record, 'view')}
            size="small"
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record, 'edit')}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, 'expert')}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (item: any, mode: 'edit' | 'view') => {
    setEditingItem({ ...item, mode });
    form.setFieldsValue(item);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string, type: 'news' | 'banner' | 'expert') => {
    confirm({
      title: '确认删除',
      content: '您确定要删除这条记录吗？',
      onOk() {
        if (type === 'news') {
          setNews(news.filter(n => n.id !== id));
        } else if (type === 'banner') {
          setBanners(banners.filter(b => b.id !== id));
        } else if (type === 'expert') {
          setExperts(experts.filter(e => e.id !== id));
        }
        message.success('删除成功');
      },
    });
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      if (editingItem) {
        // 更新逻辑
        if (activeTab === 'news') {
          setNews(news.map(n => n.id === editingItem.id ? { ...n, ...values } : n));
        } else if (activeTab === 'banners') {
          setBanners(banners.map(b => b.id === editingItem.id ? { ...b, ...values } : b));
        } else if (activeTab === 'experts') {
          setExperts(experts.map(e => e.id === editingItem.id ? { ...e, ...values } : e));
        }
        message.success('编辑成功');
      } else {
        // 新增逻辑
        const newItem = {
          id: Date.now().toString(),
          ...values,
          ...(activeTab === 'news' && {
            viewCount: 0,
            lastModified: dayjs().format('YYYY-MM-DD')
          })
        };

        if (activeTab === 'news') {
          setNews([...news, newItem]);
        } else if (activeTab === 'banners') {
          setBanners([...banners, newItem]);
        } else if (activeTab === 'experts') {
          setExperts([...experts, newItem]);
        }
        message.success('新增成功');
      }
      setDrawerVisible(false);
      setEditingItem(null);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'news':
        return (
          <Table
            columns={newsColumns}
            dataSource={news}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        );
      case 'banners':
        return (
          <Table
            columns={bannerColumns}
            dataSource={banners}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        );
      case 'experts':
        return (
          <Table
            columns={expertColumns}
            dataSource={experts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderDrawerContent = () => {
    if (!editingItem) return null;

    const isViewMode = editingItem.mode === 'view';

    if (activeTab === 'news') {
      return (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          disabled={isViewMode}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item name="summary" label="摘要" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入文章摘要" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <TextArea rows={8} placeholder="请输入文章内容" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select placeholder="选择文章分类">
              <Option value="赛事公告">赛事公告</Option>
              <Option value="专家介绍">专家介绍</Option>
              <Option value="参赛指南">参赛指南</Option>
              <Option value="获奖作品">获奖作品</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select placeholder="选择发布状态">
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>
          <Form.Item name="featured" label="是否置顶" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="publishDate" label="发布时间" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      );
    }

    // 其他表单类似...
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>内容管理</Title>
        <Text className="text-gray-600">
          管理网站的新闻资讯、轮播图和专家信息
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="新闻文章"
              value={contentStats.totalNews}
              prefix={<FileTextOutlined />}
              suffix={`/ ${contentStats.publishedNews}已发布`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="轮播图片"
              value={contentStats.totalBanners}
              prefix={<PictureOutlined />}
              suffix={`/ ${contentStats.activeBanners}激活`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="专家信息"
              value={contentStats.totalExperts}
              prefix={<UserOutlined />}
              suffix={`/ ${contentStats.activeExperts}激活`}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Input
              placeholder="搜索内容..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem({ mode: 'edit' });
              form.resetFields();
              setDrawerVisible(true);
            }}
          >
            新增
            {activeTab === 'news' ? '文章' :
              activeTab === 'banners' ? '轮播图' : '专家'}
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="新闻资讯" key="news">
            {renderTabContent()}
          </TabPane>
          <TabPane tab="轮播图片" key="banners">
            {renderTabContent()}
          </TabPane>
          <TabPane tab="专家信息" key="experts">
            {renderTabContent()}
          </TabPane>
        </Tabs>
      </Card>

      {/* 编辑抽屉 */}
      <Drawer
        title={
          editingItem?.mode === 'view' ? '查看详情' :
            editingItem?.id ? '编辑' : '新增'
        }
        width={600}
        onClose={() => {
          setDrawerVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        open={drawerVisible}
        extra={
          editingItem?.mode !== 'view' && (
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>取消</Button>
              <Button type="primary" loading={loading} onClick={() => form.submit()}>
                保存
              </Button>
            </Space>
          )
        }
      >
        {renderDrawerContent()}
      </Drawer>
    </div>
  );
};

export default ContentManagement;

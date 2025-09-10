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
  Modal,
  message,
  Rate,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getProjectList, deleteProject } from '@/services/authService'
import { TRACKS, taskIdMap } from '@/constants/index'
import ProjectDialog from './projectDialog'
const { Title, Text } = Typography;
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
  const [projectId, setProjectId] = useState<Project | null>(null);
  const [searchText, setSearchText] = useState('');
  const [trackFilter, setTrackFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState<string>(null);
  const [pageNum, setPageNum] = useState<number>(1)
  const [total, setTotal] = useState<number>(null)
  const [projects, setProjects] = useState<Project[]>([]);

  const handleProjectList = () => {
    setLoading(true);
    const params = {
      pageNum,
      pageSize: 10,
      projectName: searchText,
      status: statusFilter,
      trackId: trackFilter
    }
    getProjectList(params).then(res => {
      if (res?.code === 200) {
        const { total, records } = res?.data
        setTotal(total);
        setProjects(records);
        setLoading(false);
      }
    }).finally(() => {
      setLoading(false);

    })
  }

  useEffect(() => {
    handleProjectList()
  }, [searchText, searchText, trackFilter, pageNum])


  // 统计数据
  const stats = {
    total: projects.length,
    submitted: 10,
    approved: 10,
    finalist: 10,
    avgScore: 10
    // submitted: projects.filter(p => p.status === 'submitted').length,
    // approved: projects.filter(p => p.status === 'approved').length,
    // finalist: projects.filter(p => p.status === 'finalist').length,
    // avgScore: (projects.reduce((sum, p) => sum + (p.evaluationScore || 0), 0) / projects.filter(p => p.evaluationScore).length).toFixed(1)
  };
  // 表格列配置
  const columns: ColumnsType<Project> = [
    {
      title: '作品名称',
      key: 'project',
      width: 250,
      render: (_, record: any) => (
        <div>
          <div className="font-medium text-blue-600 mb-1">{record?.projectName}</div>
          {/* <div className="text-gray-500 text-sm mb-2">
            {record.description.substring(0, 80)}...
          </div> */}
          {/* <div className="flex flex-wrap gap-1">
            {record.tags.slice(0, 3).map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {record.tags.length > 3 && (
              <Tag>+{record.tags.length - 3}</Tag>
            )}
          </div> */}
        </div>
      ),
    },
    {
      title: '作者',
      key: 'author',
      render: (_, record: any) => {
        const trackJson = JSON.parse(record?.trackJson || '{}')

        return <div>
          <div className="font-medium">{trackJson?.realName}</div>
          <div className="text-gray-500 text-sm">{record.authorEmail}</div>
          {record.teamMembers && (
            <div className="text-gray-500 text-sm">
              团队 {record.teamMembers.length} 人
            </div>
          )}
        </div>
      },
    },
    {
      title: '赛道',
      dataIndex: 'trackId',
      key: 'track',
      render: (track: string) => (
        <Tag color="blue">{taskIdMap[track] ?? '-'}</Tag>
      ),
      filters: TRACKS?.map(track => ({ text: track.label, value: track.value })),
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      render: (status: string) => {
        const statusConfig = {
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
    // {
    //   title: '统计',
    //   key: 'stats',
    //   render: (_, record) => (
    //     <div className="text-sm">
    //       <div>👁 {record.viewCount}</div>
    //       <div>⬇️ {record.downloadCount}</div>
    //     </div>
    //   ),
    // },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size='small'>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record?.id)}
            size="small"
          >
            查看
          </Button>
          {/* <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info('编辑功能开发中...')}
            size="small"
          >
            编辑
          </Button> */}
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

  const handleView = (id) => {
    setProjectId(id);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '确认删除',
      content: '您确定要删除这个项目吗？',
      onOk() {
        deleteProject(id).then(res => {
          console.log(res, '222');
          if (res?.code === 200) {
            message.success('删除成功');
            handleProjectList()
          }
        })
      },
    });
  };

  // const handleExport = () => {
  //   message.success('导出成功，文件正在下载...');
  // };


  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2}>参数作品管理</Title>
        <Text className="text-gray-600">
          管理和查看所有参赛项目的详细信息和文件
        </Text>
      </div>

      {/* 统计卡片 */}
      {/* <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="项目总数" value={total} prefix={<FileTextOutlined />} />
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
            <Statistic title="平均评分" value={stats?.avgScore} valueStyle={{ color: '#52c41a' }} prefix={<StarOutlined />} />
          </Card>
        </Col>
      </Row> */}

      {/* 操作区域 */}
      <Card>
        <div className="table-operations">
          <Space>
            <Input
              placeholder="搜索项目名"
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

            {/* <Select
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
            </Select> */}
          </Space>
          {/* <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出数据
            </Button>
          </Space> */}
        </div>

        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          tableLayout="fixed"
          scroll={{ x: 'max-content' }}
          loading={loading}
          pagination={{
            total,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page) => {
              setPageNum(page)
            }
          }}
        />
      </Card>
      <ProjectDialog
        drawerVisible={drawerVisible}
        projectId={projectId}
        setDrawerVisible={setDrawerVisible}
      />
    </div>
  );
};

export default ProjectManagement;

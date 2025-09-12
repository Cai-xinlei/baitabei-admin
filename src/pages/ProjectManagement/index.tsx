import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Input, Select, Space, Tag, Typography, Modal, message } from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getProjectList, deleteProject } from '@/services/authService';
import { TRACKS, taskIdMap } from '@/constants/index';
import ProjectDialog from './projectDialog'; // 确保此导入与ProjectDialog的导出方式匹配

// 类型定义
interface TrackJson {
  realName?: string;
  teamName?: string;
  unitName?: string;
  members?: any[];
  subjectType?: string;
  unitPhone?: string;
  teamPhone?: string;
  phone?: string;
  email?: string;
}

interface Project {
  id: string;
  projectName?: string;
  trackJson?: string;
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'finalist' | string;
  evaluationScore?: number;
  evaluationCount: number;
  viewCount: number;
  downloadCount: number;
  [key: string]: any;
}

interface StatusMapType {
  [key: string]: { color: string; text: string };
}

// 工具函数
const getTrackJson = (trackJsonStr: string | undefined): TrackJson => {
  if (!trackJsonStr) return {};
  try {
    return JSON.parse(trackJsonStr);
  } catch (e) {
    console.error('Failed to parse trackJson:', e);
    return {};
  }
};

const truncateText = (text: string | undefined, maxLength = 20): string => {
  if (!text) return '-';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// 正确实现错误边界组件（类组件方式，兼容所有React版本）
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    // 更新state，下次渲染显示错误UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
    message.error('加载失败，请重试');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>加载失败，请重试</p>
          <Button onClick={() => this.setState({ hasError: false })}>重试</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 状态映射常量
const statusMap: StatusMapType = {
  "2": { color: 'blue', text: '已提交' },
  "3": { color: 'orange', text: '初审中' },
  "4": { color: 'green', text: '初审通过' },
  "5": { color: 'red', text: '初审不通过' },
  "6": { color: 'blue', text: '复审中' },
  "7": { color: 'green', text: '复审通过' },
  "8": { color: 'red', text: '复审不通过' },
  "9": { color: 'blue', text: '终审中' },
  "10": { color: 'orange', text: '获奖' },
  "11": { color: 'red', text: '淘汰' }
};

const ProjectManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [trackFilter, setTrackFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  console.log(drawerVisible, 'drawerVisible');

  // API调用函数
  const handleProjectList = () => {
    setLoading(true);
    const params = {
      pageNum,
      pageSize: 10,
      projectName: searchText || undefined,
      status: statusFilter || undefined,
      trackId: trackFilter || undefined
    };

    getProjectList(params)
      .then(res => {
        if (res?.code === 200) {
          const { total, records } = res?.data || { total: 0, records: [] };
          setTotal(total);
          setProjects(records);
        } else {
          message.error(`获取数据失败: ${res?.message || '未知错误'}`);
        }
      })
      .catch(err => {
        console.error('API error:', err);
        message.error('网络错误，无法获取数据');
      })
      .finally(() => {
        setLoading(false);
      });
  }
  // 数据获取副作用
  useEffect(() => {
    handleProjectList();

  }, [searchText, trackFilter, statusFilter, pageNum]);

  // 统计数据
  const stats = useMemo(() => {
    const submitted = projects.filter(p => p.status === 'submitted').length;
    const approved = projects.filter(p => p.status === 'approved').length;
    const finalist = projects.filter(p => p.status === 'finalist').length;
    const scoredProjects = projects.filter(p => p.evaluationScore);

    return {
      total: projects.length,
      submitted,
      approved,
      finalist,
      avgScore: scoredProjects.length > 0
        ? (scoredProjects.reduce((sum, p) => sum + (p.evaluationScore || 0), 0) / scoredProjects.length).toFixed(1)
        : '0.0'
    };
  }, [projects]);

  // 表格列配置
  const columns: ColumnsType = useMemo(() => [
    {
      title: '作品名称',
      key: 'project',
      width: 250,
      lock: 'left',
      render: (_, record: Project) => (
        <div title={record.projectName}>{truncateText(record.projectName)}</div>
      ),
    },
    {
      title: '作者',
      key: 'author',
      width: 150,
      render: (_, record: Project) => {
        const trackJson = getTrackJson(record.trackJson);
        const authorName = trackJson.realName ?? trackJson.teamName ?? trackJson.unitName ?? '-';
        const membersInfo = trackJson.members?.length
          ? `${trackJson.subjectType || ''}/${trackJson.members.length}人`
          : '';

        return (
          <div>
            <div>{truncateText(authorName)}</div>
            {membersInfo && <div style={{ fontSize: 12, color: '#666' }}>{membersInfo}</div>}
          </div>
        );
      },
    },
    {
      title: '联系信息',
      key: 'contact',
      width: 150,
      render: (_, record: Project) => {
        const trackJson = getTrackJson(record.trackJson);
        const phone = trackJson.unitPhone ?? trackJson.teamPhone ?? trackJson.phone ?? '-';
        const email = trackJson.email ?? '-';

        return (
          <div>
            <div>{truncateText(phone, 15)}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{truncateText(email, 25)}</div>
          </div>
        );
      },
    },
    {
      title: '赛道',
      dataIndex: 'trackId',
      key: 'track',
      width: 150,
      render: (track: string) => (
        <div>{taskIdMap[track] || taskIdMap[track] || '-'}</div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusInfo = statusMap[status] || { color: 'default', text: '未知状态' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
      filters: Object.entries(statusMap).map(([value, { text }]) => ({ text, value })),
      onFilter: (value, record) => record.status.toString() === value,
    },
    {
      title: '评分',
      key: 'score',
      width: 100,
      render: (_, record: Project) => (
        record.evaluationScore ? (
          <>
            {record.evaluationScore.toFixed(1)}
            <span style={{ marginLeft: 5, fontSize: 12, color: '#666' }}>
              ({record.evaluationCount}人评分)
            </span>
          </>
        ) : (
          '未评分'
        )
      ),
      sorter: (a: Project, b: Project) => (a.evaluationScore || 0) - (b.evaluationScore || 0),
    },
    {
      title: '操作',
      key: 'action',
      lock: 'right',
      render: (_, record: Project) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
            size="small"
          >
            查看
          </Button>
          <Button
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
  ], []);

  // 查看项目详情
  const handleView = (id: string) => {
    if (!id) {
      message.error('项目ID不存在');
      return;
    }
    setProjectId(id);
    setDrawerVisible(true);
  }

  // 删除项目
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个项目吗？',
      onOk() {
        deleteProject(id)
          .then(res => {
            if (res?.code === 200) {
              message.success('删除成功');
              handleProjectList();
            } else {
              message.error(`删除失败: ${res?.message || '未知错误'}`);
            }
          })
          .catch(err => {
            console.error('Delete error:', err);
            message.error('删除失败，网络错误');
          });
      },
    });
  };

  return (
    <div className="project-management">
      <Typography.Title level={2}>参数作品管理</Typography.Title>
      {/* <Typography.Text>管理和查看所有参赛项目的详细信息和文件</Typography.Text> */}

      <div style={{ margin: '20px 0', display: 'flex', gap: 16, alignItems: 'center' }}>
        <Input
          placeholder="搜索作品名称"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          placeholder="选择赛道"
          style={{ width: 300 }}
          onChange={value => setTrackFilter(value)}
          allowClear
          options={TRACKS}
        />

        <Select
          placeholder="选择状态"
          style={{ width: 150 }}
          onChange={value => setStatusFilter(value)}
          allowClear
        >
          {Object.entries(statusMap).map(([value, { text }]) => (
            <Select.Option key={value} value={value}>{text}</Select.Option>
          ))}
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pageNum,
          pageSize: 10,
          total,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page) => setPageNum(page)
        }}
        locale={{ emptyText: '暂无数据' }}
      />

      {/* 使用错误边界包裹ProjectDialog */}
      <ErrorBoundary>
        <ProjectDialog
          visible={drawerVisible}
          projectId={projectId}
          onClose={() => setDrawerVisible(false)}
        />
      </ErrorBoundary>
    </div>
  );
};

export default ProjectManagement;
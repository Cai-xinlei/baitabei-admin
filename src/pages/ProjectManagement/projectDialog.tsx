import React, { useState, useEffect } from 'react';
import {
    Descriptions, Card, Button, Table, Spin, message, Drawer, Typography, Form
} from 'antd';
import { DownloadOutlined, FileTextOutlined, VideoCameraOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import DocViewerPlus from './docViewerPlus'; // 假设该组件存在于同一目录
import { detailProject } from '@/services/authService';
import { taskIdMap, TRACKS, projectTypeOption } from '@/constants/index';

const { Title, Text, Paragraph } = Typography;

// 内部辅助组件：文件预览
const FilePreview = ({ fileUrl, fileName, fileType, visible, onClose }) => {
    const handleDownload = () => {
        message.info('正在下载...');
        // 实际项目中应实现文件下载逻辑
    };

    const renderPreviewContent = () => {


        switch (fileType) {
            case 'document':
                return <DocViewerPlus fileUrl={fileUrl} fileName={fileName} />;
            case "image/jpeg":
                return <img src={fileUrl} alt={fileName} style={{ maxWidth: '100%' }} />;
            case 'video':
                return (
                    <video controls style={{ width: '100%' }}>
                        <source src={fileUrl} type="video/mp4" />
                        您的浏览器不支持视频播放
                    </video>
                );
            default:
                return <Text>不支持的文件类型</Text>;
        }
    };

    return (
        <Drawer
            title={`预览: ${fileName}`}
            placement="right"
            onClose={onClose}
            open={visible}
            width={800}
        >
            <div style={{ padding: '16px' }}>
                {renderPreviewContent()}
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleDownload}
                    >
                        下载文件
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

// 内部辅助组件：评分展示
const EvaluationScore = ({ score, maxScore = 5 }) => {
    if (!score) return <Text>-</Text>;

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Rate disabled defaultValue={score} max={maxScore} />
            <Text style={{ marginLeft: 8 }}>{score}/{maxScore}</Text>
        </div>
    );
};

// 工具函数：空值处理
const formatEmptyValue = (value, placeholder = '-') => {
    if (value === null || value === undefined || value === '') {
        return placeholder;
    }
    return value;
};

// 工具函数：日期格式化
const formatDate = (dateStr, format = 'YYYY-MM-DD') => {
    if (!dateStr) return formatEmptyValue(dateStr);
    return dayjs(dateStr).isValid() ? dayjs(dateStr).format(format) : '-';
};

// 工具函数：Markdown处理
const processMarkdown = (text) => {
    if (!text) return formatEmptyValue(text);
    return text
        .replace(/\n+/g, '\n')
        .replace(/([^\n])(-|\*|\+|\d+\.) /g, '\n$1$2 ')
        .replace(/(\|.*\|)\n/g, '\n$1\n');
};

// 表格列定义常量
const MEMBER_COLUMNS = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 60 },
    { title: '年龄', dataIndex: 'age', key: 'age', width: 60 },
    { title: '职务', dataIndex: 'position', key: 'position', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '身份证号码', dataIndex: 'idCard', key: 'idCard', width: 200 },
];

const memberColumns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 60,
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 60,
    },
    {
        title: '职务',
        dataIndex: 'position',
        key: 'position',
        width: 100,
    },
    {
        title: '联系电话',
        dataIndex: 'phone',
        width: 130,
        key: 'phone',
    },
    {
        title: '身份证号码',
        dataIndex: 'idCard',
        key: 'idCard',
        width: 200,
    },
];

// 业务常量映射
const SUBJECT_TYPE_CONFIG = {
    individual: {
        title: '个人信息',
        fields: [
            { key: 'realName', label: '姓名' },
            { key: 'gender', label: '性别' },
            { key: 'birthDate', label: '出生年月', formatter: (val) => formatDate(val) },
            { key: 'phone', label: '联系电话' },
            { key: 'workUnit', label: '工作单位（学生填在读学校）' },
            { key: 'major', label: '所学专业' },
            { key: 'education', label: '学历' },
            { key: 'idCard', label: '身份证号码' },
        ]
    },
    unit: {
        title: '单位信息',
        fields: [
            { key: 'unitName', label: '单位名称' },
            { key: 'unitPhone', label: '联系电话' },
            { key: 'orgCreditCode', label: '统一社会信用代码' },
            { key: 'isXichengRegistered', label: '是否西城注册', formatter: (val) => val ? '是' : '否' },
        ]
    },
    team: {
        title: '团队信息',
        fields: [
            { key: 'teamName', label: '团队名称' },
            { key: 'teamPhone', label: '联系电话' },
            { key: 'isXichengRegistered', label: '是否西城注册', formatter: (val) => val ? '是' : '否' },
        ]
    }
};

const ProjectDetail = (props) => {
    const { onClose, visible, projectId } = props;
    const [trackJson, setTrackJson] = useState(null);
    const [trackId, setTrackId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    console.log(trackJson, 'trackJsontrackJson');
    const renderDescriptions = (value, label, span = 1) => {
        if (!value) return
        return <Descriptions.Item label={label} span={span}>
            {value}
        </Descriptions.Item>
    }
    console.log(currentFile, 'currentFilecurrentFile');

    const renderViewFile = (data) => {
        console.log(data, 'data');
        const { name, url } = data
        return <DocViewerPlus fileUrl={url} fileName={name} />

    }


    // 数据获取逻辑
    useEffect(() => {
        if (!projectId) return;

        const fetchProjectDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // 实际项目中替换为真实API调用
                const res = await detailProject(projectId);
                if (res?.code === 200) {
                    setTrackId(res?.data?.trackId);
                    setTrackJson(res?.data?.trackJson);
                } else {
                    throw new Error(res?.message || '获取项目详情失败');
                }
            } catch (err) {
                setError(err.message);
                message.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetail();
    }, [projectId]);

    // 处理文件预览
    const handleFilePreview = (file) => {
        if (!file?.url) return;
        setCurrentFile(file);
        setPreviewVisible(true);
    };

    // 生成描述项
    const generateDescriptionsItems = (configKey) => {
        if (!trackJson) return [];

        const config = SUBJECT_TYPE_CONFIG[configKey];
        if (!config) return [];

        return config.fields.map(field => ({
            key: field.key,
            label: field.label,
            children: field.formatter
                ? field.formatter(trackJson[field.key])
                : formatEmptyValue(trackJson[field.key])
        }));
    };

    // 渲染主体信息
    const renderSubjectInfo = () => {
        if (!trackJson) return null;

        const subjectType = trackJson.subjectType === '团队' ? 'team' :
            trackJson.reportType === 'individual' ? 'individual' : 'unit';

        return (
            <>
                <Card style={{ marginTop: '16px' }} title={SUBJECT_TYPE_CONFIG[subjectType]?.title}>
                    <Descriptions
                        column={2}
                        bordered
                        items={generateDescriptionsItems(subjectType)}
                    />
                </Card>
                {trackJson?.members && <Card title={'参赛成员信息'} style={{ marginTop: 16 }}>
                    <Descriptions>
                        <Descriptions.Item label="参赛成员信息" span={2}>
                            <Table
                                columns={memberColumns}
                                dataSource={trackJson?.members}
                                tableLayout="fixed"
                                scroll={{ x: 'max-content' }}
                                rowKey="id"
                                pagination={false}
                            />

                        </Descriptions.Item>
                    </Descriptions>
                </Card>}
            </>
        );
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="数据加载中..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                <Text>{error}</Text>
                <div style={{ marginTop: '16px' }}>
                    <Button onClick={() => window.location.reload()}>重试</Button>
                </div>
            </div>
        );
    }

    return (
        <Drawer
            title="项目详情"
            width={900}
            onClose={() => {
                onClose();
            }}
            open={visible}
        >

            {trackJson && (
                <>
                    {/* 项目基本信息 */}
                    <Card title="项目基本信息" style={{ marginTop: '16px' }}>
                        <Descriptions column={2} bordered>
                            {renderDescriptions(trackJson?.projectTitle, '作品名称')}
                            {trackJson?.projectType && <Descriptions.Item label="作品分类">
                                {trackJson?.projectType &&
                                    projectTypeOption?.filter(v => v.value === trackJson?.projectType)[0]?.label
                                }
                            </Descriptions.Item>}
                            <Descriptions.Item label="赛道名称">
                                {formatEmptyValue(taskIdMap[trackId])}
                            </Descriptions.Item>
                            <Descriptions.Item label="报告类型">
                                {trackJson?.reportType === "individual" ? '个人' : "单位/团体"}
                            </Descriptions.Item>
                            {trackJson?.subjectType &&
                                <Descriptions.Item label="报名主体" span={2}>
                                    <Paragraph>{trackJson?.subjectType === "团队" ? "团队（2人以上个人)" : '单位 【政府机构、企事业单位（含学校）、社会团体】'}</Paragraph>
                                </Descriptions.Item>}
                            {renderDescriptions(trackJson?.useAI, '是否使用AI工具参与创作')}
                            {renderDescriptions(trackJson?.aiRemark, '注明所使用AI模型具体名称和使用程度')}

                        </Descriptions>
                    </Card>

                    {/* 主体信息 */}
                    {renderSubjectInfo()}

                    {/* 评分信息 */}
                    {trackJson?.evaluationScore && (
                        <Card title="评分信息" style={{ marginTop: '16px' }}>
                            <EvaluationScore score={trackJson?.evaluationScore} />
                        </Card>
                    )}

                    {/* 项目描述 */}
                    {trackJson?.workDescription && (
                        <Card title="项目描述" style={{ marginTop: '16px' }}>
                            <Paragraph>
                                {trackJson?.workDescription}
                            </Paragraph>
                        </Card>
                    )}

                    {/* 附件信息 */}
                    {trackJson?.attachments && trackJson?.attachments[0]?.url && <Card title="上传作品" style={{ marginTop: '16px' }}>
                        {trackJson?.attachments && trackJson?.attachments[0]?.url && renderViewFile(trackJson?.attachments[0])}
                    </Card>}

                </>
            )}
        </Drawer>
    );
};

export default ProjectDetail;
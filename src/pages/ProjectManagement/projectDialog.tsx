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
    Form,
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


export default (props) => {
    const { setDrawerVisible, setSelectedProject, drawerVisible, selectedProject, } = props
    const [form] = Form.useForm();

    return (
        <Drawer
            title="项目详情"
            width={900}
            onClose={() => {
                setDrawerVisible(false);
                setSelectedProject(null);
            }}
            open={drawerVisible}
        >
            <Form
                // form={form}
                layout="vertical"
            // initialValues={{
            //   trackId: selectedTrackId
            // }}
            // onFinish={handleSubmit}
            >
                {selectedProject && (
                    <div className="space-y-6">
                        {/* 项目基本信息 */}
                        <Card title="参赛赛道信息">
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
                        {/* <Card title="项目统计">
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
                        </Card> */}
                    </div>
                )}
            </Form>
        </Drawer>
    )
}
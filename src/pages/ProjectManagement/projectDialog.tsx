import {
    Button,
    Card,
    Typography,
    Row,
    Col,
    Statistic,
    message,
    Drawer,
    Descriptions,
    Form,
    List,
    Rate,
    Table,
} from 'antd';
import {
    DownloadOutlined,
    FileTextOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { taskIdMap, projectTypeOption } from '@/constants/index';
import { detailProject } from '@/services/authService'

// import { DocViewerPlus } from 'react-doc-viewer-plus';
import { useEffect, useState } from 'react';
const { Title, Text, Paragraph } = Typography;

export default (props) => {
    const { setDrawerVisible, drawerVisible, projectId, } = props
    const [trackJson, setTrackJson] = useState<any>({})
    const [trackId, setTrackId] = useState('')
    const [form] = Form.useForm();
    useEffect(() => {
        if (projectId) {
            detailProject(projectId).then(res => {
                if (res?.code === 200) {
                    console.log(res, 'resres');
                    setTrackId(res?.data?.trackId)
                    setTrackJson(res?.data.trackJson)
                }
            })
        }
    }, [projectId])

    const renderItem = (value) => {
        return value || '-'
    }

    const renderDescriptions = (value, label, span = 1) => {
        if (!value) return
        return <Descriptions.Item label={label} span={span}>
            {value}
        </Descriptions.Item>
    }


    // function FilePreview({ fileUrl, fileName }) {
    //     const [visible, setVisible] = useState(false);

    //     return (
    //         <DocViewerPlus
    //             previewFile={{ fileUrl, fileName }}
    //             visibleViewerPlus={visible}
    //             onVisibleChange={() => setVisible(!visible)}
    //         />
    //     );
    // }

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

    return (
        <Drawer
            title="项目详情"
            width={900}
            onClose={() => {
                setDrawerVisible(false);
            }}
            open={drawerVisible}
        >
            {trackJson && (
                <div className="space-y-6">
                    {/* 项目基本信息 */}
                    <Card title="基础信息">
                        <Descriptions column={2}>
                            <Descriptions.Item label="作品名称" span={2}>
                                <Title level={4}>{trackJson?.projectTitle}</Title>
                            </Descriptions.Item>
                            {trackJson?.projectType && <Descriptions.Item label="作品分类">
                                {projectTypeOption?.filter(v => v.value === trackJson?.projectType)[0].label}
                            </Descriptions.Item>}
                            <Descriptions.Item label="赛道名称">
                                {renderItem(taskIdMap[trackId])}
                            </Descriptions.Item>
                            <Descriptions.Item label="参赛类型">
                                {trackJson?.reportType === "individual" ? '个人' : "单位/团体"}
                            </Descriptions.Item>
                            {trackJson?.subjectType &&
                                <Descriptions.Item label="报名主体" span={2}>
                                    <Paragraph>{trackJson?.subjectType === "团队" ? "团队（2人以上个人)" : '单位 【政府机构、企事业单位（含学校）、社会团体】'}</Paragraph>
                                </Descriptions.Item>}
                            {renderDescriptions(trackJson?.realName, '姓名')}
                            {renderDescriptions(trackJson?.gender, '性别')}
                            {renderDescriptions(dayjs(trackJson.birthDate).format('YYYY-MM-DD'), '出生年月')}
                            {renderDescriptions(trackJson?.phone, '联系电话')}
                            {renderDescriptions(trackJson?.workUnit, '工作单位（学生填在读学校）')}
                            {renderDescriptions(trackJson?.major, '所学专业')}
                            {renderDescriptions(trackJson?.education, '学历')}
                            {renderDescriptions(trackJson?.idCard, '身份证号码')}
                        </Descriptions>
                    </Card>
                    {trackJson?.subjectType && trackJson?.subjectType === '单位' && <Card title="单位信息">
                        <Descriptions column={2}>
                            <Descriptions.Item label="单位名称">
                                {trackJson?.unitName}
                            </Descriptions.Item>
                            <Descriptions.Item label="负责人联系电话">
                                {trackJson?.unitPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="单位统一社会信用代码">
                                {trackJson?.orgCreditCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="是否为西城区注册企业">
                                {trackJson?.isXichengRegistered}
                            </Descriptions.Item>
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
                    {trackJson?.subjectType && trackJson?.subjectType === '团队' && <Card title="团队信息">
                        <Descriptions column={2}>
                            <Descriptions.Item label="团队名称">
                                {trackJson?.teamName}
                            </Descriptions.Item>
                            <Descriptions.Item label="团队负责人联系电话">
                                {trackJson?.teamPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="是否为西城区注册企业" span={2}>
                                {trackJson?.isXichengRegistered}
                            </Descriptions.Item>
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
                    {/* 评分信息 */}
                    {trackJson?.evaluationScore && (
                        <Card title="评审结果">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Statistic
                                        title="平均评分"
                                        value={trackJson?.evaluationScore}
                                        precision={1}
                                        suffix={<div><Rate disabled value={trackJson?.evaluationScore} allowHalf /></div>}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="评审人数" value={trackJson?.evaluationCount} suffix="人" />
                                </Col>
                            </Row>
                        </Card>
                    )}

                    {/* 文件管理 */}
                    <Card title="项目文件">
                        <Descriptions>
                            <Descriptions.Item label="作品简介" span={2}>
                                <Paragraph>{trackJson?.workDescription}</Paragraph>
                            </Descriptions.Item>
                            {/* 文档文件 */}
                            {/* {trackJson?.files?.documents.length > 0 && (
                                <div className="mb-6">
                                    <Title level={5}>📄 文档文件</Title>
                                    <List
                                        dataSource={trackJson?.files.documents}
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
                            )} */}

                            {/* {FilePreview({
                                fileUrl: trackJson?.attachments[0]?.url, fileName: trackJson?.attachments[0]?.name
                            })} */}

                            {/* 图片文件
                      {trackJson?.files.images.length > 0 && (
                        <div className="mb-6">
                          <Title level={5}>🖼️ 图片文件</Title>
                          <Row gutter={[16, 16]}>
                            {trackJson?.files?.images?.map((item, index) => (
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
                      )} */}

                            {/* 视频文件 */}
                            {/* {trackJson?.files?.videos.length > 0 && (
                                <div className="mb-6">
                                    <Title level={5}>🎥 视频文件</Title>
                                    <List
                                        dataSource={trackJson?.files.videos}
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
                            )} */}
                        </Descriptions>

                    </Card>
                </div>
            )}

        </Drawer>
    )
}
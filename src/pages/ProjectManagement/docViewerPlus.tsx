import React, { useEffect, useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { getFilePreview } from '@/services/authService';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';

// 不支持预览的文件类型列表
const UNSUPPORTED_PREVIEW_TYPES = [
    'zip', 'rar', '7z', 'tar', 'gz', 'bz2', // 压缩包类型
    'exe', 'dll', 'bin', // 可执行文件
    'apk', 'ipa', // 安装包
    'psd', 'ai', 'sketch', // 设计源文件
    'docx'
];

// 判断文件是否支持预览
const isPreviewSupported = (fileName, previewUrl) => {
    if (!fileName || !previewUrl) return false;

    // 获取文件扩展名
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    // 检查是否在不支持的列表中
    if (UNSUPPORTED_PREVIEW_TYPES.includes(ext)) {
        return false;
    }

    // 检查预览链接是否有效
    return !!previewUrl;
};
const imageList = ['.jpg']

const OptimizedDocumentPreview = ({ fileUrl, fileName }) => {

    const [previewUrl, setPreviewUrl] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // 内部辅助组件：文件预览
    const isImage = (path) => {
        return /\.(jpg|png) $ /i.test(path)
    };
    const FilePreview = () => {
        const parsedUrl = new URL(fileUrl);
        const pathname = parsedUrl.pathname;

        const isImage = /\.(jpg|png) $ /i.test(pathname);
        if (isImage) {
            return <img src={fileUrl} alt={fileName} style={{ maxWidth: '100%' }} />;
        }
    };

    // 解析文件路径
    useEffect(() => {
        if (!fileUrl) return;

        try {
            const parsedUrl = new URL(fileUrl);
            const objectKey = decodeURIComponent(parsedUrl.pathname.substring(1));

            setIsLoading(true);
            getFilePreview({ objectKey })
                .then(response => {
                    if (response?.code === 200 && response.data) {
                        setPreviewUrl(response.data.previewUrl || '');
                        setDownloadUrl(response.data.downloadUrl || '');
                    } else {
                        message.error('获取文件信息失败');
                    }
                })
                .catch(error => {
                    message.error('获取文件信息时发生错误');
                    console.error('API调用错误:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } catch (error) {
            message.error('文件路径解析失败');
            console.error('URL解析错误:', error);
        }
    }, [fileUrl]);

    // 判断是否支持预览
    const canPreview = isPreviewSupported(fileName, previewUrl);

    // 处理查看文档
    const handleViewDocument = () => {
        if (!canPreview) return;

        try {
            window.open(previewUrl, '_blank');
        } catch (error) {
            message.error('无法打开预览窗口');
            console.error('打开窗口错误:', error);
        }
    };

    // 处理下载文件
    const handleDownload = () => {
        if (!downloadUrl) {
            message.error('下载链接不可用');
            return;
        }

        try {
            window.open(downloadUrl, '_blank');
        } catch (error) {
            message.error('无法打开下载窗口');
            console.error('打开窗口错误:', error);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* {
                FilePreview()
            } */}

            {/* 查看文档按钮 - 不支持预览时禁用并显示提示 */}
            <Tooltip
                title={!canPreview && fileName
                    ? `不支持预览此类型文件(.${fileName.split('.').pop()})，请下载查看`
                    : "查看文档预览"
                }
                placement="top"
            >
                <Button
                    icon={<FileTextOutlined />}
                    onClick={handleViewDocument}
                    disabled={!canPreview || isLoading}
                    loading={isLoading}
                    size="middle"
                    style={{
                        opacity: !canPreview ? 0.6 : 1,
                        cursor: !canPreview ? 'not-allowed' : 'pointer'
                    }}
                >
                    查看文档
                </Button>
            </Tooltip>

            {/* 下载文件按钮 */}
            <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                disabled={!downloadUrl || isLoading}
                loading={isLoading}
                size="middle"
                type="primary"
            >
                下载文件
            </Button>

            {/* 不支持预览时显示额外提示 */}
            {!canPreview && !isLoading && (
                <div style={{
                    color: '#faad14',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    ⓘ 此文件类型不支持在线预览，请下载后查看
                </div>
            )}
        </div>
    );
};

export default OptimizedDocumentPreview;
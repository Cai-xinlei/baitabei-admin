import { DocViewerPlus } from 'react-doc-viewer-plus';
import { useState } from 'react';
import {
    Layout,
    Menu,
    Dropdown,
    Avatar,
    Badge,
    Button,
    Space,
    Typography,
    theme
} from 'antd';
function App({ fileUrl, fileName }) {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <Button onClick={() => setVisible(true)}>查看文档</Button>
            <Button onClick={() => setVisible(true)}>下载文件</Button>

            <DocViewerPlus
                previewFile={{
                    fileUrl,
                    fileName
                }}
                visibleViewerPlus={visible} // 控制显示状态
                onVisibleChange={() => setVisible(false)} // 关闭回调
            />
        </div>
    );
}

export default App;
# 2025年白塔杯文化创意大赛API接口文档

## API概述

### 基础信息
- **基础URL**: `http://localhost:8080/api`
- **API版本**: v1.0
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

### 响应格式

#### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": 1690704000000
}
```

#### 错误响应
```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "timestamp": 1690704000000
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 系统内部错误 |

## 1. 用户认证模块

### 1.1 用户登录

**接口地址**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "userInfo": {
      "id": 1,
      "username": "admin",
      "email": "admin@baitabei.com",
      "realName": "管理员",
      "roles": ["SUPER_ADMIN"]
    }
  }
}
```

### 1.2 用户注册

**接口地址**: `POST /auth/register`

**请求参数**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456",
  "realName": "测试用户",
  "phone": "13800138000"
}
```

### 1.3 用户登出

**接口地址**: `POST /auth/logout`

**请求头**:
```
Authorization: Bearer <token>
```

### 1.4 刷新Token

**接口地址**: `POST /auth/refresh`

**请求头**:
```
Authorization: Bearer <refresh_token>
```

### 1.5 获取当前用户信息

**接口地址**: `GET /auth/profile`

**请求头**:
```
Authorization: Bearer <token>
```

## 2. 用户管理模块

### 2.1 用户列表

**接口地址**: `GET /users`

**请求参数**:
- `page`: 页码（默认1）
- `size`: 每页数量（默认10）
- `keyword`: 搜索关键词
- `status`: 用户状态
- `role`: 用户角色

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 100,
    "pages": 10,
    "current": 1,
    "size": 10,
    "records": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@baitabei.com",
        "realName": "管理员",
        "status": 1,
        "createdTime": "2025-07-30T10:00:00"
      }
    ]
  }
}
```

### 2.2 用户详情

**接口地址**: `GET /users/{id}`

### 2.3 创建用户

**接口地址**: `POST /users`

### 2.4 更新用户

**接口地址**: `PUT /users/{id}`

### 2.5 删除用户

**接口地址**: `DELETE /users/{id}`

## 3. 项目管理模块

### 3.1 项目列表

**接口地址**: `GET /projects`

**请求参数**:
- `page`: 页码
- `size`: 每页数量
- `trackId`: 赛道ID
- `status`: 项目状态
- `keyword`: 搜索关键词

### 3.2 项目详情

**接口地址**: `GET /projects/{id}`

### 3.3 创建项目

**接口地址**: `POST /projects`

**请求参数**:
```json
{
  "projectName": "智能文化传承平台",
  "trackId": 1,
  "description": "基于AI技术的文化传承创新平台",
  "detailedDescription": "详细描述...",
  "innovationPoints": "创新点...",
  "technicalSolution": "技术方案...",
  "marketAnalysis": "市场分析...",
  "teamInfo": "团队信息..."
}
```

### 3.4 更新项目

**接口地址**: `PUT /projects/{id}`

### 3.5 提交项目

**接口地址**: `POST /projects/{id}/submit`

### 3.6 审核项目

**接口地址**: `POST /projects/{id}/review`

**请求参数**:
```json
{
  "status": 4,
  "reviewComment": "审核通过"
}
```

## 4. 赛道管理模块

### 4.1 赛道列表

**接口地址**: `GET /tracks`

### 4.2 赛道详情

**接口地址**: `GET /tracks/{id}`

### 4.3 创建赛道

**接口地址**: `POST /tracks`

### 4.4 更新赛道

**接口地址**: `PUT /tracks/{id}`

## 5. 评审管理模块

### 5.1 评分列表

**接口地址**: `GET /evaluations`

### 5.2 评分详情

**接口地址**: `GET /evaluations/{id}`

### 5.3 提交评分

**接口地址**: `POST /evaluations`

**请求参数**:
```json
{
  "projectId": 1,
  "round": 1,
  "creativityScore": 85.5,
  "practicalityScore": 80.0,
  "technologyScore": 90.0,
  "marketScore": 75.0,
  "cultureScore": 88.0,
  "comments": "项目创意新颖，技术实现良好",
  "suggestions": "建议加强市场推广策略"
}
```

### 5.4 更新评分

**接口地址**: `PUT /evaluations/{id}`

### 5.5 评审任务分配

**接口地址**: `POST /evaluations/assign`

## 6. 新闻管理模块

### 6.1 新闻列表

**接口地址**: `GET /news`

**请求参数**:
- `page`: 页码
- `size`: 每页数量
- `category`: 新闻分类
- `status`: 发布状态
- `keyword`: 搜索关键词

### 6.2 新闻详情

**接口地址**: `GET /news/{id}`

### 6.3 创建新闻

**接口地址**: `POST /news`

### 6.4 更新新闻

**接口地址**: `PUT /news/{id}`

### 6.5 发布新闻

**接口地址**: `POST /news/{id}/publish`

### 6.6 删除新闻

**接口地址**: `DELETE /news/{id}`

## 7. 文件管理模块

### 7.1 文件上传

**接口地址**: `POST /files/upload`

**请求方式**: multipart/form-data

**请求参数**:
- `file`: 上传的文件
- `category`: 文件分类（可选）
- `description`: 文件描述（可选）

**响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": 123,
    "fileName": "document.pdf",
    "fileUrl": "https://bucket.oss.com/files/document.pdf",
    "fileSize": 1024000,
    "fileType": "pdf"
  }
}
```

### 7.2 文件删除

**接口地址**: `DELETE /files/{id}`

### 7.3 文件列表

**接口地址**: `GET /files`

## 8. 统计分析模块

### 8.1 用户统计

**接口地址**: `GET /statistics/users`

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "totalUsers": 1000,
    "activeUsers": 800,
    "newUsersToday": 50,
    "newUsersThisMonth": 200,
    "usersByRole": {
      "PARTICIPANT": 850,
      "EXPERT": 20,
      "CONTEST_ADMIN": 5,
      "SUPER_ADMIN": 1
    }
  }
}
```

### 8.2 项目统计

**接口地址**: `GET /statistics/projects`

### 8.3 评审统计

**接口地址**: `GET /statistics/evaluations`

### 8.4 综合数据看板

**接口地址**: `GET /statistics/dashboard`

## 9. 系统配置模块

### 9.1 配置列表

**接口地址**: `GET /configs`

### 9.2 更新配置

**接口地址**: `PUT /configs/{key}`

### 9.3 批量更新配置

**接口地址**: `PUT /configs/batch`

## 10. 操作日志模块

### 10.1 日志列表

**接口地址**: `GET /logs`

### 10.2 日志详情

**接口地址**: `GET /logs/{id}`

## 错误码说明

### 业务错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | 用户不存在 |
| 1002 | 用户已被禁用 |
| 1003 | 密码错误 |
| 1004 | token无效 |
| 1005 | token已过期 |
| 1006 | 权限不足 |
| 2001 | 项目不存在 |
| 2002 | 项目状态错误 |
| 2003 | 项目已提交 |
| 3001 | 赛道不存在 |
| 3002 | 赛道已关闭 |
| 4001 | 评分记录不存在 |
| 4002 | 评分已提交 |
| 5001 | 文件上传失败 |
| 5002 | 文件类型不允许 |
| 5003 | 文件大小超出限制 |

## 测试环境

### 测试账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|----- |
| 超级管理员 | admin | admin123 | 系统管理员 |
| 赛事管理员 | contest_admin | 123456 | 大赛管理员 |
| 评审专家 | expert | 123456 | 评审专家 |
| 参赛者 | participant | 123456 | 参赛用户 |

### Postman集合

导入以下Postman集合进行API测试：

```json
{
  "info": {
    "name": "白塔杯大赛API",
    "description": "2025年白塔杯文化创意大赛API接口测试"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

**作者**: MiniMax Agent  
**日期**: 2025-07-30  
**版本**: 1.0.0

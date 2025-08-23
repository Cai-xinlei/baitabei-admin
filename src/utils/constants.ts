/**
 * 系统常量定义
 */

// 用户角色
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  COMPETITION_ADMIN: 'competition_admin', 
  REVIEW_EXPERT: 'review_expert',
  NORMAL_ADMIN: 'normal_admin',
  PARTICIPANT: 'participant'
} as const;

// 用户角色显示名称
export const USER_ROLE_NAMES = {
  [USER_ROLES.SUPER_ADMIN]: '超级管理员',
  [USER_ROLES.COMPETITION_ADMIN]: '赛事管理员',
  [USER_ROLES.REVIEW_EXPERT]: '评审专家',
  [USER_ROLES.NORMAL_ADMIN]: '普通管理员',
  [USER_ROLES.PARTICIPANT]: '参赛者'
} as const;

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
  PENDING: 'pending'
} as const;

// 项目状态
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
} as const;

// 评分标准
export const SCORING_CRITERIA = {
  CREATIVITY: {
    key: 'creativity',
    name: '创意性',
    weight: 30,
    description: '创新程度、独特性、原创性'
  },
  PRACTICALITY: {
    key: 'practicality', 
    name: '实用性',
    weight: 25,
    description: '实际应用价值、解决问题能力'
  },
  TECHNICAL: {
    key: 'technical',
    name: '技术实现',
    weight: 20,
    description: '技术难度、实现质量、可行性'
  },
  MARKET: {
    key: 'market',
    name: '市场潜力', 
    weight: 15,
    description: '商业价值、市场前景、推广可能'
  },
  CULTURAL: {
    key: 'cultural',
    name: '文化内涵',
    weight: 10,
    description: '文化价值、社会意义、教育作用'
  }
} as const;

// 权限定义
export const PERMISSIONS = {
  // 用户管理
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  
  // 项目管理
  PROJECT_READ: 'project:read',
  PROJECT_WRITE: 'project:write',
  PROJECT_REVIEW: 'project:review',
  PROJECT_DELETE: 'project:delete',
  
  // 评审系统
  EVALUATION_READ: 'evaluation:read',
  EVALUATION_WRITE: 'evaluation:write',
  EVALUATION_ASSIGN: 'evaluation:assign',
  
  // 内容管理
  CONTENT_READ: 'content:read',
  CONTENT_WRITE: 'content:write',
  CONTENT_PUBLISH: 'content:publish',
  CONTENT_DELETE: 'content:delete',
  
  // 系统管理
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_BACKUP: 'system:backup'
} as const;

export default {
  USER_ROLES,
  USER_ROLE_NAMES,
  USER_STATUS,
  PROJECT_STATUS,
  SCORING_CRITERIA,
  PERMISSIONS
};
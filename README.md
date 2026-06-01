# 船海能动资料共享平台

<p align="center">
  <a href="https://whutstudy.cn"><strong>🌐 whutstudy.cn</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/chengqaq1017/self-study"><strong>⭐ GitHub</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/chengqaq1017/self-study?style=social" alt="GitHub stars" height="20">
  &nbsp;
  <img src="https://img.shields.io/badge/status-live-brightgreen?style=flat" alt="status">
  &nbsp;
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js" alt="Next.js">
</p>

武汉理工大学船海与能源动力工程学院课程资料共享平台，面向船舶与海洋工程、轮机工程、能源与动力工程（船舶）相关专业，支持按课程、关键词和年份查找资料。

## 技术栈

- **前端**: Next.js 16 (App Router) + Tailwind CSS 4
- **后端**: Next.js Route Handlers
- **数据库**: PostgreSQL + Prisma 7
- **认证**: NextAuth.js v5 (Credentials + JWT)

## 本地开发

### 前提条件

- Node.js 20.9+
- PostgreSQL 数据库

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填入 DATABASE_URL 和 AUTH_SECRET

# 3. 初始化数据库
npm run db:push
npm run db:generate

# 4. 填充课程种子数据
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

如需创建管理员账号，在运行 `npm run db:seed` 前设置：

```bash
SEED_ADMIN_EMAIL=your-admin@example.com
SEED_ADMIN_PASSWORD=your-password
```

未设置上述变量时，种子脚本不会创建默认管理员账号。

## 数据范围

课程目录依据武汉理工大学船海与能源动力工程学院官网 2025-06-05 发布的 2024 版本科培养方案整理，覆盖：

- 船舶与海洋工程专业、卓越班、学硕班
- 轮机工程专业、卓越工程师班
- 能源与动力工程（船舶）专业、船舶卓越工程师班

## 功能

- 邮箱注册/登录
- 课程目录与资料检索
- 按单个年份标注资料
- 一次选择多个文件批量上传
- 管理员审核资料后公开
- 用户在个人中心修改姓名、邮箱和密码
- 下载计数统计

## 项目结构

```text
src/
  app/
    (auth)/login/        # 登录页
    (auth)/register/     # 注册页
    admin/               # 管理员后台
    api/                 # Route Handlers
    materials/           # 资料浏览/详情
    subjects/            # 课程目录
    upload/              # 上传资料
    profile/             # 个人中心
  auth.ts                # NextAuth 配置
  middleware.ts          # 路由守卫
  components/            # 组件
  lib/
    colleges.ts          # 学院与培养方案信息
    prisma.ts            # Prisma 单例
    storage.ts           # 文件存储抽象
prisma/
  schema.prisma          # 数据库 Schema
  seed.ts                # 课程种子数据脚本
```

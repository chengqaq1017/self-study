# 武理资料共享平台

武汉理工大学笔记与考试资料分享平台。学生可上传/下载按科目组织的学习资料。

## 技术栈

- **前端**: Next.js 16 (App Router) + Tailwind CSS 4
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma 7
- **认证**: NextAuth.js v5 (Credentials + JWT)

## 本地开发

### 前提条件

- Node.js 18+
- PostgreSQL 数据库

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的 DATABASE_URL 和 AUTH_SECRET

# 3. 初始化数据库
npm run db:push      # 将 Schema 推送到数据库
npm run db:generate  # 生成 Prisma Client

# 4. 填充种子数据（科目 + 管理员账号）
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
  app/
    (auth)/login/        # 登录页
    (auth)/register/     # 注册页
    (admin)/             # 管理员后台
    api/                 # API 路由
    materials/           # 资料浏览/详情
    subjects/            # 科目分类
    upload/              # 上传资料
    profile/             # 个人中心
  auth.ts               # NextAuth 配置
  middleware.ts          # 路由守卫
  components/            # 组件
  lib/
    prisma.ts            # Prisma 单例
    storage.ts           # 文件存储抽象层
prisma/
  schema.prisma          # 数据库 Schema
  seed.ts                # 种子数据脚本
```

## 功能

- 邮箱注册/登录（后续接入智慧理工大 OAuth）
- 按科目浏览资料
- 上传考试资料（PDF/Word/PPT/压缩包等）
- 管理员审核机制
- 下载计数统计

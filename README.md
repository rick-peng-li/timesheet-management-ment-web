<!-- Git 仓库地址：git@github.com:rick-peng-li/timesheet-management-ment-web.git -->

# Timesheet Management Ment Web

一个基于 MERN 技术栈实现的工时管理系统，面向管理员与员工两类角色，支持登录鉴权、员工账号创建、项目分配、工时开始/结束记录、日报提交以及员工在线状态与当日工时统计。

## 项目概览

### 业务目标
- 为管理员提供员工、项目与工时统一管理入口
- 为员工提供项目查看、计时打卡与工作报告提交通道
- 通过在线状态与当日工时统计提升团队协作透明度

### 角色说明
- 管理员：admin，负责创建账号、分配项目、查看工时与员工状态
- 员工：employee，负责查看分配项目、开始/结束工作、提交日报、查看个人工时

## 功能模块

### 1. 认证与权限模块
- 登录接口签发 JWT，前端将 token 持久化到 `localStorage`
- 后端通过 `protect` 中间件校验 token
- 管理员接口额外通过 `adminOnly` 中间件进行角色限制
- 登录时更新用户在线状态，退出时写回离线状态与最后在线时间

### 2. 管理端模块
- 用户创建：支持创建员工或管理员账号
- 员工列表：为项目指派提供候选员工数据
- 项目分配：录入项目标题、描述、截止日期、被分配员工
- 工时总览：查看员工、项目、工时、日报、日期等记录
- 员工状态监控：查看在线/离线、最后在线时间、当前工作项目、今日时长、今日工作会话数

### 3. 员工端模块
- 我的项目：查看已分配项目、项目状态与截止日期
- 开始工作：针对项目发起计时，生成 `active` 状态工时记录
- 结束工作：结束当前项目计时并计算工时
- 提交日报：对最近一次已完成工时记录补充日报内容
- 我的工时：查看个人历史工时记录与日报

## 页面与路由设计

### 公共页面
| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/login` | 登录页 | 输入邮箱与密码，登录后根据角色跳转到不同控制台 |

### 管理端页面
| 路由 | 页面 | 功能 |
| --- | --- | --- |
| `/admin` | Dashboard 首页 | 展示欢迎信息与后台入口 |
| `/admin/status` | 员工状态页 | 查看在线状态、当前项目、今日工时与会话 |
| `/admin/assign` | 项目分配页 | 为员工分配项目 |
| `/admin/timelogs` | 工时记录页 | 查看全量工时记录与日报 |
| `/admin/create-user` | 创建用户页 | 创建员工或管理员账号 |

### 员工端页面
| 路由 | 页面 | 功能 |
| --- | --- | --- |
| `/employee` | 我的项目页 | 查看本人项目，开始/结束工作 |
| `/employee/submit` | 提交日报页 | 选择项目并提交工作报告 |
| `/employee/logs` | 我的工时页 | 查看历史工时与日报 |

## 接口设计

### 认证接口
| 方法 | 路径 | 鉴权 | 功能 |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | 否 | 用户登录，返回 `token` 与用户信息 |
| POST | `/api/auth/logout` | 是 | 用户退出登录，更新在线状态 |

### 管理端接口
| 方法 | 路径 | 鉴权 | 功能 |
| --- | --- | --- | --- |
| POST | `/api/admin/create-user` | 管理员 | 创建员工或管理员账号 |
| GET | `/api/admin/employees` | 管理员 | 获取员工列表 |
| POST | `/api/admin/assign-project` | 管理员 | 创建并分配项目 |
| GET | `/api/admin/projects` | 管理员 | 获取全部项目 |
| GET | `/api/admin/timelogs` | 管理员 | 获取全部工时记录 |
| GET | `/api/admin/employee-status` | 管理员 | 获取员工在线状态、当前项目与今日工时 |

### 员工端接口
| 方法 | 路径 | 鉴权 | 功能 |
| --- | --- | --- | --- |
| GET | `/api/employee/my-projects` | 员工 | 获取当前员工的项目列表 |
| POST | `/api/employee/start-work` | 员工 | 开始某个项目的工时记录 |
| POST | `/api/employee/stop-work` | 员工 | 结束某个项目的工时记录 |
| POST | `/api/employee/submit-report` | 员工 | 为最近一次已完成工时提交日报 |
| GET | `/api/employee/my-logs` | 员工 | 获取当前员工工时记录 |

## 数据模型设计

### User
- `name`：姓名
- `email`：邮箱，唯一
- `password`：加密后的密码
- `role`：`admin` / `employee`
- `isOnline`：是否在线
- `lastSeen`：最后在线时间
- `createdAt` / `updatedAt`：创建与更新时间

### Project
- `title`：项目标题
- `description`：项目描述
- `deadline`：截止日期
- `assignedTo`：被分配员工
- `createdBy`：创建人
- `status`：`pending` / `in-progress` / `completed`
- `createdAt` / `updatedAt`：创建与更新时间

### TimeLog
- `employee`：所属员工
- `project`：所属项目
- `startTime`：开始时间
- `endTime`：结束时间
- `hoursWorked`：工时
- `report`：工作报告
- `status`：`active` / `completed`
- `date`：记录日期
- `createdAt` / `updatedAt`：创建与更新时间

## 架构与技术栈

### 后端架构
- Node.js + Express 构建 RESTful API
- MongoDB + Mongoose 管理数据模型与持久化
- JWT 实现无状态身份认证
- bcryptjs 用于密码加密
- 中间件拆分为鉴权与角色校验逻辑
- 路由、控制器、模型分层组织，便于扩展

### 前端架构
- React 负责页面渲染
- React Router 实现登录页、管理端与员工端路由隔离
- Axios 统一封装 API 请求，并自动注入 JWT 请求头
- Context API 管理用户会话状态
- 页面按角色拆分到 `pages/admin` 与 `pages/employee`

### 目录结构
```text
.
├─backend
│  ├─controllers
│  ├─middleware
│  ├─models
│  ├─routes
│  └─server.js
├─frontend
│  ├─public
│  └─src
│     ├─api
│     ├─context
│     └─pages
└─README.md
```

## 启动方式

### 运行环境
- Node.js 18+
- MongoDB 6+
- npm 9+

### 1. 安装依赖
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. 配置后端环境变量
在 `backend` 目录下创建 `.env` 文件，至少包含以下变量：

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/timesheet_management
JWT_SECRET=your_jwt_secret
```

### 3. 启动后端
```bash
cd backend
npm run dev
```

### 4. 启动前端
```bash
cd frontend
npm start
```

### 5. 访问地址
- 前端默认地址：`http://localhost:3000`
- 后端默认地址：`http://localhost:5000`
- 前端 API 基地址：`http://localhost:5000/api`

## 交互流程说明

### 登录流程
1. 用户在登录页输入邮箱与密码
2. 前端调用 `/api/auth/login`
3. 后端校验账号密码并返回 token 与用户信息
4. 前端根据角色跳转到 `/admin` 或 `/employee`

### 员工工时流程
1. 员工在“我的项目”页面点击开始工作
2. 前端调用 `/api/employee/start-work`
3. 后端创建 `active` 状态工时记录，并将项目设为 `in-progress`
4. 员工完成后点击结束工作
5. 后端计算工时并更新为 `completed`
6. 员工在“提交日报”页面补充工作说明

### 管理员查看状态流程
1. 管理员进入“员工状态”页面
2. 前端每 20 秒拉取一次 `/api/admin/employee-status`
3. 后端聚合员工在线状态、当前项目、今日工时与会话信息并返回

## 本次整理说明
- 已补充根目录说明文档，统一为中文项目文档
- 已完善忽略规则，避免依赖、日志、构建产物与环境文件进入仓库
- 已清理前端默认脚手架冗余文件，减少无效资源与文档噪音
- 若后续需要部署到服务器，建议将前端 `src/api/axios.js` 中的 API 地址改为环境变量配置

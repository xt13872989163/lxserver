# SyncNotes - 跨平台数据同步笔记应用

## 📱 项目概述

SyncNotes 是一款支持 Android 和 Web 端实时数据同步的笔记应用，使用 React Native (Expo) 和 React 构建。

## ✅ 已实现功能

### Android 应用
- ✅ 笔记列表页面（支持下拉刷新）
- ✅ 笔记编辑器（自动保存）
- ✅ 笔记删除功能
- ✅ 设置页面
- ✅ 实时数据同步（Socket.IO）
- ✅ 离线支持（本地缓存）
- ✅ Material Design UI

### Web 应用
- ✅ 响应式笔记列表
- ✅ 模态编辑器
- ✅ 实时同步
- ✅ 键盘快捷键支持

### 后端服务
- ✅ RESTful API（CRUD 操作）
- ✅ WebSocket 实时通信
- ✅ SQLite 数据库存储
- ✅ 冲突解决机制

## 🏗️ 项目结构

```
syncnotes/
├── SPEC.md              # 项目规范文档
├── backend/             # Node.js 后端
│   ├── src/
│   │   ├── index.js           # 服务器入口
│   │   ├── routes/notes.js    # API 路由
│   │   ├── db/database.js     # SQLite 数据库
│   │   └── socket/handler.js  # Socket.IO 处理
│   └── package.json
├── android/             # React Native Android 应用
│   ├── App.jsx         # 主应用入口
│   ├── src/
│   │   ├── screens/           # 页面组件
│   │   │   ├── NotesListScreen.jsx
│   │   │   ├── NoteEditorScreen.jsx
│   │   │   └── SettingsScreen.jsx
│   │   ├── components/        # UI 组件
│   │   │   ├── NoteCard.jsx
│   │   │   ├── SyncIndicator.jsx
│   │   │   └── FAB.jsx
│   │   ├── services/          # API 服务
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── context/           # 状态管理
│   │   │   └── NotesContext.jsx
│   │   └── utils/             # 工具函数
│   │       └── storage.js
│   └── android/               # Android 原生项目
└── web/                 # React Web 应用
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── NotesPage.jsx
    │   │   └── NoteEditorModal.jsx
    │   ├── components/
    │   │   ├── NoteCard.jsx
    │   │   └── SyncIndicator.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   └── context/
    │       └── NotesContext.jsx
    └── package.json
```

## 🚀 快速开始

### 1. 启动后端服务

```bash
cd backend
npm install
npm start
```

后端服务将运行在 `http://localhost:3000`

### 2. 启动 Web 应用

```bash
cd web
npm install
npm run dev
```

Web 应用将运行在 `http://localhost:5173`

### 3. 构建 Android 应用

#### 前置要求
- Node.js 16+
- JDK 11+
- Android SDK
- Gradle 7.5+

#### 构建步骤

```bash
cd android

# 安装依赖
npm install

# 生成原生项目
npx expo prebuild --platform android

# 构建 Debug APK
cd android
./gradlew assembleDebug
```

APK 文件将生成在：
`android/app/build/outputs/apk/debug/app-debug.apk`

## 📡 API 端点

### 笔记管理

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/notes` | 获取所有笔记 |
| GET | `/api/notes/:id` | 获取单个笔记 |
| POST | `/api/notes` | 创建笔记 |
| PUT | `/api/notes/:id` | 更新笔记 |
| DELETE | `/api/notes/:id` | 删除笔记 |

### 数据同步

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/notes/status` | 获取同步状态 |
| POST | `/api/notes/pull` | 拉取更改 |
| POST | `/api/notes/push` | 推送更改 |

## 🔌 WebSocket 事件

| 事件 | 方向 | 描述 |
|------|------|------|
| `note:created` | 服务器 → 客户端 | 新笔记创建 |
| `note:updated` | 服务器 → 客户端 | 笔记更新 |
| `note:deleted` | 服务器 → 客户端 | 笔记删除 |
| `sync:complete` | 服务器 → 客户端 | 同步完成 |

## 🎨 技术栈

- **前端**: React 18, React Native 0.72
- **后端**: Node.js, Express 4, Socket.IO 4
- **数据库**: SQLite (sql.js)
- **构建**: Expo SDK 49, Vite 5
- **状态管理**: React Context
- **实时通信**: Socket.IO

## 📱 Android 应用特点

- Material Design 3 设计
- 深色主题支持
- 离线优先架构
- 自动保存（500ms 防抖）
- Pull-to-refresh 同步
- 本地缓存（AsyncStorage）

## 🌐 Web 应用特点

- 响应式设计（移动优先）
- PWA 支持
- 键盘快捷键
- 实时同步
- 模态编辑器

## 🔒 安全说明

⚠️ 当前版本未实现身份验证，仅适用于本地网络使用。

生产环境部署建议：
- 添加 JWT 身份验证
- 使用 HTTPS
- 实现数据加密
- 添加速率限制

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请提交 GitHub Issue。

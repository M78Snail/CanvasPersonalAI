# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**AI Canvas (火花画布)** - 一个基于 Vue Flow 的可视化 AI 创作画布，支持文生图、视频生成等 AI 工作流的节点式编排。

## 常用命令

```bash
# 开发服务器
npm run dev
pnpm dev

# 生产构建
npm run build
pnpm build

# 本地预览构建结果
npm run preview
pnpm preview
```

## 技术栈

- **框架**: Vue 3 (Composition API) + Vite 5
- **画布引擎**: Vue Flow (@vue-flow/core, @vue-flow/background, @vue-flow/controls, @vue-flow/minimap)
- **UI 组件**: Naive UI + Tailwind CSS
- **图标**: @vicons/ionicons5
- **状态管理**: Pinia + Vue 3 响应式 API
- **HTTP 客户端**: Axios
- **路由**: Vue Router 4

## 项目架构

### 核心目录结构

```
src/
├── api/                    # API 请求封装
│   ├── image.js           # 图像生成 API
│   ├── video.js           # 视频生成 API
│   ├── chat.js            # 对话 API (LLM)
│   └── model.js           # 模型获取 API
├── components/
│   ├── nodes/             # 自定义节点组件 (6个)
│   │   ├── TextNode.vue          # 文本输入节点
│   │   ├── ImageNode.vue         # 图片展示节点
│   │   ├── ImageConfigNode.vue   # 文生图配置节点
│   │   ├── VideoNode.vue         # 视频展示节点
│   │   ├── VideoConfigNode.vue   # 视频生成配置节点
│   │   └── LLMConfigNode.vue     # LLM 文本生成配置节点
│   └── edges/             # 自定义边组件 (3个)
│       ├── ImageRoleEdge.vue    # 图片角色边
│       ├── PromptOrderEdge.vue  # 提示词顺序边
│       └── ImageOrderEdge.vue   # 图片顺序边
├── hooks/                  # 组合式函数
│   ├── useWorkflowOrchestrator.js  # 工作流编排核心 Hook
│   ├── useApi.js                  # API 配置 Hook
│   ├── useChat.js                 # 对话 Hook
│   └── useModelConfig.js          # 模型配置 Hook
├── stores/                 # 状态管理
│   ├── canvas.js          # 画布状态 (节点/边/历史/自动保存)
│   ├── projects.js        # 项目管理 (本地存储)
│   └── models.js          # 模型管理
├── config/
│   ├── workflows.js       # 工作流模板 (5个预设)
│   └── models.js          # 模型配置
├── views/
│   ├── Home.vue           # 首页 (项目列表)
│   └── Canvas.vue         # 主画布页面
└── utils/
    ├── schema.js          # 数据验证 schema
    └── request.js         # HTTP 请求拦截器
```

### 核心业务流程

**工作流自动执行** (`useWorkflowOrchestrator.js`):
1. 用户输入文本 → LLM 分析意图 (GPT-4o)
2. 识别工作流类型 → 自动创建节点和边
3. 串行执行配置节点 → 生成图片/视频展示结果

**状态管理**:
- `stores/canvas.js` - 画布状态管理（节点、边、视口、50步撤销/重做历史）
- `stores/projects.js` - 项目管理（localStorage 持久化）
- 本地存储键: `projects`, `project_{id}`, `api-provider`, `api-keys-by-provider`

### API 端点

- `/v1/images/generations` - 图像生成 (OpenAI 兼容)
- `/v1/videos/generations` - 视频生成
- `/v1/chat/completions` - 对话补全 (OpenAI 兼容)
- `/v1/models` - 模型列表

开发服务器代理 `/v1` → `https://api.chatfire.site`

## 构建配置

- **Vite 基础路径**: `/huobao-canvas`
- **别名**: `@` → `src/`
- **Tailwind**: 深色/浅色主题切换 (darkMode: 'class')

## API 配置说明

**两个 API 渠道：**
- **火宝 (chatfire)**: `https://api.chatfire.site`
- **OpenAI**: `https://api.chatfire.cn`

**Provider 选择逻辑：**
- Provider 是**全局选择**的，用户在 API 设置中切换
- 模型配置中的 `provider: ['chatfire']` 仅用于**可用性过滤**（表示该模型在哪些渠道下显示）
- 实际访问的接口地址由**当前选中的 Provider** 决定，与模型本身的 provider 配置无关

**模型分类：**
- 文生图：4 种（Nano Banana 2/Pro、豆包 Seedream 4.5、Nano Banana）- 仅火宝
- 视频生成：5 种（Seedance 系列）- 仅火宝
- 对话模型：GPT-4o Mini/4o/5.2、DeepSeek、豆包 Seed Flash、Gemini 3 Pro

## 重要注意事项

1. 项目数据存储在 localStorage，修改存储结构时要注意兼容性
2. 画布历史记录限制为 50 步
3. 节点连接时会自动识别连接类型（imageRole/promptOrder/imageOrder）
4. 支持 5 个预设工作流模板（多角度分镜、电商图、短剧角色、多时段场景、儿童绘本）

# Dify 项目长期笔记

## 分支与改造

- 当前分支 `feature/simple-main`：基于 Dify master 的精简/自用分支。
- **Console 登录已移除（2026-09-10，硬改，无 env 开关）**：访问 `/` 直接进首页，无需登录。
  - 后端：console/inner_api 无 token 时自动以「第一个 active owner 账号」身份处理（`api/extensions/ext_login.py::_load_default_console_account`）；`check_csrf_token` 在 `g._login_bypassed` 时跳过（`api/libs/token.py`）。
  - 前端：401 不再跳 /signin（已删除 `buildSigninUrlWithRedirect`）；`/signin/*` 由 `web/app/signin/layout.tsx` 重定向到 `/`。
  - 恢复方式：回滚 2026-09-10 的这批改动即可（8 个文件）。

## 精简范围（workflow-only，2026-09-10 第三轮）

- 目标：只保留 `/app/{id}/workflow` 工作流编辑器 + `/apps` 入口 + 工作流底层核心；删掉其他所有前后端功能。
- 用户选择：仅 Workflow（删 Chatflow）、保留 /apps 入口、共享底座(models/tools/datasets/plugins)后端也删。
- **前端已删（独立功能路由/组件）**：`(commonLayout)/datasets`、`(commonLayout)/plugins`、`(commonLayout)/integrations`、`(commonLayout)/tools` 路由页；`components/integrations`、`components/rag-pipeline`、`components/snippet-list`、`features/tag-management`、`features/skills`；create-app-modal 仅留 Workflow 卡片；main-nav 收敛为仅 apps。
- **后端已删**：`controllers/console/workspace/model_providers.py`、`plugin.py`、`tool_providers.py`、`trigger_providers.py`（models/tools/plugins 的 console HTTP 层），并在 `controllers/console/__init__.py` 解除注册。
- **不能删的共享底座（被工作流/apps 复用）**：`components/rag-pipeline`（工作流输入变量面板/chunk 卡片/store slice）、`components/integrations/routes.ts` 的 buildIntegrationPath（工作流工具浏览器复用）、`features/tag-management`（apps 列表标签）、`features/skills`（agent-v2 依赖）、`components/datasets`+`components/tools`+`components/provider`（节点组件）。
- **datasets 后端保留的原因**：`api/controllers/service_api/dataset/hit_testing.py` 运行时 import `controllers.console.datasets.hit_testing_base`（→又依赖 datasets/error），删 datasets 包会让已发布工作流的知识检索命中测试端点 ImportError。若要彻底删 datasets 后端，需先把 hit_testing_base 迁到 service_api 并解耦 datasets/error。
- 验证：前端 `tsc --noEmit` 0 错误；后端 `uv run --project api python -c "import controllers.console"` 成功。

## 常用命令

- 后端：`uv run --project api <command>`（需在 `api/` 目录下执行才能导入 `models` 等模块）。
- 前端类型检查：`cd web && /Users/jet/Workspace/personal/IdeaProjects/dify/node_modules/.bin/tsc --noEmit -p tsconfig.json`（注意：`npx tsc` 会触发 devEngines 校验失败，node 24 vs 22；直接调根目录 tsc 二进制绕过）。
- 前端单测：`cd web && npx vitest run --project unit <path>`
- eslint 在本机跑不起来：devEngines 要求 node 24，当前是 22。

## 约定

- 前端跨模块 import 统一走 `@/next/*`（如 `@/next/navigation`、`@/next/headers`），不要直接 import `next/navigation`。

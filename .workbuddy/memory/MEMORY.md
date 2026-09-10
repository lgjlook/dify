# Dify 项目长期笔记

## 分支与改造

- 当前分支 `feature/simple-main`：基于 Dify master 的精简/自用分支。
- **Console 登录已移除（2026-09-10，硬改，无 env 开关）**：访问 `/` 直接进首页，无需登录。
  - 后端：console/inner_api 无 token 时自动以「第一个 active owner 账号」身份处理（`api/extensions/ext_login.py::_load_default_console_account`）；`check_csrf_token` 在 `g._login_bypassed` 时跳过（`api/libs/token.py`）。
  - 前端：401 不再跳 /signin（已删除 `buildSigninUrlWithRedirect`）；`/signin/*` 由 `web/app/signin/layout.tsx` 重定向到 `/`。
  - 恢复方式：回滚 2026-09-10 的这批改动即可（8 个文件）。

## 常用命令

- 后端：`uv run --project api <command>`（需在 `api/` 目录下执行才能导入 `models` 等模块）。
- 前端类型检查：`cd web && npx tsc --noEmit -p tsconfig.json`
- 前端单测：`cd web && npx vitest run --project unit <path>`
- eslint 在本机跑不起来：devEngines 要求 node 24，当前是 22。

## 约定

- 前端跨模块 import 统一走 `@/next/*`（如 `@/next/navigation`、`@/next/headers`），不要直接 import `next/navigation`。

import type { InstalledAppListResponse } from '@dify/contracts/api/console/installed-apps/types.gen'

// Static fallback for the removed GET /console/api/installed-apps endpoint.
// Installed apps are no longer supported by the simplified backend, so the
// console resolves to an empty list instead of issuing a network request.
export const INSTALLED_APP_LIST_MOCK: InstalledAppListResponse = {
  installed_apps: [],
  has_more: false,
  next_cursor: null,
}
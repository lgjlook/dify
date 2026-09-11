import type { GetSystemFeaturesResponse } from '@dify/contracts/api/console/system-features/types.gen'
import {
  zLicenseStatus,
  zPluginInstallationScope,
} from '@dify/contracts/api/console/system-features/zod.gen'

// Static fallback for the removed GET /console/api/system-features endpoint.
// The console bootstraps from this so it no longer calls the backend.
export const SYSTEM_FEATURES_MOCK: GetSystemFeaturesResponse = {
  deployment_edition: 'COMMUNITY',
  enable_app_deploy: false,
  sso_enforced_for_signin: false,
  sso_enforced_for_signin_protocol: null,
  enable_marketplace: false,
  enable_email_code_login: false,
  enable_email_password_login: true,
  enable_social_oauth_login: false,
  enable_collaboration_mode: true,
  is_allow_register: false,
  is_email_setup: false,
  enable_change_email: true,
  license: {
    status: zLicenseStatus.enum.none,
  },
  branding: {
    enabled: false,
    login_page_logo: '',
    workspace_logo: '',
    favicon: '',
    application_title: '',
  },
  webapp_auth: {
    enabled: false,
    allow_sso: false,
    sso_config: {
      protocol: null,
    },
    allow_email_code_login: false,
    allow_email_password_login: false,
    allow_public_access: true,
  },
  plugin_installation_permission: {
    plugin_installation_scope: zPluginInstallationScope.enum.all,
    restrict_to_marketplace_only: false,
  },
  rbac_enabled: false,
  enable_creators_platform: false,
  enable_explore_banner: false,
  enable_learn_app: true,
  enable_step_by_step_tour: false,
  knowledge_fs_enabled: false,
}

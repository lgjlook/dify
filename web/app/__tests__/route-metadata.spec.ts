import { generateMetadata as generateAppsMetadata } from '../(commonLayout)/apps/page'
import { generateMetadata as generateWebappCheckCodeMetadata } from '../(shareLayout)/webapp-reset-password/check-code/layout'
import { generateMetadata as generateWebappResetPasswordMetadata } from '../(shareLayout)/webapp-reset-password/layout'
import { generateMetadata as generateWebappSetPasswordMetadata } from '../(shareLayout)/webapp-reset-password/set-password/layout'
import { generateMetadata as generateInitMetadata } from '../init/page'
import { generateMetadata as generateInstallMetadata } from '../install/layout'
import { generateMetadata as generateOAuthCallbackMetadata } from '../oauth-callback/layout'
import { generateMetadata as generateSignInCheckCodeMetadata } from '../signin/check-code/layout'

vi.mock('server-only', () => ({}))

vi.mock('@/i18n-config/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/i18n-config/server')>()),
  getLocaleOnServer: async () => 'en-US',
}))

vi.mock('../(shareLayout)/webapp-reset-password/reset-password-layout', () => ({
  default: () => null,
}))
vi.mock('../init/InitPasswordPopup', () => ({ default: () => null }))
vi.mock('@/app/components/apps', () => ({ Apps: () => null }))

describe('fixed route metadata', () => {
  it.each([
    [generateWebappResetPasswordMetadata, 'Reset Password'],
    [generateWebappCheckCodeMetadata, 'Check your email'],
    [generateWebappSetPasswordMetadata, 'Set a password'],
    [generateSignInCheckCodeMetadata, 'Check your email'],
    [generateInstallMetadata, 'Setting up an admin account'],
    [generateInitMetadata, 'Admin initialization password'],
    [generateOAuthCallbackMetadata, 'Sign in'],
    [generateAppsMetadata, 'Studio'],
  ])('provides the localized title %s', async (generateMetadata, expectedTitle) => {
    await expect(generateMetadata()).resolves.toMatchObject({ title: expectedTitle })
  })
})

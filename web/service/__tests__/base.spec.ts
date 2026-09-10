import { buildWebAppSigninUrlWithRedirect, isWebAppSigninPath } from '../base'

vi.mock('@/utils/var', () => ({
  basePath: '/app',
  API_PREFIX: '/console/api',
  PUBLIC_API_PREFIX: '/api',
}))

describe('buildWebAppSigninUrlWithRedirect', () => {
  it('should encode the internal redirect target exactly once', () => {
    const url = buildWebAppSigninUrlWithRedirect(
      'https://example.com',
      '/chatbot/share-app',
      '?foo=bar',
    )

    expect(url).toBe(
      'https://example.com/app/webapp-signin?redirect_url=%2Fchatbot%2Fshare-app%3Ffoo%3Dbar',
    )
    expect(new URL(url).searchParams.get('redirect_url')).toBe('/chatbot/share-app?foo=bar')
  })
})

describe('isWebAppSigninPath', () => {
  it.each(['/app/webapp-signin', '/app/webapp-signin/'])(
    'should recognize the web app signin route behind basePath: %s',
    (pathname) => {
      expect(isWebAppSigninPath(pathname)).toBe(true)
    },
  )

  it.each(['/webapp-signin', '/app/webapp-signin-extra', '/app/webapp-signin/check-code'])(
    'should not match a different path: %s',
    (pathname) => {
      expect(isWebAppSigninPath(pathname)).toBe(false)
    },
  )
})

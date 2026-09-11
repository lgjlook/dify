import { buildIntegrationPath } from '@/app/components/integrations/routes'

type MainNavRouteVisibility = (options: MainNavRouteVisibilityOptions) => boolean

const DATASET_COLLECTION_ROUTES = new Set(['create', 'create-from-pipeline', 'connect'])
const DATASET_DOCUMENT_CREATION_ROUTES = new Set(['create', 'create-from-pipeline'])

export type MainNavRouteConfig = {
  key: string
  href: string
  active: (pathname: string) => boolean
  icon: string
  activeIcon: string
  visibility: MainNavRouteVisibility
} & ({ label: string; labelKey?: never } | { label?: never; labelKey: string })

export type MainNavRouteVisibilityOptions = {
  isCurrentWorkspaceDatasetOperator: boolean
}

export type DetailSidebarVisibilityOptions = Pick<
  MainNavRouteVisibilityOptions,
  'isCurrentWorkspaceDatasetOperator'
>

const VISIBLE_TO_ALL: MainNavRouteVisibility = () => true

function isPathUnderRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

export const MAIN_NAV_ROUTES = [
  {
    key: 'apps',
    href: '/apps',
    labelKey: 'menus.apps',
    active: (path: string) => isPathUnderRoute(path, '/apps') || isPathUnderRoute(path, '/app'),
    icon: 'i-custom-vender-main-nav-studio-v2',
    activeIcon: 'i-custom-vender-main-nav-studio-v2-active',
    visibility: VISIBLE_TO_ALL,
  },
] as const satisfies readonly MainNavRouteConfig[]

export function isMainNavRouteVisible(
  route: MainNavRouteConfig,
  options: MainNavRouteVisibilityOptions,
) {
  return route.visibility(options)
}

function isAppDetailPathname(pathname: string) {
  return pathname.startsWith('/app/')
}

function isDatasetDetailPathname(pathname: string) {
  const [section, datasetId, subSection, action] = pathname.split('/').filter(Boolean)

  if (section !== 'datasets' || !datasetId) return false

  if (DATASET_COLLECTION_ROUTES.has(datasetId)) return false

  if (datasetId === 'new' && subSection === 'create') return false

  if (subSection === 'documents' && action && DATASET_DOCUMENT_CREATION_ROUTES.has(action))
    return false

  return true
}

export function shouldHideMainNavigation(pathname: string) {
  const [section, namespace, knowledgeSpaceId] = pathname.split('/').filter(Boolean)

  return (
    section === 'datasets' &&
    namespace === 'new' &&
    !!knowledgeSpaceId &&
    knowledgeSpaceId !== 'create'
  )
}

export function shouldUseDetailSidebar(pathname: string, options: DetailSidebarVisibilityOptions) {
  if (isDatasetDetailPathname(pathname)) return true

  if (options.isCurrentWorkspaceDatasetOperator) return false

  return isAppDetailPathname(pathname)
}

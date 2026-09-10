import type { TemplateCategory } from './categories'

export type TemplatesHrefOptions = {
  category: TemplateCategory
  languages?: string[]
  page?: number
  query?: string
  sortBy?: string
  sortOrder?: string
  view?: string
}

export function buildTemplatesHref({
  category,
  languages,
  page = 1,
  query,
  sortBy,
  sortOrder,
  view,
}: TemplatesHrefOptions) {
  const searchParams = new URLSearchParams()
  if (query) searchParams.set('q', query)
  if (sortBy) searchParams.set('sort_by', sortBy)
  if (sortOrder) searchParams.set('sort_order', sortOrder)
  if (view) searchParams.set('view', view)
  if (languages?.length) searchParams.set('languages', languages.join(','))
  if (page > 1) searchParams.set('page', String(page))
  const queryString = searchParams.toString()
  const basePath = category === 'all' ? '/templates' : `/templates/${category}`
  return queryString ? `${basePath}?${queryString}` : basePath
}

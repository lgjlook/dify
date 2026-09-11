import { queryOptions } from '@tanstack/react-query'
import { SYSTEM_FEATURES_MOCK } from './mock'

export const systemFeaturesQueryOptions = () =>
  queryOptions({
    queryKey: ['system-features'],
    queryFn: () => SYSTEM_FEATURES_MOCK,
    staleTime: Infinity,
  })

import { dehydrate, queryOptions } from '@tanstack/react-query'
import { cache } from 'react'
import { getQueryClient } from '@/app/get-query-client'
import { connection } from '@/next/server'
import { SYSTEM_FEATURES_MOCK } from './mock'
import 'server-only'

const getRequestQueryClient = cache(getQueryClient)

const systemFeaturesServerQueryOptions = () =>
  queryOptions({
    queryKey: ['system-features'],
    queryFn: () => SYSTEM_FEATURES_MOCK,
    staleTime: 'static',
  })

export const getOptionalSystemFeatures = async () => {
  await connection()
  const queryClient = getRequestQueryClient()
  const queryOptions = systemFeaturesServerQueryOptions()
  const queryState = queryClient.getQueryState(queryOptions.queryKey)

  if (queryState?.status === 'error' && queryState.data === undefined) return undefined

  return queryClient.query(queryOptions).catch(() => undefined)
}

export const getSystemFeatures = async () => {
  await connection()
  return getRequestQueryClient().query(systemFeaturesServerQueryOptions())
}

export const dehydrateSystemFeatures = () => dehydrate(getRequestQueryClient())

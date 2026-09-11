import type {
  SnippetCanvasData,
  SnippetDetailPayload,
  SnippetDetail as SnippetDetailUIModel,
  SnippetInputField as SnippetInputFieldUIModel,
  SnippetListItem as SnippetListItemUIModel,
} from '@/models/snippet'
import type {
  CreateSnippetPayload,
  IncrementSnippetUseCountResponse,
  Snippet as SnippetContract,
  SnippetDSLImportResponse,
  SnippetListResponse,
  SnippetWorkflow,
  UpdateSnippetPayload,
} from '@/types/snippet'
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import dayjs from 'dayjs'

// NOTE: The `/snippets` and `/workspaces/current/customized-snippets` endpoints have been
// removed from the simplified backend. These hooks are kept as build-safe stubs that return
// empty data and issue NO network requests, so consuming components still compile and run.

type SnippetListParams = {
  page?: number
  limit?: number
  keyword?: string
  tag_ids?: string[]
  creator_ids?: string[]
  is_published?: boolean
}

type SnippetSummary = Pick<
  SnippetContract,
  'id' | 'name' | 'description' | 'use_count' | 'tags' | 'updated_at' | 'is_published'
>
type SnippetIdInput = {
  params: {
    snippetId: string
  }
}
type CreateSnippetInput = {
  body: CreateSnippetPayload
}
type UpdateSnippetInput = SnippetIdInput & {
  body: UpdateSnippetPayload
}

const DEFAULT_SNIPPET_LIST_PARAMS = {
  page: 1,
  limit: 30,
}
const DEFAULT_GRAPH: SnippetCanvasData = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
}

const EMPTY_SNIPPET_LIST: SnippetListResponse = {
  data: [],
  page: 1,
  limit: 30,
  total: 0,
  has_more: false,
}

const EMPTY_SNIPPET_CONTRACT: SnippetContract = {
  id: '',
  name: '',
  description: null,
  type: 'node',
  is_published: false,
  version: 0,
  use_count: 0,
  tags: [],
  created_at: 0,
  graph: {},
  input_fields: [],
  created_by: null,
  updated_by: null,
}

const EMPTY_DSL_IMPORT: SnippetDSLImportResponse = {
  id: '',
  status: '',
  snippet_id: null,
  current_dsl_version: '',
  imported_dsl_version: '',
  error: '',
}

const toMilliseconds = (timestamp?: number) => {
  if (!timestamp) return undefined

  return timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
}

const formatTimestamp = (timestamp?: number) => {
  const milliseconds = toMilliseconds(timestamp)
  if (!milliseconds) return ''

  return dayjs(milliseconds).format('YYYY-MM-DD HH:mm')
}

const toSnippetListItem = (snippet: SnippetSummary): SnippetListItemUIModel => {
  return {
    id: snippet.id,
    name: snippet.name,
    description: snippet.description,
    updatedAt: formatTimestamp(snippet.updated_at),
    usage: String(snippet.use_count ?? 0),
    tags: snippet.tags,
    is_published: snippet.is_published,
    status: undefined,
  }
}

const toSnippetDetail = (snippet: SnippetContract): SnippetDetailUIModel => {
  return {
    ...toSnippetListItem(snippet),
  }
}

const toSnippetCanvasData = (workflow?: SnippetWorkflow | null): SnippetCanvasData => {
  const graph = workflow?.graph

  if (!graph || typeof graph !== 'object') return DEFAULT_GRAPH

  const graphRecord = graph as Record<string, unknown>

  return {
    nodes: Array.isArray(graphRecord.nodes)
      ? (graphRecord.nodes as SnippetCanvasData['nodes'])
      : DEFAULT_GRAPH.nodes,
    edges: Array.isArray(graphRecord.edges)
      ? (graphRecord.edges as SnippetCanvasData['edges'])
      : DEFAULT_GRAPH.edges,
    viewport:
      graphRecord.viewport && typeof graphRecord.viewport === 'object'
        ? (graphRecord.viewport as SnippetCanvasData['viewport'])
        : DEFAULT_GRAPH.viewport,
  }
}

export const buildSnippetDetailPayload = (
  snippet: SnippetContract,
  workflow?: SnippetWorkflow | null,
): SnippetDetailPayload => {
  const inputFields = Array.isArray(workflow?.input_fields)
    ? (workflow.input_fields as SnippetInputFieldUIModel[])
    : []

  return {
    snippet: toSnippetDetail(snippet),
    graph: toSnippetCanvasData(workflow),
    inputFields,
    uiMeta: {
      inputFieldCount: inputFields.length,
      checklistCount: 0,
      autoSavedAt: formatTimestamp(workflow?.updated_at ?? snippet.updated_at),
    },
  }
}

const normalizeSnippetListParams = (params: SnippetListParams) => {
  return {
    page: params.page ?? DEFAULT_SNIPPET_LIST_PARAMS.page,
    limit: params.limit ?? DEFAULT_SNIPPET_LIST_PARAMS.limit,
    ...(params.keyword ? { keyword: params.keyword } : {}),
    ...(params.tag_ids?.length ? { tag_ids: params.tag_ids } : {}),
    ...(params.creator_ids?.length ? { creator_ids: params.creator_ids } : {}),
    ...(typeof params.is_published === 'boolean' ? { is_published: params.is_published } : {}),
  }
}

const snippetListRootKey = ['snippets', 'list'] as const
const snippetListKey = (params: SnippetListParams) => [...snippetListRootKey, params]

const invalidateSnippetQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: snippetListRootKey,
  })
}

export const useInfiniteSnippetList = (
  params: SnippetListParams = {},
  options?: { enabled?: boolean },
) => {
  const normalizedParams = normalizeSnippetListParams(params)

  return useInfiniteQuery<SnippetListResponse>({
    queryKey: snippetListKey(normalizedParams),
    queryFn: async () => EMPTY_SNIPPET_LIST,
    getNextPageParam: () => undefined,
    initialPageParam: normalizedParams.page,
    placeholderData: keepPreviousData,
    ...options,
  })
}

export const useSnippetApiDetail = (snippetId: string) => {
  return useQuery<SnippetContract>({
    queryKey: ['snippets', 'detail', snippetId],
    queryFn: async () => EMPTY_SNIPPET_CONTRACT,
    enabled: !!snippetId,
  })
}

export const useCreateSnippetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<SnippetContract, Error, CreateSnippetInput>({
    mutationKey: ['snippets', 'create'],
    mutationFn: async () => EMPTY_SNIPPET_CONTRACT,
    onSuccess: () => {
      invalidateSnippetQueries(queryClient)
    },
  })
}

export const useUpdateSnippetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<SnippetContract, Error, UpdateSnippetInput>({
    mutationKey: ['snippets', 'update'],
    mutationFn: async () => EMPTY_SNIPPET_CONTRACT,
    onSuccess: () => {
      invalidateSnippetQueries(queryClient)
    },
  })
}

export const useDeleteSnippetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, SnippetIdInput>({
    mutationKey: ['snippets', 'delete'],
    mutationFn: async () => undefined,
    onSuccess: () => {
      invalidateSnippetQueries(queryClient)
    },
  })
}

export const useIncrementSnippetUseCountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<IncrementSnippetUseCountResponse, Error, SnippetIdInput>({
    mutationKey: ['snippets', 'use-count', 'increment'],
    mutationFn: async () => ({ result: '', use_count: 0 }),
    onSuccess: () => {
      invalidateSnippetQueries(queryClient)
    },
  })
}

export const useExportSnippetMutation = () => {
  return useMutation<string, Error, { snippetId: string; include?: boolean; workflowId?: string }>({
    mutationFn: async () => '',
  })
}

export const useImportSnippetDSLMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    SnippetDSLImportResponse,
    Error,
    { mode: 'yaml-content' | 'yaml-url'; yamlContent?: string; yamlUrl?: string }
  >({
    mutationKey: ['snippets', 'import', 'dsl'],
    mutationFn: async () => EMPTY_DSL_IMPORT,
    onSuccess: () => {
      invalidateSnippetQueries(queryClient)
    },
  })
}

export const useConfirmSnippetImportMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<SnippetDSLImportResponse, Error, { importId: string }>({
    mutationKey: ['snippets', 'import', 'confirm'],
    mutationFn: async () => EMPTY_DSL_IMPORT,
    onSuccess: () => {
      invalidateSnippetQueries(queryClient)
    },
  })
}

import type { PublishSnippetWorkflowResponse, SnippetWorkflow } from '@/types/snippet'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// NOTE: The `/snippets/.../workflows` endpoints have been removed from the simplified backend.
// These hooks are kept as build-safe stubs that issue NO network requests.

const EMPTY_SNIPPET_WORKFLOW: SnippetWorkflow = {
  id: '',
  graph: {},
  features: {},
  input_fields: [],
  hash: '',
  created_at: 0,
  updated_at: 0,
}

export const fetchSnippetDraftWorkflow = async (
  _snippetId: string,
): Promise<SnippetWorkflow | undefined> => {
  return undefined
}

export const useSnippetPublishedWorkflow = (
  snippetId: string,
  onSuccess?: (publishedWorkflow: SnippetWorkflow) => void,
) => {
  return useQuery<SnippetWorkflow | undefined>({
    queryKey: ['snippets', 'workflows', 'publish', snippetId],
    queryFn: async () => undefined,
    enabled: !!snippetId,
  })
}

export const useSnippetDefaultBlockConfigs = (
  snippetId: string,
  onSuccess?: (nodesDefaultConfigs: unknown) => void,
) => {
  return useQuery<unknown>({
    queryKey: ['snippets', 'workflows', 'defaultBlockConfigs', snippetId],
    queryFn: async () => ({}),
    enabled: !!snippetId,
  })
}

export const usePublishSnippetWorkflowMutation = (snippetId: string) => {
  const queryClient = useQueryClient()

  return useMutation<PublishSnippetWorkflowResponse, Error, { params: { snippetId: string } }>({
    mutationKey: ['snippets', 'workflows', 'publish', 'post', snippetId],
    mutationFn: async () => ({ result: '', created_at: 0 }),
    onSuccess: () => {},
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createOrb, fetchOrb } from '@/shared/api/orb.api'
import type { CreateOrbInput } from '@/shared/types/orb.types'

const orbQueryKey = ['orb', 'current'] as const

export function useOrb() {
  const queryClient = useQueryClient()
  const orbQuery = useQuery({
    queryFn: fetchOrb,
    queryKey: orbQueryKey,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
  const createOrbMutation = useMutation({
    mutationFn: (input: CreateOrbInput) => createOrb(input),
    onSuccess: (orb) => {
      queryClient.setQueryData(orbQueryKey, orb)
    },
  })

  return {
    createOrb: createOrbMutation.mutateAsync,
    createOrbError: createOrbMutation.error,
    isCreatingOrb: createOrbMutation.isPending,
    isLoadingOrb: orbQuery.isLoading,
    orb: orbQuery.data,
    orbError: orbQuery.error,
    refetchOrb: orbQuery.refetch,
  }
}

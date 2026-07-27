import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchNursery, teachOrb, updateOrbRules } from '@/shared/api/orb.api'
import type { NurseryState, TeachOrbInput, UpdateOrbRulesInput } from '@/shared/types/orb.types'

type UseNurseryInput = {
  enabled: boolean
}

const nurseryQueryKey = ['orb', 'nursery'] as const
const orbQueryKey = ['orb', 'current'] as const

export function useNursery({ enabled }: UseNurseryInput) {
  const queryClient = useQueryClient()
  const nurseryQuery = useQuery({
    enabled,
    queryFn: fetchNursery,
    queryKey: nurseryQueryKey,
    retry: false,
    staleTime: 1000 * 30,
  })
  const teachOrbMutation = useMutation({
    mutationFn: (input: TeachOrbInput) => teachOrb(input),
    onSuccess: (lesson) => {
      queryClient.setQueryData<NurseryState>(nurseryQueryKey, (currentNursery) => {
        if (!currentNursery) {
          return currentNursery
        }

        return {
          ...currentNursery,
          lessons: [...currentNursery.lessons, lesson],
        }
      })
    },
  })
  const updateRulesMutation = useMutation({
    mutationFn: (input: UpdateOrbRulesInput) => updateOrbRules(input),
    onSuccess: (orb) => {
      queryClient.setQueryData<NurseryState>(nurseryQueryKey, (currentNursery) => {
        if (!currentNursery) {
          return currentNursery
        }

        return { ...currentNursery, orb }
      })
      queryClient.setQueryData(orbQueryKey, orb)
    },
  })

  return {
    isLoadingNursery: nurseryQuery.isLoading,
    isSavingRules: updateRulesMutation.isPending,
    isTeachingOrb: teachOrbMutation.isPending,
    nursery: nurseryQuery.data,
    nurseryError: nurseryQuery.error,
    refetchNursery: nurseryQuery.refetch,
    saveRules: updateRulesMutation.mutateAsync,
    saveRulesError: updateRulesMutation.error,
    teachOrb: teachOrbMutation.mutateAsync,
    teachOrbError: teachOrbMutation.error,
  }
}

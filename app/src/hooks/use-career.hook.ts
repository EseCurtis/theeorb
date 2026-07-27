import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchCareerDocuments, fetchCareerProfile, saveCareerProfile, uploadCareerDocument } from '@/shared/api/career.api'
import type { CareerProfileInput } from '@/shared/types/career.types'

const careerDocumentsKey = ['career', 'documents'] as const
const careerProfileKey = ['career', 'profile'] as const

export function useCareer() {
  const queryClient = useQueryClient()
  const profileQuery = useQuery({ queryFn: fetchCareerProfile, queryKey: careerProfileKey, retry: false })
  const documentsQuery = useQuery({ queryFn: fetchCareerDocuments, queryKey: careerDocumentsKey, retry: false })
  const saveProfileMutation = useMutation({
    mutationFn: (input: CareerProfileInput) => saveCareerProfile(input),
    onSuccess: (profile) => queryClient.setQueryData(careerProfileKey, profile),
  })
  const uploadDocumentMutation = useMutation({
    mutationFn: (file: File) => uploadCareerDocument(file),
    onSuccess: (document) => queryClient.setQueryData(careerDocumentsKey, (current: typeof documentsQuery.data) => [...(current ?? []), document]),
  })

  return {
    careerDocuments: documentsQuery.data ?? [],
    careerProfile: profileQuery.data,
    documentsError: documentsQuery.error,
    isLoadingCareer: profileQuery.isLoading || documentsQuery.isLoading,
    isSavingProfile: saveProfileMutation.isPending,
    isUploadingDocument: uploadDocumentMutation.isPending,
    profileError: profileQuery.error,
    saveProfile: saveProfileMutation.mutateAsync,
    uploadDocument: uploadDocumentMutation.mutateAsync,
  }
}

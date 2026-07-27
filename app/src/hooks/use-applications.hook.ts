import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createApplicationDraft, createGmailConnectionUrl, extractJobListing, fetchApplications, fetchGmailConnection, reviewJobListing, saveApplication, sendApplication } from '@/shared/api/career.api'
import type { Application, JobListing } from '@/shared/types/career.types'

const applicationsKey = ['applications'] as const
const gmailConnectionKey = ['gmail', 'connection'] as const

export function useApplications() {
  const queryClient = useQueryClient()
  const applicationsQuery = useQuery({ queryFn: fetchApplications, queryKey: applicationsKey, retry: false })
  const gmailConnectionQuery = useQuery({ queryFn: fetchGmailConnection, queryKey: gmailConnectionKey, retry: false })
  const extractMutation = useMutation({ mutationFn: extractJobListing })
  const draftMutation = useMutation({
    mutationFn: createApplicationDraft,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsKey }),
  })
  const reviewMutation = useMutation({ mutationFn: reviewJobListing })
  const saveMutation = useMutation({
    mutationFn: (application: Application) => saveApplication(application),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsKey }),
  })
  const sendMutation = useMutation({
    mutationFn: sendApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsKey }),
  })
  const gmailUrlMutation = useMutation({ mutationFn: createGmailConnectionUrl })

  return {
    applications: applicationsQuery.data ?? [],
    applicationsError: applicationsQuery.error,
    createDraft: draftMutation.mutateAsync,
    extractedListing: extractMutation.data,
    extractionError: extractMutation.error,
    extractListing: extractMutation.mutateAsync,
    gmailConnection: gmailConnectionQuery.data,
    getGmailConnectionUrl: gmailUrlMutation.mutateAsync,
    isCreatingDraft: draftMutation.isPending,
    isExtracting: extractMutation.isPending,
    isLoadingApplications: applicationsQuery.isLoading,
    isLoadingGmail: gmailConnectionQuery.isLoading,
    isReviewingListing: reviewMutation.isPending,
    isSavingApplication: saveMutation.isPending,
    isSendingApplication: sendMutation.isPending,
    reviewListing: (listing: JobListing) => reviewMutation.mutateAsync(listing),
    saveApplication: saveMutation.mutateAsync,
    sendApplication: sendMutation.mutateAsync,
  }
}

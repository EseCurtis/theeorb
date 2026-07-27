import { ApplicationReviewScreen } from '@/app/application-review.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/applications/$applicationId')({ component: ApplicationReviewRoute })

function ApplicationReviewRoute(): React.JSX.Element {
  const { applicationId } = Route.useParams()
  return <ApplicationReviewScreen applicationId={applicationId} />
}

import { CvVaultScreen } from '@/app/cv-vault.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/cv-vault')({ component: CvVaultScreen })

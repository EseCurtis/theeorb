import { CvVaultScreen } from '@/app/cv-vault.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/career/cv')({ component: CvVaultScreen })

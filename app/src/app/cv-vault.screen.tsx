import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useCareer } from '@/hooks/use-career.hook'

export function CvVaultScreen(): React.JSX.Element {
  const { careerDocuments, isUploadingDocument, uploadDocument } = useCareer()
  const [message, setMessage] = useState('')
  async function handleFile(event: ChangeEvent<HTMLInputElement>): Promise<void> { const file = event.target.files?.[0]; if (!file) return; await uploadDocument(file); event.target.value = ''; setMessage('CV uploaded securely.') }
  return <ScreenLayout backLabel="Career" backTo="/app/career" description="Your CV is private and attached only after your final send review." title="CV vault"><Panel label="Upload a CV" tone="cyan"><Text className="text-sm leading-6 text-[var(--muted)]">Use a PDF or DOCX, up to 10 MB.</Text><label className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-[#0a4147] px-4 text-sm text-[#d4fffb]"><Text>{isUploadingDocument ? 'Uploading…' : 'Choose CV file'}</Text><input accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" disabled={isUploadingDocument} onChange={(event) => void handleFile(event)} type="file" /></label></Panel>{message ? <Text className="text-sm text-[#b7fffa]">{message}</Text> : null}<View className="gap-3">{careerDocuments.map((document) => <Panel key={document.id} label="Private document" tone="violet"><Text className="text-base text-[var(--foreground)]">{document.originalFilename}</Text><Text className="text-sm text-[var(--muted)]">{Math.round(document.byteSize / 1024)} KB · {document.mimeType.includes('pdf') ? 'PDF' : 'DOCX'}</Text></Panel>)}</View></ScreenLayout>
}

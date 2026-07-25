import { HomeHero } from '@/components/home-hero.component'

export default function HomePage(): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center px-5 py-16">
      <HomeHero />
    </main>
  )
}

import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/home/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
    </main>
  )
}

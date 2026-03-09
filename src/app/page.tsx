import Link from 'next/link'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { manifesto, tools } from '@/lib/constants'
import { Sparkles, BookOpen, LayoutGrid, ExternalLink, ArrowRight, Search } from 'lucide-react'
import { HomeSearch } from '@/components/home-search'
import Image from 'next/image'
import { ViadLogo } from '@/components/viad-logo'

const toolIcons: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  LayoutGrid: <LayoutGrid className="h-5 w-5" />,
}

const toolColors: Record<string, string> = {
  Sparkles: 'from-viad-blue/20 to-viad-blue/5 text-viad-blue',
  BookOpen: 'from-viad-purple/20 to-viad-purple/5 text-viad-purple',
  LayoutGrid: 'from-viad-lavender/20 to-viad-lavender/5 text-viad-lavender',
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero — Light background preserving logo brand colors */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-muted/50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 border-b border-border/30">
          <div className="absolute inset-0 geo-grid" />
          <div className="absolute inset-0 hero-glow" />

          <div className="relative z-10 container flex max-w-[64rem] flex-col items-center text-center mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
            {/* Logo — original colors preserved (IA in light blue) */}
            <div className="animate-viad-scale-in">
              <ViadLogo full className="h-16 sm:h-20 md:h-24 lg:h-32 w-auto" />
            </div>

            {/* Subtitle */}
            <p className="mt-5 max-w-[42rem] text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed tracking-wide animate-viad-slide-up stagger-1">
              Clínicas de Entrenamiento de IA
            </p>

            {/* Thin accent line */}
            <div className="mt-6 mb-6 w-12 h-px bg-gradient-to-r from-transparent via-viad-blue/50 to-transparent animate-viad-fade-in stagger-2" />

            {/* Institutional banner — original colors */}
            <div className="animate-viad-fade-in stagger-3">
              <Image
                src="/consorcio-banner.png"
                alt="Instituciones del Consorcio Educativo de Oriente"
                width={800}
                height={46}
                className="w-full max-w-[500px] h-auto opacity-60 hover:opacity-90 transition-opacity duration-500"
                priority
              />
              <p className="mt-2.5 text-[11px] tracking-[0.25em] uppercase text-muted-foreground/50 font-medium">
                Consorcio Educativo de Oriente
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-viad-slide-up stagger-4">
              <Button asChild size="lg" className="bg-viad-navy hover:bg-viad-navy-light text-white shadow-lg shadow-viad-navy/20 font-semibold tracking-wide transition-all duration-300">
                <Link href="/library">
                  Explorar Prompts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:border-viad-blue/40 hover:bg-viad-blue/5 font-medium tracking-wide transition-all duration-300">
                <Link href="/learning">Ver Hacks de IA</Link>
              </Button>
            </div>
          </div>

          {/* Bottom curve */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-background" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        </section>

        {/* Manifesto */}
        <section className="container py-16 md:py-20 lg:py-28 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 items-center">
            {/* Editorial quote */}
            <div className="w-full max-w-3xl relative animate-viad-slide-up">
              <div className="absolute -top-6 -left-2 md:-left-6 text-viad-blue/15 font-heading text-[80px] md:text-[120px] leading-none select-none" aria-hidden="true">
                &ldquo;
              </div>
              <div className="relative pl-4 md:pl-8 border-l-2 border-viad-blue/20">
                <h2 className="font-heading text-lg md:text-xl font-bold text-viad-navy/40 dark:text-viad-blue/40 uppercase tracking-[0.15em] mb-4">
                  Manifiesto de IA
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 leading-relaxed md:leading-relaxed">
                  {manifesto.split('catalizador del potencial humano').map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <strong className="text-foreground font-semibold">catalizador del potencial humano</strong>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              </div>
            </div>

            {/* Tools */}
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl w-full">
              {tools.map((tool, i) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group animate-viad-slide-up stagger-${i + 2}`}
                >
                  <div className="h-full rounded-xl border border-border/60 bg-card p-5 hover:border-viad-blue/30 hover:shadow-lg hover:shadow-viad-blue/5 transition-all duration-300 accent-border-left">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className={`rounded-lg bg-gradient-to-br p-2.5 ${toolColors[tool.icon]}`}>
                        {toolIcons[tool.icon]}
                      </div>
                      <h3 className="font-heading font-bold text-sm tracking-wide flex items-center gap-2">
                        {tool.name}
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Search */}
        <section id="search" className="relative py-16 md:py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-muted/70 dark:from-muted/20 dark:to-muted/40" />
          <div className="absolute inset-0 geo-grid" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex max-w-[50rem] flex-col items-center space-y-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-viad-blue/10 px-4 py-1.5 text-xs font-medium text-viad-navy dark:text-viad-blue tracking-wide uppercase animate-viad-fade-in">
              <Search className="h-3.5 w-3.5" />
              Búsqueda global
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight animate-viad-slide-up stagger-1">
              Busca en todo el Hub
            </h2>
            <p className="max-w-[85%] leading-relaxed text-muted-foreground text-base md:text-lg animate-viad-slide-up stagger-2">
              Encuentra prompts, videos, tutoriales y más.
            </p>
            <div className="w-full pt-2 animate-viad-slide-up stagger-3">
              <HomeSearch />
            </div>
          </div>
        </section>

      </main>
      <footer className="border-t border-border/40 bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-16 md:flex-row md:py-0 mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground/80 md:text-left">
            Construido por la <span className="font-semibold text-foreground/70">VIAD</span> — Consorcio Educativo Oriente.
          </p>
          <p className="text-center text-xs text-muted-foreground/40 md:text-right tracking-wider">
            VIAD HUB &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { manifesto, tools } from '@/lib/constants'
import { Sparkles, BookOpen, LayoutGrid, ExternalLink } from 'lucide-react'
import { HomeSearch } from '@/components/home-search'

const toolIcons: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-6 w-6 text-viad-blue" />,
  BookOpen: <BookOpen className="h-6 w-6 text-viad-purple" />,
  LayoutGrid: <LayoutGrid className="h-6 w-6 text-viad-lavender" />,
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 border-b">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-viad-navy to-viad-blue">
              VIAD HUB IA
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Plataforma de Inteligencia Artificial de la VIAD — Consorcio Educativo Oriente.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-viad-navy hover:bg-viad-navy-light">
                <Link href="/library">Explorar Prompts</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/learning">Ver Hacks de IA</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Manifiesto */}
        <section className="container py-8 md:py-12 lg:py-24 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 items-center">
            <Card className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900 border-none shadow-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Declaración del Manifiesto de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-none text-center mx-auto">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {manifesto.split('catalizador del potencial humano').map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>
                          {part}
                          <strong className="text-gray-900 dark:text-white">catalizador del potencial humano</strong>
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-viad-blue/40 dark:hover:border-viad-blue/50 transition-all duration-200">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-2.5">
                        {toolIcons[tool.icon]}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {tool.name}
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Search */}
        <section id="search" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
              Busca en todo el Hub
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Encuentra prompts, videos, tutoriales y más.
            </p>
            <HomeSearch />
          </div>
        </section>

      </main>
      <footer className="border-t bg-white dark:bg-gray-950">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0 mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Construido por la VIAD — Consorcio Educativo Oriente.
          </p>
          <p className="text-center text-xs text-muted-foreground/60 md:text-right">
            VIAD HUB IA &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

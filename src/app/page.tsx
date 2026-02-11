import Link from 'next/link'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { manifesto, tools } from '@/lib/constants'
import { Sparkles, BookOpen, LayoutGrid, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 border-b">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              CEO AI Hub
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              La plataforma central de Inteligencia Artificial para el Consorcio Educativo Oriente.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                <Link href="/library">Explorar Prompts</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/learning">Ver Hacks de IA</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-12 lg:py-24">
          <div className="flex flex-col gap-8 items-center">
            <Card className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900 border-none shadow-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Declaración del Manifiesto de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none text-center mx-auto">
                  <p className="whitespace-pre-line text-lg font-medium text-gray-700 dark:text-gray-300">
                    {manifesto}
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <Link href="/policies" className="text-sm font-medium text-indigo-600 hover:underline">
                    Ver Políticas de Uso Ético y Privacidad →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
              {tools.map((tool) => (
                <Card key={tool.name} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-indigo-500">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      {tool.icon === 'Sparkles' && <Sparkles className="h-6 w-6 text-indigo-500" />}
                      {tool.icon === 'BookOpen' && <BookOpen className="h-6 w-6 text-green-500" />}
                      {tool.icon === 'LayoutGrid' && <LayoutGrid className="h-6 w-6 text-blue-500" />}
                      <div className="space-y-1">
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="container py-8 md:py-12 lg:py-24 bg-slate-50 dark:bg-slate-950 rounded-xl my-8">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Busca en todo el Hub
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Encuentra prompts, videos, tutoriales y más.
            </p>
            <div className="w-full max-w-lg flex items-center space-x-2">
              {/* We will implement a real search later */}
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar prompts, videos..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                />
              </div>
              <Button type="submit">Buscar</Button>
            </div>
          </div>
        </section>

      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Construido para el Consorcio Educativo Oriente.
          </p>
        </div>
      </footer>
    </div>
  )
}

import ArtifactRoot from '@/components/artifact/artifact-root'
import HeaderNavbar from '@/components/header-navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { VideoBackground } from '@/components/VideoBackground'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const title = 'ORB AI - Transforming Business with Intelligent AI Solutions'
const description = 'ORB AI delivers custom AI solutions, automation, and strategic consulting to drive business growth. Transform your operations with cutting-edge AI technology.'

export const metadata: Metadata = {
  metadataBase: new URL('https://morphic.sh'),
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@miiura',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let user = null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()
    user = supabaseUser
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen flex flex-col font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <VideoBackground />
            <div className="flex flex-col min-h-screen relative z-10">
              <HeaderNavbar user={user} />
              <main className="flex-1 overflow-y-auto">
                <ArtifactRoot>{children}</ArtifactRoot>
              </main>
            </div>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

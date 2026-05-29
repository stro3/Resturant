import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const LiveChat = dynamic(() => import('@/components/LiveChat'), {
  ssr: false,
  loading: () => null
})

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Multi-Experience Food Destination',
  description: 'From Street Cravings to Fine Dining Excellence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
        <LiveChat />
      </body>
    </html>
  )
}

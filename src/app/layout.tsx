import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '../index.css'
// Update the import path below if Header exists elsewhere, for example:
// import Header from '../components/Header'
import { Toaster } from "@/components/ui/sonner";
import NextAuthSessionProvider from './providers/NextAuthSessionProvider';
import Header from '@/components/Header';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Abdelrahman Magdy',
  description: 'My Portfolio Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <NextAuthSessionProvider>
          <Header />
        <Toaster  position="top-right"/> 
    
        {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}

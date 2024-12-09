import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomNavigation from '@/components/BottomNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '在庫管理アプリ',
  description: '商品在庫を簡単に管理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} pb-16`}>
        {children}
        <BottomNavigation />
      </body>
    </html>
  )
}

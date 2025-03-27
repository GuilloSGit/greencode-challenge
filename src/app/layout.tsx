import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ToastProvider } from "@/contexts/toast-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chuck Norris Jokes",
  description: "A collection of Chuck Norris jokes with favorites and ratings",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

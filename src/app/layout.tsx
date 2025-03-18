import "@/app/globals.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Chuck Norris Jokes",
  description: "A fun app to browse and save Chuck Norris jokes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

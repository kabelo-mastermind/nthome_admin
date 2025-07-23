import type React from "react"
import AdminApp from "@/components/admin-app"
import "../app/globals.css" // Ensure global styles are imported

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AdminApp>{children}</AdminApp>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };

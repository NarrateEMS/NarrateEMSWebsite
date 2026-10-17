import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dictate — NarrateEMS",
  manifest: "/dictate.webmanifest",
  appleWebApp: { capable: true, title: "Dictate", statusBarStyle: "default" },
  robots: "noindex",
}

export default function DictateLayout({ children }: { children: React.ReactNode }) {
  return children
}

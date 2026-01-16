import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NarrateEMS",
  description:
    "Transform your EMS documentation with AI-driven voice-to-text technology. Built by EMS professionals for healthcare heroes. HIPAA compliant, offline capable, and ePCR ready.",
  keywords:
    "EMS documentation, voice-to-text, paramedic software, ePCR, NEMSIS, healthcare technology, emergency medical services",
  authors: [{ name: "NarrateEMS Team" }],
  creator: "NarrateEMS",
  publisher: "NarrateEMS",
  robots: "index, follow",
  openGraph: {
    title: "NarrateEMS",
    description:
      "Transform your EMS documentation with AI-driven voice-to-text technology. Built by EMS professionals for healthcare heroes.",
    url: "https://narrateems.com",
    siteName: "NarrateEMS",
    type: "website",
    images: [
      {
        url: "https://narrateems.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NarrateEMS - Voice-Powered EMS Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NarrateEMS",
    description:
      "Transform your EMS documentation with AI-driven voice-to-text technology. Built by EMS professionals for healthcare heroes.",
    images: ["https://narrateems.com/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#14b8a6",
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#14b8a6" />
        <meta name="theme-color" content="#14b8a6" />
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

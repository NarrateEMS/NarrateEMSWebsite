import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "NarrateEMS — The chart writes itself.",
  description:
    "Built by medics, for medics. After the call, just narrate what happened. NarrateEMS writes your Zoll ePCR for you — 70% faster, HIPAA encrypted.",
  keywords:
    "EMS documentation, voice ePCR, paramedic charting, Zoll integration, EMS software, ambulance charting, voice to text EMS, post-call charting",
  authors: [{ name: "NarrateEMS" }],
  creator: "NarrateEMS",
  publisher: "NarrateEMS",
  robots: "index, follow",
  openGraph: {
    title: "NarrateEMS — The chart writes itself.",
    description:
      "After the call, just narrate. NarrateEMS writes your Zoll ePCR for you — 70% faster, HIPAA encrypted.",
    url: "https://narrateems.com",
    siteName: "NarrateEMS",
    type: "website",
    images: [
      {
        url: "https://narrateems.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NarrateEMS — Voice-driven ePCR charting for medics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NarrateEMS — The chart writes itself.",
    description:
      "After the call, narrate. NarrateEMS writes your Zoll ePCR — 70% faster.",
    images: ["https://narrateems.com/og-image.jpg"],
  },
  manifest: "/manifest.json",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A1628",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="msapplication-TileColor" content="#0A1628" />
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

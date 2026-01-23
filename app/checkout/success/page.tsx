"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Give the webhook a moment to process
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-white/5">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="NarrateEMS"
              width={150}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 pt-24">
        <div className="max-w-lg w-full text-center">
          {isLoading ? (
            <>
              <div className="w-16 h-16 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Processing your order...</h1>
              <p className="text-white/60">Please wait while we set up your account.</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-teal-400/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">Welcome to NarrateEMS!</h1>
              <p className="text-xl text-white/60 mb-8">
                Your subscription is now active. You&apos;re ready to start documenting faster.
              </p>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Next Steps:</h2>
                <ol className="text-left space-y-4 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="bg-teal-400 text-slate-900 font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                    <span>Install the <strong className="text-white">NarrateEMS Chrome Extension</strong> from the Chrome Web Store</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-teal-400 text-slate-900 font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                    <span>Log in with the email and password you just created</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-teal-400 text-slate-900 font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                    <span>Navigate to your ePCR system and start dictating!</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-teal-400 text-slate-900 font-semibold rounded-lg hover:bg-teal-300 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5a7.5 7.5 0 110 15 7.5 7.5 0 010-15z"/>
                  </svg>
                  Get Chrome Extension
                </a>
                <Link
                  href="/"
                  className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
                >
                  Back to Home
                </Link>
              </div>

              {sessionId && (
                <p className="text-white/30 text-xs mt-8">
                  Order ID: {sessionId.slice(0, 20)}...
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

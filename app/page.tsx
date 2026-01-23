"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Mic,
  FileText,
  Clock,
  Shield,
  WifiOff,
  Users,
  CheckCircle,
  Mail,
  Play,
  Activity,
} from "lucide-react"


export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ type: string } | null>(null)
  const [checkoutEmail, setCheckoutEmail] = useState("")
  const [checkoutPassword, setCheckoutPassword] = useState("")
  const [checkoutError, setCheckoutError] = useState("")
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  // Pricing tab state
  const [pricingTab, setPricingTab] = useState<'individual' | 'squad'>('squad')

  const handlePlanSelect = (planType: string) => {
    setSelectedPlan({ type: planType })
    setCheckoutEmail("")
    setCheckoutPassword("")
    setCheckoutError("")
    setShowCheckoutModal(true)
  }

  // Plan display info for checkout modal
  const getPlanDisplayInfo = (planType: string) => {
    switch (planType) {
      case 'individual_monthly':
        return 'Individual Plan - $29.99/month'
      case 'pilot_annual':
        return 'Pilot Plan - $1,000/year (500 charts included)'
      case 'small_squad_annual':
        return 'Small Squad - $3,000/year (2,000 charts included)'
      case 'large_squad_annual':
        return 'Large Squad - $6,000/year (5,000 charts included)'
      case 'high_volume_annual':
        return 'High Volume - $10,000/year (10,000 charts included)'
      default:
        return ''
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutError("")
    setIsCheckoutLoading(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: checkoutEmail,
          password: checkoutPassword,
          planType: selectedPlan?.type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  // Trigger animations on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formspree.io/f/xblynzkd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Thank you! Your message has been sent successfully.")
        setFormData({ name: "", email: "", company: "", message: "" })
      } else {
        alert("Sorry, there was an error sending your message. Please try again.")
      }
    } catch (error) {
      alert("Sorry, there was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full bg-slate-950/95 backdrop-blur-sm border-b border-white/10 z-50 transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_White-edQRVIFGqJxTAPGBJm2kUfBX3Lctuf.png"
                alt="NarrateEMS Logo"
                className={`h-8 sm:h-10 md:h-12 w-auto transition-all duration-700 ${isLoaded ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
              />
            </div>

            {/* Desktop Navigation */}
            <div
              className={`hidden md:flex items-center space-x-8 transition-all duration-1000 delay-300 ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
            >
              <button
                onClick={() => scrollToSection("solution")}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                Solution
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("market")}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                Departments
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                Contact
              </button>
              <a
                href="https://calendly.com/narrateems/narrateems"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 px-5 py-2 border border-teal-400 text-teal-400 font-medium rounded-full hover:bg-teal-400/10 transition-all duration-300 hover:scale-105"
              >
                Book Demo
              </a>
              <a
                href="/login"
                className="px-5 py-2 bg-white text-slate-900 font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105"
              >
                Log In
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/60 hover:text-white focus:outline-none transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden animate-in slide-in-from-top duration-300">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-950 border-t border-white/10">
                <button
                  onClick={() => {
                    scrollToSection("solution")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-white/60 hover:text-white transition-colors w-full text-left hover:bg-white/5 rounded-md"
                >
                  Solution
                </button>
                <button
                  onClick={() => {
                    scrollToSection("benefits")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-white/60 hover:text-white transition-colors w-full text-left hover:bg-white/5 rounded-md"
                >
                  Benefits
                </button>
                <button
                  onClick={() => {
                    scrollToSection("market")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-white/60 hover:text-white transition-colors w-full text-left hover:bg-white/5 rounded-md"
                >
                  Departments
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-white/60 hover:text-white transition-colors w-full text-left hover:bg-white/5 rounded-md"
                >
                  Contact
                </button>
                <a
                  href="https://calendly.com/narrateems/narrateems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mx-3 mt-3 px-4 py-2.5 border border-teal-400 text-teal-400 font-medium rounded-full text-center hover:bg-teal-400/10 transition-all duration-300"
                >
                  Book Demo
                </a>
                <a
                  href="/login"
                  className="block mx-3 mt-2 px-4 py-2.5 bg-white text-slate-900 font-medium rounded-full text-center hover:bg-white/90 transition-all duration-300"
                >
                  Log In
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-black relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />

        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 text-center relative z-20">
          <div className="max-w-[90rem] w-full px-4 sm:px-6 md:px-10 xl:px-20 mx-auto">
            {/* Tagline Badge */}
            <div
              className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-1000 delay-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-white/70 text-sm font-medium tracking-wide">AI-Powered EMS Documentation</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight transition-all duration-1000 delay-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            >
              Voice-Powered Charting
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Built for Healthcare Heroes</span>
            </h1>
            <p
              className={`text-lg sm:text-xl md:text-2xl text-white/60 mb-10 max-w-3xl mx-auto font-light transition-all duration-1000 delay-900 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              Empowering first responders with AI-driven documentation that puts patient care first.
            </p>

            {/* Chrome Extension Download Button - Primary CTA */}
            <div
              className={`mb-6 transition-all duration-1000 delay-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <a
                href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848a12.014 12.014 0 0 0 9.341-4.175A11.918 11.918 0 0 0 24 12c0-.037-.002-.073-.002-.11zM12 8.035a3.965 3.965 0 0 0 0 7.93 3.965 3.965 0 0 0 0-7.93z"/>
                </svg>
                Download Chrome Extension
              </a>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-1100 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <a
                href="https://calendly.com/narrateems/narrateems"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-transparent text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto font-medium border border-white/20 rounded-full hover:border-white/40 transition-all duration-300"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Request Demo
              </a>
              <Button
                size="lg"
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-transparent px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto font-medium transition-all duration-300"
                onClick={() => scrollToSection("solution")}
              >
                Learn More →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Dark */}
      <section id="problem" className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/5 rounded-full blur-[120px]" />

        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10">
          <div className="text-center mb-16">
            <p className="text-red-400 text-sm font-medium tracking-widest uppercase mb-4">The Problem</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Documentation is Broken
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Up to 1 hour per call. Outdated systems. Frustrated providers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Time Drain</h3>
              <p className="text-white/50 text-sm">Endless typing when you should be resting</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Redundant Entry</h3>
              <p className="text-white/50 text-sm">Same data, multiple fields, more errors</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Not Field-Ready</h3>
              <p className="text-white/50 text-sm">Desktop-first design fails in ambulances</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Light */}
      <section id="solution" className="py-24 bg-slate-200">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-4">The Solution</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Meet NarrateEMS
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Speak. Transcribe. Done. Even offline.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mic className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Voice-First</h3>
                  <p className="text-slate-500 text-sm">Speak naturally, AI handles the rest</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <WifiOff className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Works Offline</h3>
                  <p className="text-slate-500 text-sm">No signal? No problem. Syncs when ready</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">NEMSIS v3 Compliant</h3>
                  <p className="text-slate-500 text-sm">Industry-standard formatting, automatic</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Zoll ePCR Integration</h3>
                  <p className="text-slate-500 text-sm">Direct export, zero copy-paste</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-teal-600">Built by EMS.</span> 6+ years field experience behind every feature.
                </p>
              </div>
            </div>

            {/* Demo Card */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white text-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium opacity-90">Recording...</p>
              </div>
              <div className="space-y-2">
                <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Patient Demographics</span>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Chief Complaint</span>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Vital Signs</span>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 text-sm">Treatment Protocol...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Impact Section - Dark */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] -translate-y-1/2" />

        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image.jpg-zZeluLIQJ3rB3PKe7tKcfoKfekukF6.jpeg"
                  alt="Paramedic providing patient care"
                  className="rounded-2xl w-full h-80 object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-teal-500 text-white px-5 py-3 rounded-xl">
                  <div className="text-2xl font-bold">60%</div>
                  <div className="text-xs opacity-80">Time Saved</div>
                </div>
              </div>

              {/* Content */}
              <div>
                <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-4">Why Us</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                  Built by EMS.<br />For EMS.
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span className="text-white/70">Patient-centered workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span className="text-white/70">Medical terminology trained AI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span className="text-white/70">Designed for high-pressure situations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMS Team Section - Light */}
      <section className="py-24 bg-slate-200">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-4">For Every EMS Professional</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Your Workflow. Simplified.
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12">
              EMTs. Paramedics. Flight crews. Ground units.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-slate-50">
                <div className="text-3xl font-bold text-teal-600 mb-1">24/7</div>
                <div className="text-sm text-slate-500">Always On</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-50">
                <div className="text-3xl font-bold text-teal-600 mb-1">100%</div>
                <div className="text-sm text-slate-500">HIPAA Compliant</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-50">
                <div className="text-3xl font-bold text-teal-600 mb-1">&lt;2min</div>
                <div className="text-sm text-slate-500">Setup Time</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-50">
                <div className="text-3xl font-bold text-teal-600 mb-1">∞</div>
                <div className="text-sm text-slate-500">Offline Capable</div>
              </div>
            </div>

            {/* Simple Flow Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl">
                <Mic className="h-5 w-5 text-teal-400" />
                <span className="font-medium">Speak</span>
              </div>
              <div className="hidden md:block text-slate-300">→</div>
              <div className="md:hidden text-slate-300">↓</div>
              <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl">
                <Activity className="h-5 w-5 text-teal-400" />
                <span className="font-medium">AI Process</span>
              </div>
              <div className="hidden md:block text-slate-300">→</div>
              <div className="md:hidden text-slate-300">↓</div>
              <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl">
                <FileText className="h-5 w-5 text-teal-400" />
                <span className="font-medium">ePCR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Easy Installation Section - Dark */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />

        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10">
          <div className="text-center mb-16">
            <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-4">Get Started</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Minutes to Setup. Zero Learning Curve.
            </h2>
            <p className="text-xl text-white/50 max-w-xl mx-auto">
              Chrome extension. One click. Done.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* 3 Steps */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-14 h-14 bg-teal-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-white font-semibold mb-1">Install</h3>
                <p className="text-white/50 text-sm">One-click Chrome extension</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-teal-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-white font-semibold mb-1">Connect</h3>
                <p className="text-white/50 text-sm">Link to Zoll ePCR</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-teal-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-white font-semibold mb-1">Speak</h3>
                <p className="text-white/50 text-sm">Start documenting</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 text-lg font-semibold rounded-full hover:bg-white/90 transition-all duration-300"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#fff" stroke="#4285F4" strokeWidth="2"/>
                  <path d="M12 2a10 10 0 0 1 8.66 5h-5.66l-1.5-2.6a4 4 0 0 0-3 0L8.99 7H3.34A10 10 0 0 1 12 2z" fill="#EA4335"/>
                  <path d="M21.66 7A10 10 0 0 1 17 20.66l-2.83-4.9 1.5-2.6a4 4 0 0 0 0-3l1.5-2.6h4.49z" fill="#4285F4"/>
                  <path d="M17 20.66A10 10 0 0 1 3.34 17l2.83-4.9h3a4 4 0 0 0 3 1.73l1.5 2.6-2.83 4.9z" fill="#34A853"/>
                  <path d="M3.34 17A10 10 0 0 1 3.34 7l4.49 0 1.5 2.6a4 4 0 0 0 0 3l-1.5 2.6-4.49 0z" fill="#FBBC05"/>
                  <circle cx="12" cy="12" r="4" fill="#fff"/>
                </svg>
                Download Extension
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section - Light */}
      <section id="benefits" className="py-24 bg-slate-200">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-4">Key Benefits</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Why NarrateEMS
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl bg-slate-50 text-center hover:bg-slate-200 transition-colors">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mic className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Hands-Free</h3>
              <p className="text-slate-500 text-sm">Voice-first documentation</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 text-center hover:bg-slate-200 transition-colors">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <WifiOff className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Offline Ready</h3>
              <p className="text-slate-500 text-sm">No signal required</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 text-center hover:bg-slate-200 transition-colors">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">HIPAA Secure</h3>
              <p className="text-slate-500 text-sm">Enterprise-grade protection</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 text-center hover:bg-slate-200 transition-colors">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">ePCR Ready</h3>
              <p className="text-slate-500 text-sm">Direct Zoll integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Dark */}
      <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[150px]" />

        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10">
          <div className="text-center mb-12">
            <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Simple. Transparent.
            </h2>
            <p className="text-xl text-white/50 max-w-xl mx-auto mb-6">
              Plans for individuals and departments.
            </p>
            <div className="inline-flex items-center gap-2 bg-teal-400/10 border border-teal-400/30 text-teal-400 px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7-day free trial on all plans
            </div>
          </div>

          {/* Pricing Tab Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-slate-900/80 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setPricingTab('individual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  pricingTab === 'individual'
                    ? 'bg-teal-400 text-slate-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setPricingTab('squad')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  pricingTab === 'squad'
                    ? 'bg-teal-400 text-slate-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Squad / Department
              </button>
            </div>
          </div>

          {/* Individual Plan */}
          {pricingTab === 'individual' && (
            <div className="max-w-md mx-auto">
              <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 hover:border-teal-400/30 transition-all">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Individual</h3>
                  <p className="text-white/50 text-sm">For solo providers</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">$29.99</span>
                  <span className="text-white/50">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-white/70">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Unlimited voice narratives
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    All ePCR integrations
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Chrome extension
                  </li>
                </ul>
                <button
                  onClick={() => handlePlanSelect('individual_monthly')}
                  className="w-full py-3 px-6 bg-teal-400 text-slate-900 font-semibold rounded-lg hover:bg-teal-300 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}

          {/* Squad Plans */}
          {pricingTab === 'squad' && (
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pilot */}
                <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-teal-400/30 transition-all">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Pilot</h3>
                    <p className="text-white/50 text-xs">Getting started</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">$1,000</span>
                    <span className="text-white/50 text-sm">/year</span>
                  </div>
                  <p className="text-teal-400 text-sm font-medium mb-4">500 charts included</p>
                  <ul className="space-y-3 mb-6 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Team management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Squad billing
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      <span className="text-white/50">$2.50/extra chart</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('pilot_annual')}
                    className="w-full py-2.5 px-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
                  >
                    Get Started
                  </button>
                </div>

                {/* Small Squad */}
                <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-teal-400/30 transition-all">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Small Squad</h3>
                    <p className="text-white/50 text-xs">Growing teams</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">$3,000</span>
                    <span className="text-white/50 text-sm">/year</span>
                  </div>
                  <p className="text-teal-400 text-sm font-medium mb-4">2,000 charts included</p>
                  <ul className="space-y-3 mb-6 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Team management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Squad billing
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      <span className="text-white/50">$1.90/extra chart</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('small_squad_annual')}
                    className="w-full py-2.5 px-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
                  >
                    Get Started
                  </button>
                </div>

                {/* Large Squad - Most Popular */}
                <div className="relative bg-slate-900/50 border border-teal-400/50 rounded-2xl p-6 shadow-lg shadow-teal-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Large Squad</h3>
                    <p className="text-white/50 text-xs">Departments</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">$6,000</span>
                    <span className="text-white/50 text-sm">/year</span>
                  </div>
                  <p className="text-teal-400 text-sm font-medium mb-4">5,000 charts included</p>
                  <ul className="space-y-3 mb-6 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Team management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Squad billing
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      <span className="text-white/50">$1.40/extra chart</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('large_squad_annual')}
                    className="w-full py-2.5 px-4 bg-teal-400 text-slate-900 font-semibold rounded-lg hover:bg-teal-300 transition-colors text-sm"
                  >
                    Get Started
                  </button>
                </div>

                {/* High Volume */}
                <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-teal-400/30 transition-all">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white/10 text-teal-400 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
                    BEST VALUE
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">High Volume</h3>
                    <p className="text-white/50 text-xs">Enterprise scale</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">$10,000</span>
                    <span className="text-white/50 text-sm">/year</span>
                  </div>
                  <p className="text-teal-400 text-sm font-medium mb-4">10,000 charts included</p>
                  <ul className="space-y-3 mb-6 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Team management
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      <span className="text-white/50">$1.15/extra chart</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('high_volume_annual')}
                    className="w-full py-2.5 px-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Market Stats Section - Light */}
      <section id="market" className="py-24 bg-slate-200">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-4">The Opportunity</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Massive Market. Outdated Tools.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-8">
                <div className="text-5xl font-bold text-teal-600 mb-2">250K+</div>
                <div className="text-slate-900 font-semibold mb-1">EMS Providers</div>
                <p className="text-slate-500 text-sm">Across the US</p>
              </div>
              <div className="p-8">
                <div className="text-5xl font-bold text-teal-600 mb-2">36M+</div>
                <div className="text-slate-900 font-semibold mb-1">Annual Dispatches</div>
                <p className="text-slate-500 text-sm">Requiring documentation</p>
              </div>
              <div className="p-8">
                <div className="text-5xl font-bold text-teal-600 mb-2">35%</div>
                <div className="text-slate-900 font-semibold mb-1">Outdated Systems</div>
                <p className="text-slate-500 text-sm">Without voice capability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Dark */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />

        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10">
          <div className="text-center mb-16">
            <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              From the Field
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-white/70 mb-4 text-sm leading-relaxed">
                "Voice-first would be a game-changer for our crews."
              </p>
              <div className="text-white/40 text-xs">— EMS Chief</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-white/70 mb-4 text-sm leading-relaxed">
                "Documentation in the ambulance is a nightmare with current systems."
              </p>
              <div className="text-white/40 text-xs">— Paramedic Supervisor</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-white/70 mb-4 text-sm leading-relaxed">
                "After a cardiac arrest, spending an hour typing? Voice would save our sanity."
              </p>
              <div className="text-white/40 text-xs">— Flight Paramedic</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Light */}
      <section id="contact" className="py-24 bg-slate-200">
        <div className="w-full max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-4">Get In Touch</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Let's Talk
            </h2>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">
              Ready to modernize your documentation?
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                  Organization
                </label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-28 bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                  placeholder="Tell us about your needs..."
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Mail className="h-4 w-4" />
                <span>narrateems@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-8">
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_White-edQRVIFGqJxTAPGBJm2kUfBX3Lctuf.png"
              alt="NarrateEMS Logo"
              className="h-10 w-auto"
            />
            <div className="flex items-center gap-6 text-white/40 text-sm">
              <a href="/privacy-policy" className="hover:text-white/70 transition-colors">
                Privacy
              </a>
              <span>© 2025 NarrateEMS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">Create Your Account</h3>
            <p className="text-white/50 mb-6">
              {selectedPlan?.type && getPlanDisplayInfo(selectedPlan.type)}
            </p>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label htmlFor="checkout-email" className="block text-sm text-white/70 mb-2">Email</label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="checkout-password" className="block text-sm text-white/70 mb-2">Create Password</label>
                <input
                  id="checkout-password"
                  type="password"
                  required
                  minLength={6}
                  value={checkoutPassword}
                  onChange={(e) => setCheckoutPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400"
                  placeholder="At least 6 characters"
                />
              </div>

              {checkoutError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {checkoutError}
                </div>
              )}

              <button
                type="submit"
                disabled={isCheckoutLoading}
                className="w-full py-3 px-6 bg-teal-400 text-slate-900 font-semibold rounded-lg hover:bg-teal-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckoutLoading ? 'Processing...' : 'Continue to Payment'}
              </button>

              <p className="text-white/40 text-xs text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

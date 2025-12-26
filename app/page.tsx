"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
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
  Heart,
  Activity,
  Clipboard,
} from "lucide-react"
import { IntegrationSection } from "@/components/integration-section"

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_Blue-gNghgG69Eid0XYluSONpUoMlNuweF6.png"
                alt="NarrateEMS Logo"
                className={`h-8 sm:h-10 md:h-12 w-auto transition-all duration-700 ${isLoaded ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
              />
            </div>

            {/* Desktop Navigation */}
            <div
              className={`hidden md:flex space-x-8 transition-all duration-1000 delay-300 ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
            >
              <button
                onClick={() => scrollToSection("problem")}
                className="text-slate-600 hover:text-blue-600 transition-colors hover:scale-105 transform duration-200"
              >
                Problem
              </button>
              <button
                onClick={() => scrollToSection("solution")}
                className="text-slate-600 hover:text-blue-600 transition-colors hover:scale-105 transform duration-200"
              >
                Solution
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-slate-600 hover:text-blue-600 transition-colors hover:scale-105 transform duration-200"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("market")}
                className="text-slate-600 hover:text-blue-600 transition-colors hover:scale-105 transform duration-200"
              >
                Departments
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-600 hover:text-blue-600 transition-colors hover:scale-105 transform duration-200"
              >
                Contact
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-blue-600 focus:outline-none transition-transform duration-200 hover:scale-110"
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
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
                <button
                  onClick={() => {
                    scrollToSection("problem")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors w-full text-left hover:bg-slate-50 rounded-md"
                >
                  Problem
                </button>
                <button
                  onClick={() => {
                    scrollToSection("solution")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors w-full text-left hover:bg-slate-50 rounded-md"
                >
                  Solution
                </button>
                <button
                  onClick={() => {
                    scrollToSection("benefits")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors w-full text-left hover:bg-slate-50 rounded-md"
                >
                  Benefits
                </button>
                <button
                  onClick={() => {
                    scrollToSection("market")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors w-full text-left hover:bg-slate-50 rounded-md"
                >
                  Departments
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors w-full text-left hover:bg-slate-50 rounded-md"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-teal-600 via-green-600 to-emerald-700 relative overflow-hidden">
        {/* Enhanced Medical Background Pattern */}
        <div className="absolute inset-0 opacity-12">
          <svg className="w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            {/* Enhanced Medical Patterns */}
            <defs>
              {/* Heartbeat/EKG Pattern */}
              <pattern id="heartbeat-pattern" x="0" y="0" width="300" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M0,40 L50,40 L60,20 L70,60 L80,10 L90,70 L100,25 L110,55 L120,40 L300,40"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M0,60 L40,60 L50,35 L60,65 L70,30 L80,70 L90,45 L100,65 L110,60 L300,60"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.25"
                />
              </pattern>

              {/* Medical Cross Pattern - Enhanced */}
              <pattern id="medical-cross-enhanced" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <g opacity="0.15">
                  <rect x="50" y="25" width="20" height="70" fill="white" rx="2" />
                  <rect x="25" y="50" width="70" height="20" fill="white" rx="2" />
                  {/* Smaller crosses */}
                  <rect x="10" y="5" width="8" height="25" fill="white" opacity="0.5" rx="1" />
                  <rect x="5" y="10" width="18" height="8" fill="white" opacity="0.5" rx="1" />
                  <rect x="95" y="85" width="8" height="25" fill="white" opacity="0.5" rx="1" />
                  <rect x="90" y="90" width="18" height="8" fill="white" opacity="0.5" rx="1" />
                </g>
              </pattern>

              {/* Pulse Line Pattern */}
              <pattern id="pulse-line" x="0" y="0" width="400" height="100" patternUnits="userSpaceOnUse">
                <path
                  d="M0,50 L80,50 L90,20 L100,80 L110,10 L120,90 L130,30 L140,70 L150,50 L400,50"
                  stroke="white"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.2"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,400;400,0;0,400"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </path>
              </pattern>
            </defs>

            {/* Layer the patterns */}
            <rect width="100%" height="100%" fill="url(#heartbeat-pattern)" />
            <rect width="100%" height="100%" fill="url(#medical-cross-enhanced)" />
            <rect width="100%" height="100%" fill="url(#pulse-line)" />

            {/* Enhanced Floating Medical Elements */}
            <g opacity="0.15">
              {/* Heartbeat monitors */}
              <g transform="translate(150, 100)">
                <rect x="0" y="0" width="60" height="40" rx="5" fill="white" opacity="0.25" />
                <path
                  d="M10,20 L15,20 L20,10 L25,30 L30,15 L35,25 L40,20 L50,20"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                >
                  <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="3s" repeatCount="indefinite" />
                </path>
                <animate attributeName="opacity" values="0.15;0.25;0.15" dur="4s" repeatCount="indefinite" />
              </g>

              {/* Medical equipment icons */}
              <circle cx="300" cy="200" r="12" fill="white" opacity="0.2">
                <animate attributeName="cy" values="200;180;200" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="900" cy="300" r="8" fill="white" opacity="0.18">
                <animate attributeName="cy" values="300;275;300" dur="4.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="1100" cy="150" r="15" fill="white" opacity="0.15">
                <animate attributeName="cy" values="150;125;150" dur="6s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Enhanced Ambulance Silhouettes */}
            <g opacity="0.1">
              {/* Main ambulance - larger and more detailed */}
              <g transform="translate(800, 450)">
                <rect x="0" y="25" width="120" height="45" rx="8" fill="white" />
                <rect x="100" y="10" width="60" height="30" rx="5" fill="white" />
                <rect x="140" y="0" width="20" height="15" rx="3" fill="white" />
                {/* Wheels */}
                <circle cx="25" cy="80" r="12" fill="white" />
                <circle cx="135" cy="80" r="12" fill="white" />
                {/* Medical cross on side */}
                <rect x="110" y="35" width="8" height="20" fill="white" />
                <rect x="105" y="40" width="18" height="8" fill="white" />
                {/* Emergency lights */}
                <rect x="145" y="15" width="4" height="6" fill="white" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1s" repeatCount="indefinite" />
                </rect>
                <rect x="151" y="15" width="4" height="6" fill="white" opacity="0.6">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1s" repeatCount="indefinite" />
                </rect>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="800,450;820,450;800,450"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Secondary ambulance - smaller, in distance */}
              <g transform="translate(200, 500)" opacity="0.4">
                <rect x="0" y="15" width="60" height="25" rx="4" fill="white" />
                <rect x="50" y="8" width="25" height="15" rx="2" fill="white" />
                <circle cx="15" cy="45" r="6" fill="white" />
                <circle cx="65" cy="45" r="6" fill="white" />
                <rect x="55" y="20" width="4" height="10" fill="white" />
                <rect x="52" y="23" width="10" height="4" fill="white" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="200,500;250,500;200,500"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Medical helicopter silhouette */}
              <g transform="translate(1000, 100)" opacity="0.3">
                <ellipse cx="30" cy="20" rx="35" ry="8" fill="white" />
                <rect x="10" y="15" width="40" height="10" rx="5" fill="white" />
                <rect x="45" y="10" width="15" height="5" rx="2" fill="white" />
                <rect x="25" y="5" width="3" height="15" fill="white" />
                <rect x="32" y="8" width="6" height="3" fill="white" />
                <rect x="29" y="11" width="12" height="3" fill="white" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="1000,100;1050,90;1000,100"
                  dur="15s"
                  repeatCount="indefinite"
                />
              </g>
            </g>

            {/* Animated EKG Line Across Screen */}
            <g opacity="0.2">
              <path
                d="M0,400 L200,400 L220,350 L240,450 L260,300 L280,500 L300,380 L320,420 L340,400 L1200,400"
                stroke="white"
                strokeWidth="3"
                fill="none"
                opacity="0.3"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,1200;600,600;1200,0"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Secondary EKG line */}
              <path
                d="M0,500 L150,500 L170,460 L190,540 L210,450 L230,550 L250,480 L270,520 L290,500 L1200,500"
                stroke="white"
                strokeWidth="2"
                fill="none"
                opacity="0.25"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="1200,0;600,600;0,1200"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </svg>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10"></div>

        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 text-center relative z-20">
          <div className="max-w-[90rem] w-full px-4 sm:px-6 md:px-10 xl:px-20 mx-auto">
            <div
              className={`flex items-center justify-center mb-6 transition-all duration-1000 delay-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <div className="bg-white/15 backdrop-blur-sm rounded-full p-3 mr-4 border border-white/20 hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>
              <span className="text-white/90 font-semibold text-lg">Transforming EMS Documentation</span>
            </div>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg transition-all duration-1200 delay-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            >
              NarrateEMS – Voice-Powered Charting
              <br />
              <span className="text-blue-200 animate-pulse"> Built for Healthcare Heroes</span>
            </h1>
            <p
              className={`text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto drop-shadow-md transition-all duration-1000 delay-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              Empowering first responders with AI-driven documentation that puts patient care first.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center transition-all duration-1000 delay-1200 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <Button
                size="lg"
                className="bg-white text-slate-700 hover:bg-slate-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto shadow-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-xl"
                onClick={() => scrollToSection("contact")}
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Request Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white/10 backdrop-blur-sm w-full sm:w-auto border-2 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                onClick={() => scrollToSection("solution")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-white">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom duration-1000">
              The Documentation Crisis in EMS
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              EMS professionals can spend up to an hour per call on documentation, often on poorly designed systems that
              weren't built for field conditions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-slate-200 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-left duration-1000 delay-300">
              <CardContent className="pt-6">
                <div className="relative mb-6">
                  <Clock className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Time-Consuming Interfaces</h3>
                <p className="text-slate-600">
                  Current ePCR systems require extensive typing and tapping, taking valuable time away from patient care
                  and rest.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 border-slate-200 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <CardContent className="pt-6">
                <div className="relative mb-6">
                  <FileText className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Repetitive Data Entry</h3>
                <p className="text-slate-600">
                  Providers must enter the same information multiple times across different fields, leading to
                  frustration and errors.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 border-slate-200 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-right duration-1000 delay-700">
              <CardContent className="pt-6">
                <div className="relative mb-6">
                  <Users className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Poor Mobile Optimization</h3>
                <p className="text-slate-600">
                  Most systems weren't designed for field conditions, making documentation difficult in ambulances and
                  on mobile devices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-slate-50">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-1000">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Meet NarrateEMS</h2>
              <p className="text-xl text-slate-600 mb-8">
                A voice-first mobile tool that transcribes, formats, and completes EMS reports in real-time — even when
                you're offline.
              </p>
              <div className="bg-teal-50 border-l-4 border-teal-600 p-4 mb-8 rounded-r-lg hover:shadow-md transition-shadow duration-300">
                <p className="text-teal-800 font-medium">
                  Built by EMS professionals who understand the field. Our founder brings 6 years of hands-on EMS
                  experience to solving the documentation crisis.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-left duration-700 delay-200">
                  <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
                  <span className="text-lg text-slate-700">Real-time clarification prompts for missing data</span>
                </div>
                <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-left duration-700 delay-400">
                  <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
                  <span className="text-lg text-slate-700">ePCR-compatible output for seamless integration</span>
                </div>
                <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-left duration-700 delay-600">
                  <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
                  <span className="text-lg text-slate-700">NEMSIS Version 3 compliant formatting</span>
                </div>
                <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-left duration-700 delay-800">
                  <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
                  <span className="text-lg text-slate-700">
                    Works with ESO, ImageTrend, Zoll, and other major ePCR systems
                  </span>
                </div>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-slate-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative z-10 hover:shadow-3xl transition-shadow duration-500">
                <div className="bg-teal-600 rounded-2xl p-6 text-white text-center">
                  <Mic className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                  <p className="text-lg font-medium mb-2">Recording...</p>
                  <p className="text-sm opacity-90">
                    "Patient is a 45-year-old male with chest pain, vitals stable, transported to General Hospital..."
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="bg-slate-800 rounded-lg p-3 animate-in fade-in slide-in-from-bottom duration-500 delay-1000">
                    <div className="text-green-400 text-sm">✓ Patient Demographics</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 animate-in fade-in slide-in-from-bottom duration-500 delay-1200">
                    <div className="text-green-400 text-sm">✓ Chief Complaint</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 animate-in fade-in slide-in-from-bottom duration-500 delay-1400">
                    <div className="text-green-400 text-sm">✓ Vital Signs</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 animate-in fade-in slide-in-from-bottom duration-500 delay-1600">
                    <div className="text-yellow-400 text-sm animate-pulse">⏳ Treatment Protocol</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Healthcare Impact Section */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-in fade-in slide-in-from-left duration-1000">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image.jpg-zZeluLIQJ3rB3PKe7tKcfoKfekukF6.jpeg"
                alt="Paramedic providing patient care in ambulance"
                className="rounded-2xl shadow-lg w-full h-80 object-cover hover:shadow-2xl transition-shadow duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-4 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300 animate-in fade-in slide-in-from-bottom delay-500">
                <div className="flex items-center space-x-2">
                  <Activity className="w-6 h-6 animate-pulse" />
                  <div>
                    <div className="text-2xl font-bold">60%</div>
                    <div className="text-sm">Time Saved</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-white p-3 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300 animate-in fade-in slide-in-from-top delay-300">
                <div className="flex items-center space-x-2">
                  <Clipboard className="w-5 h-5 text-teal-600 animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">Smart Documentation</span>
                </div>
              </div>
            </div>
            <div className="animate-in fade-in slide-in-from-right duration-1000 delay-200">
              <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4 hover:scale-105 transition-transform duration-200">
                <Heart className="w-4 h-4 mr-2 animate-pulse" />
                Healthcare Innovation
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Designed by Healthcare Professionals, for Healthcare Professionals
              </h2>
              <p className="text-xl text-slate-600 mb-6">
                Our team understands the critical nature of emergency medical services. Every feature is built with
                patient safety and provider efficiency in mind.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-right duration-500 delay-400">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-200">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Patient-Centered Design</h4>
                    <p className="text-slate-600">
                      Every workflow prioritizes patient care while streamlining documentation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-right duration-500 delay-600">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-200">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Clinical Accuracy</h4>
                    <p className="text-slate-600">
                      AI trained on medical terminology and EMS protocols for precise documentation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-right duration-500 delay-800">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-200">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Stress-Free Operation</h4>
                    <p className="text-slate-600">
                      Intuitive interface designed for high-pressure emergency situations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* EMS Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4 hover:scale-105 transition-transform duration-200">
                <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Emergency Response
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Built for the Heroes Who Save Lives Every Day
              </h2>
              <p className="text-xl text-slate-600 mb-6">
                From EMTs to paramedics, flight crews to ground units - NarrateEMS adapts to every EMS professional's
                workflow and documentation needs.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 hover:scale-105 transform animate-in fade-in slide-in-from-left delay-300">
                  <div className="text-2xl font-bold text-teal-600 mb-1 animate-pulse">24/7</div>
                  <div className="text-sm text-slate-600">Always Available</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 hover:scale-105 transform animate-in fade-in slide-in-from-left delay-500">
                  <div className="text-2xl font-bold text-teal-600 mb-1 animate-pulse">100%</div>
                  <div className="text-sm text-slate-600">HIPAA Compliant</div>
                </div>
              </div>
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg"
                onClick={() => scrollToSection("contact")}
              >
                Join the Revolution
              </Button>
            </div>
            <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 flex items-center justify-center min-h-96 animate-in fade-in slide-in-from-right duration-1000 delay-200 hover:shadow-lg transition-shadow duration-500">
              <div className="relative w-full max-w-md">
                {/* Voice to Text Flow Animation */}
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* Background circles */}
                  <circle cx="80" cy="150" r="60" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" opacity="0.3">
                    <animate attributeName="r" values="60;65;60" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="320" cy="150" r="60" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" opacity="0.3">
                    <animate attributeName="r" values="60;65;60" dur="2s" repeatCount="indefinite" begin="1s" />
                  </circle>

                  {/* Microphone Icon */}
                  <g transform="translate(60, 130)">
                    <rect x="15" y="10" width="10" height="20" rx="5" fill="#14b8a6" />
                    <path d="M10 25 Q10 35 20 35 Q30 35 30 25" stroke="#14b8a6" strokeWidth="2" fill="none" />
                    <line x1="20" y1="35" x2="20" y2="45" stroke="#14b8a6" strokeWidth="2" />
                    <line x1="15" y1="45" x2="25" y2="45" stroke="#14b8a6" strokeWidth="2" />

                    {/* Sound waves */}
                    <g opacity="0.7">
                      <path d="M35 15 Q45 20 35 25" stroke="#14b8a6" strokeWidth="2" fill="none">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M40 10 Q55 20 40 30" stroke="#14b8a6" strokeWidth="2" fill="none">
                        <animate
                          attributeName="opacity"
                          values="0.3;1;0.3"
                          dur="1.5s"
                          repeatCount="indefinite"
                          begin="0.3s"
                        />
                      </path>
                      <path d="M45 5 Q65 20 45 35" stroke="#14b8a6" strokeWidth="2" fill="none">
                        <animate
                          attributeName="opacity"
                          values="0.3;1;0.3"
                          dur="1.5s"
                          repeatCount="indefinite"
                          begin="0.6s"
                        />
                      </path>
                    </g>
                  </g>

                  {/* Flowing particles/dots */}
                  <g>
                    <circle r="3" fill="#14b8a6">
                      <animateMotion dur="3s" repeatCount="indefinite">
                        <path d="M 140 150 Q 200 120 260 150" />
                      </animateMotion>
                      <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle r="2" fill="#0d9488">
                      <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s">
                        <path d="M 140 150 Q 200 180 260 150" />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        dur="3s"
                        repeatCount="indefinite"
                        begin="0.5s"
                      />
                    </circle>
                    <circle r="2.5" fill="#14b8a6">
                      <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
                        <path d="M 140 150 Q 200 140 260 150" />
                      </animateMotion>
                      <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" begin="1s" />
                    </circle>
                  </g>

                  {/* Document/Text Icon */}
                  <g transform="translate(300, 130)">
                    <rect x="5" y="5" width="30" height="40" rx="3" fill="white" stroke="#14b8a6" strokeWidth="2" />

                    {/* Text lines appearing */}
                    <g>
                      <line x1="10" y1="15" x2="25" y2="15" stroke="#14b8a6" strokeWidth="2">
                        <animate attributeName="x2" values="10;25" dur="2s" repeatCount="indefinite" begin="1s" />
                      </line>
                      <line x1="10" y1="20" x2="30" y2="20" stroke="#14b8a6" strokeWidth="2">
                        <animate attributeName="x2" values="10;30" dur="2s" repeatCount="indefinite" begin="1.3s" />
                      </line>
                      <line x1="10" y1="25" x2="20" y2="25" stroke="#14b8a6" strokeWidth="2">
                        <animate attributeName="x2" values="10;20" dur="2s" repeatCount="indefinite" begin="1.6s" />
                      </line>
                      <line x1="10" y1="30" x2="28" y2="30" stroke="#14b8a6" strokeWidth="2">
                        <animate attributeName="x2" values="10;28" dur="2s" repeatCount="indefinite" begin="1.9s" />
                      </line>
                    </g>

                    {/* Checkmark */}
                    <g opacity="0">
                      <circle cx="32" cy="12" r="6" fill="#10b981" />
                      <path d="M29 12 L31 14 L35 10" stroke="white" strokeWidth="2" fill="none" />
                      <animate attributeName="opacity" values="0;0;1" dur="3s" repeatCount="indefinite" begin="2.5s" />
                    </g>
                  </g>

                  {/* Arrow */}
                  <g transform="translate(180, 145)">
                    <path d="M0 5 L30 5 L25 0 M30 5 L25 10" stroke="#14b8a6" strokeWidth="2" fill="none" opacity="0.6">
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                    </path>
                  </g>

                  {/* Labels */}
                  <text x="80" y="230" textAnchor="middle" className="fill-slate-600 text-sm font-medium">
                    Voice Input
                  </text>
                  <text x="200" y="280" textAnchor="middle" className="fill-slate-600 text-xs">
                    AI Processing
                  </text>
                  <text x="320" y="230" textAnchor="middle" className="fill-slate-600 text-sm font-medium">
                    ePCR Ready
                  </text>
                </svg>

                {/* Status indicator */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-700">Live Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Easy Installation Section */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom duration-1000">
              Get Started in Minutes, Not Hours
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              NarrateEMS is a lightweight Chrome extension that installs instantly and works seamlessly with your
              existing workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <div className="h-full">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-slate-100 h-full flex flex-col hover:shadow-lg transition-shadow duration-500 animate-in fade-in slide-in-from-left duration-1000 delay-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Chrome Extension</h3>
                    <p className="text-slate-600">One-click installation from Chrome Web Store</p>
                  </div>
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-left duration-500 delay-500">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 hover:scale-110 transition-transform duration-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">No Software Downloads</h4>
                      <p className="text-sm text-slate-600">
                        Works directly in your browser - no heavy installations required
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-left duration-500 delay-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 hover:scale-110 transition-transform duration-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Instant Setup</h4>
                      <p className="text-sm text-slate-600">Ready to use in under 2 minutes with zero configuration</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-left duration-500 delay-900">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 hover:scale-110 transition-transform duration-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Auto-Updates</h4>
                      <p className="text-sm text-slate-600">Always get the latest features without manual updates</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-left duration-500 delay-1100">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 hover:scale-110 transition-transform duration-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Works Everywhere</h4>
                      <p className="text-sm text-slate-600">
                        Use on any computer with Chrome - ambulances, stations, or home
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-dashed border-slate-300 h-full flex flex-col relative overflow-hidden hover:shadow-lg transition-shadow duration-500 animate-in fade-in slide-in-from-right duration-1000 delay-500">
                <div className="absolute top-4 right-4 opacity-10">
                  <img
                    src="/placeholder.svg?height=96&width=96&text=Medical+tablet+for+documentation"
                    alt="Medical tablet"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="text-center flex-grow flex flex-col justify-center relative z-10">
                  <div className="w-16 h-16 bg-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Simple 3-Step Process</h3>
                  <div className="space-y-4 text-left max-w-sm mx-auto mb-6">
                    <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-right duration-500 delay-700">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform duration-200">
                        1
                      </div>
                      <span className="text-slate-700">Install Chrome extension</span>
                    </div>
                    <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-right duration-500 delay-900">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform duration-200">
                        2
                      </div>
                      <span className="text-slate-700">Connect to your ePCR system</span>
                    </div>
                    <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-right duration-500 delay-1100">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform duration-200">
                        3
                      </div>
                      <span className="text-slate-700">Start voice documentation</span>
                    </div>
                  </div>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white mt-auto hover:scale-105 transition-all duration-300 hover:shadow-lg"
                    onClick={() => scrollToSection("contact")}
                  >
                    Get Extension Access
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Key Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom duration-1000">
              Why EMS Teams Choose NarrateEMS
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Built specifically for the unique needs of emergency medical services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-slate-200 bg-white hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-left duration-1000 delay-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-teal-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Hands-Free Documentation</h3>
                <p className="text-slate-600 text-sm">
                  Document calls efficiently between calls and after patient handoff
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-slate-200 bg-white hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <WifiOff className="h-8 w-8 text-teal-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Works Offline</h3>
                <p className="text-slate-600 text-sm">
                  Document calls even in areas with poor cell coverage. Syncs when connected.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-slate-200 bg-white hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-teal-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">HIPAA-Compliant</h3>
                <p className="text-slate-600 text-sm">
                  Enterprise-grade security ensures patient data is always protected.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-slate-200 bg-white hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-right duration-1000 delay-900">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-teal-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">ePCR Integration Ready</h3>
                <p className="text-slate-600 text-sm">
                  Export directly to your existing ePCR system with NEMSIS-compliant formatting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:scale-105 transition-transform duration-200 animate-in fade-in slide-in-from-bottom duration-1000">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              Simple Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
              Transparent pricing designed for EMS professionals and departments of all sizes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual Plan */}
            <Card className="relative p-8 border-2 border-slate-200 hover:border-slate-300 transition-all duration-500 hover:shadow-lg hover:scale-105 animate-in fade-in slide-in-from-left duration-1000 delay-600">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Individual</h3>
                  <p className="text-slate-600 mb-6">Perfect for independent contractors and single users</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-slate-900">$15</span>
                    <span className="text-slate-600 ml-2">/month</span>
                  </div>
                  <Button
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg"
                    onClick={() => scrollToSection("contact")}
                  >
                    Get Started
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">Voice-to-text documentation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">Offline functionality</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">ePCR system integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">NEMSIS Version 3 compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">HIPAA-compliant security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">Email support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Plan */}
            <Card className="relative p-8 border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-green-50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-right duration-1000 delay-800">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                  Volume Discount
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Organization</h3>
                  <p className="text-slate-600 mb-6">Same great product with volume pricing for teams of 5+</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-slate-900">$10</span>
                    <span className="text-slate-600 ml-2">/user/month</span>
                  </div>
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl"
                    onClick={() => scrollToSection("contact")}
                  >
                    Contact Sales
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">Voice-to-text documentation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">Offline functionality</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">ePCR system integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">NEMSIS Version 3 compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">HIPAA-compliant security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-pulse" />
                    <span className="text-slate-700">Email support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-slate-50 rounded-2xl p-8 max-w-4xl mx-auto hover:shadow-md transition-shadow duration-500 animate-in fade-in slide-in-from-bottom duration-1000 delay-1000">
              <h3 className="text-xl font-bold text-slate-900 mb-4">All Plans Include</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                  <Shield className="h-4 w-4 text-teal-600 animate-pulse" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="h-4 w-4 text-teal-600 animate-pulse" />
                  <span>No setup fees or contracts</span>
                </div>
                <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                  <Users className="h-4 w-4 text-teal-600 animate-pulse" />
                  <span>Cancel anytime</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-slate-600 text-sm">
                  <strong>Same product, better pricing for teams.</strong> Organization plan requires minimum 5 users.
                  Contact us for enterprise pricing and custom integrations for large departments or regional EMS
                  systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <IntegrationSection />

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Market Opportunity Section */}
      <section id="market" className="py-20 bg-slate-50">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom duration-1000">
              A Market Ready for Innovation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              The EMS industry faces increasing documentation demands and yet most agencies still rely on outdated
              systems.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-8 bg-white border-slate-200 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-left duration-1000 delay-300">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-teal-600 mb-2 animate-pulse">250K+</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">EMS Providers</h3>
                <p className="text-slate-600">
                  Licensed EMS professionals across the United States generating millions of reports annually.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 bg-white border-slate-200 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-teal-600 mb-2 animate-pulse">36M+</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Annual Dispatches</h3>
                <p className="text-slate-600">
                  Emergency calls requiring detailed documentation every year, with growing regulatory demands.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 bg-white border-slate-200 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-right duration-1000 delay-700">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-teal-600 mb-2 animate-pulse">35%</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Using Outdated Systems</h3>
                <p className="text-slate-600">
                  Of agencies still rely on limited-functionality platforms without modern voice capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom duration-1000">
              What EMS Professionals Are Saying
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-slate-50 border-slate-200 relative hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-left duration-1000 delay-300">
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4 italic">
                  "We spend way too much time on redundant data entry. A voice-first solution would be a game-changer
                  for our crews."
                </p>
                <div className="text-sm text-slate-600">— EMS Chief, Municipal Fire Department</div>
              </CardContent>
            </Card>
            <Card className="p-6 bg-slate-50 border-slate-200 relative hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4 italic">
                  "Our current ePCR system wasn't designed for mobile use. Documentation in the ambulance is a
                  nightmare."
                </p>
                <div className="text-sm text-slate-600">— Paramedic Supervisor, Private EMS</div>
              </CardContent>
            </Card>
            <Card className="p-6 bg-slate-50 border-slate-200 relative hover:shadow-lg transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-right duration-1000 delay-700">
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4 italic">
                  "After a cardiac arrest, the last thing I want to do is spend an hour typing. Voice documentation
                  would save our sanity."
                </p>
                <div className="text-sm text-slate-600">— Flight Paramedic, Hospital-Based Service</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-teal-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=400&width=800&text=Emergency+response+team+in+action"
            alt="Emergency Response"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom duration-1000">
              Ready to Transform Your EMS Documentation?
            </h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Join us in revolutionizing EMS documentation and helping first responders save more lives.
            </p>
          </div>
          <Card className="bg-white/95 backdrop-blur-sm p-8 hover:shadow-2xl transition-shadow duration-500 animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="animate-in fade-in slide-in-from-left duration-500 delay-600">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full transition-all duration-300 focus:scale-105"
                      required
                    />
                  </div>
                  <div className="animate-in fade-in slide-in-from-right duration-500 delay-600">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full transition-all duration-300 focus:scale-105"
                      required
                    />
                  </div>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-800">
                  <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                    Company/Organization *
                  </label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full transition-all duration-300 focus:scale-105"
                    required
                  />
                </div>
                <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-1000">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full h-32 transition-all duration-300 focus:scale-105"
                    placeholder="Tell us about your interest in NarrateEMS..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom duration-500 delay-1200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="flex justify-center items-center">
                  <div className="flex items-center space-x-2 text-slate-600 hover:scale-105 transition-transform duration-200">
                    <Mail className="h-5 w-5 animate-pulse" />
                    <span>narrateems@gmail.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12">
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center animate-in fade-in slide-in-from-left duration-1000">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_White-edQRVIFGqJxTAPGBJm2kUfBX3Lctuf.png"
                alt="NarrateEMS Logo"
                className="h-10 sm:h-12 md:h-14 w-auto hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-slate-400 text-sm animate-in fade-in slide-in-from-right duration-1000">
              <a href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-center md:text-right">© 2025 NarrateEMS. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

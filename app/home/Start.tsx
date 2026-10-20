"use client"

import type React from "react"
import { useState } from "react"
import { Mail, ArrowUpRight } from "lucide-react"
import { STORE_URL, CALENDLY_URL, inkBtn } from "./shared"
import { rv, useReveal } from "./Faq"

const field =
  "w-full rounded-field bg-paper-tint border border-ink/30 px-4 py-3 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink"

export function Start() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useReveal<HTMLElement>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("https://formspree.io/f/xblynzkd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert("Thank you. We'll be in touch.")
        setFormData({ name: "", email: "", company: "", message: "" })
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="start" ref={ref} className="navy-tex bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className={`text-[40px] sm:max-w-[14ch] font-semibold leading-[1] tracking-tight text-balance sm:text-[64px] lg:text-[88px] ${rv}`}>
            Go home an hour earlier tonight.
          </h2>
          <p className={`max-w-[34ch] lg:pb-3 text-[22px] leading-[1.4] text-paper ${rv} delay-75`}>
            Narrate your next call on the way back. The chart is ready when you sit down.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex min-h-[148px] flex-col justify-between rounded-card bg-hi-vis p-6 text-hi-vis-ink transition-colors hover:bg-paper focus-hi-vis lg:p-8 ${rv} delay-150`}
          >
            <ArrowUpRight className="h-7 w-7 self-end transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            <span className="text-[22px] font-semibold leading-tight lg:text-[32px]">Install Chrome extension</span>
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex min-h-[148px] flex-col justify-between rounded-card bg-ink-2 p-6 text-paper transition-colors hover:bg-paper hover:text-ink focus-hi-vis lg:p-8 ${rv} delay-200`}
          >
            <ArrowUpRight className="h-7 w-7 self-end transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            <span className="text-[22px] font-semibold leading-tight lg:text-[32px]">Book a squad walkthrough</span>
          </a>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <img
            src="/photos/ambulance-night-blur.jpg"
            alt="An ambulance passing at night, motion-blurred"
            className={`h-full min-h-[280px] w-full rounded-card object-cover lg:col-span-7 ${rv}`}
            loading="lazy"
          />
          <div className={`rounded-card bg-paper p-6 text-ink lg:col-span-5 lg:p-8 ${rv} delay-75`}>
            <h3 className="text-[22px] font-semibold leading-tight">Or send us a note</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {(
                [
                  ["name", "text", "Name"],
                  ["email", "email", "Email"],
                  ["company", "text", "Squad / Department"],
                ] as const
              ).map(([key, type, label]) => (
                <label key={key} className="block text-[17px] font-semibold">
                  {label}
                  <input
                    type={type}
                    name={key}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                    className={`mt-1.5 ${field}`}
                  />
                </label>
              ))}
              <label className="block text-[17px] font-semibold">
                What does your charting workflow look like today?
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={3}
                  className={`mt-1.5 resize-none ${field}`}
                />
              </label>
              <button type="submit" disabled={isSubmitting} className={`${inkBtn} w-full disabled:opacity-60`}>
                {isSubmitting ? "Sending…" : "Send message"}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
            <a href="mailto:narrateems@gmail.com" className="mt-5 inline-flex items-center gap-2 text-[17px] underline underline-offset-4 focus-hi-vis">
              <Mail className="h-4 w-4" />
              narrateems@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

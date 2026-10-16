"use client"

import type React from "react"
import { useState } from "react"
import { Mail, ArrowUpRight } from "lucide-react"
import { STORE_URL, CALENDLY_URL, h2, primaryBtn, inkBtn } from "./shared"

export function Start() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    <>
      {/* FINAL CTA + CONTACT */}
      <section id="start" className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={h2}>Go home an hour earlier tonight.</h2>
            <p className="mt-6 text-[17px] leading-[1.6] text-paper">
              Install the Chrome extension, run your next call, and narrate it on the way back. Your Zoll chart will be
              ready by the time you sit down.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-5">
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
                Install Chrome extension
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[17px] font-semibold text-paper underline underline-offset-4"
              >
                Or book a squad walkthrough
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="mt-16 grid gap-4 lg:grid-cols-2">
            <div className="bg-paper p-6 text-ink lg:p-8">
              <h3 className="text-[22px] font-semibold">Or send us a note</h3>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                {(
                  [
                    ["name", "text", "Name"],
                    ["email", "email", "Email"],
                    ["company", "text", "Squad / Department"],
                  ] as const
                ).map(([key, type, label]) => (
                  <input
                    key={key}
                    type={type}
                    placeholder={label}
                    aria-label={label}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                    className="w-full bg-paper-tint border-b-2 border-ink px-4 py-3 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink"
                  />
                ))}
                <textarea
                  placeholder="What does your charting workflow look like today?"
                  aria-label="What does your charting workflow look like today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full bg-paper-tint border-b-2 border-ink px-4 py-3 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink resize-none"
                />
                <button type="submit" disabled={isSubmitting} className={`${inkBtn} w-full disabled:opacity-60`}>
                  {isSubmitting ? "Sending…" : "Send message"}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
              <a href="mailto:narrateems@gmail.com" className="mt-5 inline-flex items-center gap-2 text-[17px] underline underline-offset-4">
                <Mail className="h-4 w-4" />
                narrateems@gmail.com
              </a>
            </div>
            <img
              src="/photos/jump-bags.jpg"
              alt="A row of navy medical jump bags with reflective stripes on a shelf"
              className="h-full min-h-[280px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  )
}

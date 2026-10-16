import Link from "next/link"
import { cn } from "@/lib/utils"

type WordmarkProps = {
  href?: string
  className?: string
  variant?: "ink" | "paper"
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: { word: "text-xl", chip: "text-[13px] px-1.5 py-[1px]" },
  md: { word: "text-[22px]", chip: "text-[13px] px-1.5 py-[2px]" },
  lg: { word: "text-3xl", chip: "text-[16px] px-2 py-[2px]" },
} as const

export function Wordmark({ href = "/", className, variant = "ink", size = "md" }: WordmarkProps) {
  const isPaper = variant === "paper"
  const s = sizeMap[size]

  const inner = (
    <span
      className={cn("inline-flex items-baseline gap-1.5 tracking-tight leading-none select-none", className)}
      aria-label="NarrateEMS"
    >
      <span className={cn("font-sans font-semibold", s.word, isPaper ? "text-paper" : "text-ink")}>narrate</span>
      <span className={cn("font-sans font-semibold", s.chip, isPaper ? "bg-paper text-ink" : "bg-ink text-paper")}>
        ems
      </span>
    </span>
  )

  if (!href) return inner
  return (
    <Link href={href} className="inline-flex focus-hi-vis">
      {inner}
    </Link>
  )
}

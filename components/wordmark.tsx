import Link from "next/link"
import { cn } from "@/lib/utils"

type WordmarkProps = {
  href?: string
  className?: string
  variant?: "ink" | "paper"
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: { serif: "text-xl", chip: "text-[9px] px-1.5 py-[2px]" },
  md: { serif: "text-2xl", chip: "text-[10px] px-1.5 py-[3px]" },
  lg: { serif: "text-3xl", chip: "text-[11px] px-2 py-[3px]" },
} as const

export function Wordmark({ href = "/", className, variant = "ink", size = "md" }: WordmarkProps) {
  const isPaper = variant === "paper"
  const s = sizeMap[size]

  const inner = (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 tracking-tight leading-none select-none",
        className,
      )}
      aria-label="NarrateEMS"
    >
      <span
        className={cn(
          "font-serif italic",
          s.serif,
          isPaper ? "text-paper" : "text-ink",
        )}
      >
        narrate
      </span>
      <span
        className={cn(
          "font-mono uppercase tracking-[0.18em] font-medium rounded-sm",
          s.chip,
          isPaper
            ? "bg-paper text-ink"
            : "bg-ink text-paper",
        )}
      >
        ems
      </span>
    </span>
  )

  if (!href) return inner
  return (
    <Link href={href} className="inline-flex focus-hi-vis rounded-sm">
      {inner}
    </Link>
  )
}

import Link from "next/link"
import { cn } from "@/lib/utils"

type WordmarkProps = {
  href?: string
  className?: string
  variant?: "ink" | "paper"
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: { serif: "text-xl", chip: "px-1 py-px" },
  md: { serif: "text-2xl", chip: "px-1.5 py-0.5" },
  lg: { serif: "text-3xl", chip: "px-1.5 py-0.5" },
} as const

export function Wordmark({ href = "/", className, variant = "ink", size = "md" }: WordmarkProps) {
  const isPaper = variant === "paper"
  const s = sizeMap[size]

  const inner = (
    <span
      className={cn(
        "inline-flex items-baseline gap-1 font-extrabold tracking-[-0.04em] leading-none select-none",
        s.serif,
        className,
      )}
      aria-label="NarrateEMS"
    >
      <span
        className={cn(
          isPaper ? "text-paper" : "text-ink",
        )}
      >
        narrate
      </span>
      <span
        className={cn(
          "rounded-[4px]",
          s.chip,
          isPaper
            ? "bg-paper text-blue"
            : "bg-blue text-white",
        )}
      >
        ems
      </span>
    </span>
  )

  if (!href) return inner
  return (
    <Link href={href} className="inline-flex focus-hi-vis rounded-[4px]">
      {inner}
    </Link>
  )
}

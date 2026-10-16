import Link from "next/link"
import { Wordmark } from "@/components/wordmark"

export function Footer() {
  return (
    <>
      {/* FOOTER */}
      <footer className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <Wordmark variant="paper" size="md" />
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[17px]">
              <Link href="/privacy-policy" className="hover:underline underline-offset-4">Privacy</Link>
              <Link href="/terms-of-service" className="hover:underline underline-offset-4">Terms</Link>
              <Link href="/sla" className="hover:underline underline-offset-4">SLA</Link>
              <a href="mailto:narrateems@gmail.com" className="hover:underline underline-offset-4">Contact</a>
            </div>
          </div>
          <p className="mt-10 max-w-[60ch] text-[13px] leading-relaxed text-paper">
            Photos: &ldquo;Ambulance at night&rdquo; by JumpV, CC BY 2.0, via Flickr. &ldquo;Fontainebleau ambulance
            soir 2020-11-22 (2)&rdquo; by Baidax, CC BY-SA 4.0, and &ldquo;Bags of medical supplies and defibrillators&rdquo;
            by Hillelfrei, CC BY-SA 4.0 (cropped), both via Wikimedia Commons.
          </p>
          <p className="mt-4 text-[13px] text-paper">© 2026 NarrateEMS</p>
        </div>
      </footer>
    </>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Zap, Database, Shield } from "lucide-react"

export function IntegrationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Seamless Zoll ePCR Integration
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            NarrateEMS integrates directly with Zoll ePCR, the industry-leading platform trusted by thousands of EMS agencies nationwide.
          </p>
        </div>

        {/* Zoll Integration Highlight */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-200">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold text-slate-900">Zoll ePCR</span>
              </div>
              <p className="text-slate-600 text-lg">
                Voice-powered documentation that exports directly into your Zoll ePCR workflow.
                No manual data entry. No copy-paste. Just speak and sync.
              </p>
            </div>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6 border-teal-200 bg-teal-50">
            <CardContent className="pt-6">
              <Zap className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Quick Setup</h4>
              <p className="text-slate-600 text-sm">
                Get started in under an hour with minimal training required for your team.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-teal-200 bg-teal-50">
            <CardContent className="pt-6">
              <Database className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 mb-3">NEMSIS Compliant</h4>
              <p className="text-slate-600 text-sm">
                All exports meet NEMSIS Version 3 standards for seamless data transfer.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-teal-200 bg-teal-50">
            <CardContent className="pt-6">
              <Shield className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Secure Transfer</h4>
              <p className="text-slate-600 text-sm">
                End-to-end encryption ensures patient data remains protected during export.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

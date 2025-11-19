import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Zap, Database, Shield } from "lucide-react"

export function IntegrationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Seamless Integration with Your Existing Systems
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            NarrateEMS works with the ePCR platforms you already use, requiring minimal setup and training.
          </p>
        </div>

        {/* Compatible Systems Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Compatible ePCR Systems</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center justify-center space-x-2 p-4 bg-slate-50 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 font-medium">ESO</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-slate-50 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 font-medium">ImageTrend</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-slate-50 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Zoll</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-slate-50 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Sansio</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-slate-50 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 font-medium">RescueNet</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-slate-50 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Traumasoft</span>
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

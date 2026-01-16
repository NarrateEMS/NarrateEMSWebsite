"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Users, LogOut, Download, ExternalLink, CheckCircle } from "lucide-react"

const CHROME_EXTENSION_URL = "https://chromewebstore.google.com/detail/narrateems/nokdpnigpfafepjbdinggckgcdekdjkm"

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [squadName, setSquadName] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("none")

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          // Not logged in, redirect to home
          router.push("/")
          return
        }

        setUser(session.user)

        // Get squad name from user metadata first
        const metadata = session.user.user_metadata || {}
        if (metadata.squad_name) {
          setSquadName(metadata.squad_name)
        }

        // Try to get subscription info
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("subscription_status, squad_id, squad_names")
          .eq("user_id", session.user.id)
          .single()

        if (subscription) {
          setSubscriptionStatus(subscription.subscription_status)
          if (subscription.squad_names && subscription.squad_names.length > 0) {
            setSquadName(subscription.squad_names[0])
          }
        }

      } catch (err) {
        console.error("Error loading user data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_Blue-gNghgG69Eid0XYluSONpUoMlNuweF6.png"
                alt="NarrateEMS Logo"
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Account</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500">Email</label>
                <p className="text-slate-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Status</label>
                <div className="flex items-center gap-2">
                  {subscriptionStatus === "active" ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">Active</span>
                    </>
                  ) : (
                    <span className="text-slate-600">{subscriptionStatus}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Squad Info Card */}
          {squadName && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  Squad Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-slate-500">Squad</label>
                  <p className="text-slate-900 text-lg font-medium">{squadName}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Download Extension Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-teal-600" />
              Get the Chrome Extension
            </CardTitle>
            <CardDescription>
              Install the NarrateEMS Chrome extension to start using voice-to-text documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.open(CHROME_EXTENSION_URL, "_blank")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Download from Chrome Web Store
            </Button>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:support@narrateems.com" className="text-teal-600 hover:underline">
              support@narrateems.com
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}


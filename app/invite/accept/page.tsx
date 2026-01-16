"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"

type PageState = "loading" | "set-password" | "processing" | "success" | "error"

export default function AcceptInvitePage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [email, setEmail] = useState("")
  const [squadName, setSquadName] = useState("")
  const [squadId, setSquadId] = useState("")
  const [inviteId, setInviteId] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleInviteToken = async () => {
      try {
        // Supabase client will automatically detect and process the tokens from the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setError("Failed to process invite link. Please try again or contact support.")
          setPageState("error")
          return
        }

        if (!session) {
          // No session yet - wait for Supabase to process the hash
          // Listen for auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (event === "SIGNED_IN" && newSession) {
              await processSession(newSession)
              subscription.unsubscribe()
            }
          })
          
          // Give it a moment to process
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            if (retrySession) {
              await processSession(retrySession)
            } else {
              setError("Invalid or expired invite link. Please request a new invitation.")
              setPageState("error")
            }
          }, 2000)
          return
        }

        await processSession(session)
      } catch (err) {
        console.error("Error handling invite:", err)
        setError("An unexpected error occurred. Please try again.")
        setPageState("error")
      }
    }

    const processSession = async (session: any) => {
      const user = session.user
      setEmail(user.email || "")
      
      // Get squad info from user metadata (set during invite)
      const metadata = user.user_metadata || {}
      setSquadName(metadata.squad_name || "Your Squad")
      setSquadId(metadata.squad_id || "")
      setInviteId(metadata.invite_id || "")
      
      setPageState("set-password")
    }

    handleInviteToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setPageState("processing")

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error("Password update error:", updateError)
        setError("Failed to set password: " + updateError.message)
        setPageState("set-password")
        return
      }

      // Call edge function to accept the invite and create user_subscription
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/accept-squad-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            user_id: session?.user?.id,
            squad_id: squadId,
            invite_id: inviteId,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        console.error("Accept invite error:", result)
        // Don't fail completely - password is set, they can still proceed
        console.warn("Note: Invite acceptance had an issue, but password was set successfully")
      }

      setPageState("success")
      
      // Redirect to account page after a short delay
      setTimeout(() => {
        router.push("/account")
      }, 2000)

    } catch (err) {
      console.error("Error during submission:", err)
      setError("An unexpected error occurred. Please try again.")
      setPageState("set-password")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_Blue-gNghgG69Eid0XYluSONpUoMlNuweF6.png"
              alt="NarrateEMS Logo"
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {pageState === "loading" && "Processing Invitation..."}
            {pageState === "set-password" && "Set Your Password"}
            {pageState === "processing" && "Setting Up Your Account..."}
            {pageState === "success" && "Welcome to NarrateEMS!"}
            {pageState === "error" && "Something Went Wrong"}
          </CardTitle>
          <CardDescription>
            {pageState === "loading" && "Please wait while we verify your invitation"}
            {pageState === "set-password" && `You're joining ${squadName}`}
            {pageState === "processing" && "Just a moment..."}
            {pageState === "success" && "Your account is ready"}
            {pageState === "error" && error}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {pageState === "loading" && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          )}

          {/* Set Password Form */}
          {pageState === "set-password" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                Create Account
              </Button>
            </form>
          )}

          {/* Processing State */}
          {pageState === "processing" && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          )}

          {/* Success State */}
          {pageState === "success" && (
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <p className="text-slate-600">Redirecting you to your account...</p>
            </div>
          )}

          {/* Error State */}
          {pageState === "error" && (
            <div className="text-center py-4">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="mt-4"
              >
                Return to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"

type PageState = "loading" | "set-password" | "confirm-join" | "processing" | "success" | "error"

export default function AcceptInvitePage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [email, setEmail] = useState("")
  const [squadName, setSquadName] = useState("")
  const [squadId, setSquadId] = useState("")
  const [inviteId, setInviteId] = useState("")
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const processedRef = useRef(false)

  useEffect(() => {
    const handleInviteToken = async () => {
      try {
        // First check if there's already a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setError("Failed to process invite link. Please try again or contact support.")
          setPageState("error")
          return
        }

        if (session) {
          await processSession(session)
          return
        }

        // No session yet — listen for auth state change from URL hash processing
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && newSession && !processedRef.current) {
            processedRef.current = true
            subscription.unsubscribe()
            await processSession(newSession)
          }
        })

        // Poll for session with retries instead of a single timeout
        // Supabase may take variable time to process the hash tokens
        let attempts = 0
        const maxAttempts = 10
        const pollInterval = setInterval(async () => {
          attempts++
          if (processedRef.current) {
            clearInterval(pollInterval)
            return
          }

          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            clearInterval(pollInterval)
            if (!processedRef.current) {
              processedRef.current = true
              subscription.unsubscribe()
              await processSession(retrySession)
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval)
            if (!processedRef.current) {
              subscription.unsubscribe()
              setError("Invalid or expired invite link. Please request a new invitation.")
              setPageState("error")
            }
          }
        }, 1000)

        // Cleanup on unmount
        return () => {
          clearInterval(pollInterval)
          subscription.unsubscribe()
        }
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

      // Check if this is an existing user who already has a password
      // Existing users: created_at is significantly before the invite (they registered first)
      // New invited users: created_at is very recent (just created by inviteUserByEmail)
      // We check if the user has identities with a provider — existing users have "email" provider
      // with a confirmed identity, while invite-created users may not
      const hasExistingPassword = user.identities?.some(
        (identity: any) => identity.provider === "email" && identity.identity_data?.email_verified === true
      )

      if (hasExistingPassword) {
        // Existing user — skip password form, just confirm joining the squad
        setIsExistingUser(true)
        setPageState("confirm-join")
      } else {
        // New user created by invite — needs to set password
        setIsExistingUser(false)
        setPageState("set-password")
      }
    }

    handleInviteToken()
  }, [])

  // Accept the invite (call edge function)
  const acceptInvite = async () => {
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
      // Don't fail completely — log the issue but still show success
      console.warn("Note: Invite acceptance had an issue, but user setup may still work")
    }

    return result
  }

  // Handle new user: set password + accept invite
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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
      // Set the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error("Password update error:", updateError)
        setError("Failed to set password: " + updateError.message)
        setPageState("set-password")
        return
      }

      // Accept the invite
      await acceptInvite()

      setPageState("success")
      setTimeout(() => {
        router.push("/account")
      }, 2000)

    } catch (err) {
      console.error("Error during submission:", err)
      setError("An unexpected error occurred. Please try again.")
      setPageState("set-password")
    }
  }

  // Handle existing user: just accept invite (no password change needed)
  const handleJoinSquad = async () => {
    setPageState("processing")

    try {
      await acceptInvite()

      setPageState("success")
      setTimeout(() => {
        router.push("/account")
      }, 2000)

    } catch (err) {
      console.error("Error joining squad:", err)
      setError("An unexpected error occurred. Please try again.")
      setPageState("confirm-join")
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
            {pageState === "confirm-join" && "Join Squad"}
            {pageState === "processing" && "Setting Up Your Account..."}
            {pageState === "success" && "Welcome to NarrateEMS!"}
            {pageState === "error" && "Something Went Wrong"}
          </CardTitle>
          <CardDescription>
            {pageState === "loading" && "Please wait while we verify your invitation"}
            {pageState === "set-password" && `You're joining ${squadName}`}
            {pageState === "confirm-join" && `You've been invited to join ${squadName}`}
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

          {/* Set Password Form (new users) */}
          {pageState === "set-password" && (
            <form onSubmit={handleSetPassword} className="space-y-4">
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
                Create Account & Join Squad
              </Button>
            </form>
          )}

          {/* Confirm Join (existing users) */}
          {pageState === "confirm-join" && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
                <p className="text-slate-700">
                  Signed in as <span className="font-medium">{email}</span>
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <Button
                onClick={handleJoinSquad}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                Join {squadName}
              </Button>
            </div>
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
              <p className="text-slate-600">
                {isExistingUser
                  ? "You've joined the squad! You can now use NarrateEMS with your existing login."
                  : "Your account is ready! Open the NarrateEMS Chrome extension and log in with your new password."
                }
              </p>
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

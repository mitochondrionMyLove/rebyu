import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AlertCircle, Loader2, UserPlus } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { registerAccount, toSafeAuthMessage } from "@/services/authService.js"
import AuthShell from "./auth-shell.jsx"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const setField = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setPending(true)
    try {
      await registerAccount({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      })
      toast.success("Account created. Check your email for a verification code.")
      navigate("/verify-email", { state: { email: form.email.trim() } })
    } catch (err) {
      setError(
        toSafeAuthMessage(
          err,
          "Unable to create your account. Please check your details and try again."
        )
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      description="Start reviewing for your certification with REBYU."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="register-first">First name</Label>
            <Input
              id="register-first"
              autoComplete="given-name"
              required
              value={form.firstName}
              onChange={setField("firstName")}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-last">Last name</Label>
            <Input
              id="register-last"
              autoComplete="family-name"
              required
              value={form.lastName}
              onChange={setField("lastName")}
              className="h-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={setField("email")}
            placeholder="you@example.com"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={setField("password")}
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">
            At least 8 characters, with upper and lower case letters and a
            number.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-confirm">Confirm password</Label>
          <Input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={setField("confirmPassword")}
            className="h-10"
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" className="h-10 w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              Create account
            </>
          )}
        </Button>

        <Separator />
      </form>
    </AuthShell>
  )
}

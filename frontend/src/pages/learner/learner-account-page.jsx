import React, { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useOutletContext } from "react-router-dom"
import { toast } from "sonner"
import { Mail, Shield, UserRound } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LearnerPageHeader } from "@/components/learner/learner-ui.jsx"
import { updateLearner, updateUser } from "@/services/learnerService.js"

function initials(name) {
  return String(name || "Learner")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export default function LearnerAccountPage() {
  const { data } = useOutletContext()
  const queryClient = useQueryClient()
  const learner = data.learner
  const user = data.user
  const fullName = [learner?.firstName, learner?.lastName].filter(Boolean).join(" ") || learner?.username || "Learner"

  const [form, setForm] = useState({
    firstName: learner?.firstName ?? "",
    lastName: learner?.lastName ?? "",
    username: learner?.username ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  })

  useEffect(() => {
    setForm({
      firstName: learner?.firstName ?? "",
      lastName: learner?.lastName ?? "",
      username: learner?.username ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    })
  }, [learner, user])

  const canSave = Boolean(learner?.learnerId && user?.userId)

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!canSave) {
        throw new Error("Your learner profile could not be resolved from local authentication data.")
      }

      await updateUser(user.userId, {
        ...user,
        email: form.email,
        phoneNumber: form.phoneNumber,
      })

      await updateLearner(learner.learnerId, {
        ...learner,
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
      })
    },
    onSuccess: async () => {
      toast.success("Profile updated")
      await queryClient.invalidateQueries({ queryKey: ["learner-portal-data"] })
    },
    onError: (error) => {
      toast.error("Could not update profile", {
        description: error?.response?.data?.message || error?.message || "Please try again.",
      })
    },
  })

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  return (
    <div className="space-y-7">
      <LearnerPageHeader
        title="Account"
        subtitle="Manage learner profile information connected to your REBYU account."
      />

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-zinc-950 text-xl text-white">
              {initials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950">{fullName}</h1>
            <p className="mt-1 text-sm text-zinc-500">{user?.email || data.identity?.email || "No email available"}</p>
            <span className="mt-3 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              Learner
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            saveMutation.mutate()
          }}
        >
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-zinc-500" />
            <h2 className="font-semibold text-zinc-950">Profile Information</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">First name</span>
              <input
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                disabled={!canSave}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">Last name</span>
              <input
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                disabled={!canSave}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">Username</span>
              <input
                value={form.username}
                onChange={(event) => updateField("username", event.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                disabled={!canSave}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                disabled={!canSave}
                required
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-zinc-700">Phone number</span>
              <input
                value={form.phoneNumber}
                onChange={(event) => updateField("phoneNumber", event.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                disabled={!canSave}
              />
            </label>
          </div>

          {!canSave && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
              Profile editing is disabled because the current session does not include a resolvable learner and user id.
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <Button disabled={!canSave || saveMutation.isPending} type="submit">
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        <div className="space-y-5">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950">Account Security</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Password changes are not shown because the current backend does not expose a password update endpoint.
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-zinc-500" />
              <h2 className="font-semibold text-zinc-950">Learning Preferences</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Learning preferences will be editable when learner preference fields are available from the backend.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}

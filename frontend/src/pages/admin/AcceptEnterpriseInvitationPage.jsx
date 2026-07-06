import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import {
    CheckCircle2,
    CircleAlert,
    Loader2,
    Mail,
    ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { base } from "@/services/base"

const ACCEPT_INVITATION_ENDPOINT = "learners/accept-invitation"
const LEARNER_LEARNING_ROUTE = "/learner/learning"

function getErrorStatus(error) {
    return error?.response?.status ?? error?.status
}

function getErrorMessage(error) {
    const status = getErrorStatus(error)

    if (status === 401 || status === 403) {
        return "Please sign in using the email address that received this invitation."
    }

    return (
        error?.response?.data?.message ??
        error?.data?.message ??
        error?.message ??
        "This invitation is invalid, expired, cancelled, or has already been used."
    )
}

function getResponsePayload(result) {
    return result?.data ?? result ?? {}
}

function ensureSuccessfulResponse(result) {
    const status = result?.status

    /*
     * Supports Axios-style responses:
     * { status: 200, data: {...} }
     *
     * Also supports custom base() functions that return only data.
     */
    if (
        typeof status === "number" &&
        (status < 200 || status >= 300)
    ) {
        const payload = getResponsePayload(result)

        throw new Error(
            payload?.message ??
            "Could not accept this invitation."
        )
    }

    return getResponsePayload(result)
}

export default function AcceptEnterpriseInvitationPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()

    const token = String(searchParams.get("token") ?? "").trim()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [accepted, setAccepted] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [certificationTitle, setCertificationTitle] = useState("")

    const hasValidToken = Boolean(token)

    async function handleAcceptInvitation() {
        if (!hasValidToken || isSubmitting) {
            return
        }

        setIsSubmitting(true)
        setErrorMessage("")

        try {
            const result = await base(ACCEPT_INVITATION_ENDPOINT, {
                method: "POST",
                data: {
                    token,
                },
            })

            const payload = ensureSuccessfulResponse(result)

            /*
             * Optional: these values appear only when your backend returns them.
             *
             * Example backend response:
             * {
             *   "message": "Invitation accepted successfully.",
             *   "certificationTitle": "TOPCIT Review"
             * }
             */
            setCertificationTitle(
                payload?.certificationTitle ??
                payload?.certification?.title ??
                ""
            )

            /*
             * Remove the token from the browser URL after successful acceptance.
             * This prevents the learner from accidentally copying or reopening it.
             */
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            )

            /*
             * Refresh learner data so the newly enrolled certification
             * appears immediately in My Learning.
             */
            await queryClient.invalidateQueries({
                queryKey: ["learner-portal-data"],
            })

            setAccepted(true)

            toast.success("Invitation accepted", {
                description: "Your certification access is now available.",
            })
        } catch (error) {
            setErrorMessage(getErrorMessage(error))
        } finally {
            setIsSubmitting(false)
        }
    }

    function goToLearning() {
        navigate(LEARNER_LEARNING_ROUTE, {
            replace: true,
        })
    }

    if (!hasValidToken) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-10">
                <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-sm">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50">
                        <CircleAlert className="size-6 text-red-600" />
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-zinc-950">
                        Invalid invitation link
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        This invitation link does not contain a valid token. Please use the
                        complete invitation link sent to your email.
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-6"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        Go to Home
                    </Button>
                </section>
            </main>
        )
    }

    if (accepted) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-10">
                <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-sm">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="size-6 text-primary" />
                    </div>

                    <p className="mt-5 text-sm font-semibold text-primary">
                        Invitation Accepted
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
                        You are now enrolled
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                        {certificationTitle
                            ? `You now have access to ${certificationTitle}. Start learning whenever you are ready.`
                            : "Your certification access has been added to your REBYU account. Start learning whenever you are ready."}
                    </p>

                    <Button
                        type="button"
                        className="mt-7 w-full"
                        onClick={goToLearning}
                    >
                        Open My Learning
                    </Button>
                </section>
            </main>
        )
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-10">
            <section className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 bg-primary/5 px-7 py-8 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="size-6 text-primary" />
                    </div>

                    <p className="mt-5 text-sm font-semibold text-primary">
                        REBYU Enterprise Invitation
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
                        You have been invited
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                        Accept this invitation to receive certification access from your
                        organization.
                    </p>
                </div>

                <div className="p-7">
                    <div className="flex gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

                        <div>
                            <p className="text-sm font-semibold text-zinc-900">
                                Before you continue
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Make sure you are signed in using the same email address where
                                this invitation was sent. An invitation can only be accepted
                                once.
                            </p>
                        </div>
                    </div>

                    {errorMessage ? (
                        <div
                            role="alert"
                            className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                        >
                            <CircleAlert className="mt-0.5 size-5 shrink-0 text-red-600" />

                            <p className="text-sm leading-6 text-red-700">
                                {errorMessage}
                            </p>
                        </div>
                    ) : null}

                    <Button
                        type="button"
                        className="mt-6 w-full"
                        onClick={handleAcceptInvitation}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Accepting Invitation...
                            </>
                        ) : (
                            "Accept Invitation"
                        )}
                    </Button>

                    <p className="mt-4 text-center text-xs leading-5 text-zinc-400">
                        Do not accept this invitation if it was not intended for you.
                    </p>
                </div>
            </section>
        </main>
    )
}
import { GraduationCap } from "lucide-react"
import { Link } from "react-router-dom"

import heroStudy from "@/assets/hero-study.webp"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AuthShell({ title, description, children, footer, split = false }) {
  if (split) {
    return (
      <div className="grid min-h-dvh bg-background lg:grid-cols-2">
        <div className="flex flex-col gap-6 p-6 md:p-10">
          <Link to="/" className="flex w-fit items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="size-4" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight">REBYU</span>
          </Link>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-md">
              <div className="mb-7 space-y-2 text-center">
                <h1 className="text-3xl font-bold">{title}</h1>
                {description ? (
                  <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                ) : null}
              </div>
              {children}
              {footer ? (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  {footer}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-muted lg:block">
          <img
            src={heroStudy}
            alt="Learner preparing for a certification with REBYU"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07162D]/80 via-[#07162D]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">
              Structured certification preparation
            </p>
            <p className="mt-3 max-w-xl font-heading text-3xl font-bold leading-tight text-white">
              Diagnose weak topics, follow a focused study plan, and track your readiness.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-4" aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            REBYU
          </span>
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer ? (
            <CardFooter className="justify-center border-t px-6 py-4 text-sm text-muted-foreground">
              {footer}
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </div>
  )
}

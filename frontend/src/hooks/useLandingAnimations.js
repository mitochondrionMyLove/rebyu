import { useLayoutEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function animateDashboardNumbers(scope) {
    const numbers = scope.querySelectorAll(".dashboard-number")

    numbers.forEach((node) => {
        const target = Number(node.dataset.value ?? 0)
        const suffix = node.dataset.suffix ?? ""
        const counter = { value: 0 }

        gsap.to(counter, {
            value: target,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
                node.textContent = `${Math.round(counter.value)}${suffix}`
            },
        })
    })
}

export function useLandingAnimations(scopeRef) {
    useLayoutEffect(() => {
        const scope = scopeRef.current

        if (!scope) {
            return undefined
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches

        const context = gsap.context(() => {
            if (prefersReducedMotion) {
                gsap.set(
                    [
                        ".dashboard-shell",
                        ".dashboard-detail",
                        ".dashboard-float",
                        ".falling-visual-shell",
                        ".falling-eyebrow",
                        ".falling-heading",
                        ".falling-description",
                        ".falling-pill",
                    ],
                    { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }
                )

                gsap.set(".dashboard-chart-bar", { scaleY: 1 })
                gsap.utils.toArray(".dashboard-number").forEach((node) => {
                    const suffix = node.dataset.suffix ?? ""
                    node.textContent = `${node.dataset.value ?? 0}${suffix}`
                })

                return
            }

            const isMobile = window.matchMedia("(max-width: 767px)").matches

            // Hero decorative parallax.
            gsap.to(".hero-orb-one", {
                yPercent: -20,
                xPercent: 6,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.7,
                    invalidateOnRefresh: true,
                },
            })

            gsap.to(".hero-orb-two", {
                yPercent: 16,
                xPercent: -5,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.9,
                    invalidateOnRefresh: true,
                },
            })

            // Dashboard wake-up.
            gsap.set(".dashboard-shell", {
                autoAlpha: 0.56,
                y: 58,
                scale: 0.95,
                rotateX: 7,
                transformPerspective: 1200,
                transformOrigin: "center bottom",
            })
            gsap.set(".dashboard-detail", { autoAlpha: 0.32, y: 14 })
            gsap.set(".dashboard-chart-bar", {
                scaleY: 0.16,
                transformOrigin: "bottom center",
            })
            gsap.set(".dashboard-float", { autoAlpha: 0, y: 18, scale: 0.9 })
            gsap.utils.toArray(".dashboard-number").forEach((node) => {
                const suffix = node.dataset.suffix ?? ""
                node.textContent = `0${suffix}`
            })

            const dashboardTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".dashboard-trigger",
                    start: "top 88%",
                    end: "top 38%",
                    scrub: 0.72,
                    invalidateOnRefresh: true,
                },
            })

            dashboardTimeline
                .to(
                    ".dashboard-shell",
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        duration: 1,
                        ease: "power3.out",
                    },
                    0
                )
                .to(
                    ".dashboard-detail",
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.66,
                        stagger: 0.065,
                        ease: "power2.out",
                    },
                    0.2
                )
                .to(
                    ".dashboard-chart-bar",
                    {
                        scaleY: 1,
                        duration: 0.7,
                        stagger: 0.055,
                        ease: "power3.out",
                    },
                    0.42
                )
                .to(
                    ".dashboard-float",
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.55,
                        stagger: 0.1,
                        ease: "back.out(1.25)",
                    },
                    0.56
                )

            let counted = false
            ScrollTrigger.create({
                trigger: ".dashboard-trigger",
                start: "top 68%",
                once: true,
                onEnter: () => {
                    if (!counted) {
                        counted = true
                        animateDashboardNumbers(scope)
                    }
                },
            })

            // Falling How It Works rows.
            const fallingSections = gsap.utils.toArray(".falling-section")

            fallingSections.forEach((section, index) => {
                const visual = section.querySelector(".falling-visual-shell")
                const textItems = section.querySelectorAll(
                    ".falling-eyebrow, .falling-heading, .falling-description, .falling-pill"
                )
                const direction = index % 2 === 0 ? -1 : 1
                const visualX = isMobile ? 0 : direction * 30
                const visualRotation = isMobile ? 0 : direction * 4
                const visualY = isMobile ? -56 : -126

                gsap.set(visual, {
                    autoAlpha: 0,
                    x: visualX,
                    y: visualY,
                    rotate: visualRotation,
                    scale: 0.94,
                    filter: "blur(8px)",
                    transformOrigin: "center center",
                })
                gsap.set(textItems, { autoAlpha: 0, y: 22 })

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top 78%",
                        end: "top 35%",
                        scrub: 0.55,
                        invalidateOnRefresh: true,
                    },
                })

                timeline
                    .to(
                        visual,
                        {
                            autoAlpha: 1,
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            filter: "blur(0px)",
                            duration: 0.78,
                            ease: "power3.out",
                        },
                        0
                    )
                    .to(
                        textItems,
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.48,
                            stagger: 0.09,
                            ease: "power2.out",
                        },
                        0.28
                    )
            })

            requestAnimationFrame(() => ScrollTrigger.refresh())
        }, scope)

        return () => context.revert()
    }, [scopeRef])
}

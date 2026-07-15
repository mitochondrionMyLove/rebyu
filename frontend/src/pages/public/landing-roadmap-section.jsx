import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    BookOpen,
    CheckCircle2,
    Clock3,
    Target,
    TrendingUp,
} from "lucide-react";

import communityStudy from "../../assets/community-study.webp";
import heroStudy from "../../assets/hero-study.webp";
import mockExam from "../../assets/mock-exam.webp";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const STAGES = [
    {
        id: "diagnostic",
        number: "01",
        title: "Diagnostic assessment",
        description:
            "Begin with a clear baseline. REBYU identifies the lessons and topics that need the most attention.",
        icon: Target,
        image: mockExam,
        photographer: "Andy Barbour",
        source:
            "https://www.pexels.com/photo/a-high-angle-shot-of-students-taking-exam-inside-the-classroom-6683580/",
        previewTitle: "Diagnostic completed",
        previewText: "Software Engineering is your first priority topic.",
        detail: "42% baseline score",
    },
    {
        id: "plan",
        number: "02",
        title: "Personalized study plan",
        description:
            "Your weak topics become an ordered daily plan with focused lessons, review sessions, and assessment milestones.",
        icon: BookOpen,
        image: heroStudy,
        photographer: "George Milton",
        source:
            "https://www.pexels.com/photo/student-working-with-laptop-and-writing-notes-in-planner-7034444/",
        previewTitle: "Today’s study plan",
        previewText: "Review SDLC models, then complete a 15-item lesson quiz.",
        detail: "3 focused tasks",
    },
    {
        id: "lessons",
        number: "03",
        title: "Structured lessons",
        description:
            "Move through certification, major category, middle category, and lesson content without losing your place.",
        icon: CheckCircle2,
        image: heroStudy,
        photographer: "George Milton",
        source:
            "https://www.pexels.com/photo/student-working-with-laptop-and-writing-notes-in-planner-7034444/",
        previewTitle: "Software Development",
        previewText: "Lesson 4 of 8 · Development methodologies",
        detail: "67% category mastery",
    },
    {
        id: "mock",
        number: "04",
        title: "Mock examinations",
        description:
            "Practice with timed assessments after lesson quizzes and middle exams prepare you for the complete examination.",
        icon: Clock3,
        image: mockExam,
        photographer: "Andy Barbour",
        source:
            "https://www.pexels.com/photo/a-high-angle-shot-of-students-taking-exam-inside-the-classroom-6683580/",
        previewTitle: "Mock exam ready",
        previewText: "100 questions · 120 minutes · Attempt 1",
        detail: "Timed simulation",
    },
    {
        id: "readiness",
        number: "05",
        title: "Exam readiness",
        description:
            "Readiness, mastery, and recent performance show whether to continue, review, or schedule another mock exam.",
        icon: TrendingUp,
        image: communityStudy,
        photographer: "Yan Krukau",
        source:
            "https://www.pexels.com/photo/college-students-studying-inside-a-classroom-8199165/",
        previewTitle: "Readiness improved",
        previewText: "Your strongest gain is in Software Development.",
        detail: "82% ready",
    },
];

function PaperAirplane({ planeRef }) {
    return (
        <g
            ref={planeRef}
            aria-hidden="true"
            style={{ transformOrigin: "center" }}
        >
            <defs>
                <filter id="paperPlaneShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0B1F3A" floodOpacity="0.25" />
                </filter>
                <linearGradient id="wingTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E8EFFF" />
                </linearGradient>
                <linearGradient id="wingBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DCE6FF" />
                    <stop offset="100%" stopColor="#AFC4FF" />
                </linearGradient>
            </defs>

            {/* Scale down to fit the path nicely */}
            <g filter="url(#paperPlaneShadow)" transform="scale(0.55)">
                {/* Right wing (Bottom in this orientation) */}
                <path
                    d="M 35 0 L -25 25 L -10 0 Z"
                    fill="url(#wingBottom)"
                    stroke="#275DF5"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />

                {/* Right inner fold */}
                <path
                    d="M 35 0 L -15 5 L -10 0 Z"
                    fill="#8EAAFF"
                    stroke="#275DF5"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />

                {/* Left wing (Top in this orientation) */}
                <path
                    d="M 35 0 L -25 -25 L -10 0 Z"
                    fill="url(#wingTop)"
                    stroke="#275DF5"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />

                {/* Left inner fold */}
                <path
                    d="M 35 0 L -15 -5 L -10 0 Z"
                    fill="#C0D3FF"
                    stroke="#275DF5"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </g>
        </g>
    );
}

function StagePreview({ stage }) {
    return (
        <div className="overflow-hidden rounded-[1.5rem] border border-[#DDE5F0] bg-white shadow-[0_28px_70px_rgba(11,31,58,0.12)]">
            <figure className="relative h-[220px] overflow-hidden sm:h-[300px] lg:h-[340px]">
                <img
                    src={stage.image}
                    alt={`Learners preparing during the ${stage.title.toLowerCase()} stage`}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06152B]/80 via-[#06152B]/10 to-transparent" />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-[#071A34]/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                    <span>{stage.number}</span>
                    <span className="h-3 w-px bg-white/35" />
                    <span>{stage.title}</span>
                </div>

                <figcaption className="absolute bottom-4 left-5 text-[10px] text-white/75">
                    Photo by{" "}
                    <a
                        href={stage.source}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-white underline-offset-2 hover:underline"
                    >
                        {stage.photographer}
                    </a>
                </figcaption>
            </figure>

            <div className="relative bg-white p-5 sm:p-7">
                <div className="absolute -top-10 right-5 flex min-h-[70px] w-[92px] items-center justify-center rounded-2xl border border-white/70 bg-[#275DF5] px-3 text-center text-white shadow-[0_14px_32px_rgba(39,93,245,0.28)]">
                    <span className="text-xs font-bold leading-4">{stage.detail}</span>
                </div>

                <div className="pr-24">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5670A2]">
                        Current REBYU step
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-[#0B1F3A] sm:text-2xl">
                        {stage.previewTitle}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-[#64758E]">
                        {stage.previewText}
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#E7EDF5] pt-5 text-center">
                    <div>
                        <p className="text-sm font-bold text-[#0B1F3A]">14</p>
                        <p className="mt-1 text-[10px] text-[#738198]">Lessons</p>
                    </div>
                    <div className="border-x border-[#E7EDF5]">
                        <p className="text-sm font-bold text-[#0B1F3A]">78%</p>
                        <p className="mt-1 text-[10px] text-[#738198]">Accuracy</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#0B1F3A]">4 days</p>
                        <p className="mt-1 text-[10px] text-[#738198]">Streak</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RoadmapSection() {
    const containerRef = useRef(null);
    const routeRef = useRef(null);
    const progressRef = useRef(null);
    const planeRef = useRef(null);
    const slideRefs = useRef([]);

    useLayoutEffect(() => {
        const root = containerRef.current;
        if (!root) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const ctx = gsap.context(() => {
            const route = routeRef.current;
            const progress = progressRef.current;
            const plane = planeRef.current;

            if (reducedMotion) {
                gsap.set(plane, { opacity: 0 });
                return;
            }

            // Setup SVG path lengths
            const routeLength = route.getTotalLength();
            gsap.set(progress, {
                strokeDasharray: routeLength,
                strokeDashoffset: routeLength,
            });

            // Set transform origin for the plane
            gsap.set(plane, {
                transformOrigin: "50% 50%",
                transformBox: "fill-box",
            });

            // Master timeline tied naturally to the scroll height
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: "top 25%",
                    end: "bottom 85%",
                    scrub: 1,
                },
            });

            // Draw progress line
            tl.to(progress, {
                strokeDashoffset: 0,
                ease: "none",
            }, 0);

            // Fly plane
            tl.to(plane, {
                motionPath: {
                    path: route,
                    align: route,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: true,
                },
                ease: "none",
            }, 0);

            // Animate each stage into view as it is reached
            slideRefs.current.forEach((slide) => {
                if (!slide) return;
                gsap.fromTo(
                    slide.querySelector(".slide-content"),
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: slide,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="how-it-works"
            ref={containerRef}
            className="relative w-full overflow-hidden bg-[#F4F7FC] py-16 sm:py-32"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

                {/* Header */}
                <div className="mb-12 text-center sm:mb-20">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#275DF5]">
                        How REBYU works
                    </p>
                    <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-[-0.04em] text-[#0B1F3A] sm:text-4xl">
                        One connected route from diagnosis to readiness.
                    </h2>
                </div>

                <div className="relative">
                    {/* Wavy Vertical SVG Track - overflow-visible prevents the airplane from clipping */}
                    <svg
                        className="pointer-events-none absolute bottom-0 left-2 top-0 z-0 hidden h-full w-20 overflow-visible md:block md:left-8 lg:left-12 lg:w-28"
                        viewBox="0 0 120 1000"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            ref={routeRef}
                            d="M 58 20 C 58 125, 96 142, 96 210 C 96 292, 23 320, 23 405 C 23 488, 96 520, 96 606 C 96 690, 25 720, 25 806 C 25 884, 62 920, 62 980"
                            fill="none"
                            stroke="#CBD6E4"
                            strokeWidth="3"
                            strokeDasharray="8 11"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                        <path
                            ref={progressRef}
                            d="M 58 20 C 58 125, 96 142, 96 210 C 96 292, 23 320, 23 405 C 23 488, 96 520, 96 606 C 96 690, 25 720, 25 806 C 25 884, 62 920, 62 980"
                            fill="none"
                            stroke="#275DF5"
                            strokeWidth="4"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                        <PaperAirplane planeRef={planeRef} />
                    </svg>

                    {/* Vertical Stages List */}
                    <div className="relative z-10 flex flex-col gap-16 py-0 md:gap-32 md:py-10">
                        {STAGES.map((stage, index) => {
                            const Icon = stage.icon;

                            return (
                                <div
                                    key={stage.id}
                                    ref={(el) => (slideRefs.current[index] = el)}
                                    className="pl-0 md:pl-32 lg:pl-48"
                                >
                                    <div className="slide-content grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr]">

                                        {/* Left Side: Text */}
                                        <div>
                                            <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#275DF5] text-white shadow-[0_12px_28px_rgba(39,93,245,0.3)]">
                                                <Icon className="size-[20px]" aria-hidden="true" />
                                            </span>
                                            <h3 className="text-[1.7rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-4xl">
                                                <span className="mr-3 text-[#275DF5]/40">{stage.number}.</span>
                                                {stage.title}
                                            </h3>
                                            <p className="mt-5 max-w-md text-base leading-relaxed text-[#64758E]">
                                                {stage.description}
                                            </p>
                                        </div>

                                        {/* Right Side: Mockup Preview */}
                                        <div className="w-full">
                                            <StagePreview stage={stage} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

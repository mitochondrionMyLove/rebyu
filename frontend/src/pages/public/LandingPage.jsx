import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  ChevronDown,
  FileQuestion,
  GraduationCap,
  Menu,
  MessageCircle,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  X

} from "lucide-react";

import { Button } from "@/components/ui/button";
import communityStudy from "../../assets/community-study.webp";
import heroStudy from "../../assets/hero-study.webp";
import mockExam from "../../assets/mock-exam.webp";
import institutionLab from "../../assets/institution-lab.webp";
import { FeatureBento } from "./landing-feature-bento.jsx";
import { RoadmapSection } from "./landing-roadmap-section.jsx";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Certifications", href: "#certifications" },
  { label: "Features", href: "#features" },
  { label: "Team", href: "#team" },
  { label: "Get Access", href: "#get-access" },
];

const CERTIFICATIONS = [
  {
    title: "TOPCIT",
    type: "Certification review",
    description:
        "Prepare across software development, databases, networking, and information systems.",
    image: heroStudy,
  },
  {
    title: "IT Passport",
    type: "Certification review",
    description:
        "Build a practical foundation in strategy, management, and technology topics.",
    image: communityStudy,
  },
  {
    title: "Private Reviewer",
    type: "Private review space",
    description:
        "Organize your own study materials into a private lesson and assessment space.",
    image: mockExam,
  },
];

const LEARNER_POINTS = [
  "Browse certifications and study lesson content",
  "Unlock analytics, weakness reports, and study plans",
  "Practice with mock exams and learner challenges",
  "Join certification discussions and study circles",
];

const ENTERPRISE_POINTS = [
  "Request a partnership and select certifications",
  "Configure learner slots and invite participants",
  "Assign certification access and track participation",
  "Receive consolidated institutional invoices",
];

const TEAM_MEMBERS = [
  {
    name: "Glyzel Galagar",
    role: "Founder & Backend Lead",
    description: "Product direction, Spring Boot services, platform architecture, and AI integration.",
    image: heroStudy,
    position: "object-[48%_38%]",
  },
  {
    name: "Frontend Team",
    role: "Frontend Development",
    description: "Learner interfaces, responsive experiences, assessments, and product interactions.",
    image: communityStudy,
    position: "object-[46%_36%]",
  },
  {
    name: "Design Team",
    role: "UI/UX & Visual Design",
    description: "Research, interface systems, brand direction, and accessible learning experiences.",
    image: institutionLab,
    position: "object-[54%_34%]",
  },
  {
    name: "Academic Team",
    role: "Content & Assessment",
    description: "Curriculum structure, reviewer quality, question design, and certification alignment.",
    image: mockExam,
    position: "object-[52%_30%]",
  },
];

function BrandMark({ compact = false }) {
  return (
      <span className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <span
          className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm ${
              compact ? "size-8" : "size-10 sm:size-11"
          }`}
      >
        <GraduationCap className={compact ? "size-5" : "size-5 sm:size-6"} aria-hidden="true" />
      </span>
      <span className={`font-heading font-bold tracking-tight text-[#0B1F3A] ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
        REBYU
      </span>
    </span>
  );
}

function LandingNavbar({ shellRef, logoRef }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useLayoutEffect(() => {
    if (!mobileMenuOpen || !mobileMenuRef.current) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
          mobileMenuRef.current,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.24,
            ease: "power2.out",
          },
      );
    }, mobileMenuRef);

    return () => context.revert();
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
      <>
        {mobileMenuOpen ? (
            <button
                type="button"
                aria-label="Close navigation menu"
                className="fixed inset-0 z-40 bg-[#07162D]/25 backdrop-blur-[1px] xl:hidden"
                onClick={closeMobileMenu}
            />
        ) : null}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <div
            ref={shellRef}
            style={{
              willChange:
                  "max-width, border-radius, background-color, border-color, box-shadow, backdrop-filter",
            }}
            className={`pointer-events-auto mx-auto max-w-[1520px] overflow-hidden transition-colors duration-300 ${
                mobileMenuOpen
                    ? "rounded-[22px] border border-white/65 bg-[#FCFDFF]/95 shadow-[0_18px_45px_rgba(11,31,58,0.12)] backdrop-blur-xl"
                    : "rounded-[22px] border border-white/70 bg-[#FCFDFF]/88 shadow-[0_10px_30px_rgba(11,31,58,0.08)] backdrop-blur-xl"
            }`}
        >
          <div className="relative flex h-[68px] items-center justify-between px-4 sm:px-5 lg:px-6">
            <Link
                ref={logoRef}
                to="/welcome"
                onClick={closeMobileMenu}
                className="relative z-10 flex origin-left items-center gap-2.5"
            >
              <BrandMark />
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 whitespace-nowrap xl:flex">
              {NAV_ITEMS.map((item) => (
                  <a
                      key={item.href}
                      href={item.href}
                      className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-[#EEF3FF] hover:text-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </a>
              ))}
            </nav>

            <div className="relative z-10 hidden items-center gap-2.5 xl:flex">
              <Button
                  asChild
                  variant="ghost"
                  className="rounded-md text-[#0B1F3A] hover:bg-[#EEF3FF]"
              >
                <Link to="/login">Log in</Link>
              </Button>

              <Button
                  asChild
                  className="whitespace-nowrap rounded-md px-5 shadow-sm"
              >
                <Link to="/register">
                  Start preparing
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <Button
                ref={menuButtonRef}
                type="button"
                variant="ghost"
                size="icon"
                className="relative z-10 ml-auto rounded-md text-[#0B1F3A] hover:bg-[#EEF3FF]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="landing-mobile-menu"
                onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? (
                  <X className="size-5" aria-hidden="true" />
              ) : (
                  <Menu className="size-5" aria-hidden="true" />
              )}
            </Button>
          </div>

          {mobileMenuOpen ? (
              <div
                  ref={mobileMenuRef}
                  id="landing-mobile-menu"
                  className="max-h-[calc(100vh-92px)] overflow-y-auto border-t border-[#D9E3F2] xl:hidden"
              >
                <nav aria-label="Mobile navigation" className="grid gap-1 p-3 sm:grid-cols-2 sm:gap-2 sm:p-4">
                  {NAV_ITEMS.map((item) => (
                      <a
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex min-h-11 items-center rounded-lg px-4 py-3 text-sm font-semibold text-[#40526B] transition-colors hover:bg-[#EEF3FF] hover:text-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.label}
                      </a>
                  ))}
                </nav>

                <div className="grid grid-cols-2 gap-3 border-t border-[#D9E3F2] p-3 sm:p-4">
                  <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-[#C8D7F0] bg-white text-[#0B1F3A]"
                  >
                    <Link to="/login" onClick={closeMobileMenu}>
                      Log in
                    </Link>
                  </Button>

                  <Button
                      asChild
                      className="rounded-full bg-[#275DF5] text-white hover:bg-[#153FBE]"
                  >
                    <Link to="/register" onClick={closeMobileMenu}>
                      Get started
                    </Link>
                  </Button>
                </div>
              </div>
          ) : null}
        </div>
      </header>
      </>
  );
}

function HeroNetworkVisual({ visualRef }) {
  return (
      <div
          ref={visualRef}
          className="hero-network relative mx-auto h-[148px] w-full max-w-[920px] shrink-0 sm:h-[205px] lg:h-[215px]"
          aria-hidden="true"
      >
        <svg
            viewBox="0 0 1000 280"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
        >
          {[
            "M 500 132 L 132 132",
            "M 500 132 L 252 42",
            "M 500 132 L 306 216",
            "M 500 132 L 868 132",
            "M 500 132 L 748 42",
            "M 500 132 L 694 216",
          ].map((path) => (
              <path
                  key={path}
                  d={path}
                  className="hero-network-path"
                  fill="none"
                  stroke="#DCE3EC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
              />
          ))}

          {[
            [414, 132],
            [357, 82],
            [382, 176],
            [586, 132],
            [643, 82],
            [618, 176],
          ].map(([cx, cy]) => (
              <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#315EF6"
                  className="hero-network-dot"
              />
          ))}
        </svg>

        <div className="hero-network-node absolute left-[6%] top-[34%] hidden size-[58px] -translate-y-1/2 overflow-hidden rounded-2xl border-4 border-white bg-[#E8ECF2] shadow-[0_14px_30px_rgba(11,31,58,0.14)] sm:block">
          <img
              src={heroStudy}
              alt=""
              className="h-full w-full object-cover"
          />
        </div>

        <div className="hero-network-node absolute left-[19%] top-[4%] flex size-[52px] items-center justify-center rounded-2xl bg-[#FFD44D] text-[#453600] shadow-[0_14px_30px_rgba(11,31,58,0.12)] sm:size-[58px]">
          <Target className="size-6" />
        </div>

        <div className="hero-network-node absolute left-[25%] top-[65%] flex size-[54px] items-center justify-center rounded-2xl bg-[#27BDEB] text-white shadow-[0_14px_30px_rgba(11,31,58,0.12)] sm:size-[60px]">
          <BookOpen className="size-6" />
        </div>

        <div className="hero-network-node absolute left-1/2 top-[47%] flex size-[86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#315EF6] to-[#6D4BFF] text-white shadow-[0_22px_48px_rgba(75,74,230,0.28)] sm:size-[96px]">
          <Check className="size-11 stroke-[2.4]" />
        </div>

        <div className="hero-network-node absolute right-[19%] top-[4%] flex size-[52px] items-center justify-center rounded-2xl bg-[#FF6B4A] text-white shadow-[0_14px_30px_rgba(11,31,58,0.12)] sm:size-[58px]">
          <FileQuestion className="size-6" />
        </div>

        <div className="hero-network-node absolute right-[25%] top-[65%] hidden size-[54px] overflow-hidden rounded-2xl border-4 border-white bg-[#E8ECF2] shadow-[0_14px_30px_rgba(11,31,58,0.14)] sm:block sm:size-[60px]">
          <img
              src={communityStudy}
              alt=""
              className="h-full w-full object-cover"
          />
        </div>

        <div className="hero-network-node absolute right-[6%] top-[34%] hidden size-[58px] -translate-y-1/2 items-center justify-center rounded-2xl border border-[#E4E9F0] bg-white text-[#0B1F3A] shadow-[0_14px_30px_rgba(11,31,58,0.12)] sm:flex">
          <TrendingUp className="size-6" />
        </div>

        <div className="hero-network-node absolute bottom-[1%] left-[43%] hidden size-[48px] overflow-hidden rounded-2xl border-4 border-white bg-[#E8ECF2] shadow-[0_12px_26px_rgba(11,31,58,0.12)] md:block">
          <img
              src={mockExam}
              alt=""
              className="h-full w-full object-cover"
          />
        </div>

        <div className="hero-network-node absolute bottom-[4%] right-[38%] hidden size-[48px] items-center justify-center rounded-2xl bg-[#F0F3F8] text-[#315EF6] shadow-[0_12px_26px_rgba(11,31,58,0.10)] md:flex">
          <Users className="size-5" />
        </div>
      </div>
  );
}

function HeroVideo({ videoRef }) {
  return (
      <div
          ref={videoRef}
          style={{ transformStyle: "preserve-3d" }}
          className="hero-video relative mx-auto mt-9 w-full max-w-5xl rounded-[1.1rem] border border-white/60 bg-white/40 p-2 shadow-[0_24px_60px_rgba(11,31,58,0.08)] backdrop-blur-md sm:mt-12 sm:rounded-[1.5rem] sm:p-3 lg:mt-16"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-[1rem] bg-[#0B1F3A] shadow-inner">
          <iframe
              className="absolute inset-0 h-full w-full border-0"
              src="https://www.youtube.com/embed/M7lc1UVf-VE?rel=0&showinfo=0&autohide=1"
              title="REBYU Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
          ></iframe>
        </div>
      </div>
  );
}

function HeroSection({ sectionRef, canvasRef, textRef, visualRef, videoRef }) {
  return (
      <section
          ref={sectionRef}
          className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.72),transparent_38%),linear-gradient(180deg,#EEF4FF_0%,#F3F7FF_72%,#FFFFFF_100%)]"
      >
        <div
            ref={canvasRef}
          className="relative flex min-h-screen w-full flex-col items-center justify-start px-5 pb-12 pt-[92px] sm:px-8 sm:pb-16 sm:pt-[104px] lg:px-12 lg:pb-20 lg:pt-[108px]"
        >
          <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center">
            <HeroNetworkVisual visualRef={visualRef} />

            <div ref={textRef} className="relative mx-auto mt-1 w-full max-w-3xl text-center">
              <p className="hero-kicker text-xs font-bold uppercase tracking-[0.14em] text-[#1D4ED8]">
                One connected review experience
              </p>

              <h1 className="hero-title mx-auto mt-4 max-w-3xl text-[2.35rem] font-bold leading-[1.02] tracking-[-0.045em] text-[#0B1F3A] sm:mt-5 sm:text-6xl lg:text-[4rem]">
                Stop scrambling for reviewers. Start actually preparing.
              </h1>

              <p className="hero-copy mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6A7688] sm:text-base sm:leading-7">
                Organize your review, focus on weak areas, and prepare confidently for your certification.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="min-h-12 rounded-lg bg-[#275DF5] px-6 text-white shadow-[0_12px_24px_rgba(39,93,245,0.2)] hover:bg-[#1D4ED8]">
                  <Link to="/register">Start preparing <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
                </Button>
                <Button asChild variant="outline" className="min-h-12 rounded-lg border-[#C8D7F0] bg-white/70 px-6 text-[#0B1F3A] hover:bg-white">
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>
            </div>

            <HeroVideo videoRef={videoRef} />
          </div>
        </div>
      </section>
  );
}

function AboutSection() {
  return (
      <section id="about" className="scroll-mt-24 bg-background px-5 py-16 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-20">
          <figure
              data-landing-reveal
              className="relative min-h-[320px] overflow-hidden rounded-2xl bg-[#E9EEF5] sm:min-h-[480px] sm:rounded-[1.75rem]"
          >
            <img
                src={mockExam}
                alt="Learner completing a focused exam preparation session"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07162D]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#AFC4FF]">
                A clearer starting point
              </p>
              <p className="mt-3 max-w-md text-2xl font-bold leading-tight">
                Study time should follow evidence, not guesswork.
              </p>
            </div>
          </figure>

          <div data-landing-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#275DF5]">
              About REBYU
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.04em] text-[#0B1F3A] sm:text-5xl">
              Certification preparation should not feel scattered.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#61728A]">
              REBYU brings diagnostic assessments, structured lessons, quizzes,
              middle exams, mock exams, and progress insights into one connected
              learning experience.
            </p>

            <div className="mt-9 border-y border-[#DCE5F0]">
              {[
                ["01", "Start with a diagnostic", "Find weak topics before lessons begin."],
                ["02", "Study in the right order", "Follow a plan built from actual results."],
                ["03", "Practice at every level", "Complete lesson quizzes, middle exams, and mock exams."],
                ["04", "Track your readiness", "Use your results to decide what to study next."],
              ].map(([number, title, description]) => (
                  <div
                      key={number}
                      className="grid gap-3 border-b border-[#E5EBF3] py-5 last:border-b-0 sm:grid-cols-[56px_1fr]"
                  >
                <span className="text-xs font-bold tracking-[0.14em] text-[#275DF5]">
                  {number}
                </span>
                    <div>
                      <h3 className="text-base font-bold text-[#0B1F3A]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#6A7A91]">
                        {description}
                      </p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}

function CertificationSection() {
  return (
      <section
          id="certifications"
          className="border-y border-[#DCE5F0] bg-[#F7F9FC] px-5 py-16 sm:py-28 lg:px-8 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#275DF5]">
              Certification reviewers
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.04em] text-[#0B1F3A] sm:text-5xl">
              Choose the review path that matches your goal.
            </h2>
          </div>

          <div className="mt-9 grid gap-5 sm:mt-12 lg:grid-cols-3">
            {CERTIFICATIONS.map((certification) => (
                <article
                    key={certification.title}
                    data-landing-reveal
                    className="group overflow-hidden border border-[#DCE5F0] bg-white"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                        src={certification.image}
                        alt="Learners preparing for certification examinations"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07162D]/66 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0B1F3A] shadow-sm">
                  {certification.type}
                </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0B1F3A]">
                      {certification.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#64758E]">
                      {certification.description}
                    </p>
                  </div>
                </article>
            ))}
          </div>
        </div>
      </section>
  );
}

function CommunitySection() {
  return (
      <section id="community" className="scroll-mt-24 bg-[#0B1F3A] px-5 py-16 text-white sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-[4.5rem]">
          <figure
              data-landing-reveal
              className="relative min-h-[320px] overflow-hidden rounded-2xl bg-[#152D4E] sm:min-h-[500px] sm:rounded-[1.75rem]"
          >
            <img
                src={communityStudy}
                alt="College students studying together in a classroom"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07162D]/78 via-[#07162D]/10 to-transparent" />
            <figcaption className="absolute bottom-4 left-5 text-xs text-white/90">
              Photo by Yan Krukau on Pexels
            </figcaption>
          </figure>

          <div data-landing-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9BB7FF]">
              Community and study circles
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
              Prepare with learners working toward the same certification.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#D5DEEA]">
              Ask certification-related questions, share study resources, and join
              focused discussions with learners preparing for the same goal.
            </p>

            <div className="mt-8 space-y-3">
              <div className="border border-white/[0.14] bg-white/[0.06] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#AFC4FF]">
                  <Users className="size-4" aria-hidden="true" />
                  TOPCIT study circle
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-white">
                  “Software Development review tonight. We will compare Agile and
                  Waterfall before taking the quiz.”
                </p>
                <p className="mt-3 text-xs font-medium text-[#C1CCDC]">8 learners joined</p>
              </div>
              <div className="border border-white/[0.14] bg-white/[0.06] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#AFC4FF]">
                  <FileQuestion className="size-4" aria-hidden="true" />
                  Shared quiz
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-white">
                  “I created a 15-item practice quiz for Database Normalization.”
                </p>
                <p className="mt-3 text-xs font-medium text-[#C1CCDC]">12 attempts · 4 replies</p>
              </div>
              <div className="flex items-center gap-3 pt-3 text-sm font-semibold text-[#AFC4FF]">
                <MessageCircle className="size-4" aria-hidden="true" />
                Discussions stay connected to certifications and lessons.
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

function TeamMemberCard({ member }) {
  return (
      <article
          data-team-card
          className="group relative min-h-[420px] overflow-hidden rounded-[0.85rem] bg-[#DDE4EC] sm:min-h-[470px] lg:min-h-[500px]"
      >
        <img
            src={member.image}
            alt={`${member.name} — ${member.role}`}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] ${member.position}`}
            loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#062536]/95 via-[#062536]/12 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
          <h3 className="text-xl font-bold tracking-[-0.025em]">
            {member.name}
          </h3>
          <p className="mt-2 text-xs font-medium text-white/90">
            {member.role}
          </p>
        </div>
      </article>
  );
}

function TeamSection() {
  return (
      <section
          id="team"
          className="scroll-mt-24 bg-white px-5 py-16 sm:py-28 lg:px-8 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <div
              data-landing-reveal
              className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-4xl font-bold tracking-[-0.045em] text-[#0B1F3A] sm:text-5xl">
              Team
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#64758E] sm:text-base">
              REBYU is built by a multidisciplinary team focused on making
              certification preparation clearer, more structured, and easier
              for learners to follow.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
                <TeamMemberCard
                    key={member.name}
                    member={member}
                />
            ))}
          </div>
        </div>
      </section>
  );
}

function AccessColumn({ icon: Icon, title, description, points, button, to, dark }) {
  return (
      <div className={`flex h-full flex-col p-7 sm:p-9 ${dark ? "bg-[#0B1F3A] text-white" : "bg-white"}`}>
      <span
          className={`flex size-11 items-center justify-center rounded-xl ${
              dark ? "bg-white text-[#0B1F3A]" : "bg-[#E9EFFF] text-[#275DF5]"
          }`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
        <h3 className={`mt-6 text-2xl font-bold ${dark ? "text-white" : "text-[#0B1F3A]"}`}>
          {title}
        </h3>
        <p className={`mt-3 text-sm leading-6 md:min-h-[4.5rem] lg:min-h-24 ${dark ? "text-[#D5DEEA]" : "text-[#64758E]"}`}>
          {description}
        </p>
        <div className={`mt-7 flex-1 space-y-3 border-y py-6 ${dark ? "border-white/[0.14]" : "border-[#E1E8F2]"}`}>
          {points.map((point) => (
              <div key={point} className="flex items-start gap-3 text-sm">
                <Check
                    className={`mt-0.5 size-4 shrink-0 ${dark ? "text-[#AFC4FF]" : "text-[#275DF5]"}`}
                    aria-hidden="true"
                />
                <span className={dark ? "text-[#D5DEEA]" : "text-[#465A76]"}>
              {point}
            </span>
              </div>
          ))}
        </div>
        <Button
            asChild
            className={`mt-7 w-full rounded-lg ${
                dark
                    ? "bg-white text-[#0B1F3A] hover:bg-[#E9EEF5]"
                    : "bg-[#275DF5] text-white hover:bg-[#1D4ED8]"
            }`}
        >
          <Link to={to}>
            {button}
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
  );
}

function AccessSection() {
  return (
      <section id="get-access" className="scroll-mt-24 bg-muted/40 px-5 py-16 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[0.84fr_1.16fr]">
            <figure className="relative min-h-[300px] overflow-hidden bg-muted sm:min-h-[480px] lg:min-h-[560px]">
              <img
                  src={institutionLab}
                  alt="Teacher guiding learners in a computer laboratory"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07162D]/72 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B8CAFF]">
                  Individual and institutional access
                </p>
                <p className="mt-3 max-w-md text-3xl font-bold leading-tight">
                  One platform for self-directed learners and partner institutions.
                </p>
                <p className="mt-4 text-xs text-white/90">
                  Photo by Gustavo Fring on Pexels
                </p>
              </div>
            </figure>

            <div className="grid items-stretch border-t border-border md:grid-cols-2 md:border-t-0 lg:border-l">
              <AccessColumn
                  icon={GraduationCap}
                  title="For learners"
                  description="Explore available certifications, study structured lessons, and unlock advanced preparation tools with a premium plan."
                  points={LEARNER_POINTS}
                  button="Start Reviewing"
                  to="/register"
              />
              <AccessColumn
                  icon={Building2}
                  title="For institutions"
                  description="Provide certification access to learners through a managed partnership workflow."
                  points={ENTERPRISE_POINTS}
                  button="Request Partnership"
                  to="/enterprise/request-access"
                  dark
              />
            </div>
          </div>
        </div>
      </section>
  );
}

function Footer() {
  return (
      <footer className="relative overflow-hidden bg-gradient-to-b from-[#0B1F3A] to-[#040E1E] px-5 pt-16 text-white sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Top Grid - Columns like Discord */}
          <div className="grid gap-16 lg:grid-cols-[1.5fr_2fr]">
            {/* Left Column: Brand & Language/Social */}
            <div className="flex flex-col gap-8">
              {/* Language Selector */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                  Language
                </div>
                <button className="flex w-36 items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:bg-white/10">
                  English
                  <ChevronDown className="size-4" />
                </button>
              </div>

              {/* Socials */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                  Social
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a href="#" className="text-sm text-[#9BB7FF] transition-colors hover:text-white">X / Twitter</a>
                  <a href="#" className="text-sm text-[#9BB7FF] transition-colors hover:text-white">Instagram</a>
                  <a href="#" className="text-sm text-[#9BB7FF] transition-colors hover:text-white">Facebook</a>
                  <a href="#" className="text-sm text-[#9BB7FF] transition-colors hover:text-white">YouTube</a>
                </div>
              </div>
            </div>

            {/* Right Column: Link Groups */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                {
                  title: "Platform",
                  links: [
                    ["Certifications", "#certifications"],
                    ["Features", "#features"],
                    ["How It Works", "#how-it-works"],
                  ],
                },
                {
                  title: "Access",
                  links: [
                    ["Learner Login", "/login"],
                    ["Create Account", "/register"],
                    ["Institution Access", "/enterprise/request-access"],
                  ],
                },
                {
                  title: "Discover",
                  links: [
                    ["About", "#about"],
                    ["Community", "#community"],
                    ["Team", "#team"],
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    ["Terms of Use", "/terms"],
                    ["Privacy Policy", "/privacy"],
                    ["Guidelines", "/guidelines"],
                  ],
                },
              ].map((column) => (
                  <div key={column.title}>
                    <h3 className="text-sm font-bold text-white">{column.title}</h3>
                    <div className="mt-5 flex flex-col gap-4">
                      {column.links.map(([label, to]) => (
                          <a
                              key={to}
                              href={to}
                              className="text-sm text-[#9BB7FF] transition-colors hover:text-white hover:underline underline-offset-2"
                          >
                            {label}
                          </a>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Huge Logo Text - Discord Style (Subtle) */}
        <div className="pointer-events-none mt-14 flex w-full select-none justify-center overflow-hidden leading-[0.75]">
          <span className="text-[25vw] font-black tracking-[-0.04em] text-[#0E2A54]">
            REBYU
          </span>
        </div>
      </footer>
  );
}

export default function LandingPage() {
  const rootRef = useRef(null);
  const navShellRef = useRef(null);
  const navLogoRef = useRef(null);
  const heroRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroVisualRef = useRef(null);
  const heroVideoRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set("[data-landing-reveal]", { opacity: 1, y: 0 });
        gsap.set("[data-team-card]", {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
        });
        return;
      }

      const heroTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      const networkPaths = gsap.utils.toArray(".hero-network-path", root);
      const networkDots = gsap.utils.toArray(".hero-network-dot", root);
      const networkNodes = gsap.utils.toArray(".hero-network-node", root);

      networkPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      heroTimeline
          .from(heroCanvasRef.current, {
            opacity: 0,
            y: 28,
            scale: 0.985,
            duration: 0.72,
            delay: 0.1,
          })
          .to(
              networkPaths,
              {
                strokeDashoffset: 0,
                duration: 0.9,
                stagger: 0.05,
                ease: "power2.out",
              },
              "-=0.42",
          )
          .from(
              networkDots,
              {
                opacity: 0,
                scale: 0,
                transformOrigin: "center",
                duration: 0.35,
                stagger: 0.05,
              },
              "-=0.62",
          )
          .from(
              networkNodes,
              {
                opacity: 0,
                scale: 0.72,
                y: 18,
                duration: 0.5,
                stagger: {
                  each: 0.07,
                  from: "center",
                },
              },
              "-=0.48",
          )
          .from(".hero-kicker", { opacity: 0, y: 12, duration: 0.4 }, "-=0.18")
          .from(".hero-title", { opacity: 0, y: 30, duration: 0.7 }, "-=0.22")
          .from(".hero-copy", { opacity: 0, y: 16, duration: 0.5 }, "-=0.42")
          .from(heroVideoRef.current, { opacity: 0, y: 60, scale: 0.96, duration: 0.8 }, "-=0.3");

      gsap.set(navShellRef.current, {
        maxWidth: 1520,
        borderRadius: 22,
        borderColor: "rgba(255,255,255,0.7)",
        backgroundColor: "rgba(252,253,255,0.88)",
        boxShadow: "0 10px 30px rgba(11,31,58,0.08)",
        backdropFilter: "blur(16px)",
      });

      gsap
          .timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "+=220",
              scrub: true,
            },
          })
          .to(
              navShellRef.current,
              {
                maxWidth: 1320,
                borderRadius: 22,
                borderColor: "rgba(255,255,255,0.65)",
                backgroundColor: "rgba(252,253,255,0.95)",
                boxShadow: "0 18px 45px rgba(11,31,58,0.12)",
                backdropFilter: "blur(16px)",
                ease: "none",
              },
              0,
          )
          .to(navLogoRef.current, { scale: 0.94, ease: "none" }, 0);

      gsap.to(heroVisualRef.current, {
        yPercent: -8,
        scale: 1.015,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to(heroTextRef.current, {
        yPercent: -5,
        opacity: 0.84,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Video Scroll Animation (Parallax 3D Depth)
      gsap.to(heroVideoRef.current, {
        yPercent: -15,
        scale: 1.02,
        rotationX: 2,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.utils.toArray("[data-landing-reveal]", root).forEach((element) => {
        gsap.fromTo(
            element,
            { opacity: 0, y: 34 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 82%",
                once: true,
              },
            },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
      <div
          ref={rootRef}
          className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground selection:bg-primary/20 selection:text-foreground"
      >
        <LandingNavbar shellRef={navShellRef} logoRef={navLogoRef} />
        <main>
          <HeroSection
              sectionRef={heroRef}
              canvasRef={heroCanvasRef}
              textRef={heroTextRef}
              visualRef={heroVisualRef}
              videoRef={heroVideoRef}
          />
          <AboutSection />
          <RoadmapSection />
          <FeatureBento />
          <CertificationSection />
          <CommunitySection />
          <TeamSection />
          <AccessSection />
        </main>
        <Footer />
      </div>
  );
}

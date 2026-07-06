import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Menu,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "About", to: "/about" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Certifications", to: "/certifications" },
  { label: "Features", to: "/features" },
  { label: "Get Access", to: "/get-access" },
];

const certifications = [
  {
    title: "TOPCIT",
    description: "Technology and Productivity Certificate for ICT",
    tag: "Featured",
    icon: BrainCircuit,
    panel: "from-[#315EF6] via-[#5A7DFF] to-[#B4C8FF]",
    chip: "bg-white/20 text-white",
    iconSurface: "bg-white/15 text-white",
  },
  {
    title: "IT Passport",
    description: "A practical foundation for aspiring IT professionals.",
    tag: "Popular",
    icon: GraduationCap,
    panel: "from-[#F2BA52] via-[#F5C66C] to-[#FFE7B3]",
    chip: "bg-[#102C57]/10 text-[#102C57]",
    iconSurface: "bg-white/55 text-[#7D5310]",
  },
  {
    title: "FE Reviewer",
    description: "Build stronger foundations before your examination.",
    tag: "Coming Soon",
    icon: BookOpen,
    panel: "from-[#FF8E72] via-[#FFB19E] to-[#FFE0D8]",
    chip: "bg-white/45 text-[#7D301F]",
    iconSurface: "bg-white/60 text-[#8E3C29]",
  },
  {
    title: "Private Reviewer",
    description: "Create a review space using your own study materials.",
    tag: "Personal",
    icon: FileQuestion,
    panel: "from-[#8B7DEB] via-[#B0A6FF] to-[#E4E0FF]",
    chip: "bg-white/50 text-[#443A82]",
    iconSurface: "bg-white/60 text-[#514696]",
  },
];

const storySteps = [
  {
    number: "01",
    eyebrow: "Start with clarity",
    title: "Know exactly where to begin.",
    description:
        "Take a diagnostic assessment first, then see your strongest areas and the topics that deserve your attention.",
    points: ["Diagnostic assessment", "Weak-topic insights"],
    kind: "diagnostic",
  },
  {
    number: "02",
    eyebrow: "Study with direction",
    title: "Focus on what matters most.",
    description:
        "REBYU turns your results into a focused learning path, so every review session moves you toward the next milestone.",
    points: ["Personalized learning path", "High-priority topics"],
    kind: "path",
  },
  {
    number: "03",
    eyebrow: "Prepare with confidence",
    title: "See progress while you improve.",
    description:
        "Practice through adaptive quizzes and mock examinations, then track mastery, readiness, and momentum in one place.",
    points: ["Adaptive practice", "Readiness tracking"],
    kind: "readiness",
  },
];

const connectedCards = [
  {
    title: "Diagnostic assessment",
    label: "Start here",
    description: "Find your starting point before you open your first lesson.",
    icon: Target,
    tone: "bg-[#EAF0FF] text-[#173B8C]",
    visual: "diagnostic",
  },
  {
    title: "Personalized study path",
    label: "Focused next steps",
    description: "A clearer route through lessons, priorities, and milestones.",
    icon: BookOpen,
    tone: "bg-[#FFF2D8] text-[#7B5614]",
    visual: "path",
  },
  {
    title: "Adaptive quizzes",
    label: "Practice with purpose",
    description:
        "More practice where you need it instead of random repetition.",
    icon: FileQuestion,
    tone: "bg-[#FFE7E0] text-[#8B3929]",
    visual: "quiz",
  },
  {
    title: "Mock exam simulation",
    label: "Exam-ready practice",
    description: "Build confidence through timed, focused exam simulations.",
    icon: Clock3,
    tone: "bg-[#E9E6FF] text-[#514696]",
    visual: "mock",
  },
  {
    title: "AI Coach support",
    label: "Guidance when needed",
    description: "Ask for a clearer explanation while you study.",
    icon: Bot,
    tone: "bg-[#DFF5FF] text-[#0B5F80]",
    visual: "coach",
  },
];

const featureCards = [
  {
    id: "plan",
    size: "md:col-span-4",
    icon: Target,
    title: "A plan that adapts to you.",
    description:
        "Start with a diagnostic, identify your weak topics, and follow a study path built around what needs attention.",
    detail:
        "Every milestone makes the next recommended topic clearer, so learners can spend more time improving and less time guessing where to go.",
    tone: "bg-[#E8EFFF] border-[#C9D8FF]",
    visual: "plan",
  },
  {
    id: "materials",
    size: "md:col-span-2",
    icon: Upload,
    title: "Official or private materials.",
    description:
        "Choose a reviewer or create a private space from your own files.",
    detail:
        "Use official certification reviewers, accept Enterprise access, or organize personal files in a private learning experience.",
    tone: "bg-[#FFF2D8] border-[#F1D79F]",
    visual: "materials",
  },
  {
    id: "practice",
    size: "md:col-span-2",
    icon: FileQuestion,
    title: "Practice what needs work.",
    description: "Adaptive quizzes and mocks keep practice focused.",
    detail:
        "Question sets can surface weak-topic practice and let learners build confidence before important exam milestones.",
    tone: "bg-[#FFE8E2] border-[#F4C9BE]",
    visual: "practice",
  },
  {
    id: "coach",
    size: "md:col-span-2",
    icon: Sparkles,
    title: "Guidance while you study.",
    description: "Ask the AI Coach for simpler explanations and focused help.",
    detail:
        "The AI Coach supports learners while they work through a lesson, helping them understand the concept before they continue.",
    tone: "bg-[#EEEAFE] border-[#D7D1FA]",
    visual: "coach",
  },
  {
    id: "progress",
    size: "md:col-span-2",
    icon: BarChart3,
    title: "Progress that is easy to understand.",
    description: "See mastery, accuracy, streaks, and readiness in one view.",
    detail:
        "Clear progress signals make it easier to know whether to review, practice, or move forward to the next assessment.",
    tone: "bg-[#E2F4FF] border-[#C1E6F9]",
    visual: "progress",
  },
];

const sectionMotion = {
  hidden: { opacity: 0, y: 36, scale: 0.985, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.64, ease: [0.22, 1, 0.36, 1] },
  },
};

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      setHasScrolled(scrollY > 18);
      setHeroProgress(Math.min(scrollY / 560, 1));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
      <div className="min-h-screen overflow-x-hidden bg-[#F5F8FF] text-[#0B1F3A]">
        <StickyNavbar
            hasScrolled={hasScrolled}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen((current) => !current)}
            onCloseMobileMenu={closeMobileMenu}
        />

        <main>
          <HeroSection heroProgress={heroProgress} reduceMotion={reduceMotion} />
          <WhyRebyuStickySection reduceMotion={reduceMotion} />
          <CertificationCarouselSection reduceMotion={reduceMotion} />
          <ConnectedLearningSection reduceMotion={reduceMotion} />
          <FeaturesBentoSection reduceMotion={reduceMotion} />
          <AccessSection reduceMotion={reduceMotion} />
        </main>

        <Footer />
      </div>
  );
}

function StickyNavbar({
                        hasScrolled,
                        mobileMenuOpen,
                        onToggleMobileMenu,
                        onCloseMobileMenu,
                      }) {
  return (
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <motion.div
            animate={{
              maxWidth: hasScrolled ? 1180 : 1400,
              y: hasScrolled ? 0 : 0,
              borderRadius: hasScrolled ? 22 : 0,
            }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className={`pointer-events-auto mx-auto transition-colors duration-300 ${
                hasScrolled
                    ? "border border-white/65 bg-[#FCFDFF]/82 shadow-[0_18px_45px_rgba(11,31,58,0.12)] backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
          <div className="flex h-[68px] items-center justify-between px-4 sm:px-5 lg:px-6">
            <Link
                to="/"
                onClick={onCloseMobileMenu}
                className="flex items-center gap-2.5"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#0B1F3A] text-white shadow-[0_8px_20px_rgba(11,31,58,0.2)]">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#0B1F3A]">
              REBYU
            </span>
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              {navItems.map((item) => (
                  <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                          [
                            "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                            isActive
                                ? "bg-[#E8EFFF] text-[#153C9A]"
                                : "text-[#52647F] hover:bg-white/70 hover:text-[#0B1F3A]",
                          ].join(" ")
                      }
                  >
                    {item.label}
                  </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2.5 lg:flex">
              <Button
                  asChild
                  variant="ghost"
                  className="rounded-full text-[#0B1F3A] hover:bg-[#E8EFFF]"
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                  asChild
                  className="rounded-full bg-[#275DF5] px-5 text-white shadow-[0_8px_18px_rgba(39,93,245,0.24)] hover:bg-[#153FBE]"
              >
                <Link to="/register">
                  Start preparing
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto rounded-full text-[#0B1F3A] hover:bg-white/60 lg:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                onClick={onToggleMobileMenu}
            >
              {mobileMenuOpen ? (
                  <X className="size-5" />
              ) : (
                  <Menu className="size-5" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-[#D9E3F2] lg:hidden"
                >
                  <nav className="flex flex-col gap-1 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={onCloseMobileMenu}
                            className="rounded-xl px-4 py-3 text-sm font-semibold text-[#42546E] transition hover:bg-[#E8EFFF] hover:text-[#153C9A]"
                        >
                          {item.label}
                        </Link>
                    ))}
                  </nav>
                  <div className="grid grid-cols-2 gap-3 border-t border-[#D9E3F2] p-4 pt-4">
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-[#C8D7F0] bg-white text-[#0B1F3A]"
                    >
                      <Link to="/login" onClick={onCloseMobileMenu}>
                        Log in
                      </Link>
                    </Button>
                    <Button
                        asChild
                        className="rounded-full bg-[#275DF5] text-white hover:bg-[#153FBE]"
                    >
                      <Link to="/register" onClick={onCloseMobileMenu}>
                        Get started
                      </Link>
                    </Button>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
  );
}

function HeroSection({ heroProgress, reduceMotion }) {
  const dashboardStyle = reduceMotion
      ? undefined
      : {
        transform: `perspective(1600px) rotateX(${8 - heroProgress * 8}deg) scale(${0.92 + heroProgress * 0.08}) translateY(${28 - heroProgress * 28}px)`,
      };

  return (
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_8%_10%,rgba(141,170,255,0.64),transparent_31%),radial-gradient(circle_at_88%_7%,rgba(255,207,123,0.45),transparent_25%),linear-gradient(135deg,#EAF0FF_0%,#F8FAFF_50%,#E6EEFF_100%)] px-5 pb-10 pt-36 sm:pt-40 lg:px-8 lg:pb-0">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 top-32 size-[28rem] rounded-full bg-[#6C90FF]/20 blur-3xl" />
          <div className="absolute -right-24 top-4 size-[31rem] rounded-full bg-[#F5C66C]/30 blur-3xl" />
          <motion.div
              animate={reduceMotion ? undefined : { y: [0, -16, 0], x: [0, 10, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[-7rem] left-[14%] size-72 rounded-full bg-white/55 blur-2xl"
          />
        </div>

        <div className="mx-auto max-w-7xl">
          <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5D5F6] bg-white/70 px-3.5 py-1.5 text-xs font-bold text-[#244BAA] shadow-sm backdrop-blur">
              <Sparkles className="size-3.5" />
              Personalized certification preparation
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.06em] text-[#0B1F3A] sm:text-5xl lg:text-7xl">
              Stop scrambling for reviewers.
              <span className="block bg-gradient-to-r from-[#275DF5] via-[#4F7CFF] to-[#8A79F6] bg-clip-text text-transparent">
              Start actually preparing.
            </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#586B86] sm:text-lg">
              Organize your reviewer, focus on weak topics, and prepare
              confidently for your certification through one clear learning path.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#275DF5] px-6 text-white shadow-[0_12px_28px_rgba(39,93,245,0.28)] hover:bg-[#153FBE]"
              >
                <Link to="/register">
                  Start reviewing <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[#C8D7F0] bg-white/75 px-6 text-[#0B1F3A] shadow-sm hover:bg-white"
              >
                <Link to="/how-it-works">
                  <PlayCircle className="mr-2 size-4" />
                  See how it works
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="relative mx-auto mt-14 max-w-6xl pb-1 sm:mt-16">
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 42 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.16,
                  duration: 0.76,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={dashboardStyle}
                className="relative origin-bottom"
            >
              <div className="absolute -left-5 top-16 z-10 hidden rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_18px_38px_rgba(22,55,120,0.14)] backdrop-blur lg:block">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#FFF2D8] text-[#9B650E]">
                    <Target className="size-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#102C57]">
                      Diagnostic complete
                    </p>
                    <p className="text-[10px] text-[#70809A]">
                      3 topics need attention
                    </p>
                  </div>
                </div>
              </div>

              <DashboardPreview reduceMotion={reduceMotion} />

              <div className="absolute -bottom-5 -right-4 z-10 hidden rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_18px_38px_rgba(22,55,120,0.14)] backdrop-blur sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#E8EFFF] text-[#275DF5]">
                    <Clock3 className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#102C57]">
                      4-day study streak
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#71819B]">
                      Keep building momentum.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}

function DashboardPreview({ reduceMotion = false }) {
  const chart = [31, 44, 39, 57, 54, 67, 75, 84];

  return (
      <div className="overflow-hidden rounded-t-[2rem] border border-b-0 border-[#C9D8F5] bg-[#FCFDFF] p-2.5 shadow-[0_34px_85px_rgba(25,61,135,0.2)] sm:p-3">
        <div className="overflow-hidden rounded-t-[1.55rem] border border-b-0 border-[#E3EAF6] bg-[#F8FAFF]">
          <div className="flex h-14 items-center justify-between border-b border-[#E4EAF5] bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#0B1F3A] text-white">
                <GraduationCap className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#102C57]">REBYU</p>
                <p className="text-[10px] text-[#7A899F]">Learner Dashboard</p>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full bg-[#E8EFFF] px-3 py-1 text-[10px] font-bold text-[#275DF5]">
              68% Ready
            </span>
              <div className="size-7 rounded-full bg-[#FFE0D8]" />
            </div>
          </div>

          <div className="grid min-h-[355px] grid-cols-[64px_1fr] sm:grid-cols-[158px_1fr]">
            <aside className="border-r border-[#E4EAF5] bg-white px-2 py-4 sm:px-4">
              <div className="space-y-2.5">
                <DashboardSidebar icon={LayoutDashboard} label="Home" active />
                <DashboardSidebar icon={BookOpen} label="Reviewers" />
                <DashboardSidebar icon={FileQuestion} label="Assessments" />
                <DashboardSidebar icon={BarChart3} label="Progress" />
              </div>
            </aside>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-medium text-[#72819A]">
                    Welcome back, Glyzel
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-[#102C57]">
                    Your review overview
                  </h2>
                </div>
                <div className="rounded-lg border border-[#DEE7F5] bg-white px-3 py-2 text-[10px] text-[#7B89A1]">
                  Search your lessons
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <DashboardStat
                    label="Lessons completed"
                    value="14"
                    detail="+3 this week"
                />
                <DashboardStat
                    label="Practice accuracy"
                    value="78%"
                    detail="+6% this week"
                />
                <DashboardStat
                    label="Study streak"
                    value="4 days"
                    detail="Keep going"
                />
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.8fr]">
                <div className="rounded-xl border border-[#E1E8F4] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1B3764]">
                        Readiness trend
                      </p>
                      <p className="mt-1 text-[10px] text-[#8492A8]">
                        Your improvement over time
                      </p>
                    </div>
                    <TrendingUp className="size-4 text-[#275DF5]" />
                  </div>
                  <div className="mt-6 flex h-28 items-end gap-1.5">
                    {chart.map((height, index) => (
                        <motion.div
                            key={index}
                            initial={reduceMotion ? false : { height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{
                              delay: 0.32 + index * 0.05,
                              duration: 0.42,
                            }}
                            className="flex flex-1 items-end rounded-t-sm bg-[#EDF2FF]"
                        >
                          <motion.div
                              initial={reduceMotion ? false : { height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{
                                delay: 0.28 + index * 0.05,
                                duration: 0.48,
                              }}
                              className={`w-full rounded-t-sm ${index === chart.length - 1 ? "bg-[#275DF5]" : "bg-[#AFC4FF]"}`}
                          />
                        </motion.div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#FFF2D8] p-4">
                  <WandSparkles className="size-4 text-[#A66A0B]" />
                  <p className="mt-4 text-xs font-bold text-[#765014]">
                    Study suggestion
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-[#8B6B36]">
                    Review Accounting and Financial Affairs before taking your
                    next quiz.
                  </p>
                  <Button
                      size="sm"
                      variant="ghost"
                      className="mt-4 h-7 px-0 text-[10px] text-[#765014] hover:bg-transparent"
                  >
                    View topic
                    <ChevronRight className="ml-1 size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function DashboardSidebar({ icon: Icon, label, active = false }) {
  return (
      <div
          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] ${active ? "bg-[#E8EFFF] font-bold text-[#275DF5]" : "text-[#8A98AE]"}`}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="hidden sm:inline">{label}</span>
      </div>
  );
}

function DashboardStat({ label, value, detail }) {
  return (
      <div className="rounded-xl border border-[#E1E8F4] bg-white p-3">
        <p className="text-[10px] text-[#8492A8]">{label}</p>
        <p className="mt-2 text-lg font-bold tracking-tight text-[#17355F]">
          {value}
        </p>
        <p className="mt-1 text-[10px] text-[#4970D0]">{detail}</p>
      </div>
  );
}

function WhyRebyuStickySection({ reduceMotion }) {
  const [activeStep, setActiveStep] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observers = itemRefs.current.map((element, index) => {
      if (!element) return null;
      return new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveStep(index);
          },
          { rootMargin: "-34% 0px -46% 0px", threshold: 0.08 },
      );
    });

    itemRefs.current.forEach(
        (element, index) => element && observers[index]?.observe(element),
    );
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return (
      <RevealSection
          className="bg-[#FCFDFF] px-5 py-20 lg:px-8 lg:py-28"
          reduceMotion={reduceMotion}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
              eyebrow="Why REBYU"
              title="Certification preparation should not feel scattered."
              description="A clearer system for discovering weak topics, studying with focus, and walking into practice sessions with direction."
          />
          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="space-y-6 lg:py-12">
              {storySteps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                    <article
                        key={step.number}
                        ref={(element) => {
                          itemRefs.current[index] = element;
                        }}
                        className={`rounded-3xl border p-6 transition-all sm:p-7 ${isActive ? "border-[#B9CCFF] bg-[#F3F6FF] shadow-[0_18px_45px_rgba(43,90,210,0.10)]" : "border-transparent bg-transparent opacity-65"}`}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4C70D2]">
                        {step.number} — {step.eyebrow}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold tracking-[-0.045em] text-[#0B1F3A] sm:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-[#61728C] sm:text-base">
                        {step.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {step.points.map((point) => (
                            <span
                                key={point}
                                className="inline-flex items-center gap-2 rounded-full border border-[#D8E3F5] bg-white px-3 py-2 text-xs font-semibold text-[#38506F]"
                            >
                        <Check className="size-3.5 text-[#275DF5]" />
                              {point}
                      </span>
                        ))}
                      </div>
                    </article>
                );
              })}
            </div>
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <motion.div
                  key={storySteps[activeStep].kind}
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[2rem] border border-[#D4E0F3] bg-[#F7F9FF] p-3 shadow-[0_28px_65px_rgba(30,70,145,0.12)] sm:p-5"
              >
                <StoryPreview kind={storySteps[activeStep].kind} />
              </motion.div>
            </div>
          </div>
        </div>
      </RevealSection>
  );
}

function StoryPreview({ kind }) {
  if (kind === "path") return <StudyPathVisual />;
  if (kind === "readiness") return <ReadinessVisual />;
  return <DiagnosticVisual />;
}

function DiagnosticVisual() {
  const bars = [
    ["Management and Organization", "74%", "74%", "bg-[#275DF5]"],
    ["Technology", "61%", "61%", "bg-[#F5B84C]"],
    ["Accounting and Financial Affairs", "42%", "42%", "bg-[#FF8E72]"],
  ];
  return (
      <div className="rounded-[1.5rem] border border-[#E0E8F5] bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#102C57]">
              Diagnostic Assessment
            </p>
            <p className="mt-1 text-[11px] text-[#7D8DA4]">
              IT Passport reviewer
            </p>
          </div>
          <span className="rounded-full bg-[#E8EFFF] px-3 py-1 text-[10px] font-bold text-[#275DF5]">
          Completed
        </span>
        </div>
        <div className="mt-8 space-y-5">
          {bars.map(([label, value, width, color]) => (
              <div key={label}>
                <div className="flex justify-between gap-3">
                  <p className="text-[11px] font-semibold text-[#53667F]">
                    {label}
                  </p>
                  <span className="text-[11px] font-bold text-[#53667F]">
                {value}
              </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#EEF3FC]">
                  <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`h-full rounded-full ${color}`}
                  />
                </div>
              </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-[#FFF2D8] p-4">
          <div className="flex items-center gap-2 text-[#84570C]">
            <Target className="size-4" />
            <p className="text-xs font-bold">Priority recommendation</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#876B35]">
            Start with Accounting and Financial Affairs before continuing to your
            next topic.
          </p>
        </div>
      </div>
  );
}

function StudyPathVisual() {
  const items = [
    ["Diagnostic Assessment", "Completed", "done"],
    ["Business Strategy", "Continue studying", "active"],
    ["Technology Management", "Unlock after current category", "locked"],
    ["Mock Examination", "Available after lessons", "locked"],
  ];
  return (
      <div className="rounded-[1.5rem] border border-[#E0E8F5] bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-[#102C57]">
              Personalized Study Path
            </p>
            <p className="mt-1 text-[11px] text-[#7D8DA4]">
              Your next recommended steps
            </p>
          </div>
          <BookOpen className="size-5 text-[#275DF5]" />
        </div>
        <div className="mt-8 space-y-5">
          {items.map(([title, subtitle, state], index) => (
              <div key={title} className="relative flex gap-3">
                {index < items.length - 1 && (
                    <div className="absolute left-[9px] top-6 h-8 border-l border-dashed border-[#D7E2F5]" />
                )}
                <div
                    className={`z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ${state === "done" ? "bg-[#E8EFFF] text-[#275DF5] ring-[#9AB5FF]" : state === "active" ? "bg-[#FFF2D8] text-[#A36A0C] ring-[#E3B661]" : "bg-[#F1F4F8] text-[#98A6B8] ring-[#D5DDE9]"}`}
                >
                  {state === "done" ? (
                      <Check className="size-3" />
                  ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#253D64]">{title}</p>
                  <p className="mt-1 text-[10px] text-[#8795A8]">{subtitle}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

function ReadinessVisual() {
  const bars = [43, 58, 55, 67, 64, 76, 84, 92];
  return (
      <div className="rounded-[1.5rem] border border-[#E0E8F5] bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#102C57]">
              Progress and Readiness
            </p>
            <p className="mt-1 text-[11px] text-[#7D8DA4]">
              Recent learning performance
            </p>
          </div>
          <div className="rounded-full bg-[#E8EFFF] px-3 py-1 text-[10px] font-bold text-[#275DF5]">
            68% Ready
          </div>
        </div>
        <div className="mt-8 flex h-40 items-end gap-2">
          {bars.map((height, index) => (
              <div
                  key={index}
                  className="flex flex-1 items-end rounded-t-md bg-[#EEF3FC]"
              >
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.48 }}
                    className={`w-full rounded-t-md ${index === bars.length - 1 ? "bg-[#275DF5]" : "bg-[#AFC4FF]"}`}
                />
              </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <MetricTile value="14" label="Lessons" />
          <MetricTile value="78%" label="Accuracy" />
          <MetricTile value="4" label="Day streak" />
        </div>
      </div>
  );
}

function MetricTile({ value, label }) {
  return (
      <div className="rounded-xl bg-[#F4F7FC] p-3 text-center">
        <p className="text-sm font-bold text-[#1A3763]">{value}</p>
        <p className="mt-1 text-[10px] text-[#8796AA]">{label}</p>
      </div>
  );
}

function CertificationCarouselSection({ reduceMotion }) {
  const trackRef = useRef(null);
  function scrollCarousel(direction) {
    trackRef.current?.scrollBy({ left: direction * 336, behavior: "smooth" });
  }

  return (
      <RevealSection
          className="overflow-hidden border-y border-[#D9E3F2] bg-[#EAF0FF] px-5 py-20 lg:px-8 lg:py-28"
          reduceMotion={reduceMotion}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
              eyebrow="Certification reviewers"
              title="Find the right reviewer for your certification goal."
              description="Select an official certification reviewer, accept an Enterprise invitation, or prepare using your own materials."
          />
          <div className="mt-10 flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous certifications"
                className="flex size-10 items-center justify-center rounded-full border border-[#C6D5EE] bg-white text-[#1E438E] transition hover:bg-[#F5F8FF]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Next certifications"
                className="flex size-10 items-center justify-center rounded-full border border-[#C6D5EE] bg-white text-[#1E438E] transition hover:bg-[#F5F8FF]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div
              ref={trackRef}
              className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {certifications.map((certification, index) => (
                <CertificationCard
                    key={certification.title}
                    certification={certification}
                    index={index}
                    reduceMotion={reduceMotion}
                />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
                asChild
                variant="outline"
                className="rounded-full border-[#BDCEEA] bg-white/80 text-[#17386F] hover:bg-white"
            >
              <Link to="/certifications">
                Explore all certifications <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </RevealSection>
  );
}

function CertificationCard({ certification, index, reduceMotion }) {
  const Icon = certification.icon;
  return (
      <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: index * 0.07, duration: 0.42 }}
          whileHover={
            reduceMotion ? undefined : { y: -8, rotate: index % 2 ? 0.4 : -0.4 }
          }
          className="group w-[286px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] border border-white/80 bg-[#FCFDFF] shadow-[0_14px_34px_rgba(29,66,137,0.11)]"
      >
        <div
            className={`relative flex h-52 items-end overflow-hidden bg-gradient-to-br p-5 ${certification.panel}`}
        >
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/20" />
          <div className="absolute -bottom-14 left-5 size-36 rounded-full bg-white/15" />
          <motion.div
              whileHover={reduceMotion ? undefined : { rotate: 7, scale: 1.06 }}
              className={`relative flex size-14 items-center justify-center rounded-2xl shadow-sm backdrop-blur ${certification.iconSurface}`}
          >
            <Icon className="size-7" />
          </motion.div>
          <span
              className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur ${certification.chip}`}
          >
          {certification.tag}
        </span>
          <div className="absolute bottom-5 right-5 flex items-end gap-1 opacity-80">
            {[20, 34, 27, 44, 52].map((h, barIndex) => (
                <span
                    key={barIndex}
                    style={{ height: h }}
                    className="w-1.5 rounded-full bg-white/70"
                />
            ))}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold tracking-tight text-[#102C57]">
            {certification.title}
          </h3>
          <p className="mt-2 min-h-[42px] text-sm leading-5 text-[#65758D]">
            {certification.description}
          </p>
          <Link
              to="/certifications"
              className="mt-5 inline-flex items-center text-sm font-bold text-[#275DF5] transition hover:text-[#153FBE]"
          >
            View reviewer{" "}
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.article>
  );
}

function ConnectedLearningSection({ reduceMotion }) {
  const [activeIndex, setActiveIndex] = useState(2);
  const activeCard = connectedCards[activeIndex];

  return (
      <RevealSection
          className="relative overflow-hidden bg-[#FCFDFF] px-5 py-20 lg:px-8 lg:py-28"
          reduceMotion={reduceMotion}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-14rem] top-1/3 size-[30rem] rounded-full bg-[#DDE7FF]/55 blur-3xl" />
          <div className="absolute right-[-10rem] top-0 size-[25rem] rounded-full bg-[#F8DFA5]/35 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
              eyebrow="Connected learning"
              title="Every study moment, connected."
              description="From your first diagnostic to your final mock exam, REBYU keeps your preparation focused in one connected learning experience."
          />
          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div className="relative mx-auto h-[340px] w-full max-w-3xl sm:h-[390px]">
              {connectedCards.map((card, index) => {
                const distance = index - activeIndex;
                const isActive = distance === 0;
                const Icon = card.icon;
                const translateX = distance * 52;
                const rotateY = distance * -13;
                return (
                    <motion.button
                        key={card.title}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-pressed={isActive}
                        className="absolute left-1/2 top-1/2 w-[230px] -translate-x-1/2 -translate-y-1/2 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#9AB5FF]/65 sm:w-[270px]"
                        animate={{
                          x: translateX,
                          y: Math.abs(distance) * 9,
                          scale: isActive
                              ? 1.07
                              : 0.88 - Math.min(Math.abs(distance), 2) * 0.035,
                          rotateY,
                          rotateZ: distance * -1.8,
                          opacity: Math.abs(distance) > 2 ? 0 : isActive ? 1 : 0.64,
                          zIndex: 10 - Math.abs(distance),
                        }}
                        transition={{ type: "spring", stiffness: 230, damping: 24 }}
                        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
                    >
                      <div
                          className={`min-h-[245px] rounded-[1.65rem] border border-white/75 p-5 shadow-[0_22px_50px_rgba(38,76,150,0.16)] ${card.tone}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex size-11 items-center justify-center rounded-xl bg-white/70 shadow-sm">
                            <Icon className="size-5" />
                          </div>
                          <span className="rounded-full bg-white/65 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide">
                        {card.label}
                      </span>
                        </div>
                        <h3 className="mt-8 text-lg font-bold tracking-tight">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-xs leading-5 opacity-75">
                          {card.description}
                        </p>
                        <div className="mt-5">
                          <ConnectedCardVisual visual={card.visual} />
                        </div>
                      </div>
                    </motion.button>
                );
              })}
            </div>
            <div className="rounded-[1.75rem] border border-[#D6E1F4] bg-white/80 p-7 shadow-[0_18px_46px_rgba(35,73,145,0.10)] backdrop-blur">
            <span className="inline-flex rounded-full bg-[#E8EFFF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#275DF5]">
              Learning flow
            </span>
              <h3 className="mt-5 text-3xl font-bold tracking-[-0.05em] text-[#0B1F3A]">
                {activeCard.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[#64758E]">
                {activeCard.description}
              </p>
              <div className="mt-7 flex gap-2">
                {connectedCards.map((card, index) => (
                    <button
                        key={card.title}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show ${card.title}`}
                        className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-8 bg-[#275DF5]" : "w-2.5 bg-[#C9D7F0] hover:bg-[#8EA9E3]"}`}
                    />
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs font-bold text-[#275DF5]">
                <Sparkles className="size-4" />
                One connected preparation experience
              </div>
            </div>
          </div>
        </div>
      </RevealSection>
  );
}

function ConnectedCardVisual({ visual }) {
  if (visual === "quiz")
    return (
        <div className="space-y-1.5">
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 w-4/5 rounded-full bg-white/60" />
          <div className="mt-3 flex gap-1.5">
            {["A", "B", "C", "D"].map((item, index) => (
                <span
                    key={item}
                    className={`flex size-6 items-center justify-center rounded-md text-[9px] font-bold ${index === 1 ? "bg-white text-[#8B3929]" : "bg-white/45"}`}
                >
              {item}
            </span>
            ))}
          </div>
        </div>
    );
  if (visual === "mock")
    return (
        <div className="flex items-end gap-1.5">
          <div className="rounded-lg bg-white/60 px-2 py-1 text-[9px] font-bold">
            45:00
          </div>
          <div className="ml-auto flex items-end gap-1">
            {[24, 38, 31, 48].map((height, index) => (
                <span
                    key={index}
                    style={{ height }}
                    className="w-2 rounded-t bg-white/75"
                />
            ))}
          </div>
        </div>
    );
  if (visual === "coach")
    return (
        <div className="space-y-2">
          <div className="ml-auto w-4/5 rounded-xl rounded-br-sm bg-white/70 p-2 text-[9px]">
            Explain this lesson.
          </div>
          <div className="w-[88%] rounded-xl rounded-bl-sm bg-white/45 p-2 text-[9px]">
            Here is a simpler way to understand it.
          </div>
        </div>
    );
  if (visual === "path")
    return (
        <div className="space-y-2">
          {["Diagnostic", "Business Strategy", "Mock Exam"].map((item, index) => (
              <div key={item} className="flex items-center gap-2">
            <span
                className={`size-2 rounded-full ${index === 1 ? "bg-white" : "bg-white/50"}`}
            />
                <span className="text-[9px] font-semibold">{item}</span>
              </div>
          ))}
        </div>
    );
  return (
      <div className="flex items-end gap-1">
        {[34, 58, 46, 72].map((height, index) => (
            <span
                key={index}
                style={{ height }}
                className="w-3 rounded-t bg-white/70"
            />
        ))}
      </div>
  );
}

function FeaturesBentoSection({ reduceMotion }) {
  const [expandedId, setExpandedId] = useState(null);
  const expandedCard = featureCards.find((card) => card.id === expandedId);

  return (
      <RevealSection
          className="bg-[#F5F8FF] px-5 py-20 lg:px-8 lg:py-28"
          reduceMotion={reduceMotion}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
              eyebrow="Features"
              title="Everything you need to prepare with confidence."
              description="A calm, connected workspace for every stage of your certification preparation."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-6">
            {featureCards.map((card, index) => (
                <FeatureBentoCard
                    key={card.id}
                    card={card}
                    index={index}
                    expanded={expandedId === card.id}
                    onExpand={() => setExpandedId(card.id)}
                    reduceMotion={reduceMotion}
                />
            ))}
          </div>
        </div>
        <AnimatePresence>
          {expandedCard && (
              <ExpandedFeatureDialog
                  card={expandedCard}
                  onClose={() => setExpandedId(null)}
              />
          )}
        </AnimatePresence>
      </RevealSection>
  );
}

function FeatureBentoCard({ card, index, expanded, onExpand, reduceMotion }) {
  const Icon = card.icon;
  return (
      <motion.button
          type="button"
          onClick={onExpand}
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: index * 0.07, duration: 0.43 }}
          whileHover={reduceMotion ? undefined : { y: -6 }}
          aria-expanded={expanded}
          className={`group relative min-h-[245px] overflow-hidden rounded-[1.55rem] border p-6 text-left shadow-[0_12px_28px_rgba(32,66,130,0.07)] transition-shadow hover:shadow-[0_22px_42px_rgba(32,66,130,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#9AB5FF]/65 ${card.size} ${card.tone}`}
      >
        <div className="relative z-10">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/80 text-[#275DF5] shadow-sm">
            <Icon className="size-5" />
          </div>
          <h3 className="mt-8 max-w-sm text-xl font-bold tracking-tight text-[#102C57]">
            {card.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#5D708B]">
            {card.description}
          </p>
        </div>
        <div className="absolute bottom-5 left-6 right-6">
          <BentoVisual visual={card.visual} />
        </div>
        <div className="absolute right-5 top-5 rounded-full bg-white/65 px-2.5 py-1 text-[10px] font-bold text-[#516681] opacity-0 transition-opacity group-hover:opacity-100">
          Expand
        </div>
      </motion.button>
  );
}

function BentoVisual({ visual }) {
  if (visual === "materials")
    return (
        <div className="flex gap-2">
          {["bg-[#275DF5]", "bg-[#F5C66C]", "bg-[#FF8E72]", "bg-[#8B7DEB]"].map(
              (color) => (
                  <div
                      key={color}
                      className="flex size-10 items-center justify-center rounded-xl bg-white/75 shadow-sm"
                  >
                    <span className={`size-4 rounded-md ${color}`} />
                  </div>
              ),
          )}
        </div>
    );
  if (visual === "practice")
    return (
        <div className="rounded-xl border border-white/75 bg-white/70 p-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#7E4336]">
            <span>Weak-topic quiz</span>
            <span>8 / 10</span>
          </div>
          <div className="mt-3 flex gap-1">
            {[1, 1, 1, 1, 1, 0, 1, 1].map((correct, index) => (
                <span
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${correct ? "bg-[#FF8E72]" : "bg-[#F4C9BE]"}`}
                />
            ))}
          </div>
        </div>
    );
  if (visual === "coach")
    return (
        <div className="space-y-2">
          <div className="ml-auto max-w-[82%] rounded-xl rounded-br-sm bg-white/75 p-2 text-[10px] text-[#5A4F97]">
            Explain this topic simply.
          </div>
          <div className="max-w-[88%] rounded-xl rounded-bl-sm bg-white/55 p-2 text-[10px] text-[#5A4F97]">
            Let’s break it into two ideas.
          </div>
        </div>
    );
  if (visual === "progress")
    return (
        <div className="flex h-16 items-end gap-1.5">
          {[30, 43, 38, 54, 62, 78].map((height, index) => (
              <span
                  key={index}
                  style={{ height: `${height}%` }}
                  className={`flex-1 rounded-t ${index === 5 ? "bg-[#275DF5]" : "bg-white/75"}`}
              />
          ))}
        </div>
    );
  return (
      <div className="rounded-2xl border border-white/80 bg-white/75 p-3 shadow-sm">
        <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#294775]">
          Today’s focus
        </span>
          <span className="rounded-full bg-[#E8EFFF] px-2 py-0.5 text-[9px] font-bold text-[#275DF5]">
          Priority
        </span>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="size-2.5 rounded-full bg-[#275DF5]" />
          <span className="text-[10px] text-[#667892]">
          Accounting and Financial Affairs
        </span>
        </div>
      </div>
  );
}

function ExpandedFeatureDialog({ card, onClose }) {
  const Icon = card.icon;
  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-[#081B38]/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${card.title} details`}
          onMouseDown={onClose}
      >
        <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onMouseDown={(event) => event.stopPropagation()}
            className={`relative w-full max-w-2xl rounded-[2rem] border p-6 shadow-[0_28px_80px_rgba(3,22,57,0.3)] sm:p-8 ${card.tone}`}
        >
          <button
              type="button"
              onClick={onClose}
              aria-label="Close feature details"
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-white/75 text-[#334F75] hover:bg-white"
          >
            <X className="size-4" />
          </button>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-[#275DF5] shadow-sm">
            <Icon className="size-6" />
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#4A6ECC]">
            REBYU feature
          </p>
          <h3 className="mt-3 max-w-lg text-3xl font-bold tracking-[-0.05em] text-[#102C57]">
            {card.title}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#5B6F8B]">
            {card.detail}
          </p>
          <div className="mt-8 rounded-2xl border border-white/80 bg-white/70 p-4">
            <ExpandedFeatureVisual visual={card.visual} />
          </div>
          <Button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-full bg-[#275DF5] text-white hover:bg-[#153FBE]"
          >
            Continue exploring <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>
      </motion.div>
  );
}

function ExpandedFeatureVisual({ visual }) {
  if (visual === "materials")
    return (
        <div className="grid grid-cols-4 gap-3">
          {["PDF reviewer", "Notes", "Slides", "Practice set"].map(
              (item, index) => (
                  <div
                      key={item}
                      className="rounded-xl border border-[#DCE6F4] bg-[#FCFDFF] p-3"
                  >
                    <div
                        className={`size-7 rounded-lg ${["bg-[#275DF5]", "bg-[#F5C66C]", "bg-[#FF8E72]", "bg-[#8B7DEB]"][index]}`}
                    />
                    <p className="mt-3 text-[10px] font-bold text-[#38506F]">
                      {item}
                    </p>
                  </div>
              ),
          )}
        </div>
    );
  if (visual === "coach")
    return (
        <div className="space-y-3">
          <div className="ml-auto max-w-[72%] rounded-2xl rounded-br-sm bg-[#E8EFFF] p-3 text-sm text-[#294C9B]">
            What does opportunity cost mean?
          </div>
          <div className="max-w-[86%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm text-[#566B88] shadow-sm">
            It is the value of the next best choice you give up when you choose
            something else.
          </div>
        </div>
    );
  return (
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricTile value="68%" label="Readiness" />
        <MetricTile value="78%" label="Practice accuracy" />
        <MetricTile value="4 days" label="Current streak" />
      </div>
  );
}

function AccessSection({ reduceMotion }) {
  return (
      <RevealSection
          className="relative isolate overflow-hidden border-y border-[#D9E3F2] bg-[radial-gradient(circle_at_6%_88%,rgba(167,194,255,0.6),transparent_29%),radial-gradient(circle_at_90%_2%,rgba(245,198,108,0.38),transparent_25%),#EAF0FF] px-5 py-20 lg:px-8 lg:py-28"
          reduceMotion={reduceMotion}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
              eyebrow="Get access"
              title="Start your REBYU journey."
              description="Choose the path that fits you, whether you are learning independently or supporting a group of learners."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <AccessCard
                icon={GraduationCap}
                eyebrow="For learners"
                title="Prepare for your certification your way."
                description="Buy an official certification reviewer, accept an Enterprise invitation, or use your own materials to create a private reviewer."
                points={[
                  "Buy official certification reviewers",
                  "Accept an Enterprise invitation",
                  "Track progress, mastery, and readiness",
                  "Follow a personalized study path",
                ]}
                buttonLabel="Get started"
                to="/register"
            />
            <AccessCard
                enterprise
                icon={Building2}
                eyebrow="For enterprises"
                title="Give your learners a better way to prepare."
                description="Partner with REBYU to provide official certification access, manage learner slots, and monitor progress in one place."
                points={[
                  "Request organization access",
                  "Choose certification reviewers and slots",
                  "Invite learners through email",
                  "Monitor diagnostic completion and progress",
                ]}
                buttonLabel="Request Enterprise access"
                to="/enterprise/request-access"
            />
          </div>
        </div>
      </RevealSection>
  );
}

function AccessCard({
                      icon: Icon,
                      eyebrow,
                      title,
                      description,
                      points,
                      buttonLabel,
                      to,
                      enterprise = false,
                    }) {
  return (
      <article className="rounded-[1.75rem] border border-white/80 bg-white/85 p-7 shadow-[0_18px_42px_rgba(31,70,142,0.10)] backdrop-blur sm:p-8">
        <div
            className={`flex size-12 items-center justify-center rounded-2xl ${enterprise ? "bg-[#FFE6DF] text-[#A54A35]" : "bg-[#E8EFFF] text-[#275DF5]"}`}
        >
          <Icon className="size-6" />
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[#4B6FCB]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.045em] text-[#102C57]">
          {title}
        </h3>
        <p className="mt-5 text-sm leading-6 text-[#667791]">{description}</p>
        <div className="mt-8 space-y-4">
          {points.map((point) => (
              <div
                  key={point}
                  className="flex items-start gap-3 text-sm text-[#465D7C]"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-[#275DF5]" />
                <span>{point}</span>
              </div>
          ))}
        </div>
        <Button
            asChild
            className={`mt-9 w-full rounded-full ${enterprise ? "bg-[#FF8E72] text-white hover:bg-[#E77459]" : "bg-[#275DF5] text-white hover:bg-[#153FBE]"}`}
        >
          <Link to={to}>
            {buttonLabel}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </article>
  );
}

function Footer() {
  return (
      <footer className="bg-[#0B1F3A] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1.5fr_0.8fr_0.8fr]">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[#0B1F3A]">
                  <GraduationCap className="size-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">REBYU</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#B8C7E2]">
                REBYU helps learners study smarter, practice with purpose, and
                prepare confidently for proficiency certifications.
              </p>
            </div>
            <FooterColumn
                title="Pages"
                links={[
                  { label: "About", to: "/about" },
                  { label: "How It Works", to: "/how-it-works" },
                  { label: "Certifications", to: "/certifications" },
                  { label: "Features", to: "/features" },
                ]}
            />
            <FooterColumn
                title="Information"
                links={[
                  { label: "Get Access", to: "/get-access" },
                  { label: "Contact", to: "/contact" },
                  { label: "Privacy Policy", to: "/privacy-policy" },
                  { label: "Terms of Use", to: "/terms-of-use" },
                ]}
            />
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-[#9DB2D7] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} REBYU. All rights reserved.</p>
            <p>Study with direction. Practice with purpose.</p>
          </div>
        </div>
      </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <div className="mt-4 flex flex-col gap-3">
          {links.map((link) => (
              <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-[#B8C7E2] transition hover:text-white"
              >
                {link.label}
              </Link>
          ))}
        </div>
      </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4B6FCB]">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-[-0.055em] text-[#0B1F3A] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#64758E]">
              {description}
            </p>
        )}
      </div>
  );
}

function RevealSection({ children, className, reduceMotion }) {
  return (
      <motion.section
          variants={sectionMotion}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className={className}
      >
        {children}
      </motion.section>
  );
}

export default LandingPage;

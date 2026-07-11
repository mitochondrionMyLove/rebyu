import React, { useMemo, useState } from "react"
import {
    Bookmark,
    BookOpen,
    ChevronRight,
    FileArchive,
    FileText,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Search,
    Send,
    Share2,
    Sparkles,
    Users,
    UsersRound,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LearnerPageHeader } from "@/components/learner/learner-ui.jsx"

const FEED_TABS = [
    { value: "for-you", label: "For you" },
    { value: "discussion", label: "Discussions" },
    { value: "quizzes", label: "Quizzes" },
    { value: "notes", label: "PDFs & notes" },
    { value: "docx", label: "DOCX" },
    { value: "circle", label: "Study circles" },
]

const INITIAL_POSTS = [
    {
        postId: 1,
        authorName: "Mara Reyes",
        initials: "MR",
        badge: "Top contributor",
        badgeClass:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        community: "PNLE 2026 Review Circle",
        createdAt: "2 hours ago",
        title: "PNLE pharmacology quick notes",
        description:
            "Concise medication-safety notes covering digoxin, insulin, anticoagulants, and high-alert medication checks.",
        postType: "notes",
        attachment: {
            name: "PNLE Pharmacology Quick Notes.pdf",
            type: "PDF",
            meta: "48 pages · Pharmacology · 572 saves",
        },
        reactions: 482,
        comments: 39,
        liked: false,
        saved: false,
    },
    {
        postId: 2,
        authorName: "Arvin N. Lopez",
        initials: "AN",
        badge: "LET reviewer",
        badgeClass:
            "border-amber-200 bg-amber-50 text-amber-700",
        community: "LET Professional Education",
        createdAt: "Yesterday",
        title: "How do you approach classroom assessment questions?",
        description:
            "I keep confusing assessment for learning and assessment of learning during timed quizzes. What examples help you remember the difference?",
        postType: "discussion",
        reactions: 316,
        comments: 27,
        liked: true,
        saved: true,
    },
    {
        postId: 3,
        authorName: "Camille Torres",
        initials: "CT",
        badge: "Contributor",
        badgeClass:
            "border-blue-200 bg-blue-50 text-blue-700",
        community: "Civil Service Prep Hub",
        createdAt: "2 days ago",
        title: "Numerical reasoning shortcuts",
        description:
            "A short DOCX reviewer with percentage, ratio, sequence, and work-rate shortcuts for timed entrance and civil service exams.",
        postType: "docx",
        attachment: {
            name: "Numerical Reasoning Shortcuts.docx",
            type: "DOCX",
            meta: "18 pages · Numerical Reasoning",
        },
        reactions: 251,
        comments: 18,
        liked: false,
        saved: false,
    },
    {
        postId: 4,
        authorName: "Joshua Lim",
        initials: "JL",
        badge: "Circle owner",
        badgeClass:
            "border-violet-200 bg-violet-50 text-violet-700",
        community: "Programming Practice",
        createdAt: "3 days ago",
        title: "Programming Practice study circle is now open",
        description:
            "Join us for weekly coding drills, solution reviews, and timed programming challenges.",
        postType: "circle",
        circleId: 4,
        reactions: 192,
        comments: 14,
        liked: false,
        saved: false,
    },
]

const INITIAL_STUDY_CIRCLES = [
    {
        circleId: 1,
        initials: "PN",
        name: "PNLE 2026 Review Circle",
        description: "Medication, nursing concepts, and mock-exam discussions.",
        members: 8200,
        newResources: 34,
        joined: true,
        owner: false,
    },
    {
        circleId: 2,
        initials: "LE",
        name: "LET Professional Education",
        description: "Teaching strategies, assessment, and professional education.",
        members: 3400,
        newResources: 12,
        joined: false,
        owner: false,
    },
    {
        circleId: 3,
        initials: "CS",
        name: "Civil Service Prep Hub",
        description: "Verbal, numerical, analytical, and clerical ability practice.",
        members: 2100,
        newResources: 7,
        joined: false,
        owner: false,
    },
    {
        circleId: 4,
        initials: "PP",
        name: "Programming Practice",
        description: "Coding drills, solution reviews, and timed challenges.",
        members: 563,
        newResources: 9,
        joined: false,
        owner: false,
    },
]

const POPULAR_TOPICS = [
    "PNLE Pharmacology",
    "LET Assessment Strategies",
    "Community Health Nursing",
    "Numerical Reasoning",
]

function createInitials(value) {
    return String(value)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
}

function CommunityAvatar({ initials, className = "" }) {
    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ${className}`}
            aria-hidden="true"
        >
            {initials}
        </div>
    )
}

function AttachmentIcon({ type }) {
    if (type === "QUIZ") {
        return <BookOpen className="h-5 w-5 text-primary" />
    }

    if (type === "DOCX") {
        return <FileArchive className="h-5 w-5 text-emerald-600" />
    }

    return <FileText className="h-5 w-5 text-blue-600" />
}

function PostTypeBadge({ type }) {
    const styles = {
        discussion:
            "border-violet-200 bg-violet-50 text-violet-700",
        quizzes:
            "border-blue-200 bg-blue-50 text-blue-700",
        notes:
            "border-amber-200 bg-amber-50 text-amber-700",
        docx:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        circle:
            "border-cyan-200 bg-cyan-50 text-cyan-700",
    }

    const labels = {
        discussion: "Discussion",
        quizzes: "Quiz",
        notes: "PDF / Notes",
        docx: "DOCX",
        circle: "Study Circle",
    }

    return (
        <Badge
            variant="outline"
            className={`h-5 rounded-full px-1.5 text-[10px] ${
                styles[type] ?? styles.discussion
            }`}
        >
            {labels[type] ?? "Post"}
        </Badge>
    )
}

function CommunityPost({
                           post,
                           circles,
                           onToggleLike,
                           onToggleSave,
                           onOpenComments,
                           onJoinCircle,
                       }) {
    const linkedCircle = post.circleId
        ? circles.find((circle) => circle.circleId === post.circleId)
        : null

    return (
        <article className="rounded-xl border bg-background">
            <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <CommunityAvatar initials={post.initials} />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {post.authorName}
              </span>

                            <Badge
                                variant="outline"
                                className={`h-5 rounded-full px-1.5 text-[10px] ${post.badgeClass}`}
                            >
                                {post.badge}
                            </Badge>
                        </div>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {post.createdAt} · {post.community}
                        </p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Post actions"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={() => onToggleSave(post.postId)}
                            >
                                <Bookmark className="mr-2 h-4 w-4" />
                                {post.saved ? "Remove from saved" : "Save post"}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                Copy link
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>Hide post</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                Report post
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="mt-4">
                    <div className="mb-2">
                        <PostTypeBadge type={post.postType} />
                    </div>

                    <h2 className="text-base font-semibold leading-6 text-foreground">
                        {post.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {post.description}
                    </p>
                </div>

                {post.attachment ? (
                    <div className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                            <AttachmentIcon type={post.attachment.type} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                                {post.attachment.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {post.attachment.meta}
                            </p>
                        </div>
                    </div>
                ) : null}

                {linkedCircle ? (
                    <div className="mt-4 flex flex-col gap-3 rounded-lg border bg-muted/20 px-3 py-3 sm:flex-row sm:items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                            {linkedCircle.initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                                {linkedCircle.name}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {linkedCircle.members.toLocaleString()} members
                            </p>
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            variant={linkedCircle.joined ? "outline" : "default"}
                            onClick={() => onJoinCircle(linkedCircle.circleId)}
                        >
                            {linkedCircle.joined ? "Joined" : "Join circle"}
                        </Button>
                    </div>
                ) : null}

                <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
                    <button
                        type="button"
                        className="hover:text-foreground"
                        onClick={() => onToggleLike(post.postId)}
                    >
                        {post.reactions + (post.liked ? 1 : 0)} reactions
                    </button>

                    <button
                        type="button"
                        className="hover:text-foreground"
                        onClick={() => onOpenComments(post.postId)}
                    >
                        {post.comments} comments
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 border-t">
                <Button
                    type="button"
                    variant="ghost"
                    className="h-11 rounded-none"
                    onClick={() => onToggleLike(post.postId)}
                >
                    <Heart
                        className={`mr-2 h-4 w-4 ${
                            post.liked ? "fill-primary text-primary" : ""
                        }`}
                    />
                    Like
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    className="h-11 rounded-none border-x"
                    onClick={() => onOpenComments(post.postId)}
                >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comment
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    className="h-11 rounded-none"
                    onClick={() => toast.success("Post link copied.")}
                >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>
            </div>
        </article>
    )
}

export default function Community() {
    const [posts, setPosts] = useState(INITIAL_POSTS)
    const [circles, setCircles] = useState(INITIAL_STUDY_CIRCLES)
    const [activeTab, setActiveTab] = useState("for-you")
    const [searchValue, setSearchValue] = useState("")

    const [composerOpen, setComposerOpen] = useState(false)
    const [shareType, setShareType] = useState("discussion")
    const [shareTitle, setShareTitle] = useState("")
    const [shareDescription, setShareDescription] = useState("")
    const [shareCommunity, setShareCommunity] = useState(
        "PNLE 2026 Review Circle"
    )

    const [createCircleOpen, setCreateCircleOpen] = useState(false)
    const [circleName, setCircleName] = useState("")
    const [circleDescription, setCircleDescription] = useState("")
    const [circleCertification, setCircleCertification] = useState(
        "IT Passport"
    )

    const visiblePosts = useMemo(() => {
        const query = searchValue.trim().toLowerCase()

        return posts.filter((post) => {
            const matchesTab =
                activeTab === "for-you" || post.postType === activeTab

            const matchesSearch =
                !query ||
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.authorName.toLowerCase().includes(query) ||
                post.community.toLowerCase().includes(query)

            return matchesTab && matchesSearch
        })
    }, [activeTab, posts, searchValue])

    function openComposer(type) {
        setShareType(type)
        setComposerOpen(true)
    }

    function toggleLike(postId) {
        setPosts((current) =>
            current.map((post) =>
                post.postId === postId
                    ? { ...post, liked: !post.liked }
                    : post
            )
        )
    }

    function toggleSave(postId) {
        setPosts((current) =>
            current.map((post) =>
                post.postId === postId
                    ? { ...post, saved: !post.saved }
                    : post
            )
        )
    }

    function toggleJoinCircle(circleId) {
        setCircles((current) =>
            current.map((circle) =>
                circle.circleId === circleId
                    ? {
                        ...circle,
                        joined: !circle.joined,
                        members: circle.joined
                            ? Math.max(0, circle.members - 1)
                            : circle.members + 1,
                    }
                    : circle
            )
        )
    }

    function publishPost() {
        if (!shareTitle.trim() || !shareDescription.trim()) {
            toast.error("Add a title and description.")
            return
        }

        const nextPost = {
            postId: Date.now(),
            authorName: "Glyzel",
            initials: "GG",
            badge: "Learner",
            badgeClass:
                "border-violet-200 bg-violet-50 text-violet-700",
            community: shareCommunity,
            createdAt: "Just now",
            title: shareTitle.trim(),
            description: shareDescription.trim(),
            postType: shareType,
            attachment:
                shareType === "discussion"
                    ? null
                    : {
                        name:
                            shareType === "quizzes"
                                ? shareTitle.trim()
                                : `${shareTitle.trim()}.${
                                    shareType === "docx" ? "docx" : "pdf"
                                }`,
                        type:
                            shareType === "quizzes"
                                ? "QUIZ"
                                : shareType === "docx"
                                    ? "DOCX"
                                    : "PDF",
                        meta:
                            shareType === "quizzes"
                                ? "Shared quiz"
                                : shareType === "docx"
                                    ? "Shared DOCX resource"
                                    : "Shared PDF or notes",
                    },
            reactions: 0,
            comments: 0,
            liked: false,
            saved: false,
        }

        setPosts((current) => [nextPost, ...current])
        setShareTitle("")
        setShareDescription("")
        setComposerOpen(false)
        toast.success(
            shareType === "discussion"
                ? "Discussion posted."
                : "Resource shared with the community."
        )
    }

    function createStudyCircle() {
        if (!circleName.trim() || !circleDescription.trim()) {
            toast.error("Add a circle name and description.")
            return
        }

        const circleId = Date.now()
        const newCircle = {
            circleId,
            initials: createInitials(circleName),
            name: circleName.trim(),
            description: circleDescription.trim(),
            members: 1,
            newResources: 0,
            joined: true,
            owner: true,
        }

        const announcementPost = {
            postId: circleId + 1,
            authorName: "Glyzel",
            initials: "GG",
            badge: "Circle owner",
            badgeClass:
                "border-cyan-200 bg-cyan-50 text-cyan-700",
            community: newCircle.name,
            createdAt: "Just now",
            title: `${newCircle.name} study circle was created`,
            description: `${newCircle.description} This circle focuses on ${circleCertification}. Join the circle to participate in discussions and shared reviews.`,
            postType: "circle",
            circleId,
            reactions: 0,
            comments: 0,
            liked: false,
            saved: false,
        }

        setCircles((current) => [newCircle, ...current])
        setPosts((current) => [announcementPost, ...current])
        setCircleName("")
        setCircleDescription("")
        setCreateCircleOpen(false)
        setActiveTab("for-you")

        toast.success("Study circle created and posted to the news feed.")
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <LearnerPageHeader
                    title="Community"
                    subtitle="Start discussions, share study resources, and join study circles with other REBYU learners."
                />

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateCircleOpen(true)}
                    >
                        <UsersRound className="mr-2 h-4 w-4" />
                        Create circle
                    </Button>

                    <Button
                        type="button"
                        onClick={() => openComposer("discussion")}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create post
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                <main className="min-w-0 space-y-4">
                    <section className="rounded-xl border bg-background p-4">
                        <button
                            type="button"
                            className="flex w-full items-center gap-3"
                            onClick={() => openComposer("discussion")}
                        >
                            <CommunityAvatar initials="GG" />

                            <div className="flex h-10 min-w-0 flex-1 items-center rounded-full bg-muted px-4 text-left text-sm text-muted-foreground">
                                Start a discussion or share a review resource, Glyzel...
                            </div>
                        </button>

                        <div className="mt-4 grid gap-2 border-t pt-3 sm:grid-cols-4">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => openComposer("discussion")}
                            >
                                <MessageCircle className="mr-2 h-4 w-4 text-violet-600" />
                                Discussion
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => openComposer("quizzes")}
                            >
                                <BookOpen className="mr-2 h-4 w-4 text-blue-600" />
                                Share quiz
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => openComposer("notes")}
                            >
                                <FileText className="mr-2 h-4 w-4 text-orange-600" />
                                PDF / notes
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => openComposer("docx")}
                            >
                                <FileArchive className="mr-2 h-4 w-4 text-emerald-600" />
                                DOCX
                            </Button>
                        </div>
                    </section>

                    <section className="grid gap-3 rounded-lg border bg-background px-4 py-3 text-xs text-muted-foreground sm:grid-cols-2">
                        <p>
              <span className="font-semibold text-primary">
                Start discussions and ask questions
              </span>{" "}
                            about lessons, quizzes, exam strategies, and study topics.
                        </p>

                        <p>
                            Share only files you created or have permission to distribute.
                        </p>
                    </section>

                    <div className="flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-sm font-semibold">Community news feed</h2>

                        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
                            {FEED_TABS.map((tab) => (
                                <Button
                                    key={tab.value}
                                    type="button"
                                    variant={
                                        activeTab === tab.value ? "secondary" : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setActiveTab(tab.value)}
                                    className="shrink-0"
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search discussions, quizzes, files, or circles..."
                            className="pl-9"
                        />
                    </div>

                    {visiblePosts.length > 0 ? (
                        <div className="space-y-4">
                            {visiblePosts.map((post) => (
                                <CommunityPost
                                    key={post.postId}
                                    post={post}
                                    circles={circles}
                                    onToggleLike={toggleLike}
                                    onToggleSave={toggleSave}
                                    onJoinCircle={toggleJoinCircle}
                                    onOpenComments={() =>
                                        toast.info("Comments panel can open here.")
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="border-y py-16 text-center">
                            <MessageCircle className="mx-auto h-6 w-6 text-muted-foreground" />
                            <p className="mt-3 text-sm font-semibold">
                                No community posts found
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Try changing the feed tab or search.
                            </p>
                        </div>
                    )}
                </main>

                <aside className="space-y-4">
                    <section className="rounded-xl border bg-background p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold">Study circles</h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Join or create focused review groups.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCreateCircleOpen(true)}
                                aria-label="Create study circle"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-3 divide-y">
                            {circles.map((circle) => (
                                <div
                                    key={circle.circleId}
                                    className="py-3"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                            {circle.initials}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {circle.name}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                {circle.members.toLocaleString()} members
                                                {circle.owner ? " · You own this circle" : ""}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={circle.joined ? "outline" : "default"}
                                        className="mt-2 w-full"
                                        onClick={() => toggleJoinCircle(circle.circleId)}
                                        disabled={circle.owner}
                                    >
                                        {circle.owner
                                            ? "Owner"
                                            : circle.joined
                                                ? "Joined"
                                                : "Join circle"}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="mt-2 h-auto px-0"
                        >
                            Browse all circles
                        </Button>
                    </section>

                    <section className="rounded-xl border bg-background p-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h2 className="text-sm font-semibold">Popular this week</h2>
                        </div>

                        <ol className="mt-3 divide-y">
                            {POPULAR_TOPICS.map((topic, index) => (
                                <li key={topic}>
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 py-3 text-left"
                                        onClick={() => setSearchValue(topic)}
                                    >
                    <span className="w-4 text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                                        <span className="text-xs text-foreground">
                      {topic}
                    </span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="rounded-xl border bg-background p-4">
                        <h2 className="text-sm font-semibold">Community reminder</h2>

                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                            Be respectful during discussions. Do not share active exam
                            answers, copied reviewer courses, or files you are not allowed to
                            distribute.
                        </p>
                    </section>
                </aside>
            </div>

            <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Create community post</DialogTitle>
                        <DialogDescription>
                            Start a discussion or share a study resource with a study circle.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2 sm:grid-cols-4">
                            {[
                                {
                                    value: "discussion",
                                    label: "Discussion",
                                    icon: MessageCircle,
                                },
                                {
                                    value: "quizzes",
                                    label: "Quiz",
                                    icon: BookOpen,
                                },
                                {
                                    value: "notes",
                                    label: "PDF / Notes",
                                    icon: FileText,
                                },
                                {
                                    value: "docx",
                                    label: "DOCX",
                                    icon: FileArchive,
                                },
                            ].map((type) => {
                                const Icon = type.icon

                                return (
                                    <Button
                                        key={type.value}
                                        type="button"
                                        variant={
                                            shareType === type.value ? "default" : "outline"
                                        }
                                        onClick={() => setShareType(type.value)}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {type.label}
                                    </Button>
                                )
                            })}
                        </div>

                        <Select
                            value={shareCommunity}
                            onValueChange={setShareCommunity}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a study circle" />
                            </SelectTrigger>

                            <SelectContent>
                                {circles
                                    .filter((circle) => circle.joined || circle.owner)
                                    .map((circle) => (
                                        <SelectItem
                                            key={circle.circleId}
                                            value={circle.name}
                                        >
                                            {circle.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>

                        <Input
                            value={shareTitle}
                            onChange={(event) => setShareTitle(event.target.value)}
                            placeholder={
                                shareType === "discussion"
                                    ? "Discussion title or question"
                                    : "Resource title"
                            }
                        />

                        <Textarea
                            value={shareDescription}
                            onChange={(event) =>
                                setShareDescription(event.target.value)
                            }
                            placeholder={
                                shareType === "discussion"
                                    ? "Write your question, opinion, or discussion..."
                                    : "Add a short description of what this resource covers..."
                            }
                            className="min-h-28"
                        />

                        {shareType !== "discussion" &&
                        shareType !== "quizzes" ? (
                            <button
                                type="button"
                                className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center"
                            >
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="mt-2 text-sm font-medium">
                  Choose a{" "}
                                    {shareType === "docx" ? "DOCX" : "PDF"} file
                </span>
                                <span className="mt-1 text-xs text-muted-foreground">
                  Select a file you created or have permission to share.
                </span>
                            </button>
                        ) : null}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setComposerOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="button" onClick={publishPost}>
                            <Send className="mr-2 h-4 w-4" />
                            {shareType === "discussion"
                                ? "Post discussion"
                                : "Share resource"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={createCircleOpen}
                onOpenChange={setCreateCircleOpen}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create study circle</DialogTitle>
                        <DialogDescription>
                            Create a focused study group. A public announcement will
                            automatically be added to the community news feed.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="circle-name">Circle name</Label>
                            <Input
                                id="circle-name"
                                value={circleName}
                                onChange={(event) => setCircleName(event.target.value)}
                                placeholder="Example: IT Passport Security Review"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="circle-certification">
                                Certification or topic
                            </Label>

                            <Select
                                value={circleCertification}
                                onValueChange={setCircleCertification}
                            >
                                <SelectTrigger id="circle-certification">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="IT Passport">
                                        IT Passport
                                    </SelectItem>
                                    <SelectItem value="TOPCIT">TOPCIT</SelectItem>
                                    <SelectItem value="Fundamental Engineer">
                                        Fundamental Engineer
                                    </SelectItem>
                                    <SelectItem value="General Study">
                                        General Study
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="circle-description">Description</Label>
                            <Textarea
                                id="circle-description"
                                value={circleDescription}
                                onChange={(event) =>
                                    setCircleDescription(event.target.value)
                                }
                                placeholder="Explain what learners will study and discuss in this circle..."
                                className="min-h-28"
                            />
                        </div>

                        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs leading-5 text-muted-foreground">
                            After creation, the circle will appear in the Study Circles list
                            and a joinable announcement post will be published to the news
                            feed.
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateCircleOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="button" onClick={createStudyCircle}>
                            <UsersRound className="mr-2 h-4 w-4" />
                            Create study circle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
import { useEffect, useState } from "react"
import { ImagePlus, Plus, Trash2, Video as VideoIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"

import {
    Card,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"

import {
    Tabs as ShadcnTabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Accordion as ShadcnAccordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FILE_API_URL = "http://localhost:8080/api/files/download"

function createId(prefix) {
    return `${prefix}-${crypto.randomUUID()}`
}

function getDownloadUrl(key) {
    if (!key) return ""

    if (key.startsWith("http://") || key.startsWith("https://")) {
        return key
    }

    return `${FILE_API_URL}?key=${encodeURIComponent(key)}`
}

function useObjectUrl(file) {
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (!file) {
            setUrl("")
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setUrl(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    return url
}

function FloatingDeleteButton({ onClick }) {
    return (
        <button
            type="button"
            title="Delete tool"
            aria-label="Delete tool"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white/95 text-zinc-400 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={(event) => {
                event.stopPropagation()
                onClick()
            }}
        >
            <Trash2 size={16} />
        </button>
    )
}

function AddButton({ children, onClick, className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 ${className}`}
        >
            <Plus className="h-4 w-4" />
            {children}
        </button>
    )
}

function RemoveButton({ children = "Remove", onClick, disabled = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:pointer-events-none disabled:opacity-35"
        >
            {children}
        </button>
    )
}

function ToolShell({ title, description, onDelete, children, className = "" }) {
    return (
        <section
            className={`relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md ${className}`}
        >
            <FloatingDeleteButton onClick={onDelete} />

            {(title || description) && (
                <div className="border-b border-zinc-100 bg-zinc-50/70 px-5 py-4 pr-16">
                    {title && <h3 className="font-semibold text-zinc-950">{title}</h3>}
                    {description && (
                        <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
                    )}
                </div>
            )}

            <div className="space-y-5 p-5">{children}</div>
        </section>
    )
}

function SectionHeading({ title, description, action }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <h3 className="font-semibold text-zinc-950">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
                )}
            </div>

            {action}
        </div>
    )
}

function InlineField({ value, onChange, placeholder, className = "" }) {
    return (
        <input
            type="text"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={`w-full border-0 bg-transparent outline-none placeholder:text-zinc-300 ${className}`}
        />
    )
}

function TextAreaField({ value, onChange, placeholder, rows = 4, className = "" }) {
    return (
        <textarea
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full resize-none rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700 outline-none transition placeholder:text-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100 ${className}`}
        />
    )
}

function ImageUploadArea({ data, onDataChange, title = "Upload an image" }) {
    const selectedImage = data?.file ?? null
    const uploadedImagePreview = useObjectUrl(selectedImage)
    const previewUrl = uploadedImagePreview || getDownloadUrl(data?.imageKey)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/jpeg": [".jpeg", ".jpg", ".jfif"],
            "image/png": [".png"],
            "image/webp": [".webp"],
            "image/gif": [".gif"],
        },
        multiple: false,
        onDrop: (acceptedFiles) => {
            const imageFile = acceptedFiles[0]
            if (!imageFile) return

            onDataChange({
                ...data,
                file: imageFile,
                imageKey: "",
            })
        },
    })

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`cursor-pointer rounded-3xl border-2 border-dashed p-7 text-center transition ${
                    isDragActive
                        ? "border-zinc-950 bg-zinc-100"
                        : "border-zinc-200 bg-zinc-50/70 hover:border-zinc-500 hover:bg-white"
                }`}
            >
                <input {...getInputProps()} />
                <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm">
                    <ImagePlus className="h-5 w-5" />
                </div>
                <p className="font-medium text-zinc-800">
                    {isDragActive ? "Drop the image here" : title}
                </p>
                <p className="mt-1 text-sm text-zinc-500">JPG, PNG, WebP, GIF, or JFIF.</p>
            </div>

            {previewUrl && (
                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
                    <img
                        src={previewUrl}
                        alt={data?.smallHeader || data?.title || "Lesson upload preview"}
                        className="max-h-[420px] w-full object-cover"
                    />
                </div>
            )}
        </div>
    )
}

function VideoUploadArea({ data, onDataChange, title = "Upload a video" }) {
    const selectedVideo = data?.file ?? null
    const uploadedVideoPreview = useObjectUrl(selectedVideo)
    const previewUrl = uploadedVideoPreview || getDownloadUrl(data?.videoKey)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "video/mp4": [".mp4"],
            "video/webm": [".webm"],
            "video/ogg": [".ogg"],
        },
        multiple: false,
        onDrop: (acceptedFiles) => {
            const videoFile = acceptedFiles[0]
            if (!videoFile) return

            onDataChange({
                ...data,
                file: videoFile,
                videoKey: "",
            })
        },
    })

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`cursor-pointer rounded-3xl border-2 border-dashed p-7 text-center transition ${
                    isDragActive
                        ? "border-zinc-950 bg-zinc-100"
                        : "border-zinc-200 bg-zinc-50/70 hover:border-zinc-500 hover:bg-white"
                }`}
            >
                <input {...getInputProps()} />
                <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm">
                    <VideoIcon className="h-5 w-5" />
                </div>
                <p className="font-medium text-zinc-800">
                    {isDragActive ? "Drop the video here" : title}
                </p>
                <p className="mt-1 text-sm text-zinc-500">MP4, WebM, or OGG.</p>
            </div>

            {previewUrl && (
                <video
                    src={previewUrl}
                    controls
                    className="w-full rounded-3xl border border-zinc-200 bg-black"
                />
            )}
        </div>
    )
}

export function HeadingTool({ data, onDataChange, onDelete }) {
    return (
        <div className="relative rounded-2xl px-1 py-2 transition hover:bg-zinc-50">
            <FloatingDeleteButton onClick={onDelete} />

            <InlineField
                value={data?.text}
                onChange={(value) => onDataChange({ ...data, text: value })}
                placeholder="Write a heading..."
                className="pr-12 text-3xl font-bold text-zinc-950"
            />
        </div>
    )
}

export function SubheadingTool({ data, onDataChange, onDelete }) {
    return (
        <div className="relative rounded-2xl px-1 py-2 transition hover:bg-zinc-50">
            <FloatingDeleteButton onClick={onDelete} />

            <InlineField
                value={data?.text}
                onChange={(value) => onDataChange({ ...data, text: value })}
                placeholder="Write a smaller heading..."
                className="pr-12 text-xl font-semibold text-zinc-900"
            />
        </div>
    )
}

export function DescriptionTool({ data, onDataChange, onDelete }) {
    return (
        <div className="relative">
            <FloatingDeleteButton onClick={onDelete} />

            <TextAreaField
                value={data?.text}
                onChange={(value) => onDataChange({ ...data, text: value })}
                placeholder="Write a description..."
                rows={4}
                className="pr-12"
            />
        </div>
    )
}

function ListEditorTool({ data, onDataChange, onDelete, ordered = false }) {
    const items = data?.items ?? []

    function updateItem(itemId, value) {
        onDataChange({
            ...data,
            items: items.map((item) =>
                item.id === itemId ? { ...item, text: value } : item
            ),
        })
    }

    function addItem() {
        onDataChange({
            ...data,
            items: [...items, { id: createId("list"), text: "" }],
        })
    }

    function removeItem(itemId) {
        if (items.length <= 1) return
        onDataChange({ ...data, items: items.filter((item) => item.id !== itemId) })
    }

    const ListTag = ordered ? "ol" : "ul"

    return (
        <ToolShell
            title={ordered ? "Numbered list" : "Bullet list"}
            description="Add important lesson points or instructions."
            onDelete={onDelete}
        >
            <SectionHeading
                title="List items"
                description="New items start blank so you can type directly."
                action={<AddButton onClick={addItem}>Add item</AddButton>}
            />

            <ListTag className={ordered ? "list-decimal space-y-3 pl-6" : "list-disc space-y-3 pl-6"}>
                {items.map((item, index) => (
                    <li key={item.id} className="pl-1 marker:text-zinc-400">
                        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-2 transition focus-within:border-zinc-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-100">
                            <input
                                type="text"
                                value={item.text ?? ""}
                                onChange={(event) => updateItem(item.id, event.target.value)}
                                placeholder={`List item ${index + 1}`}
                                className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                            />
                            <RemoveButton onClick={() => removeItem(item.id)} disabled={items.length <= 1} />
                        </div>
                    </li>
                ))}
            </ListTag>
        </ToolShell>
    )
}

export function UnorderedListTool(props) {
    return <ListEditorTool {...props} ordered={false} />
}

export function OrderedListTool(props) {
    return <ListEditorTool {...props} ordered />
}

function ImageTextTool({ data, onDataChange, onDelete, imagePosition = "left" }) {
    const toolData = data ?? {}
    const imageIsOnRight = imagePosition === "right"

    return (
        <ToolShell
            title={imageIsOnRight ? "Text with image on the right" : "Image with text on the right"}
            description="Combine an image with an explanation or lesson content."
            onDelete={onDelete}
        >
            <div className="grid gap-6 md:grid-cols-2 md:items-start">
                <div className={imageIsOnRight ? "md:order-2" : "md:order-1"}>
                    <ImageUploadArea data={toolData} onDataChange={onDataChange} />
                </div>

                <div className={imageIsOnRight ? "md:order-1" : "md:order-2"}>
                    <InlineField
                        value={toolData.title}
                        onChange={(value) => onDataChange({ ...toolData, title: value })}
                        placeholder="Write a title..."
                        className="text-2xl font-bold text-zinc-950"
                    />

                    <TextAreaField
                        value={toolData.description}
                        onChange={(value) => onDataChange({ ...toolData, description: value })}
                        placeholder="Write the explanation..."
                        rows={8}
                        className="mt-4"
                    />
                </div>
            </div>
        </ToolShell>
    )
}

export function ImageLeftTextTool(props) {
    return <ImageTextTool {...props} imagePosition="left" />
}

export function ImageRightTextTool(props) {
    return <ImageTextTool {...props} imagePosition="right" />
}

function TabsEditor({ items, onItemsChange, intro }) {
    const tabItems = items ?? []
    const [activeTab, setActiveTab] = useState(tabItems[0]?.id ?? "")

    useEffect(() => {
        const activeTabStillExists = tabItems.some((tab) => tab.id === activeTab)
        if (!activeTabStillExists) setActiveTab(tabItems[0]?.id ?? "")
    }, [tabItems, activeTab])

    function updateTab(tabId, field, value) {
        onItemsChange(
            tabItems.map((tab) => (tab.id === tabId ? { ...tab, [field]: value } : tab))
        )
    }

    function addTab() {
        const newTab = { id: createId("tab"), label: "", title: "", description: "" }
        onItemsChange([...tabItems, newTab])
        setActiveTab(newTab.id)
    }

    function removeTab(tabId) {
        if (tabItems.length <= 1) return

        const updatedTabs = tabItems.filter((tab) => tab.id !== tabId)
        onItemsChange(updatedTabs)
        if (activeTab === tabId) setActiveTab(updatedTabs[0]?.id ?? "")
    }

    return (
        <div className="space-y-4">
            <SectionHeading
                title="Tabs"
                description={intro ?? "New tabs start blank and stay inside this block."}
                action={<AddButton onClick={addTab}>Add tab</AddButton>}
            />

            <ShadcnTabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex h-auto w-full flex-nowrap justify-start overflow-x-auto rounded-2xl bg-zinc-100 p-1">
                    {tabItems.map((tab, index) => (
                        <TabsTrigger key={tab.id} value={tab.id} className="shrink-0 rounded-xl">
                            {tab.label || `Tab ${index + 1}`}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabItems.map((tab, index) => (
                    <TabsContent key={tab.id} value={tab.id}>
                        <Card className="rounded-3xl border-zinc-200 shadow-none">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-full space-y-3">
                                        <input
                                            type="text"
                                            value={tab.label ?? ""}
                                            onChange={(event) => updateTab(tab.id, "label", event.target.value)}
                                            placeholder={`Tab ${index + 1} label`}
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium outline-none placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
                                        />

                                        <input
                                            type="text"
                                            value={tab.title ?? ""}
                                            onChange={(event) => updateTab(tab.id, "title", event.target.value)}
                                            placeholder={`Tab ${index + 1} title`}
                                            className="w-full bg-transparent text-xl font-semibold text-zinc-950 outline-none placeholder:text-zinc-300"
                                        />
                                    </div>

                                    <RemoveButton onClick={() => removeTab(tab.id)} disabled={tabItems.length <= 1} />
                                </div>

                                <CardDescription>
                                    <TextAreaField
                                        value={tab.description}
                                        onChange={(value) => updateTab(tab.id, "description", value)}
                                        placeholder={`Write content for Tab ${index + 1}...`}
                                        rows={4}
                                        className="mt-3"
                                    />
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </TabsContent>
                ))}
            </ShadcnTabs>
        </div>
    )
}

export function TabsTool({ data, onDataChange, onDelete }) {
    return (
        <ToolShell
            title="Tabs block"
            description="Add content that learners can open by tab."
            onDelete={onDelete}
        >
            <TabsEditor
                items={data?.items ?? []}
                onItemsChange={(items) => onDataChange({ ...data, items })}
            />
        </ToolShell>
    )
}

function AccordionEditor({ items, onItemsChange, intro }) {
    const accordionItems = items ?? []

    function updateItem(itemId, field, value) {
        onItemsChange(
            accordionItems.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
            )
        )
    }

    function addItem() {
        onItemsChange([
            ...accordionItems,
            { id: createId("accordion"), title: "", content: "" },
        ])
    }

    function removeItem(itemId) {
        if (accordionItems.length <= 1) return
        onItemsChange(accordionItems.filter((item) => item.id !== itemId))
    }

    return (
        <div className="space-y-4">
            <SectionHeading
                title="Accordion items"
                description={intro ?? "New items start blank so you can type directly."}
                action={<AddButton onClick={addItem}>Add item</AddButton>}
            />

            <ShadcnAccordion type="single" collapsible className="w-full space-y-3">
                {accordionItems.map((item, index) => (
                    <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="rounded-2xl border border-zinc-200 px-4"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={item.title ?? ""}
                                onChange={(event) => updateItem(item.id, "title", event.target.value)}
                                placeholder={`Accordion item ${index + 1} title`}
                                className="w-full bg-transparent py-4 font-medium outline-none placeholder:text-zinc-400"
                            />

                            <AccordionTrigger className="w-auto shrink-0 px-2">
                                <span className="sr-only">Toggle content</span>
                            </AccordionTrigger>
                        </div>

                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                <TextAreaField
                                    value={item.content}
                                    onChange={(value) => updateItem(item.id, "content", value)}
                                    rows={4}
                                    placeholder={`Write content for item ${index + 1}...`}
                                />

                                <RemoveButton onClick={() => removeItem(item.id)} disabled={accordionItems.length <= 1}>
                                    Remove item
                                </RemoveButton>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </ShadcnAccordion>
        </div>
    )
}

export function AccordionTool({ data, onDataChange, onDelete }) {
    return (
        <ToolShell
            title="Accordion block"
            description="Create expandable questions, notes, or explanations."
            onDelete={onDelete}
        >
            <AccordionEditor
                items={data?.items ?? []}
                onItemsChange={(items) => onDataChange({ ...data, items })}
            />
        </ToolShell>
    )
}

function FlipCardsEditor({ cards, onCardsChange, intro }) {
    const cardItems = cards ?? []
    const [flippedCardId, setFlippedCardId] = useState(null)

    function updateCard(cardId, field, value) {
        onCardsChange(
            cardItems.map((card) =>
                card.id === cardId ? { ...card, [field]: value } : card
            )
        )
    }

    function addCard() {
        onCardsChange([
            ...cardItems,
            { id: createId("flip-card"), frontTitle: "", backTitle: "", description: "" },
        ])
    }

    function removeCard(cardId) {
        if (cardItems.length <= 1) return

        onCardsChange(cardItems.filter((card) => card.id !== cardId))
        if (flippedCardId === cardId) setFlippedCardId(null)
    }

    function toggleCard(cardId) {
        setFlippedCardId((currentId) => (currentId === cardId ? null : cardId))
    }

    return (
        <div className="space-y-4">
            <SectionHeading
                title="Review cards"
                description={intro ?? "New cards start blank and use placeholders only."}
                action={<AddButton onClick={addCard}>Add card</AddButton>}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {cardItems.map((card, index) => {
                    const isFlipped = flippedCardId === card.id

                    return (
                        <div key={card.id} className="h-64 w-full [perspective:1000px]">
                            <div
                                className={`relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
                                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                                }`}
                            >
                                <div className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-zinc-950 p-5 text-white shadow-sm [backface-visibility:hidden]">
                                    <div>
                                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                                            Front {index + 1}
                                        </p>

                                        <input
                                            type="text"
                                            value={card.frontTitle ?? ""}
                                            onChange={(event) => updateCard(card.id, "frontTitle", event.target.value)}
                                            placeholder="Question or term"
                                            className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-zinc-500"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toggleCard(card.id)}
                                        className="self-start rounded-full border border-white/20 px-3 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
                                    >
                                        Flip card
                                    </button>
                                </div>

                                <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col justify-between rounded-3xl bg-zinc-100 p-5 text-zinc-950 shadow-sm [backface-visibility:hidden]">
                                    <div>
                                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                                            Back {index + 1}
                                        </p>

                                        <input
                                            type="text"
                                            value={card.backTitle ?? ""}
                                            onChange={(event) => updateCard(card.id, "backTitle", event.target.value)}
                                            placeholder="Answer"
                                            className="w-full bg-transparent text-xl font-semibold text-zinc-950 outline-none placeholder:text-zinc-400"
                                        />

                                        <textarea
                                            value={card.description ?? ""}
                                            onChange={(event) => updateCard(card.id, "description", event.target.value)}
                                            rows={3}
                                            placeholder="Explanation..."
                                            className="mt-3 w-full resize-none bg-transparent text-sm text-zinc-600 outline-none placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleCard(card.id)}
                                            className="rounded-full bg-black px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                                        >
                                            Flip back
                                        </button>

                                        <RemoveButton onClick={() => removeCard(card.id)} disabled={cardItems.length <= 1} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function FlipGridTool({ data, onDataChange, onDelete }) {
    return (
        <ToolShell
            title="Flip card grid"
            description="Great for flashcards, terms, questions, and answers."
            onDelete={onDelete}
        >
            <FlipCardsEditor
                cards={data?.cards ?? []}
                onCardsChange={(cards) => onDataChange({ ...data, cards })}
            />
        </ToolShell>
    )
}

export function ImageTool({ data, onDataChange, onDelete }) {
    return (
        <ToolShell
            title="Image block"
            description="Upload an image for your lesson."
            onDelete={onDelete}
        >
            <ImageUploadArea data={data ?? {}} onDataChange={onDataChange} />
        </ToolShell>
    )
}

export function VideoTool({ data, onDataChange, onDelete }) {
    return (
        <ToolShell
            title="Video block"
            description="Upload a video lesson or explanation."
            onDelete={onDelete}
        >
            <VideoUploadArea data={data ?? {}} onDataChange={onDataChange} />
        </ToolShell>
    )
}

function CombinedHeaderFields({ data, onDataChange, title, description }) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-5">
            <div className="mb-4">
                <h3 className="font-semibold text-zinc-950">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
            </div>

            <div className="space-y-3">
                <InlineField
                    value={data?.smallHeader}
                    onChange={(value) => onDataChange({ ...data, smallHeader: value })}
                    placeholder="Write a smaller heading..."
                    className="text-xl font-semibold text-zinc-900"
                />

                <TextAreaField
                    value={data?.description}
                    onChange={(value) => onDataChange({ ...data, description: value })}
                    placeholder="Write a description..."
                    rows={4}
                />
            </div>
        </div>
    )
}

function GridItemsEditor({ data, onDataChange }) {
    const items = data?.gridItems ?? []

    function updateItem(itemId, field, value) {
        onDataChange({
            ...data,
            gridItems: items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
            ),
        })
    }

    function addItem() {
        onDataChange({
            ...data,
            gridItems: [...items, { id: createId("grid"), title: "", description: "" }],
        })
    }

    function removeItem(itemId) {
        if (items.length <= 1) return
        onDataChange({ ...data, gridItems: items.filter((item) => item.id !== itemId) })
    }

    return (
        <div className="space-y-4">
            <SectionHeading
                title="Grid cards"
                description="New cards start blank and use placeholders only."
                action={<AddButton onClick={addItem}>Add card</AddButton>}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="space-y-3 rounded-3xl border border-zinc-200 bg-zinc-50/60 p-4 transition hover:bg-white hover:shadow-sm"
                    >
                        <input
                            type="text"
                            value={item.title ?? ""}
                            onChange={(event) => updateItem(item.id, "title", event.target.value)}
                            placeholder={`Card ${index + 1} title`}
                            className="w-full bg-transparent text-lg font-semibold text-zinc-950 outline-none placeholder:text-zinc-300"
                        />

                        <TextAreaField
                            value={item.description}
                            onChange={(value) => updateItem(item.id, "description", value)}
                            placeholder={`Card ${index + 1} description...`}
                            rows={4}
                        />

                        <RemoveButton onClick={() => removeItem(item.id)} disabled={items.length <= 1}>
                            Remove card
                        </RemoveButton>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function IntroImageCardTool({ data, onDataChange, onDelete }) {
    const toolData = data ?? {}

    return (
        <ToolShell
            title="Intro image card"
            description="A smaller heading, description, and image in one combined block."
            onDelete={onDelete}
        >
            <CombinedHeaderFields
                data={toolData}
                onDataChange={onDataChange}
                title="Intro content"
                description="This uses the same heading and description behavior as your individual tools."
            />

            <ImageUploadArea data={toolData} onDataChange={onDataChange} title="Upload intro image" />
        </ToolShell>
    )
}

export function HeaderDescriptionGridTool({ data, onDataChange, onDelete }) {
    const toolData = data ?? {}

    return (
        <ToolShell
            title="Header description grid"
            description="A smaller heading, description, and grid cards in one block."
            onDelete={onDelete}
        >
            <CombinedHeaderFields
                data={toolData}
                onDataChange={onDataChange}
                title="Header content"
                description="Start with a heading and description, then add grid cards below."
            />

            <GridItemsEditor data={toolData} onDataChange={onDataChange} />
        </ToolShell>
    )
}

export function ImageFeatureGridTool({ data, onDataChange, onDelete }) {
    const toolData = data ?? {}

    return (
        <ToolShell
            title="Image feature grid"
            description="A smaller heading, description, image, and grid cards in one block."
            onDelete={onDelete}
        >
            <CombinedHeaderFields
                data={toolData}
                onDataChange={onDataChange}
                title="Feature content"
                description="Add the intro text, upload an image, then list the features."
            />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                <ImageUploadArea data={toolData} onDataChange={onDataChange} title="Upload feature image" />
                <GridItemsEditor data={toolData} onDataChange={onDataChange} />
            </div>
        </ToolShell>
    )
}

export function ReviewCardGridTool({ data, onDataChange, onDelete }) {
    const toolData = data ?? {}

    return (
        <ToolShell
            title="Review card grid"
            description="A smaller heading, description, and flip card grid in one block."
            onDelete={onDelete}
        >
            <CombinedHeaderFields
                data={toolData}
                onDataChange={onDataChange}
                title="Review intro"
                description="Add context before the cards. The cards use the same behavior as your individual flip cards."
            />

            <FlipCardsEditor
                cards={toolData.cards ?? []}
                onCardsChange={(cards) => onDataChange({ ...toolData, cards })}
            />
        </ToolShell>
    )
}

export function ContentAccordionBlockTool({ data, onDataChange, onDelete }) {
    const toolData = data ?? {}

    return (
        <ToolShell
            title="Accordion content block"
            description="A smaller heading, description, and accordion in one block."
            onDelete={onDelete}
        >
            <CombinedHeaderFields
                data={toolData}
                onDataChange={onDataChange}
                title="Accordion intro"
                description="Add context before the accordion items."
            />

            <AccordionEditor
                items={toolData.items ?? []}
                onItemsChange={(items) => onDataChange({ ...toolData, items })}
            />
        </ToolShell>
    )
}

export function ContentTabsBlockTool({ data, onDataChange, onDelete }) {
    const toolData = data ?? {}

    return (
        <ToolShell
            title="Tabs content block"
            description="A smaller heading, description, and tabs in one block."
            onDelete={onDelete}
        >
            <CombinedHeaderFields
                data={toolData}
                onDataChange={onDataChange}
                title="Tabs intro"
                description="Add context before the tabs. New tabs stay inside this block."
            />

            <TabsEditor
                items={toolData.items ?? []}
                onItemsChange={(items) => onDataChange({ ...toolData, items })}
            />
        </ToolShell>
    )
}

export function MediaTextBlockTool({ data, onDataChange, onDelete }) {
    const toolData = data ?? {}
    const mediaType = toolData.mediaType === "video" ? "video" : "image"
    const mediaIsOnRight = toolData.layout === "image-right"

    function updateField(field, value) {
        const nextData = { ...toolData, [field]: value }

        if (field === "mediaType") {
            nextData.mediaType = value === "video" ? "video" : "image"
            nextData.file = null

            if (nextData.mediaType === "video") {
                nextData.imageKey = ""
            } else {
                nextData.videoKey = ""
            }
        }

        onDataChange(nextData)
    }

    return (
        <ToolShell
            title="Media text block"
            description="A smaller heading, description, media, and supporting text in one block."
            onDelete={onDelete}
        >
            <CombinedHeaderFields
                data={toolData}
                onDataChange={onDataChange}
                title="Media intro"
                description="Add context before the image or video layout."
            />

            <div className="grid gap-3 rounded-3xl border border-zinc-200 bg-zinc-50/60 p-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-medium text-zinc-700">
                    <span>Media type</span>
                    <select
                        value={mediaType}
                        onChange={(event) => updateField("mediaType", event.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
                    >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-zinc-700">
                    <span>Layout</span>
                    <select
                        value={toolData.layout === "image-right" ? "image-right" : "image-left"}
                        onChange={(event) => updateField("layout", event.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
                    >
                        <option value="image-left">Media left</option>
                        <option value="image-right">Media right</option>
                    </select>
                </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:items-start">
                <div className={mediaIsOnRight ? "md:order-2" : "md:order-1"}>
                    {mediaType === "video" ? (
                        <VideoUploadArea data={toolData} onDataChange={onDataChange} title="Upload media video" />
                    ) : (
                        <ImageUploadArea data={toolData} onDataChange={onDataChange} title="Upload media image" />
                    )}
                </div>

                <div className={mediaIsOnRight ? "md:order-1" : "md:order-2"}>
                    <InlineField
                        value={toolData.supportingTitle}
                        onChange={(value) => updateField("supportingTitle", value)}
                        placeholder="Write a title..."
                        className="text-2xl font-bold text-zinc-950"
                    />

                    <TextAreaField
                        value={toolData.supportingDescription}
                        onChange={(value) => updateField("supportingDescription", value)}
                        placeholder="Write the explanation..."
                        rows={8}
                        className="mt-4"
                    />
                </div>
            </div>
        </ToolShell>
    )
}

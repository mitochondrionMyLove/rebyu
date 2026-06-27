import { useEffect, useState, useContext } from "react"
import { Trash2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
      onClick={onClick}
    >
      <Trash2 size={16} />
    </button>
  )
}

export function HeadingTool({ value = "", onChange, onClick }) {
  return (
    <div className="relative">
      <FloatingDeleteButton onClick={onClick} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Write a heading..."
        className="w-full border-0 bg-transparent text-3xl font-bold text-zinc-950 outline-none placeholder:text-zinc-300"
      />
    </div>
  )
}

export function DescriptionTool({ value = "", onChange, onClick }) {
  return (
    <div className="relative">
      <FloatingDeleteButton onClick={onClick}/>

      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Write a description..."
        rows={4}
        className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 transition outline-none focus:border-zinc-950"
      />
    </div>
  )
}

export function TabsTool({ onClick}) {
  const [activeTab, setActiveTab] = useState("overview")

  const [tabItems, setTabItems] = useState([
    {
      id: "overview",
      label: "Overview",
      title: "Overview",
      description: "Write the overview content here.",
    },
    {
      id: "analytics",
      label: "Analytics",
      title: "Analytics",
      description: "Write the analytics content here.",
    },
    {
      id: "reports",
      label: "Reports",
      title: "Reports",
      description: "Write the reports content here.",
    },
  ])

  function updateTab(id, field, value) {
    setTabItems((currentTabs) =>
      currentTabs.map((tab) =>
        tab.id === id ? { ...tab, [field]: value } : tab
      )
    )
  }

  function addTab({ onClick }) {
    const newTab = {
      id: createId("tab"),
      label: "New Tab",
      title: "New Tab",
      description: "Write your tab content here.",
    }

    setTabItems((currentTabs) => [...currentTabs, newTab])
    setActiveTab(newTab.id)
  }

  function removeTab(id) {
    if (tabItems.length === 1) return

    const nextTabs = tabItems.filter((tab) => tab.id !== id)

    setTabItems(nextTabs)

    if (activeTab === id) {
      setActiveTab(nextTabs[0].id)
    }
  }

  return (
    <section className="relative w-full space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <FloatingDeleteButton onClick={onClick}/>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-950">Tabs block</h3>
          <p className="text-sm text-zinc-500">
            Add content that learners can open by tab.
          </p>
        </div>

        <button
          type="button"
          onClick={addTab}
          className="mr-10 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Add tab
        </button>
      </div>

      <ShadcnTabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start overflow-x-auto">
          {tabItems.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label || "Untitled"}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabItems.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="w-full">
                    <input
                      type="text"
                      value={tab.label}
                      onChange={(event) =>
                        updateTab(tab.id, "label", event.target.value)
                      }
                      placeholder="Tab label"
                      className="mb-3 w-full border-b border-zinc-200 bg-transparent pb-2 text-sm font-medium outline-none focus:border-zinc-950"
                    />

                    <input
                      type="text"
                      value={tab.title}
                      onChange={(event) =>
                        updateTab(tab.id, "title", event.target.value)
                      }
                      placeholder="Tab title"
                      className="w-full bg-transparent text-xl font-semibold text-zinc-950 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTab(tab.id)}
                    className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <CardDescription>
                  <textarea
                    value={tab.description}
                    onChange={(event) =>
                      updateTab(tab.id, "description", event.target.value)
                    }
                    placeholder="Write tab content..."
                    rows={4}
                    className="mt-3 w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 outline-none focus:border-zinc-950"
                  />
                </CardDescription>
              </CardHeader>

              <CardContent className="text-sm text-zinc-500">
                This is how the learner will see your tab content.
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </ShadcnTabs>
    </section>
  )
}

export function ImageTool({ onChange, onClick }) {
  const [imageFile, setImageFile] = useState(null)
  const imagePreview = useObjectUrl(imageFile)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedImage = acceptedFiles[0]

      if (!selectedImage) return

      setImageFile(selectedImage)
      onChange?.(selectedImage)
    },
  })

  return (
    <section className="relative space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <FloatingDeleteButton onClick={onClick} />

      <div>
        <h3 className="font-semibold text-zinc-950">Image block</h3>
        <p className="text-sm text-zinc-500">
          Upload an image for your lesson.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragActive
            ? "border-zinc-950 bg-zinc-100"
            : "border-zinc-200 hover:border-zinc-500"
        }`}
      >
        <input {...getInputProps()} />

        <p className="font-medium text-zinc-800">
          {isDragActive ? "Drop the image here" : "Upload an image"}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          Drag and drop or click to select a JPG, PNG, or WebP file.
        </p>
      </div>

      {imagePreview && (
        <div className="space-y-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <img
              src={imagePreview}
              alt="Lesson upload preview"
              className="max-h-[420px] w-full object-cover"
            />
          </div>
          <p className="text-xs text-zinc-500">
            {imageFile?.name} &middot; {formatFileSize(imageFile?.size ?? 0)}
          </p>
        </div>
      )}
    </section>
  )
}

export function AccordionTool({onClick}) {
  const [items, setItems] = useState([
    {
      id: "item-1",
      title: "What is this lesson about?",
      content: "Write the answer or lesson explanation here.",
    },
  ])

  function updateItem(id, field, value) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  function addItem() {
    const newItem = {
      id: createId("accordion"),
      title: "New accordion item",
      content: "Write content here.",
    }

    setItems((currentItems) => [...currentItems, newItem])
  }

  function removeItem(id) {
    if (items.length === 1) return

    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  return (
    <section className="relative space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <FloatingDeleteButton onClick={onClick}/>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-950">Accordion block</h3>
          <p className="text-sm text-zinc-500">
            Create expandable questions, notes, or explanations.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mr-10 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Add item
        </button>
      </div>

      <ShadcnAccordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="gap-4">
              <input
                type="text"
                value={item.title}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) =>
                  updateItem(item.id, "title", event.target.value)
                }
                className="w-full bg-transparent font-medium outline-none"
              />
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-3 pt-2">
                <textarea
                  value={item.content}
                  onChange={(event) =>
                    updateItem(item.id, "content", event.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-zinc-200 p-3 text-sm text-zinc-700 outline-none focus:border-zinc-950"
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove item
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </ShadcnAccordion>
    </section>
  )
}

export function FlipGridTool({onClick}) {
  const [flippedCardId, setFlippedCardId] = useState(null)

  const [cards, setCards] = useState([
    {
      id: "card-1",
      frontTitle: "Definition",
      backTitle: "Answer",
      description: "Write the explanation here.",
    },
    {
      id: "card-2",
      frontTitle: "Question",
      backTitle: "Answer",
      description: "Write the answer here.",
    },
    {
      id: "card-3",
      frontTitle: "Term",
      backTitle: "Meaning",
      description: "Write the meaning here.",
    },
  ])

  function updateCard(id, field, value) {
    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    )
  }

  function addCard() {
    setCards((currentCards) => [
      ...currentCards,
      {
        id: createId("flip-card"),
        frontTitle: "New question",
        backTitle: "New answer",
        description: "Write the explanation here.",
      },
    ])
  }

  function removeCard(id) {
    setCards((currentCards) => currentCards.filter((card) => card.id !== id))

    if (flippedCardId === id) {
      setFlippedCardId(null)
    }
  }

  function toggleCard(id) {
    setFlippedCardId((currentId) => (currentId === id ? null : id))
  }

  return (
    <section className="relative space-y-5 rounded-2xl border border-zinc-200 bg-white p-5">
      <FloatingDeleteButton onClick={onClick}/>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-950">Flip card grid</h3>
          <p className="text-sm text-zinc-500">
            Great for flashcards, terms, questions, and answers.
          </p>
        </div>

        <button
          type="button"
          onClick={addCard}
          className="mr-10 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Add card
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card) => {
          const isFlipped = flippedCardId === card.id

          return (
            <div key={card.id} className="h-64 w-full [perspective:1000px]">
              <div
                className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-black p-5 text-white [backface-visibility:hidden]">
                  <div>
                    <p className="mb-3 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                      Front
                    </p>

                    <input
                      type="text"
                      value={card.frontTitle}
                      onChange={(event) =>
                        updateCard(card.id, "frontTitle", event.target.value)
                      }
                      className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-zinc-500"
                      placeholder="Question or term"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCard(card.id)}
                    className="self-start rounded-lg border border-white/20 px-3 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
                  >
                    Flip card
                  </button>
                </div>

                <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col justify-between rounded-2xl bg-zinc-100 p-5 text-zinc-950 [backface-visibility:hidden]">
                  <div>
                    <p className="mb-3 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
                      Back
                    </p>

                    <input
                      type="text"
                      value={card.backTitle}
                      onChange={(event) =>
                        updateCard(card.id, "backTitle", event.target.value)
                      }
                      className="w-full bg-transparent text-xl font-semibold text-zinc-950 outline-none"
                      placeholder="Answer"
                    />

                    <textarea
                      value={card.description}
                      onChange={(event) =>
                        updateCard(card.id, "description", event.target.value)
                      }
                      rows={3}
                      className="mt-3 w-full resize-none bg-transparent text-sm text-zinc-600 outline-none"
                      placeholder="Explanation..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleCard(card.id)}
                      className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                    >
                      Flip back
                    </button>

                    <button
                      type="button"
                      onClick={() => removeCard(card.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function ImageTextTool({ imagePosition = "left", data = {}, onDataChange, onClick }) {
  const [imageFile, setImageFile] = useState(null)
  const imagePreview = useObjectUrl(imageFile)
  const imageSource = imagePreview || (data.imageKey ? getFileViewUrl(data.imageKey) : "")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedImage = acceptedFiles[0]

      if (!selectedImage) return

      setImageFile(selectedImage)
      onDataChange?.({ file: selectedImage })
    },
  })

  const imageBlock = (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragActive
            ? "border-zinc-950 bg-zinc-100"
            : "border-zinc-200 hover:border-zinc-500"
        }`}
      >
        <input {...getInputProps()} />
        <p className="font-medium text-zinc-800">
          {isDragActive ? "Drop the image here" : "Upload an image"}
        </p>
      </div>
      {imageSource ? (
        <img
          src={imageSource}
          alt="Lesson upload preview"
          className="max-h-[320px] w-full rounded-2xl border border-zinc-200 object-cover"
        />
      ) : null}
    </div>
  )

  const textBlock = (
    <textarea
      value={data.text ?? ""}
      onChange={(event) => onDataChange?.({ text: event.target.value })}
      placeholder="Write supporting text..."
      rows={8}
      className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 transition outline-none focus:border-zinc-950"
    />
  )

  return (
    <section className="relative rounded-2xl border border-zinc-200 bg-white p-5">
      <FloatingDeleteButton onClick={onClick} />
      <div className="grid gap-5 md:grid-cols-2">
        {imagePosition === "left" ? imageBlock : textBlock}
        {imagePosition === "left" ? textBlock : imageBlock}
      </div>
    </section>
  )
}

export function VideoTool({ data = {}, onChange, onClick }) {
  const [videoFile, setVideoFile] = useState(null)
  const videoPreview = useObjectUrl(videoFile)
  const videoSource = videoPreview || (data.videoKey ? getFileViewUrl(data.videoKey) : "")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogg"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedVideo = acceptedFiles[0]

      if (!selectedVideo) return

      setVideoFile(selectedVideo)
      onChange?.(selectedVideo)
    },
  })

  return (
    <section className="relative space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <FloatingDeleteButton onClick={onClick}/>

      <div>
        <h3 className="font-semibold text-zinc-950">Video block</h3>
        <p className="text-sm text-zinc-500">
          Upload a video lesson or explanation.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragActive
            ? "border-zinc-950 bg-zinc-100"
            : "border-zinc-200 hover:border-zinc-500"
        }`}
      >
        <input {...getInputProps()} />

        <p className="font-medium text-zinc-800">
          {isDragActive ? "Drop the video here" : "Upload a video"}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          Drag and drop or click to select an MP4, WebM, or OGG video.
        </p>
      </div>

      {videoSource && (
        <div className="space-y-2">
          <video
            src={videoSource}
            controls
            className="w-full rounded-2xl border border-zinc-200 bg-black"
          />
          {videoFile ? (
            <p className="text-xs text-zinc-500">
              {videoFile.name} &middot; {formatFileSize(videoFile.size)}
            </p>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default function LessonToolsPreview({ index, sectionIndex }) {
  const [heading, setHeading] = useState("Introduction to Networking")
  const [description, setDescription] = useState(
    "Learn the basic concepts of computer networking."
  )

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <HeadingTool value={heading} onChange={setHeading} />
      <DescriptionTool value={description} onChange={setDescription} />
      <TabsTool />
      <AccordionTool />
      <FlipGridTool />
      <ImageTool
        onChange={(file) => {
          console.log("Selected image:", file)
        }}
      />
      <VideoTool
        onChange={(file) => {
          console.log("Selected video:", file)
        }}
      />
    </section>
  )
}

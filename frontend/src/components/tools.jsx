import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

import {
  Card,
  CardContent,
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
  if (!key) {
    return ""
  }

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

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
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
          onClick={(event) => {
            event.stopPropagation()
            onClick()
          }}
      >
        <Trash2 size={16} />
      </button>
  )
}

export function HeadingTool({ data, onDataChange, onDelete }) {
  return (
      <div className="relative">
        <FloatingDeleteButton onClick={onDelete} />

        <input
            type="text"
            value={data?.text ?? ""}
            onChange={(event) =>
                onDataChange({
                  ...data,
                  text: event.target.value,
                })
            }
            placeholder="Write a heading..."
            className="w-full border-0 bg-transparent pr-10 text-3xl font-bold text-zinc-950 outline-none placeholder:text-zinc-300"
        />
      </div>
  )
}

export function SubheadingTool({ data, onDataChange, onDelete }) {
  return (
      <div className="relative">
        <FloatingDeleteButton onClick={onDelete} />

        <input
            type="text"
            value={data?.text ?? ""}
            onChange={(event) =>
                onDataChange({
                  ...data,
                  text: event.target.value,
                })
            }
            placeholder="Write a smaller heading..."
            className="w-full border-0 bg-transparent pr-10 text-xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-300"
        />
      </div>
  )
}

export function DescriptionTool({ data, onDataChange, onDelete }) {
  return (
      <div className="relative">
        <FloatingDeleteButton onClick={onDelete} />

        <textarea
            value={data?.text ?? ""}
            onChange={(event) =>
                onDataChange({
                  ...data,
                  text: event.target.value,
                })
            }
            placeholder="Write a description..."
            rows={4}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 pr-12 text-sm text-zinc-700 outline-none transition focus:border-zinc-950"
        />
      </div>
  )
}

function ListEditorTool({
                          data,
                          onDataChange,
                          onDelete,
                          ordered = false,
                        }) {
  const items = data?.items ?? []

  function updateItem(itemId, value) {
    onDataChange({
      ...data,
      items: items.map((item) =>
          item.id === itemId
              ? {
                ...item,
                text: value,
              }
              : item
      ),
    })
  }

  function addItem() {
    onDataChange({
      ...data,
      items: [
        ...items,
        {
          id: createId("list"),
          text: "New list item",
        },
      ],
    })
  }

  function removeItem(itemId) {
    if (items.length <= 1) {
      return
    }

    onDataChange({
      ...data,
      items: items.filter((item) => item.id !== itemId),
    })
  }

  const ListTag = ordered ? "ol" : "ul"

  return (
      <section className="relative space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <FloatingDeleteButton onClick={onDelete} />

        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-zinc-950">
              {ordered ? "Numbered list" : "Bullet list"}
            </h3>

            <p className="text-sm text-zinc-500">
              Add important lesson points or instructions.
            </p>
          </div>

          <button
              type="button"
              onClick={addItem}
              className="mr-10 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Add item
          </button>
        </div>

        <ListTag
            className={
              ordered
                  ? "list-decimal space-y-2 pl-6"
                  : "list-disc space-y-2 pl-6"
            }
        >
          {items.map((item) => (
              <li key={item.id} className="pl-1">
                <div className="flex items-center gap-2">
                  <input
                      type="text"
                      value={item.text ?? ""}
                      onChange={(event) => updateItem(item.id, event.target.value)}
                      placeholder="Write a list item..."
                      className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-950"
                  />

                  <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </li>
          ))}
        </ListTag>
      </section>
  )
}

export function UnorderedListTool(props) {
  return <ListEditorTool {...props} ordered={false} />
}

export function OrderedListTool(props) {
  return <ListEditorTool {...props} ordered />
}

function ImageTextTool({
                         data,
                         onDataChange,
                         onDelete,
                         imagePosition = "left",
                       }) {
  const toolData = data ?? {}
  const selectedImage = toolData.file ?? null

  const uploadedImagePreview = useObjectUrl(selectedImage)

  const imageUrl =
      uploadedImagePreview || getDownloadUrl(toolData.imageKey)

  const imageIsOnRight = imagePosition === "right"

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

      if (!imageFile) {
        return
      }

      onDataChange({
        ...toolData,
        file: imageFile,
        imageKey: "",
      })
    },
  })

  return (
      <section className="relative rounded-2xl border border-zinc-200 bg-white p-5">
        <FloatingDeleteButton onClick={onDelete} />

        <div className="mb-5 pr-10">
          <h3 className="font-semibold text-zinc-950">
            {imageIsOnRight
                ? "Text with image on the right"
                : "Image with text on the right"}
          </h3>

          <p className="text-sm text-zinc-500">
            Combine an image with an explanation or lesson content.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div className={imageIsOnRight ? "md:order-2" : "md:order-1"}>
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

              <p className="mt-1 text-sm text-zinc-500">
                Click or drag a JPG, PNG, WebP, GIF, or JFIF image.
              </p>
            </div>

            {imageUrl && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
                  <img
                      src={imageUrl}
                      alt={toolData.title || "Lesson content"}
                      className="h-64 w-full object-cover"
                  />
                </div>
            )}
          </div>

          <div className={imageIsOnRight ? "md:order-1" : "md:order-2"}>
            <input
                type="text"
                value={toolData.title ?? ""}
                onChange={(event) =>
                    onDataChange({
                      ...toolData,
                      title: event.target.value,
                    })
                }
                placeholder="Write a title..."
                className="w-full border-0 bg-transparent text-2xl font-bold text-zinc-950 outline-none placeholder:text-zinc-300"
            />

            <textarea
                value={toolData.description ?? ""}
                onChange={(event) =>
                    onDataChange({
                      ...toolData,
                      description: event.target.value,
                    })
                }
                placeholder="Write the explanation..."
                rows={8}
                className="mt-4 w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700 outline-none transition focus:border-zinc-950"
            />
          </div>
        </div>
      </section>
  )
}

export function ImageLeftTextTool(props) {
  return <ImageTextTool {...props} imagePosition="left" />
}

export function ImageRightTextTool(props) {
  return <ImageTextTool {...props} imagePosition="right" />
}

export function TabsTool({ data, onDataChange, onDelete }) {
  const tabItems = data?.items ?? []
  const [activeTab, setActiveTab] = useState(tabItems[0]?.id ?? "")

  useEffect(() => {
    const activeTabStillExists = tabItems.some(
        (tab) => tab.id === activeTab
    )

    if (!activeTabStillExists) {
      setActiveTab(tabItems[0]?.id ?? "")
    }
  }, [tabItems, activeTab])

  function updateTab(tabId, field, value) {
    onDataChange({
      ...data,
      items: tabItems.map((tab) =>
          tab.id === tabId ? { ...tab, [field]: value } : tab
      ),
    })
  }

  function addTab() {
    const newTab = {
      id: createId("tab"),
      label: "New Tab",
      title: "New Tab",
      description: "Write your tab content here.",
    }

    onDataChange({
      ...data,
      items: [...tabItems, newTab],
    })

    setActiveTab(newTab.id)
  }

  function removeTab(tabId) {
    if (tabItems.length === 1) {
      return
    }

    const updatedTabs = tabItems.filter((tab) => tab.id !== tabId)

    onDataChange({
      ...data,
      items: updatedTabs,
    })

    if (activeTab === tabId) {
      setActiveTab(updatedTabs[0]?.id ?? "")
    }
  }

  return (
      <section className="relative w-full space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <FloatingDeleteButton onClick={onDelete} />

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

export function AccordionTool({ data, onDataChange, onDelete }) {
  const items = data?.items ?? []

  function updateItem(itemId, field, value) {
    onDataChange({
      ...data,
      items: items.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
      ),
    })
  }

  function addItem() {
    const newItem = {
      id: createId("accordion"),
      title: "New accordion item",
      content: "Write content here.",
    }

    onDataChange({
      ...data,
      items: [...items, newItem],
    })
  }

  function removeItem(itemId) {
    if (items.length === 1) {
      return
    }

    onDataChange({
      ...data,
      items: items.filter((item) => item.id !== itemId),
    })
  }

  return (
      <section className="relative space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <FloatingDeleteButton onClick={onDelete} />

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
                <div className="flex items-center gap-2">
                  <input
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                          updateItem(item.id, "title", event.target.value)
                      }
                      placeholder="Accordion title"
                      className="w-full bg-transparent py-4 font-medium outline-none"
                  />

                  <AccordionTrigger className="w-auto shrink-0 px-2">
                    <span className="sr-only">Toggle content</span>
                  </AccordionTrigger>
                </div>

                <AccordionContent>
                  <div className="space-y-3 pt-2">
                <textarea
                    value={item.content}
                    onChange={(event) =>
                        updateItem(item.id, "content", event.target.value)
                    }
                    rows={4}
                    placeholder="Write content here..."
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

export function FlipGridTool({ data, onDataChange, onDelete }) {
  const cards = data?.cards ?? []
  const [flippedCardId, setFlippedCardId] = useState(null)

  function updateCard(cardId, field, value) {
    onDataChange({
      ...data,
      cards: cards.map((card) =>
          card.id === cardId ? { ...card, [field]: value } : card
      ),
    })
  }

  function addCard() {
    const newCard = {
      id: createId("flip-card"),
      frontTitle: "New question",
      backTitle: "New answer",
      description: "Write the explanation here.",
    }

    onDataChange({
      ...data,
      cards: [...cards, newCard],
    })
  }

  function removeCard(cardId) {
    onDataChange({
      ...data,
      cards: cards.filter((card) => card.id !== cardId),
    })

    if (flippedCardId === cardId) {
      setFlippedCardId(null)
    }
  }

  function toggleCard(cardId) {
    setFlippedCardId((currentId) =>
        currentId === cardId ? null : cardId
    )
  }

  return (
      <section className="relative space-y-5 rounded-2xl border border-zinc-200 bg-white p-5">
        <FloatingDeleteButton onClick={onDelete} />

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
                            placeholder="Question or term"
                            className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-zinc-500"
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
                            placeholder="Answer"
                            className="w-full bg-transparent text-xl font-semibold text-zinc-950 outline-none"
                        />

                        <textarea
                            value={card.description}
                            onChange={(event) =>
                                updateCard(card.id, "description", event.target.value)
                            }
                            rows={3}
                            placeholder="Explanation..."
                            className="mt-3 w-full resize-none bg-transparent text-sm text-zinc-600 outline-none"
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

export function ImageTool({ data, onDataChange, onDelete }) {
  const selectedImage = data?.file ?? null
  const uploadedImagePreview = useObjectUrl(selectedImage)

  const previewUrl =
      uploadedImagePreview || getDownloadUrl(data?.imageKey)

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

      if (!imageFile) {
        return
      }

      onDataChange({
        ...data,
        file: imageFile,
        imageKey: "",
      })
    },
  })

  return (
      <section className="relative space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <FloatingDeleteButton onClick={onDelete} />
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
            Drag and drop or click to select a JPG, PNG, WebP, GIF, or JFIF file.
          </p>
        </div>
        {previewUrl && (
            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <img
                  src={previewUrl}
                  alt="Lesson upload preview"
                  className="max-h-[420px] w-full object-cover"
              />
            </div>
        )}
      </section>
  )
}

export function VideoTool({ data, onDataChange, onDelete }) {
  const selectedVideo = data?.file ?? null
  const uploadedVideoPreview = useObjectUrl(selectedVideo)

  const previewUrl =
      uploadedVideoPreview || getDownloadUrl(data?.videoKey)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogg"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const videoFile = acceptedFiles[0]

      if (!videoFile) {
        return
      }

      onDataChange({
        ...data,
        file: videoFile,
        videoKey: "",
      })
    },
  })

  return (
      <section className="relative space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <FloatingDeleteButton onClick={onDelete} />

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

        {previewUrl && (
            <video
                src={previewUrl}
                controls
                className="w-full rounded-2xl border border-zinc-200 bg-black"
            />
        )}
      </section>
  )
}
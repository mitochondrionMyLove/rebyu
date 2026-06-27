import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import DiagramArea from "../challenges/diagram-area.jsx"

export default function MainArea() {
    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Left sidebar + diagram area */}
            <ResizablePanelGroup
                orientation="horizontal"
                className="min-w-0 flex-1"
            >
                {/* Sidebar */}
                <ResizablePanel
                    defaultSize="25%"
                    minSize="18%"
                    maxSize="35%"
                >
                    <aside className="flex h-full items-center justify-center bg-white p-4">
                        <p className="text-sm font-semibold text-zinc-950">
                            Sidebar
                        </p>
                    </aside>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Diagram area */}
                <ResizablePanel defaultSize="75%" minSize="40%">
                    <main className="h-full min-h-0 w-full min-w-0 overflow-hidden bg-white">
                        <DiagramArea />
                    </main>
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* Fixed right panel */}
            <aside className="flex h-full w-[20%] shrink-0 items-center justify-center border-l border-zinc-200 bg-white p-4">
                <p className="text-sm font-semibold text-zinc-950">
                    Content
                </p>
            </aside>
        </div>
    )
}
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function BigDialog({
                                      trigger,
                                      title = "Dialog",
                                      description,
                                      content,
                                      contentClassName = "",
                                      onOpenChange,
                                  }) {
    return (
        <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent className="flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:h-[calc(100dvh-4rem)] sm:w-[calc(100vw-4rem)] sm:max-w-none">
                <DialogHeader className="shrink-0 border-b border-border bg-background px-5 py-4 pr-12 sm:px-6">
                    <DialogTitle className="text-base sm:text-lg">
                        {title}
                    </DialogTitle>

                    {description && (
                        <DialogDescription className="mt-1">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div
                    className={`min-h-0 flex-1 overflow-hidden bg-muted/30 p-3 sm:p-4 ${contentClassName}`}
                >
                    {content}
                </div>
            </DialogContent>
        </Dialog>
    )
}
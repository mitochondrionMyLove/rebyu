import {
    CheckCircle2,
    Circle,
    LockKeyhole,
    PlayCircle,
} from "lucide-react"

const statusStyles = {
    completed: {
        container: "border-emerald-200 bg-emerald-50",
        badge: "bg-emerald-100 text-emerald-700",
        text: "Completed",
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    },

    active: {
        container: "border-blue-500 bg-blue-50 ring-1 ring-blue-500",
        badge: "bg-blue-100 text-blue-700",
        text: "Current Item",
        icon: <PlayCircle className="h-4 w-4 text-blue-600" />,
    },

    pending: {
        container: "border-zinc-200 bg-white",
        badge: "bg-zinc-100 text-zinc-600",
        text: "Not Started",
        icon: <Circle className="h-4 w-4 text-zinc-400" />,
    },

    locked: {
        container: "border-zinc-200 bg-zinc-50 opacity-60",
        badge: "bg-zinc-200 text-zinc-500",
        text: "Locked",
        icon: <LockKeyhole className="h-4 w-4 text-zinc-400" />,
    },
}

export default function ItemsCard({
                                      itemNumber = 1,
                                      title = "Untitled Item",
                                      points = 10,
                                      status = "pending",
                                  }) {
    const currentStatus = statusStyles[status] ?? statusStyles.pending

    return (
        <div className={`w-full rounded-xl border p-3 ${currentStatus.container}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">
              Item {itemNumber}
            </span>

                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${currentStatus.badge}`}
                        >
              {points} pts
            </span>
                    </div>

                    <p className="mt-1 truncate text-sm font-semibold text-zinc-900">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">{currentStatus.text}</p>
                </div>

                <div className="mt-1 shrink-0">{currentStatus.icon}</div>
            </div>
        </div>
    )
}
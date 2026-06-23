import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CertificationSkeletonCard({ size }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({length: size}).map((_,index) => {
        return (
          <Card
            className="card h-[380px] w-full overflow-hidden rounded-[32px] bg-base-100 shadow-sm"
            key={index}
          >
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

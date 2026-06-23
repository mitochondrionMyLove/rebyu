import React, { useEffect, useState } from "react"
import { Plus, CircleChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import CertificationCard from "../../components/certification-card"
import { getAllCertifications } from "../../services/certificationService"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { CertificationSkeletonCard } from "../../components/certification-skeleton-card"

function Certifications() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    async function getAllCertificates() {
      setIsLoading(true)
      const response = await getAllCertifications()
      setItems(response)
      setIsLoading(false)
    }
    getAllCertificates()
  }, [])

  if (isLoading)
       return <CertificationSkeletonCard size = {items.length || 4}/>
  return (
    <section className="flex h-full flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">
          Active Certifications
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage the certification reviews available to learners.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => {
          return <CertificationCard key={index} item={item} />
        })}
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <button
              type="button"
              className="group flex h-[380px] w-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-zinc-800 bg-zinc-50 p-6 text-center transition-all duration-200 hover:border-zinc-950 hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white transition-transform duration-200 group-hover:scale-110">
                <Plus className="h-6 w-6 text-zinc-900" strokeWidth={1.8} />
              </div>

              <span className="text-base font-medium text-zinc-900">
                Create Certification
              </span>

              <span className="mt-1 max-w-[180px] text-sm text-zinc-500">
                Add a new certification review for learners.
              </span>
            </button>
          </DrawerTrigger>
          <DrawerContent className="fixed top-0 right-0 bottom-auto left-auto flex h-dvh !w-[50vw] !max-w-none flex-col rounded-l-3xl rounded-r-none border-l bg-white p-0">
            <DrawerHeader className="flex flex-row items-center justify-start gap-3 border-b px-6 py-5 text-left">
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close drawer"
                  className="shrink-0 rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                >
                  <CircleChevronLeft className="h-7 w-7" />
                </button>
              </DrawerClose>

              <div className="min-w-0 text-left">
                <DrawerTitle className="text-left text-lg font-semibold">
                  Create Certification
                </DrawerTitle>
              </div>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* form goes here */}
              fsdafdsa
            </div>

            <DrawerFooter className="border-t px-6 py-4">
              <Button className="w-full">Create Certification</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </section>
  )
}

export default Certifications

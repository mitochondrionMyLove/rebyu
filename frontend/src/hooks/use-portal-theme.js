import { useEffect } from "react"

export function usePortalTheme() {
  useEffect(() => {
    document.body.classList.add("netacad-overlay-theme")
    return () => document.body.classList.remove("netacad-overlay-theme")
  }, [])
}

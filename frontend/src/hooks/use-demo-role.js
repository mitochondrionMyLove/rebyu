import { useCallback, useSyncExternalStore } from "react"

import { DEMO_ROLE_KEY, getDemoRole, setDemoRole } from "@/lib/demo-role"

const listeners = new Set()

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key === DEMO_ROLE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function useDemoRole() {
  const role = useSyncExternalStore(subscribe, getDemoRole)

  const changeRole = useCallback((nextRole) => {
    setDemoRole(nextRole)
    notify()
  }, [])

  return [role, changeRole]
}

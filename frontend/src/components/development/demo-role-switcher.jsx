import { useNavigate } from "react-router-dom"
import { Eye } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDemoRole } from "@/hooks/use-demo-role"
import { DEMO_ROLE_LABELS, getDemoRoleHome } from "@/lib/demo-role"

// Development-only preview control. Delete this file (and its usages in the
// three dashboard layouts) once real authentication is wired in.
export function DemoRoleSwitcher() {
  const navigate = useNavigate()
  const [role, setRole] = useDemoRole()

  if (!import.meta.env.DEV) {
    return null
  }

  const handleChange = (nextRole) => {
    if (nextRole === role) return
    setRole(nextRole)
    navigate(getDemoRoleHome(nextRole), { replace: true })
  }

  return (
    <Select value={role} onValueChange={handleChange}>
      <SelectTrigger
        size="sm"
        aria-label="Preview role"
        className="h-8 gap-1.5 border-dashed text-xs text-muted-foreground"
      >
        <Eye className="size-3.5" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="LEARNER">
          Preview as {DEMO_ROLE_LABELS.LEARNER}
        </SelectItem>
        <SelectItem value="ENTERPRISE">
          Preview as {DEMO_ROLE_LABELS.ENTERPRISE}
        </SelectItem>
        <SelectItem value="ADMIN">
          Preview as {DEMO_ROLE_LABELS.ADMIN}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export default DemoRoleSwitcher

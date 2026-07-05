import { FolderOpenIcon } from "lucide-react"

import {
  EnterpriseEmptyState,
  EnterprisePageHeader,
} from "@/components/enterprise/enterprise-ui.jsx"

export default function EnterpriseFilesPage() {
  // The backend currently exposes lesson/certification media uploads only —
  // there is no organization-scoped document storage endpoint yet, so this
  // page presents an honest empty state instead of a fake file manager.
  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        title="Files"
        subtitle="Documents shared between your organization and REBYU."
      />
      <EnterpriseEmptyState
        icon={FolderOpenIcon}
        title="No organization files yet"
        description="Verification documents and shared files will appear here once organization file storage is available."
      />
    </div>
  )
}

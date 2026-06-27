import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./layouts/DashboardLayout"
import ChallengesLayout from "./layouts/ChallengesLayout"


import Certifications from "./pages/admin/Certifications"
import Challenges from "./pages/admin/Challenges"
import QuestionBank from "./pages/admin/QuestionBank"
import Analytics from "./pages/admin/Analytics"
import Learners from "./pages/admin/Learners"
import Organizations from "./pages/admin/Organizations"
import ViewCertificationAdmin from "./pages/admin/ViewCertificationAdmin"

import Learner from "./pages/learner/Learner"
import Enterprise from "./pages/enterprise/Enterprise"
import LandingPage from "./pages/public/LandingPage"
import CreateLessons from "./pages/admin/CreateLessons"

export function App() {
  localStorage.setItem("role", "admin")

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Certifications />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="learners" element={<Learners />} />
          <Route path="analytics" element={<Analytics />} />
          <Route
            path="certification/:id"
            element={<ViewCertificationAdmin />}
          />
          <Route path="lessons/:name/create" element={<CreateLessons />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["learner"]} />}>
        <Route path="/learner" element={<Learner />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["enterprise"]} />}>
        <Route path="/enterprise" element={<Enterprise />} />
      </Route>

        <Route path='/challenges' element={<ChallengesLayout />} />
    </Routes>
  )
}

export default App

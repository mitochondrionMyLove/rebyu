import { Navigate, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./layouts/DashboardLayout"
import LearnerLayout from "./layouts/learner-layout.jsx"
import EnterpriseLayout from "./layouts/enterprise-layout.jsx"
import { roleHomePath, useAuth } from "./context/auth-context.jsx"
import LoginPage from "./pages/auth/login-page.jsx"
import RegisterPage from "./pages/auth/register-page.jsx"
import VerifyEmailPage from "./pages/auth/verify-email-page.jsx"
import ForgotPasswordPage from "./pages/auth/forgot-password-page.jsx"
import SetNewPasswordPage from "@/pages/auth/set-new-password-page.jsx"

import Certifications from "./pages/admin/Certifications"
import Challenges from "./pages/admin/Challenges"
import QuestionBank from "./pages/admin/QuestionBank"
import Analytics from "./pages/admin/Analytics"
import Learners from "./pages/admin/Learners"
import Organizations from "./pages/admin/Organizations"
import ViewCertificationAdmin from "./pages/admin/ViewCertificationAdmin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import PartnershipRequests from "./pages/admin/PartnershipRequests"
import AcceptEnterpriseInvitationPage from "./pages/admin/AcceptEnterpriseInvitationPage"


import LandingPage from "./pages/public/LandingPage"
import CreateLessons from "./pages/admin/CreateLessons"
import LearnerProgressPage from "./pages/learner/learner-progress-page.jsx"
import LearnerLearningPage from "./pages/learner/learner-learning-page.jsx"
import LearnerDiagnosticGatePage from "./pages/learner/learner-diagnostic-page.jsx"
import LearnerLessonPage from "./pages/learner/learner-lesson-page.jsx"
import LearnerSubscriptionPage from "./pages/learner/learner-subscription-page.jsx"
import LearnerCertificationDetailPage from "./pages/learner/learner-certification-detail-page.jsx"
import LearnerCertificationsPage from "./pages/learner/learner-certifications-page.jsx"
import LearnerChallengesPage from "./pages/learner/learner-challenges-page.jsx"
import LearnerFilesPage from "./pages/learner/learner-files-page.jsx"
import LearnerAccountPage from "./pages/learner/learner-account-page.jsx"
import LearnerAssessmentAttemptPage from "./pages/learner/learner-assessment-attempt-page.jsx"
import LearnerAssessmentResultPage from "./pages/learner/learner-assessment-result-page.jsx"
import LearningStudyPlan from "./pages/learner/learner-study-plan.jsx"
import MistakesBank from "./pages/learner/learner-mistakes-bank.jsx"
import Community from "./pages/learner/learner-community-qa.jsx"


import EnterpriseDashboardPage from "./pages/enterprise/enterprise-dashboard-page.jsx"
import EnterpriseLearnersPage from "./pages/enterprise/enterprise-learners-page.jsx"
import EnterpriseLearnerDetailPage from "./pages/enterprise/enterprise-learner-detail-page.jsx"
import EnterpriseInvitationsPage from "./pages/enterprise/enterprise-invitations-page.jsx"
import EnterpriseCertificationsPage from "./pages/enterprise/enterprise-certifications-page.jsx"
import EnterpriseGroupsPage from "./pages/enterprise/enterprise-groups-page.jsx"
import EnterpriseLicensePage from "./pages/enterprise/enterprise-license-page.jsx"
import EnterpriseAnalyticsPage from "./pages/enterprise/enterprise-analytics-page.jsx"
import EnterprisePartnershipPage from "./pages/enterprise/enterprise-partnership-page.jsx"
import EnterpriseBillingPage from "./pages/enterprise/enterprise-billing-page.jsx"
import EnterpriseFilesPage from "./pages/enterprise/enterprise-files-page.jsx"
import EnterpriseOrganizationPage from "./pages/enterprise/enterprise-organization-page.jsx"
import EnterpriseSettingsPage from "./pages/enterprise/enterprise-settings-page.jsx"
import EnterpriseRequestAccessPage from "./pages/public/enterprise-request-access-page.jsx"

import CompilerArea from "./components/challenges/compiler-area.jsx"


function RoleHomeRedirect() {
    const { user, status } = useAuth()

    if (status === "loading") {
        return null
    }

    if (status === "authenticated") {
        return <Navigate to={roleHomePath(user?.role)} replace />
    }

    return <Navigate to="/login" replace />
}

export function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/set-new-password" element={<SetNewPasswordPage />} />

            {/* Public: organization representatives request Enterprise access with no account. */}
            <Route
                path="/enterprise/request-access"
                element={<EnterpriseRequestAccessPage />}
            />

            <Route
                path="/invitations/accept"
                element={<AcceptEnterpriseInvitationPage />}
            />

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route index element={<Certifications />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="challenges" element={<Challenges />} />
                    <Route path="question-bank" element={<QuestionBank />} />
                    <Route path="organizations" element={<Organizations />} />
                    <Route path="partnership-requests" element={<PartnershipRequests />} />
                    <Route path="learners" element={<Learners />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route
                        path="certification/:id"
                        element={<ViewCertificationAdmin />}
                    />
                    <Route path="lessons/:name/create" element={<CreateLessons />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["LEARNER"]} />}>
                <Route path="/learner" element={<LearnerLayout />}>
                    <Route index element={<Navigate to="progress" replace />} />
                    <Route path="progress" element={<LearnerProgressPage />} />
                    <Route path="learning" element={<LearnerLearningPage />} />

                    {/* Diagnostic gate. This must match the path used in learner-learning-page.jsx. */}
                    <Route
                        path="learning/:certificationId/diagnostic"
                        element={<LearnerDiagnosticGatePage />}
                    />

                    <Route
                        path="learning/:certificationId"
                        element={<LearnerLearningPage />}
                    />
                    <Route path="lessons/:lessonId" element={<LearnerLessonPage />} />
                    <Route path="plan" element={<LearningStudyPlan />} />
                    <Route
                        path="certifications"
                        element={<LearnerCertificationsPage />}
                    />
                    <Route
                        path="certifications/:certificationId"
                        element={<LearnerCertificationDetailPage />}
                    />
                    <Route path="challenges" element={<LearnerChallengesPage />} />
                    <Route path="subscription" element={<LearnerSubscriptionPage />} />
                    <Route path="library" element={<LearnerFilesPage />} />
                    <Route path="mistakes" element={<MistakesBank />} />
                    <Route path="community" element={<Community />} />
                    <Route path="account" element={<LearnerAccountPage />} />
                </Route>


                <Route
                    path="/learner/assessments/:examId"
                    element={<LearnerAssessmentAttemptPage />}
                />
                <Route
                    path="/learner/results/:examResultId"
                    element={<LearnerAssessmentResultPage />}
                />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ENTERPRISE"]} />}>
                <Route path="/enterprise" element={<EnterpriseLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<EnterpriseDashboardPage />} />
                    <Route path="learners" element={<EnterpriseLearnersPage />} />
                    <Route
                        path="learners/:learnerId"
                        element={<EnterpriseLearnerDetailPage />}
                    />
                    <Route path="invitations" element={<EnterpriseInvitationsPage />} />
                    <Route
                        path="certifications"
                        element={<EnterpriseCertificationsPage />}
                    />
                    <Route path="groups" element={<EnterpriseGroupsPage />} />
                    <Route path="license" element={<EnterpriseLicensePage />} />
                    <Route path="analytics" element={<EnterpriseAnalyticsPage />} />
                    <Route path="partnership" element={<EnterprisePartnershipPage />} />
                    <Route path="billing" element={<EnterpriseBillingPage />} />
                    <Route path="files" element={<EnterpriseFilesPage />} />
                    <Route path="organization" element={<EnterpriseOrganizationPage />} />
                    <Route path="settings" element={<EnterpriseSettingsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<RoleHomeRedirect />} />
        </Routes>
    )
}

export default App

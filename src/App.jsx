import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/LandingPage/Layout'
import Welcome from './pages/Welcome'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Onboarding from './pages/auth/Onboarding'
import AcceptInvite from './pages/auth/AcceptInvite'
import DashboardHome from './pages/Dashboard/DashboardHome'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import NdaEditor from './pages/Dashboard/templates/NdaEditor'
import ProposalEditor from './pages/Dashboard/templates/ProposalEditor'
import InvoiceEditor from './pages/Dashboard/templates/InvoiceEditor'
import DocumentList from './pages/Dashboard/documents/DocumentList'
import Settings from './pages/Dashboard/settings/Settings'
import Team from './pages/Dashboard/team/Team'
import AuthLayout from './components/auth/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout />} >
              <Route path="/" element={<Welcome />} />

              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/accept-invite" element={<AcceptInvite />} />
            </Route>

            {/* Auth Routes - Wrapper removed to allow per-page layout props */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<DashboardLayout />} >
              <Route path='/dashboard' element={<DashboardHome />} />

              {/* Documents - View Permission */}
              <Route element={<ProtectedRoute permission="document.view" />}>
                <Route path='/documents' element={<DocumentList />} />
                <Route path='/documents/nda' element={<NdaEditor />} />
                <Route path='/documents/nda/:id' element={<NdaEditor />} />
                <Route path='/documents/proposal' element={<ProposalEditor />} />
                <Route path='/documents/proposal/:id' element={<ProposalEditor />} />
                <Route path='/documents/invoice' element={<InvoiceEditor />} />
                <Route path='/documents/invoice/:id' element={<InvoiceEditor />} />
              </Route>

              {/* Team - View Permission */}
              <Route element={<ProtectedRoute permission="team.view" />}>
                <Route path='/team' element={<Team />} />
              </Route>

              {/* Settings - Manage Permission */}
              <Route element={<ProtectedRoute permission="settings.manage" />}>
                <Route path='/settings' element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App

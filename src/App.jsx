import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/LandingPage/Layout'
import Welcome from './pages/Welcome'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Onboarding from './pages/auth/Onboarding'
import AcceptInvite from './pages/auth/AcceptInvite'
import VerifyEmailMessage from './pages/auth/VerifyEmailMessage'
import VerifyEmailHandler from './pages/auth/VerifyEmailHandler'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AuthCallback from './pages/auth/AuthCallback'
import DashboardHome from './pages/Dashboard/DashboardHome'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import NdaEditor from './pages/Dashboard/templates/NdaEditor'
import ProposalEditor from './pages/Dashboard/templates/ProposalEditor'
import InvoiceEditor from './pages/Dashboard/templates/InvoiceEditor'
import OfferLetterEditor from './pages/Dashboard/templates/OfferLetterEditor'
import ConsultingAgreementEditor from './pages/Dashboard/templates/ConsultingAgreementEditor'
import DocumentList from './pages/Dashboard/documents/DocumentList'
import Settings from './pages/Dashboard/settings/Settings'
import Team from './pages/Dashboard/team/Team'
import SignatureModule from './pages/Dashboard/signature-module/SignatureModule'
import SignatureDocumentList from './pages/Dashboard/signature-module/SignatureDocumentList'
import SignedDocumentViewer from './pages/Dashboard/signature-module/SignedDocumentViewer';

import DocumentEditor from './components/DocumentEngine/DocumentEditor'
import AuthLayout from './components/auth/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Features from './pages/Landing/Features'
import Pricing from './pages/Landing/Pricing'
import About from './pages/Landing/About'
import Privacy from './pages/Landing/Privacy'
import Terms from './pages/Landing/Terms'
import Contact from './pages/Landing/Contact'
import Careers from './pages/Landing/Careers'
import Changelog from './pages/Landing/Changelog'
import BlogList from './pages/Landing/BlogList'
import BlogPost from './pages/Landing/BlogPost'
import PublicDocumentViewer from './pages/PublicDocumentViewer'
import SignDocument from './pages/Public/SignDocument'
// import Landing from './pages/Public/document-generator/Landing'
import GuestEditor from './pages/Public/document-generator/GuestEditor'

// SEO Landing Pages
import NdaLanding from './pages/Landing/Tools/NdaLanding'
import ProposalLanding from './pages/Landing/Tools/ProposalLanding'
import ConsultingAgreementLanding from './pages/Landing/Tools/ConsultingAgreementLanding'
import InvoiceLanding from './pages/Landing/Tools/InvoiceLanding'
import SignatureLanding from './pages/Landing/Tools/SignatureLanding'
import OfferLetterLanding from './pages/Landing/Tools/OfferLetterLanding'

import GuestRoute from './components/GuestRoute'
import ScrollToTop from './components/ScrollToTop'

import { Toaster } from 'react-hot-toast'

// ...

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <GoogleReCaptchaProvider
          reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: 'head',
            nonce: undefined,
          }}
        >
          <Router>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'text-sm font-medium text-slate-800',
                style: {
                  background: '#ffffff',
                  color: '#1e293b',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  padding: '12px 16px',
                  borderRadius: '8px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route element={<Layout />} >
                <Route path="/" element={<Welcome />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />

                {/* Footer Links */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />

                <Route path="/accept-invite" element={<AcceptInvite />} />
                <Route path="/verify-email" element={<VerifyEmailHandler />} />
                <Route path="/verify-email-message" element={<VerifyEmailMessage />} />

                {/* SEO Landing Pages (Tools) */}
                <Route path="/tools/nda" element={<NdaLanding />} />
                <Route path="/tools/business-proposal" element={<ProposalLanding />} />
                <Route path="/tools/consulting-agreement" element={<ConsultingAgreementLanding />} />
                <Route path="/tools/invoice-generator" element={<InvoiceLanding />} />
                <Route path="/tools/electronic-signature" element={<SignatureLanding />} />
                <Route path="/tools/offer-letter" element={<OfferLetterLanding />} />
              </Route>

              {/* Protected Onboarding */}
              <Route element={<ProtectedRoute redirectPath="/login" />}>
                <Route path="/onboarding" element={<Onboarding />} />
              </Route>

              {/* Public Viewer Route */}
              <Route path="/view/:token" element={<PublicDocumentViewer />} />
              <Route path="/sign/:token" element={<SignDocument />} />

              {/* Guest Document Generator */}
              {/* Route path="/create-document" element={<Landing />}  REMOVED - Merged into Welcome */}
              <Route path="/create-document/:template" element={<GuestEditor />} />

              {/* Auth Routes - Redirect if logged in */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/password-reset/:token" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Route>

              {/* Dashboard Routes - Protected */}
              <Route element={<ProtectedRoute />}>
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
                    <Route path='/documents/offer-letter' element={<OfferLetterEditor />} />
                    <Route path='/documents/offer-letter/:id' element={<OfferLetterEditor />} />
                    <Route path='/documents/consulting-agreement' element={<ConsultingAgreementEditor />} />
                    <Route path='/documents/consulting-agreement/:id' element={<ConsultingAgreementEditor />} />
                    <Route path='/documents/general/:id' element={<DocumentEditor />} />
                  </Route>

                  {/* Team - View Permission */}
                  <Route element={<ProtectedRoute permission="team.view" />}>
                    <Route path='/team' element={<Team />} />
                  </Route>

                  {/* Signatures - Manage Permission */}
                  <Route element={<ProtectedRoute permission="settings.signature" />}>
                    <Route path='/signatures' element={<SignatureModule />} />
                    <Route path='/signatures/:id/edit' element={<SignatureModule />} />
                    <Route path='/signatures/list' element={<SignatureDocumentList />} />
                    <Route path='/signatures/:documentId/view-signed' element={<SignedDocumentViewer />} />
                  </Route>

                  {/* Unified Engine Test Route */}
                  <Route path='/document-engine/test' element={<DocumentEditor />} />

                  {/* Settings - Manage Permission */}
                  <Route element={<ProtectedRoute permission="settings.manage" />}>
                    <Route path='/settings' element={<Settings />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Router>
        </GoogleReCaptchaProvider>
      </HelmetProvider>
    </AuthProvider>
  )
}

export default App

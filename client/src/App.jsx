import { useLocation, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProjects from "./pages/AdminProjects";
import AdminProfile from "./pages/AdminProfile";
import AdminAbout from "./pages/AdminAbout";
import AdminSkills from "./pages/AdminSkills";
import AdminExperience from "./pages/AdminExperience";
import AdminEducation from "./pages/AdminEducation";
import AdminServices from "./pages/AdminServices";
import AdminMessages from "./pages/AdminMessages";
import Contact from "./pages/Contact";
import AdminCertificates from "./pages/AdminCertificates";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Public Navbar */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* ==================== ADMIN LOGIN ==================== */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ==================== ADMIN DASHBOARD ==================== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN PROJECTS ==================== */}
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN PROFILE ==================== */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN ABOUT ==================== */}
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              <AdminAbout />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN SKILLS ==================== */}
        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <AdminSkills />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN EXPERIENCE ==================== */}
        <Route
          path="/admin/experience"
          element={
            <ProtectedRoute>
              <AdminExperience />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN EDUCATION ==================== */}
        <Route
          path="/admin/education"
          element={
            <ProtectedRoute>
              <AdminEducation />
            </ProtectedRoute>
          }
        />
 {/* ==================== ADMIN CERTIFICATES ==================== */}
        <Route
  path="/admin/certificates"
  element={
    <ProtectedRoute>
      <AdminCertificates />
    </ProtectedRoute>
  }
/>

        {/* ==================== ADMIN SERVICES ==================== */}
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <AdminServices />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN MESSAGES ==================== */}
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          }
        />

        {/* ==================== CONTACT ==================== */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ==================== PUBLIC PORTFOLIO ==================== */}
        <Route
  path="/"
  element={<Home />}
/>
      </Routes>
    </>
  );
}

export default App;
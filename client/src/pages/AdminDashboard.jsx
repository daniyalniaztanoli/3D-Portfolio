
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { API_URL } from "../api";

import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Canvas, useFrame } from "@react-three/fiber";

import {
  Float,
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
} from "@react-three/drei";

const drawerWidth = 250;

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Profile", path: "/admin/profile" },
  { label: "About", path: "/admin/about" },
  { label: "Projects", path: "/admin/projects" },
  { label: "Skills", path: "/admin/skills" },
  { label: "Experience", path: "/admin/experience" },
  { label: "Education", path: "/admin/education" },
  { label: "Services", path: "/admin/services" },
  { label: "Certificates", path: "/admin/certificates" },
  { label: "Messages", path: "/admin/messages" },
];

const dashboardCards = [
  {
    title: "Projects",
    description: "Portfolio projects stored in MongoDB.",
    path: "/admin/projects",
    symbol: "P",
  },
  {
    title: "Skills",
    description: "Technical skills available in your portfolio.",
    path: "/admin/skills",
    symbol: "S",
  },
  {
    title: "Experience",
    description: "Professional experience entries.",
    path: "/admin/experience",
    symbol: "E",
  },
  {
    title: "Education",
    description: "Education records in your portfolio.",
    path: "/admin/education",
    symbol: "ED",
  },
  {
    title: "Services",
    description: "Services currently available.",
    path: "/admin/services",
    symbol: "SV",
  },
  {
    title: "Certificates",
    description: "Manage your achievements and certifications.",
    path: "/admin/certificates",
    symbol: "C",
  },
  {
    title: "Messages",
    description: "Messages received from visitors.",
    path: "/admin/messages",
    symbol: "M",
  },
];

/* =========================
   3D ADMIN CORE
========================= */

function RotatingCore() {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.6}
      floatIntensity={0.8}
    >
      <Sphere args={[1.15, 64, 64]}>
        <MeshDistortMaterial
          color="#7C3AED"
          emissive="#4C1D95"
          emissiveIntensity={0.7}
          roughness={0.15}
          metalness={0.8}
          distort={0.32}
          speed={2}
        />
      </Sphere>

      <Sphere args={[1.45, 32, 32]}>
        <meshBasicMaterial
          color="#06B6D4"
          wireframe
          transparent
          opacity={0.18}
        />
      </Sphere>
    </Float>
  );
}

function CoreRing() {
  const ringRef = useRef(null);

  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.elapsedTime;

      ringRef.current.rotation.x = time * 0.3;
      ringRef.current.rotation.y = time * 0.4;
    }
  });

  return (
    <mesh
      ref={ringRef}
      rotation={[Math.PI / 2.5, 0, 0]}
    >
      <torusGeometry args={[1.7, 0.025, 16, 100]} />

      <meshBasicMaterial
        color="#06B6D4"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Admin3DScene() {
  return (
    <>
      <ambientLight intensity={0.5} />

      <pointLight
        position={[3, 3, 3]}
        color="#7C3AED"
        intensity={20}
        distance={8}
      />

      <pointLight
        position={[-3, -2, 2]}
        color="#06B6D4"
        intensity={15}
        distance={8}
      />

      <RotatingCore />
      <CoreRing />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.7}
      />
    </>
  );
}

/* =========================
   MAIN DASHBOARD
========================= */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    educations: 0,
    services: 0,
    certificates: 0,
    messages: 0,
    unreadMessages: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("adminUser") || "{}"
    );
  } catch {
    user = {};
  }

  const token = localStorage.getItem("adminToken");

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        setError("Please log in to access the dashboard.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/dashboard/stats"
        );

        if (cancelled) return;

        if (response.data?.success) {
          const fetchedStats = response.data.stats || {};

          setStats((previous) => ({
            ...previous,
            ...fetchedStats,
          }));

          setRecentProjects(
            response.data.recentProjects || []
          );

          setRecentMessages(
            response.data.recentMessages || []
          );
        } else {
          setError(
            response.data?.message ||
              "Dashboard data could not be loaded."
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
            (err.response
              ? `Server error: ${err.response.status}`
              : "Unable to connect to the backend. Please check the API URL and backend status.")
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /* =========================
     FETCH CERTIFICATES COUNT
  ========================= */

  useEffect(() => {
    let cancelled = false;

    const fetchCertificates = async () => {
      try {
        const response = await api.get(
          "/api/certificates"
        );

        if (cancelled) return;

        const certificates =
          response.data?.certificates;

        if (Array.isArray(certificates)) {
          setStats((previous) => ({
            ...previous,
            certificates: certificates.length,
          }));
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Certificate count error:",
            err
          );
        }
      }
    };

    fetchCertificates();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================
     HELPERS
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login", { replace: true });
  };

  const handleNavigation = (path) => {
    navigate(path);

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    const normalizedPath = image.startsWith("/")
      ? image
      : `/${image}`;

    return `${API_URL}${normalizedPath}`;
  };

  /* =========================
     SIDEBAR
  ========================= */

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#08080B",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 3,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.8rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            background:
              "linear-gradient(90deg, #7C3AED, #06B6D4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Daniyal.
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.72rem",
            color: "#71717A",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Admin Portal
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          px: 1.5,
          py: 2,
          overflowY: "auto",
        }}
      >
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path;

          return (
            <Button
              key={item.path}
              fullWidth
              onClick={() => handleNavigation(item.path)}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                px: 2,
                py: 1.25,
                mb: 0.5,
                color: isActive ? "#fff" : "#A1A1AA",
                background: isActive
                  ? "linear-gradient(90deg, rgba(124,58,237,0.25), rgba(6,182,212,0.10))"
                  : "transparent",
                borderLeft: isActive
                  ? "3px solid #7C3AED"
                  : "3px solid transparent",
                borderRadius: "0 10px 10px 0",
                fontSize: "0.88rem",
                fontWeight: isActive ? 700 : 500,
                "&:hover": {
                  background: "rgba(124,58,237,0.12)",
                  color: "#fff",
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box sx={{ mb: 1.5, px: 1 }}>
          <Typography
            sx={{
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            {user?.name || "Administrator"}
          </Typography>

          <Typography
            sx={{
              color: "#71717A",
              fontSize: "0.72rem",
              mt: 0.3,
              wordBreak: "break-word",
            }}
          >
            {user?.email || "admin@portfolio.com"}
          </Typography>
        </Box>

        <Button
          fullWidth
          onClick={handleLogout}
          sx={{
            color: "#F87171",
            border: "1px solid rgba(248,113,113,0.2)",
            py: 1,
            "&:hover": {
              background: "rgba(248,113,113,0.08)",
              borderColor: "rgba(248,113,113,0.4)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  /* =========================
     RETURN
  ========================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: "rgba(5,5,5,0.92)",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "64px !important",
              px: 2,
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: "#fff", mr: 1 }}
              aria-label="Open navigation menu"
            >
              <Box sx={{ fontSize: "1.5rem" }}>☰</Box>
            </IconButton>

            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 800,
                background:
                  "linear-gradient(90deg, #7C3AED, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Daniyal.
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              position: "fixed",
              left: 0,
              top: 0,
              height: "100vh",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              background: "#08080B",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#08080B",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          minWidth: 0,
          width: {
            xs: "100%",
            md: `calc(100% - ${drawerWidth}px)`,
          },
          ml: {
            xs: 0,
            md: `${drawerWidth}px`,
          },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 10, sm: 11, md: 5 },
            pb: 5,
          }}
        >
          {/* HERO DASHBOARD */}

          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 430, sm: 470, md: 390 },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1.1fr 0.9fr",
              },
              alignItems: "center",
              borderRadius: { xs: 3, md: 4 },
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "radial-gradient(circle at 80% 50%, rgba(124,58,237,0.18), transparent 35%), radial-gradient(circle at 90% 20%, rgba(6,182,212,0.12), transparent 30%), rgba(255,255,255,0.025)",
              mb: 4,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "rgba(124,58,237,0.15)",
                filter: "blur(80px)",
                right: { xs: "5%", md: "15%" },
                top: "10%",
                pointerEvents: "none",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                px: { xs: 2.5, sm: 4, md: 5 },
                py: { xs: 3, md: 4 },
              }}
            >
              <Typography
                sx={{
                  color: "#06B6D4",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                CONTROL CENTER
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: "2.2rem",
                    sm: "2.8rem",
                    md: "3.4rem",
                    lg: "3.8rem",
                  },
                  lineHeight: 1.05,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  mb: 1.5,
                }}
              >
                Welcome back,
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background:
                      "linear-gradient(90deg, #7C3AED, #06B6D4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {user?.name || "Daniyal"}
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "#A1A1AA",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  lineHeight: 1.7,
                  maxWidth: 500,
                }}
              >
                Manage your portfolio, projects, skills,
                experience and visitor messages from one place.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate("/admin/projects")}
                  sx={{
                    background:
                      "linear-gradient(90deg, #7C3AED, #6D28D9)",
                    px: 2.5,
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #6D28D9, #5B21B6)",
                    },
                  }}
                >
                  Manage Projects
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.15)",
                    px: 2.5,
                    "&:hover": {
                      borderColor: "#06B6D4",
                      background: "rgba(6,182,212,0.06)",
                    },
                  }}
                >
                  View Portfolio
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                position: { xs: "absolute", md: "relative" },
                right: { xs: "-45px", md: 0 },
                bottom: { xs: "-30px", md: "auto" },
                width: { xs: "280px", sm: "340px", md: "100%" },
                height: { xs: "250px", sm: "300px", md: "360px" },
                opacity: { xs: 0.65, md: 1 },
              }}
            >
              <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
              >
                <Admin3DScene />
              </Canvas>
            </Box>
          </Box>

          {/* ERROR */}

          {error && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(248,113,113,0.3)",
                background: "rgba(248,113,113,0.06)",
              }}
            >
              <Typography
                sx={{ color: "#F87171", fontSize: "0.85rem" }}
              >
                {error}
              </Typography>

              {!token && (
                <Button
                  size="small"
                  onClick={() => navigate("/admin/login")}
                  sx={{ mt: 1, color: "#06B6D4" }}
                >
                  Go to Login
                </Button>
              )}
            </Box>
          )}

          {/* STATISTICS */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
                xl: "repeat(5, minmax(0, 1fr))",
              },
              gap: { xs: 1.5, sm: 2, lg: 2.5 },
              mb: 5,
            }}
          >
            {[
              { label: "Projects", value: stats.projects },
              { label: "Skills", value: stats.skills },
              { label: "Experience", value: stats.experiences },
              { label: "Certificates", value: stats.certificates },
              { label: "Messages", value: stats.messages },
            ].map((item) => (
              <Card
                key={item.label}
                sx={{
                  minWidth: 0,
                  background:
                    "linear-gradient(145deg, rgba(124,58,237,0.10), rgba(6,182,212,0.04))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "0.25s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "rgba(124,58,237,0.4)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Typography
                    sx={{ color: "#A1A1AA", fontSize: "0.78rem", mb: 1 }}
                  >
                    {item.label}
                  </Typography>

                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#7C3AED" }} />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: { xs: "1.8rem", sm: "2.2rem" },
                        fontWeight: 800,
                        background:
                          "linear-gradient(90deg, #7C3AED, #06B6D4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {item.value ?? 0}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* MESSAGE STATUS */}

          <Card
            sx={{
              mb: 5,
              background: "rgba(6,182,212,0.045)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
                    Message Center
                  </Typography>

                  <Typography
                    sx={{ color: "#A1A1AA", fontSize: "0.82rem", mt: 0.5 }}
                  >
                    {loading
                      ? "Checking messages..."
                      : `${stats.unreadMessages ?? 0} unread message${
                          stats.unreadMessages === 1 ? "" : "s"
                        }`}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/messages")}
                  sx={{
                    color: "#06B6D4",
                    borderColor: "rgba(6,182,212,0.35)",
                    "&:hover": {
                      borderColor: "#06B6D4",
                      background: "rgba(6,182,212,0.06)",
                    },
                  }}
                >
                  View Messages
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* RECENT PROJECTS AND MESSAGES */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                lg: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
              },
              gap: 3,
              mb: 5,
            }}
          >
            {/* RECENT PROJECTS */}

            <Card
              sx={{
                minWidth: 0,
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                      Recent Projects
                    </Typography>

                    <Typography
                      sx={{ color: "#71717A", fontSize: "0.78rem", mt: 0.5 }}
                    >
                      Latest projects
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    onClick={() => navigate("/admin/projects")}
                    sx={{ color: "#06B6D4" }}
                  >
                    View All
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={28} sx={{ color: "#7C3AED" }} />
                  </Box>
                ) : recentProjects.length === 0 ? (
                  <Typography sx={{ color: "#71717A", py: 3 }}>
                    No projects found.
                  </Typography>
                ) : (
                  recentProjects.map((project) => (
                    <Box
                      key={project._id}
                      onClick={() => navigate("/admin/projects")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        minWidth: 0,
                        "&:hover": {
                          background: "rgba(124,58,237,0.08)",
                        },
                      }}
                    >
                      {project.image ? (
                        <Box
                          component="img"
                          src={getImageUrl(project.image)}
                          alt={project.title || "Project"}
                          loading="lazy"
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "10px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "10px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(135deg, #7C3AED, #06B6D4)",
                            fontWeight: 800,
                          }}
                        >
                          P
                        </Box>
                      )}

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {project.title || "Untitled project"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#71717A",
                            fontSize: "0.72rem",
                            mt: 0.4,
                          }}
                        >
                          {project.category || "Web Development"}
                          {" • "}
                          {formatDate(project.createdAt)}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color:
                            project.status === "published"
                              ? "#06B6D4"
                              : "#71717A",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          flexShrink: 0,
                        }}
                      >
                        {project.status || "draft"}
                      </Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>

            {/* RECENT MESSAGES */}

            <Card
              sx={{
                minWidth: 0,
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                      Recent Messages
                    </Typography>

                    <Typography
                      sx={{ color: "#71717A", fontSize: "0.78rem", mt: 0.5 }}
                    >
                      Latest visitors
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    onClick={() => navigate("/admin/messages")}
                    sx={{ color: "#06B6D4" }}
                  >
                    View All
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={28} sx={{ color: "#06B6D4" }} />
                  </Box>
                ) : recentMessages.length === 0 ? (
                  <Typography sx={{ color: "#71717A", py: 3 }}>
                    No messages found.
                  </Typography>
                ) : (
                  recentMessages.map((message) => (
                    <Box
                      key={message._id}
                      onClick={() => navigate("/admin/messages")}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgba(6,182,212,0.06)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {message.name || "Visitor"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#A1A1AA",
                              fontSize: "0.75rem",
                              mt: 0.3,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {message.subject || "No subject"}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            color:
                              message.status === "unread"
                                ? "#06B6D4"
                                : "#52525B",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            flexShrink: 0,
                          }}
                        >
                          {message.status || "read"}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{ color: "#52525B", fontSize: "0.68rem", mt: 0.8 }}
                      >
                        {formatDate(message.createdAt)}
                      </Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Box>

          {/* MANAGEMENT CARDS */}

          <Typography
            sx={{
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
              fontWeight: 700,
              mb: 2.5,
            }}
          >
            Manage Portfolio
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2, sm: 2.5, lg: 3 },
            }}
          >
            {dashboardCards.map((card) => (
              <Card
                key={card.path}
                onClick={() => navigate(card.path)}
                sx={{
                  cursor: "pointer",
                  minWidth: 0,
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "rgba(124,58,237,0.5)",
                    background: "rgba(124,58,237,0.06)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      fontSize: card.symbol.length > 1 ? "0.68rem" : "0.9rem",
                      fontWeight: 800,
                      background:
                        "linear-gradient(135deg, #7C3AED, #06B6D4)",
                    }}
                  >
                    {card.symbol}
                  </Box>

                  <Typography
                    sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 1 }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#A1A1AA",
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {card.description}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2.5,
                      color: "#06B6D4",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    Manage →
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* FOOTER */}

          <Box
            sx={{
              mt: 6,
              pt: 3,
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Typography
              sx={{
                color: "#52525B",
                fontSize: "0.75rem",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Portfolio Admin Panel • Daniyal
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

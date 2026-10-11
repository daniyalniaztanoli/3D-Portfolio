
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DownloadIcon from "@mui/icons-material/Download";

const API_URL = "https://hearty-friendship-production-fec3.up.railway.app/api/profile";
const SERVER_URL = "https://hearty-friendship-production-fec3.up.railway.app";

/* =========================================
   CODE TYPEWRITER
========================================= */

function CodeTypewriter() {
  const fullCode = `const developer = {
  name: "Daniyal",
  stack: "MERN",
  passion: "Coding"
};`;

  const [visibleChars, setVisibleChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let delay = deleting ? 35 : 55;

    if (!deleting && visibleChars === fullCode.length) {
      delay = 1800;
    }

    if (deleting && visibleChars === 0) {
      delay = 700;
    }

    const timer = setTimeout(() => {
      if (!deleting) {
        if (visibleChars < fullCode.length) {
          setVisibleChars((prev) => prev + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (visibleChars > 0) {
          setVisibleChars((prev) => prev - 1);
        } else {
          setDeleting(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleChars, deleting, fullCode.length]);

  return (
    <Text
      position={[-1.48, 0, 0.18]}
      fontSize={0.17}
      color="#06B6D4"
      anchorX="left"
      anchorY="middle"
      maxWidth={3}
      lineHeight={1.7}
    >
      {fullCode.substring(0, visibleChars) + "▌"}
    </Text>
  );
}

/* =========================================
   3D LAPTOP
========================================= */

function Laptop() {
  const laptopRef = useRef();

  useFrame((state) => {
    if (!laptopRef.current) return;

    laptopRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.12;

    laptopRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={1.5}
    >
      <group ref={laptopRef}>
        {/* Laptop base */}
        <RoundedBox
          args={[3.8, 0.22, 2.5]}
          radius={0.12}
          smoothness={6}
          position={[0, -1.1, 0]}
        >
          <meshStandardMaterial
            color="#151515"
            metalness={0.8}
            roughness={0.25}
          />
        </RoundedBox>

        {/* Screen frame */}
        <group position={[0, 0.3, -0.9]}>
          <RoundedBox
            args={[3.8, 2.5, 0.18]}
            radius={0.12}
            smoothness={6}
          >
            <meshStandardMaterial
              color="#111111"
              metalness={0.7}
              roughness={0.2}
            />
          </RoundedBox>

          {/* Screen */}
          <RoundedBox
            args={[3.45, 2.15, 0.04]}
            radius={0.08}
            smoothness={4}
            position={[0, 0, 0.12]}
          >
            <meshStandardMaterial
              color="#050505"
              emissive="#7C3AED"
              emissiveIntensity={0.12}
            />
          </RoundedBox>

          {/* Browser top bar */}
          <mesh position={[0, 0.82, 0.16]}>
            <boxGeometry args={[3.2, 0.03, 0.01]} />
            <meshBasicMaterial color="#222222" />
          </mesh>

          <mesh position={[-1.35, 0.82, 0.18]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#7C3AED" />
          </mesh>

          <mesh position={[-1.18, 0.82, 0.18]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#06B6D4" />
          </mesh>

          <mesh position={[-1.01, 0.82, 0.18]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>

          <CodeTypewriter />

          <pointLight
            position={[0, 0, 0.5]}
            intensity={2}
            distance={4}
            color="#7C3AED"
          />
        </group>

        {/* Keyboard */}
        <mesh position={[0, -0.91, 0.25]}>
          <boxGeometry args={[3.1, 0.04, 1.55]} />
          <meshStandardMaterial
            color="#202020"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Keyboard glow */}
        <mesh position={[0, -0.875, 0.25]}>
          <boxGeometry args={[2.7, 0.015, 1.2]} />
          <meshBasicMaterial
            color="#7C3AED"
            transparent
            opacity={0.08}
          />
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, -0.88, 0.9]}>
          <boxGeometry args={[1.0, 0.025, 0.55]} />
          <meshStandardMaterial
            color="#101010"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* =========================================
   PARTICLES
========================================= */

function Particles() {
  const groupRef = useRef();

  const [particles] = useState(() =>
    Array.from({ length: 55 }, (_, index) => ({
      id: index,
      x: (Math.random() - 0.5) * 7,
      y: (Math.random() - 0.5) * 5,
      z: (Math.random() - 0.5) * 3,
    }))
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y =
      state.clock.elapsedTime * 0.08;

    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <mesh
          key={particle.id}
          position={[particle.x, particle.y, particle.z]}
        >
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial
            color={particle.id % 2 === 0 ? "#7C3AED" : "#06B6D4"}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================
   3D SCENE
========================================= */

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={3}
        color="#FFFFFF"
      />

      <pointLight
        position={[3, 2, 3]}
        intensity={25}
        color="#7C3AED"
      />

      <pointLight
        position={[-3, 1, 2]}
        intensity={20}
        color="#06B6D4"
      />

      <Particles />
      <Laptop />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

/* =========================================
   HERO SECTION
========================================= */

export default function Hero3D() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [cvLoading, setCvLoading] = useState(true);
  const [cvError, setCvError] = useState("");

  /* Fetch latest CV URL from backend */
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not fetch profile");
        }

        const data = await response.json();
        const profile = data.profile || data;

        if (isMounted) {
          setResumeUrl(profile?.resumeUrl || "");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);

        if (isMounted) {
          setCvError(
            "CV load nahi ho saka. Backend connection check karein."
          );
        }
      } finally {
        if (isMounted) {
          setCvLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  /* Download latest uploaded CV */
  const handleDownloadCV = async () => {
    setCvError("");

    if (!resumeUrl) {
      setCvError("Abhi CV upload nahi hai. Admin panel se CV upload karein.");
      return;
    }

    const fullUrl = resumeUrl.startsWith("http")
      ? resumeUrl
      : `${SERVER_URL}${
          resumeUrl.startsWith("/") ? "" : "/"
        }${resumeUrl}`;

    try {
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error("CV file not found");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "Muhammad-Daniyal-CV.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("CV download error:", error);

      setCvError(
        "CV download nahi ho saka. Backend aur uploaded file check karein."
      );
    }
  };

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        pt: { xs: 11, sm: 12, md: 10 },
        pb: { xs: 7, sm: 8, md: 5 },
      }}
    >
      {/* Purple glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 260, sm: 380, md: 500 },
          height: { xs: 260, sm: 380, md: 500 },
          borderRadius: "50%",
          background: "rgba(124,58,237,0.13)",
          filter: { xs: "blur(90px)", md: "blur(130px)" },
          top: { xs: "8%", md: "5%" },
          right: { xs: "-25%", md: "-10%" },
          pointerEvents: "none",
        }}
      />

      {/* Cyan glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 220, sm: 300, md: 400 },
          height: { xs: 220, sm: 300, md: 400 },
          borderRadius: "50%",
          background: "rgba(6,182,212,0.10)",
          filter: { xs: "blur(80px)", md: "blur(120px)" },
          bottom: { xs: "-5%", md: "-10%" },
          left: { xs: "-25%", md: "-10%" },
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2.5, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "center",
            gap: { xs: 3, sm: 4, md: 5 },
          }}
        >
          {/* Left content */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography
                sx={{
                  color: "#06B6D4",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  mb: { xs: 1.5, md: 2 },
                }}
              >
                Hello, I'm
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "2.5rem",
                    sm: "3.2rem",
                    md: "4rem",
                    lg: "4.4rem",
                  },
                  lineHeight: { xs: 1.05, md: 1 },
                  letterSpacing: { xs: "-1.5px", md: "-2.5px" },
                }}
              >
                Muhammad
                <br />

                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Daniyal
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: { xs: 2.5, sm: 3 },
                  maxWidth: 550,
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  lineHeight: 1.8,
                }}
              >
                Full Stack Developer building modern, responsive and
                scalable web applications with React, Node.js and MongoDB.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  mt: { xs: 3, sm: 3.5 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() =>
                    document
                      .querySelector("#projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    px: 3,
                    py: 1.3,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(124,58,237,0.35)",
                    },
                    transition: "0.3s",
                  }}
                >
                  View Projects
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadCV}
                  disabled={cvLoading}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    px: 3,
                    py: 1.3,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "#FFFFFF",
                    "&:hover": {
                      borderColor: "#06B6D4",
                      background: "rgba(6,182,212,0.08)",
                    },
                    "&.Mui-disabled": {
                      color: "#A1A1AA",
                      borderColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {cvLoading ? "Loading CV..." : "Download CV"}
                </Button>
              </Stack>

              {cvError && (
                <Alert
                  severity="warning"
                  onClose={() => setCvError("")}
                  sx={{
                    mt: 2,
                    maxWidth: 450,
                    borderRadius: 2,
                  }}
                >
                  {cvError}
                </Alert>
              )}
            </motion.div>
          </Box>

          {/* Right 3D scene */}
          <Box
            sx={{
              width: "100%",
              height: {
                xs: 300,
                sm: 390,
                md: 500,
                lg: 560,
              },
              minWidth: 0,
              position: "relative",
            }}
          >
            <Scene />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
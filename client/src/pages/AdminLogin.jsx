
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// API CONFIGURATION
// ============================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://hearty-friendship-production-fec3.up.railway.app"
).replace(/\/$/, "");

// ============================================
// 3D ROCKET
// ============================================

function RocketModel() {
  const rocketRef = useRef();
  const flameRef = useRef();
  const glowRef = useRef();

  useFrame((state, delta) => {
    if (!rocketRef.current) return;

    const time = state.clock.getElapsedTime();

    rocketRef.current.position.x += delta * 2.7;
    rocketRef.current.position.y = Math.sin(time * 1.4) * 0.45;

    rocketRef.current.rotation.z =
      -Math.PI / 2 + Math.sin(time * 2) * 0.035;

    if (rocketRef.current.position.x > 13) {
      rocketRef.current.position.x = -13;
    }

    if (flameRef.current) {
      flameRef.current.scale.y =
        0.9 + Math.sin(time * 18) * 0.15;

      flameRef.current.scale.x =
        0.9 + Math.sin(time * 14) * 0.08;
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(time * 12) * 0.12
      );
    }
  });

  return (
    <group
      ref={rocketRef}
      position={[-13, 0, -1]}
      rotation={[0, 0, -Math.PI / 2]}
      scale={1.25}
    >
      <mesh>
        <cylinderGeometry args={[0.32, 0.4, 1.7, 32]} />
        <meshStandardMaterial
          color="#E5E7EB"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 1.08, 0]}>
        <coneGeometry args={[0.32, 0.55, 32]} />
        <meshStandardMaterial
          color="#7C3AED"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[0.27, 0.035, 12, 32]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={2}
        />
      </mesh>

      <mesh
        position={[0, 0.35, 0.32]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.17, 32]} />
        <meshStandardMaterial
          color="#06131A"
          metalness={0.9}
          roughness={0.1}
          emissive="#06B6D4"
          emissiveIntensity={0.8}
        />
      </mesh>

      <mesh
        position={[0, 0.35, 0.335]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.18, 0.025, 12, 32]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={1.5}
        />
      </mesh>

      <mesh
        position={[0, -0.35, -0.32]}
        rotation={[0, 0, -0.35]}
      >
        <boxGeometry args={[0.55, 0.7, 0.12]} />
        <meshStandardMaterial
          color="#7C3AED"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      <mesh
        position={[0, -0.35, 0.32]}
        rotation={[0, 0, 0.35]}
      >
        <boxGeometry args={[0.55, 0.7, 0.12]} />
        <meshStandardMaterial
          color="#7C3AED"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.18, 24]} />
        <meshStandardMaterial
          color="#18181B"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      <mesh ref={flameRef} position={[0, -1.35, 0]}>
        <coneGeometry args={[0.2, 0.9, 24]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={5}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh position={[0, -1.38, 0]}>
        <coneGeometry args={[0.11, 0.65, 20]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={5}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, -1.3, 0]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ============================================
// SECOND SMALL ROCKET
// ============================================

function SmallRocket() {
  const rocketRef = useRef();

  useFrame((state, delta) => {
    if (!rocketRef.current) return;

    const time = state.clock.getElapsedTime();

    rocketRef.current.position.x += delta * 1.5;
    rocketRef.current.position.y =
      Math.sin(time * 1.1) * 0.35 - 2.4;

    rocketRef.current.rotation.z =
      -Math.PI / 2 + Math.sin(time) * 0.04;

    if (rocketRef.current.position.x > 14) {
      rocketRef.current.position.x = -14;
    }
  });

  return (
    <group
      ref={rocketRef}
      position={[-14, -2.4, -2]}
      rotation={[0, 0, -Math.PI / 2]}
      scale={0.55}
    >
      <mesh>
        <cylinderGeometry args={[0.3, 0.38, 1.5, 24]} />
        <meshStandardMaterial
          color="#A1A1AA"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0.98, 0]}>
        <coneGeometry args={[0.3, 0.5, 24]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={1.5}
        />
      </mesh>

      <mesh position={[0, -1, 0]}>
        <coneGeometry args={[0.16, 0.65, 20]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// ============================================
// SPACE SCENE
// ============================================

function SpaceScene() {
  return (
    <>
      <ambientLight intensity={0.35} />

      <pointLight
        position={[5, 4, 5]}
        intensity={5}
        color="#7C3AED"
      />

      <pointLight
        position={[-5, -3, 3]}
        intensity={4}
        color="#06B6D4"
      />

      <Stars
        radius={80}
        depth={45}
        count={1800}
        factor={3}
        saturation={0}
        fade
        speed={0.7}
      />

      <Sparkles
        count={120}
        scale={[20, 12, 10]}
        size={1.3}
        speed={0.35}
        color="#06B6D4"
      />

      <RocketModel />
      <SmallRocket />
    </>
  );
}

// ============================================
// ADMIN LOGIN PAGE
// ============================================

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: form.email.trim(),
          password: form.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.token) {
        localStorage.setItem(
          "adminToken",
          response.data.token
        );

        localStorage.setItem(
          "adminUser",
          JSON.stringify(response.data.user || {})
        );

        navigate("/admin/dashboard");
      } else {
        setError(
          response.data?.message ||
            "Login failed. Please try again."
        );
      }
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      if (!err.response) {
        setError(
          "Cannot connect to the server. Please try again."
        );
      } else {
        setError(
          err.response.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at center, #101020 0%, #07070D 45%, #030305 100%)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: { xs: 280, md: 600 },
          height: { xs: 280, md: 600 },
          borderRadius: "50%",
          background: "rgba(124,58,237,0.13)",
          filter: "blur(120px)",
          top: "-180px",
          left: "-180px",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: { xs: 250, md: 500 },
          height: { xs: 250, md: 500 },
          borderRadius: "50%",
          background: "rgba(6,182,212,0.09)",
          filter: "blur(120px)",
          bottom: "-180px",
          right: "-180px",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <Canvas
          camera={{
            position: [0, 0, 12],
            fov: 45,
          }}
          dpr={[1, 1.5]}
        >
          <SpaceScene />
        </Canvas>
      </Box>

      <Typography
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: { xs: 20, md: 30 },
          left: { xs: 20, md: 35 },
          zIndex: 10,
          fontSize: { xs: "1.5rem", md: "1.8rem" },
          fontWeight: 800,
          letterSpacing: "-0.04em",
          cursor: "pointer",
          background:
            "linear-gradient(90deg, #7C3AED, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Daniyal.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 5,
          width: {
            xs: "calc(100% - 32px)",
            sm: 430,
          },
          p: { xs: 3, sm: 4 },
          borderRadius: { xs: 3, sm: 4 },
          background: "rgba(10,10,15,0.82)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.7), 0 0 70px rgba(124,58,237,0.12)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.13)",
            filter: "blur(70px)",
            top: -100,
            right: -80,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              color: "#06B6D4",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            ADMIN PORTAL
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.2rem", sm: "2.5rem" },
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            Welcome

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
              Back.
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#71717A",
              fontSize: "0.82rem",
              mt: 1.5,
            }}
          >
            Sign in to manage your portfolio
          </Typography>
        </Box>

        {error && (
          <Box
            role="alert"
            sx={{
              position: "relative",
              mb: 2.5,
              p: 1.5,
              borderRadius: 2,
              border:
                "1px solid rgba(248,113,113,0.3)",
              background: "rgba(248,113,113,0.06)",
            }}
          >
            <Typography
              sx={{
                color: "#F87171",
                fontSize: "0.78rem",
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ position: "relative" }}
        >
          <Typography
            sx={{
              color: "#D4D4D8",
              fontSize: "0.78rem",
              fontWeight: 600,
              mb: 0.8,
            }}
          >
            Email Address
          </Typography>

          <TextField
            fullWidth
            name="email"
            type="email"
            autoComplete="username"
            placeholder="admin@example.com"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                background: "rgba(255,255,255,0.035)",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.1)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(124,58,237,0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7C3AED",
                  borderWidth: "1px",
                },
              },
              "& input": {
                fontSize: "0.9rem",
              },
            }}
          />

          <Typography
            sx={{
              color: "#D4D4D8",
              fontSize: "0.78rem",
              fontWeight: 600,
              mb: 0.8,
            }}
          >
            Password
          </Typography>

          <TextField
            fullWidth
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                background: "rgba(255,255,255,0.035)",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.1)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(124,58,237,0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7C3AED",
                  borderWidth: "1px",
                },
              },
              "& input": {
                fontSize: "0.9rem",
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontSize: "0.9rem",
              fontWeight: 700,
              background:
                "linear-gradient(90deg, #7C3AED, #06B6D4)",
              boxShadow:
                "0 10px 30px rgba(124,58,237,0.25)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #6D28D9, #0891B2)",
                boxShadow:
                  "0 12px 35px rgba(124,58,237,0.4)",
              },
              "&:disabled": {
                background: "rgba(124,58,237,0.3)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={22}
                sx={{ color: "#fff" }}
              />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        <Button
          fullWidth
          onClick={() => navigate("/")}
          sx={{
            position: "relative",
            mt: 2,
            color: "#71717A",
            fontSize: "0.78rem",
            "&:hover": {
              color: "#fff",
              background: "transparent",
            },
          }}
        >
          ← Back to Portfolio
        </Button>

        <Box
          sx={{
            height: 2,
            width: "45%",
            mx: "auto",
            mt: 3,
            borderRadius: 10,
            background:
              "linear-gradient(90deg, #7C3AED, #06B6D4)",
          }}
        />
      </Paper>

      <Typography
        sx={{
          position: "absolute",
          bottom: { xs: 18, md: 25 },
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#3F3F46",
          fontSize: "0.68rem",
          zIndex: 3,
        }}
      >
        Secure Admin Access • Daniyal Portfolio
      </Typography>
    </Box>
  );
}

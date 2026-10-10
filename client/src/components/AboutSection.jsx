import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  RoundedBox,
} from "@react-three/drei";

import { useRef } from "react";
import { motion } from "framer-motion";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CodeIcon from "@mui/icons-material/Code";

const PURPLE = "#7C3AED";
const CYAN = "#06B6D4";

/* =========================
   3D CORE
========================= */

function GlassCore() {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    const time = state.clock.elapsedTime;

    group.current.rotation.x =
      Math.sin(time * 0.4) * 0.12;

    group.current.rotation.y =
      time * 0.3;

    group.current.position.y =
      Math.sin(time * 0.8) * 0.08;
  });

  return (
    <group ref={group}>

      {/* GLASS CUBE */}

      <RoundedBox
        args={[2.2, 2.2, 2.2]}
        radius={0.3}
        smoothness={6}
      >
        <meshPhysicalMaterial
          color={PURPLE}
          transparent
          opacity={0.18}
          roughness={0.08}
          metalness={0.4}
          transmission={0.8}
          thickness={1}
        />
      </RoundedBox>

      {/* INNER CORE */}

      <mesh scale={0.5}>
        <icosahedronGeometry args={[1, 3]} />

        <meshStandardMaterial
          color={PURPLE}
          emissive={PURPLE}
          emissiveIntensity={2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* CYAN RING */}

      <mesh
        rotation={[
          Math.PI / 2,
          0.2,
          0,
        ]}
      >
        <torusGeometry
          args={[
            1.45,
            0.015,
            16,
            80,
          ]}
        />

        <meshBasicMaterial color={CYAN} />
      </mesh>

      {/* PURPLE RING */}

      <mesh
        rotation={[
          0.5,
          Math.PI / 3,
          0,
        ]}
      >
        <torusGeometry
          args={[
            1.7,
            0.012,
            16,
            80,
          ]}
        />

        <meshBasicMaterial color={PURPLE} />
      </mesh>

    </group>
  );
}

/* =========================
   3D SCENE
========================= */

function AboutScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5.5],
        fov: 42,
      }}
      dpr={[1, 1.5]}
      style={{
        width: "100%",
        height: "100%",
      }}
    >

      <ambientLight intensity={1.2} />

      <pointLight
        position={[3, 3, 4]}
        intensity={12}
        color={PURPLE}
      />

      <pointLight
        position={[-3, -2, 3]}
        intensity={10}
        color={CYAN}
      />

      <Environment preset="city" />

      <Float
        speed={1.4}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <GlassCore />
      </Float>

    </Canvas>
  );
}

/* =========================
   ABOUT SECTION
========================= */

export default function AboutSection() {
  return (
    <Box
      id="about"
      sx={{
        position: "relative",
        overflow: "hidden",

        py: {
          xs: 7,
          sm: 9,
          md: 12,
        },
      }}
    >

      {/* BACKGROUND GRID */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,

          opacity: 0.16,

          pointerEvents: "none",

          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 1px,
              transparent 1px
            )
          `,

          backgroundSize: {
            xs: "45px 45px",
            sm: "55px 55px",
            md: "70px 70px",
          },
        }}
      />

      {/* PURPLE GLOW */}

      <Box
        sx={{
          position: "absolute",

          width: {
            xs: 220,
            sm: 300,
            md: 400,
          },

          height: {
            xs: 220,
            sm: 300,
            md: 400,
          },

          borderRadius: "50%",

          background:
            "rgba(124,58,237,0.09)",

          filter: {
            xs: "blur(80px)",
            md: "blur(140px)",
          },

          left: {
            xs: "-120px",
            md: "-180px",
          },

          top: "25%",

          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,

          px: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
        }}
      >

        {/* =========================
            SECTION LABEL
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              mb: {
                xs: 3.5,
                sm: 4,
                md: 5,
              },
            }}
          >

            <Typography
              sx={{
                color: CYAN,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              01 / ABOUT ME
            </Typography>
            

          </Stack>

        </motion.div>

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1.05fr 0.95fr",
            },

            gap: {
              xs: 3,
              sm: 4,
              md: 5,
            },

            alignItems: "center",
          }}
        >

          {/* =========================
              TEXT
          ========================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <Typography
              component="h2"
              sx={{
                fontWeight: 800,

                /* SAME SYSTEM AS HERO */

                fontSize: {
                  xs: "2.5rem",
                  sm: "3.2rem",
                  md: "4rem",
                  lg: "4.4rem",
                },

                lineHeight: {
                  xs: 1.05,
                  md: 1,
                },

                letterSpacing: {
                  xs: "-1.5px",
                  md: "-2.5px",
                },

                maxWidth: 650,
              }}
            >
              More Than
              <br />

              <Box
                component="span"
                sx={{
                  background:
                    `linear-gradient(
                      90deg,
                      ${PURPLE},
                      ${CYAN}
                    )`,

                  backgroundClip:
                    "text",

                  WebkitBackgroundClip:
                    "text",

                  WebkitTextFillColor:
                    "transparent",
                }}
              >
                A Developer.
              </Box>

            </Typography>

            {/* BODY */}

            <Typography
              sx={{
                mt: {
                  xs: 2.5,
                  sm: 3,
                  md: 3.5,
                },

                maxWidth: 560,

                color: "text.secondary",

                /* SAME BODY SCALE */

                fontSize: {
                  xs: "0.9rem",
                  sm: "0.95rem",
                  md: "1rem",
                },

                lineHeight: 1.8,
              }}
            >
              I'm Muhammad Daniyal, a Full Stack
              Developer who enjoys turning ideas into
              modern, responsive and interactive web
              experiences.
            </Typography>

            <Typography
              sx={{
                mt: 1.5,

                maxWidth: 560,

                color: "text.secondary",

                fontSize: {
                  xs: "0.9rem",
                  sm: "0.95rem",
                  md: "1rem",
                },

                lineHeight: 1.8,
              }}
            >
              I work mainly with React, JavaScript,
              Node.js, Express and MongoDB, while
              exploring 3D interfaces and creative
              frontend experiences.
            </Typography>

            {/* BUTTON */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              sx={{
                mt: {
                  xs: 3,
                  sm: 3.5,
                  md: 4,
                },

                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >

              <Button
                href="/contact"
                variant="contained"
                endIcon={
                  <ArrowForwardIcon />
                }
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  px: 2.5,
                  py: 1.3,

                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.9rem",
                  },

                  background:
                    `linear-gradient(
                      90deg,
                      ${PURPLE},
                      ${CYAN}
                    )`,

                  "&:hover": {
                    transform:
                      "translateY(-2px)",
                  },

                  transition: "0.25s",
                }}
              >
                Let's work together
              </Button>

            </Stack>

          </motion.div>

          {/* =========================
              3D
          ========================= */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <Box
              sx={{
                position: "relative",

                width: "100%",

                height: {
                  xs: 280,
                  sm: 350,
                  md: 440,
                  lg: 470,
                },

                minWidth: 0,
              }}
            >

              <AboutScene />

              {/* CURRENT FOCUS */}

              <Box
                sx={{
                  position: "absolute",

                  left: {
                    xs: 0,
                    sm: 5,
                    md: 0,
                  },

                  bottom: {
                    xs: 5,
                    sm: 15,
                    md: 30,
                  },

                  maxWidth: {
                    xs: "70%",
                    sm: "auto",
                  },

                  px: {
                    xs: 1.5,
                    sm: 2,
                  },

                  py: {
                    xs: 1,
                    sm: 1.2,
                  },

                  border:
                    "1px solid rgba(255,255,255,0.1)",

                  borderRadius: 2,

                  background:
                    "rgba(10,10,10,0.65)",

                  backdropFilter:
                    "blur(12px)",
                }}
              >

                <Typography
                  sx={{
                    color: CYAN,

                    fontSize: {
                      xs: "0.55rem",
                      sm: "0.62rem",
                    },

                    letterSpacing: 1.5,
                    fontWeight: 700,
                  }}
                >
                  CURRENT FOCUS
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.65rem",
                      sm: "0.75rem",
                    },

                    fontWeight: 600,

                    mt: 0.3,

                    whiteSpace: {
                      xs: "normal",
                      sm: "nowrap",
                    },
                  }}
                >
                  Full Stack Development
                </Typography>

              </Box>

              {/* TECH */}

              <Box
                sx={{
                  position: "absolute",

                  right: {
                    xs: 0,
                    sm: 5,
                    md: 0,
                  },

                  top: {
                    xs: 5,
                    sm: 15,
                    md: 30,
                  },

                  px: {
                    xs: 1.2,
                    sm: 1.5,
                  },

                  py: {
                    xs: 0.8,
                    sm: 1,
                  },

                  border:
                    "1px solid rgba(124,58,237,0.3)",

                  borderRadius: 2,

                  background:
                    "rgba(124,58,237,0.08)",

                  backdropFilter:
                    "blur(12px)",
                }}
              >

                <Stack
                  direction="row"
                  spacing={0.7}
                  alignItems="center"
                >

                  <CodeIcon
                    sx={{
                      color: PURPLE,

                      fontSize: {
                        xs: 14,
                        sm: 16,
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },

                      fontWeight: 600,

                      whiteSpace: "nowrap",
                    }}
                  >
                    React + Node
                  </Typography>

                </Stack>

              </Box>

            </Box>

          </motion.div>

        </Box>

        {/* =========================
            STATS
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >

          <Box
            sx={{
              mt: {
                xs: 6,
                sm: 7,
                md: 8,
              },

              pt: {
                xs: 2.5,
                sm: 3,
              },

              borderTop:
                "1px solid rgba(255,255,255,0.1)",

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(4, 1fr)",
              },

              gap: {
                xs: 2.5,
                sm: 2,
              },
            }}
          >

            <Stat
              value="MERN"
              label="Stack"
            />

            <Stat
              value="10+"
              label="Projects"
            />

            <Stat
              value="React"
              label="Frontend"
            />

            <Stat
              value="Node"
              label="Backend"
            />

          </Box>

        </motion.div>

      </Container>

    </Box>
  );
}

/* =========================
   STAT
========================= */

function Stat({ value, label }) {
  return (
    <Box
      sx={{
        minWidth: 0,
      }}
    >

      <Typography
        sx={{
          fontSize: {
            xs: "1.2rem",
            sm: "1.4rem",
            md: "1.6rem",
          },

          fontWeight: 800,

          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          mt: 0.3,

          color: "text.secondary",

          fontSize: {
            xs: "0.65rem",
            sm: "0.7rem",
          },

          letterSpacing: 0.8,
        }}
      >
        {label}
      </Typography>

    </Box>
  );
}
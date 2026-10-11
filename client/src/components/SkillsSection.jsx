import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Chip,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import BuildIcon from "@mui/icons-material/Build";

const API_URL = "https://hearty-friendship-production-fec3.up.railway.app/api/skills";

const categoryIcons = {
  Frontend: <CodeIcon />,
  Backend: <StorageIcon />,
  Tools: <BuildIcon />,
};

const categories = ["Frontend", "Backend", "Tools"];

const headingSize = {
  xs: "2.5rem",
  sm: "3.2rem",
  md: "4rem",
  lg: "4.4rem",
};

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const getSkills = async () => {
      try {
        const response = await axios.get(API_URL, {
          signal: controller.signal,
        });

        const data = response.data;

        if (Array.isArray(data)) {
          setSkills(data);
        } else if (Array.isArray(data?.skills)) {
          setSkills(data.skills);
        } else if (Array.isArray(data?.data)) {
          setSkills(data.data);
        } else {
          setSkills([]);
        }
      } catch (error) {
        if (axios.isCancel(error) || error.name === "CanceledError") return;
        console.error("Error loading skills:", error);
        setSkills([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    getSkills();

    return () => controller.abort();
  }, []);

  const getSkillsByCategory = (category) =>
    skills.filter(
      (skill) =>
        String(skill.category || "").toLowerCase() ===
          category.toLowerCase() && skill.status !== "draft"
    );

  const visibleCategories = categories.filter(
    (category) => getSkillsByCategory(category).length > 0
  );

  return (
    <Box
      id="skills"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 7, sm: 9, md: 12 },
        background: "#050505",
      }}
    >
      {/* Background Grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Purple Glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 180, md: 320 },
          height: { xs: 180, md: 320 },
          borderRadius: "50%",
          background: "rgba(124, 58, 237, 0.15)",
          filter: "blur(100px)",
          left: { xs: -100, md: -120 },
          top: "20%",
          pointerEvents: "none",
        }}
      />

      {/* Cyan Glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 160, md: 280 },
          height: { xs: 160, md: 280 },
          borderRadius: "50%",
          background: "rgba(6, 182, 212, 0.12)",
          filter: "blur(100px)",
          right: { xs: -90, md: -100 },
          bottom: "10%",
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
        {/* Section Header */}
        <Box sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              color: "#06B6D4",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              mb: 1.5,
            }}
          >
            02 / SKILLS
          </Typography>

          <Typography
            component="h2"
            sx={{
              color: "#FFFFFF",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
              fontSize: headingSize,
            }}
          >
            Tools I Use
          </Typography>

          <Typography
            component="span"
            sx={{
              display: "block",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              fontSize: headingSize,
              background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              width: "fit-content",
              pb: 0.5,
            }}
          >
            To Build Things.
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 650,
              color: "#A1A1AA",
              lineHeight: 1.8,
              fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
            }}
          >
            Technologies and tools I use to build responsive, scalable and
            interactive digital experiences.
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Typography sx={{ color: "#A1A1AA", fontSize: "0.95rem" }}>
            Loading skills...
          </Typography>
        )}

        {/* No Skills */}
        {!loading && visibleCategories.length === 0 && (
          <Box
            sx={{
              py: 6,
              px: 3,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <Typography sx={{ color: "#A1A1AA", fontSize: "0.95rem" }}>
              No skills found. Add skills from the Admin Panel.
            </Typography>
          </Box>
        )}

        {/* Skill Categories */}
        {!loading && visibleCategories.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: `repeat(${Math.min(visibleCategories.length, 3)}, 1fr)`,
              },
              gap: { xs: 2, md: 3 },
            }}
          >
            {visibleCategories.map((category) => {
              const categorySkills = getSkillsByCategory(category);

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  style={{ height: "100%" }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      p: { xs: 2.2, sm: 3 },
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.035)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(14px)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        borderColor: "rgba(124,58,237,0.45)",
                        boxShadow: "0 20px 60px rgba(124,58,237,0.12)",
                      },
                    }}
                  >
                    {/* Category Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 2,
                          color: "#06B6D4",
                          background: "rgba(124,58,237,0.12)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {categoryIcons[category]}
                      </Box>

                      <Typography
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        {category}
                      </Typography>
                    </Box>

                    {/* Skills */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                      }}
                    >
                      {categorySkills.map((skill, index) => {
                        const level = Math.min(
                          100,
                          Math.max(0, Number(skill.level) || 0)
                        );

                        return (
                          <motion.div
                            key={skill._id || skill.name || index}
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.08,
                            }}
                          >
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 0.8,
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#FFFFFF",
                                    fontWeight: 600,
                                    fontSize: {
                                      xs: "0.82rem",
                                      sm: "0.88rem",
                                    },
                                  }}
                                >
                                  {skill.name}
                                </Typography>

                                <Typography
                                  sx={{
                                    color: "#06B6D4",
                                    fontWeight: 700,
                                    fontSize: "0.72rem",
                                  }}
                                >
                                  {level}%
                                </Typography>
                              </Box>

                              <LinearProgress
                                variant="determinate"
                                value={level}
                                sx={{
                                  height: 5,
                                  borderRadius: 10,
                                  backgroundColor: "rgba(255,255,255,0.08)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 10,
                                    background:
                                      "linear-gradient(90deg, #7C3AED, #06B6D4)",
                                  },
                                }}
                              />
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Box>

                    {/* Skill Chips */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.8,
                        mt: 3,
                      }}
                    >
                      {categorySkills.slice(0, 4).map((skill, index) => (
                        <Chip
                          key={skill._id || skill.name || index}
                          label={skill.name}
                          size="small"
                          sx={{
                            color: "#A1A1AA",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            fontSize: "0.68rem",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}
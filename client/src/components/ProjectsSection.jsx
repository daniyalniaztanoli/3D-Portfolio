import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/projects`;

const headingSize = {
  xs: "2.5rem",
  sm: "3.2rem",
  md: "4rem",
  lg: "4.4rem",
};

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const getProjects = async () => {
      try {
        const response = await axios.get(API_URL, {
          signal: controller.signal,
        });

        const data = response.data;
        let list = [];

        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.projects)) list = data.projects;
        else if (Array.isArray(data?.data)) list = data.data;

        setProjects(list.filter((project) => project.status !== "draft"));
      } catch (error) {
        if (axios.isCancel(error) || error.name === "CanceledError") return;
        console.error("Error loading projects:", error);
        setProjects([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    getProjects();

    return () => controller.abort();
  }, []);

  return (
    <Box
      id="projects"
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
          opacity: 0.1,
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
          width: { xs: 180, md: 330 },
          height: { xs: 180, md: 330 },
          borderRadius: "50%",
          background: "rgba(124,58,237,0.14)",
          filter: "blur(110px)",
          left: { xs: -100, md: -140 },
          top: "15%",
          pointerEvents: "none",
        }}
      />

      {/* Cyan Glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 170, md: 300 },
          height: { xs: 170, md: 300 },
          borderRadius: "50%",
          background: "rgba(6,182,212,0.1)",
          filter: "blur(110px)",
          right: { xs: -100, md: -130 },
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
        {/* Header */}
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
            03 / PROJECTS
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
            Things I've
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
            Built.
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
            A selection of projects where I turn ideas into functional and
            interactive digital experiences.
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Typography sx={{ color: "#A1A1AA", fontSize: "0.95rem" }}>
            Loading projects...
          </Typography>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <Box
            sx={{
              py: 7,
              px: 3,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <Typography
              sx={{ color: "#A1A1AA", fontSize: "0.95rem", mb: 2 }}
            >
              No projects found.
            </Typography>

            <Typography sx={{ color: "#71717A", fontSize: "0.82rem" }}>
              Add projects from the Admin Panel.
            </Typography>
          </Box>
        )}

        {/* Projects */}
        {!loading && projects.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {projects.map((project, index) => {
              const imageUrl = getImageUrl(project.image);

              return (
                <motion.div
                  key={project._id || project.slug || index}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 3) * 0.08,
                  }}
                  style={{ height: "100%" }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.035)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(14px)",
                      transition:
                        "transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        borderColor: "rgba(124,58,237,0.45)",
                        boxShadow: "0 25px 70px rgba(124,58,237,0.13)",
                        "& img": { transform: "scale(1.06)" },
                      },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16 / 10",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #111111, #17111f)",
                      }}
                    >
                      {imageUrl ? (
                        <Box
                          component="img"
                          src={imageUrl}
                          alt={project.title || "Project"}
                          loading="lazy"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            background:
                              "radial-gradient(circle at center, rgba(124,58,237,0.22), transparent 60%)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#7C3AED",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              letterSpacing: "0.2em",
                            }}
                          >
                            PROJECT
                          </Typography>
                        </Box>
                      )}

                      {/* Featured Badge */}
                      {project.featured && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 14,
                            left: 14,
                            px: 1.2,
                            py: 0.6,
                            borderRadius: 2,
                            background: "rgba(124,58,237,0.85)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#FFFFFF",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                            }}
                          >
                            FEATURED
                          </Typography>
                        </Box>
                      )}

                      {/* Category */}
                      {project.category && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 14,
                            right: 14,
                            px: 1.2,
                            py: 0.6,
                            borderRadius: 2,
                            background: "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#A1A1AA",
                              fontSize: "0.62rem",
                              fontWeight: 600,
                            }}
                          >
                            {project.category}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Content */}
                    <Box
                      sx={{
                        p: { xs: 2.2, sm: 2.6 },
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <Typography
                        component="h3"
                        sx={{
                          color: "#FFFFFF",
                          fontSize: { xs: "1.05rem", sm: "1.15rem" },
                          fontWeight: 700,
                          mb: 1.2,
                        }}
                      >
                        {project.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#A1A1AA",
                          fontSize: { xs: "0.8rem", sm: "0.84rem" },
                          lineHeight: 1.7,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {project.description}
                      </Typography>

                      {/* Technologies */}
                      {Array.isArray(project.technologies) &&
                        project.technologies.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.7,
                              mb: 2.5,
                            }}
                          >
                            {project.technologies
                              .slice(0, 5)
                              .map((technology, techIndex) => (
                                <Chip
                                  key={`${technology}-${techIndex}`}
                                  label={technology}
                                  size="small"
                                  sx={{
                                    color: "#A1A1AA",
                                    background: "rgba(255,255,255,0.04)",
                                    border:
                                      "1px solid rgba(255,255,255,0.07)",
                                    fontSize: "0.65rem",
                                  }}
                                />
                              ))}
                          </Box>
                        )}

                      {/* Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: "auto",
                          flexWrap: "wrap",
                        }}
                      >
                        {project.githubUrl && (
                          <Button
                            component="a"
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            startIcon={<GitHubIcon />}
                            sx={{
                              color: "#FFFFFF",
                              border: "1px solid rgba(255,255,255,0.12)",
                              fontSize: "0.72rem",
                              "&:hover": {
                                borderColor: "#7C3AED",
                                background: "rgba(124,58,237,0.1)",
                              },
                            }}
                          >
                            GitHub
                          </Button>
                        )}

                        {project.liveUrl && (
                          <Button
                            component="a"
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            variant="contained"
                            endIcon={<OpenInNewIcon />}
                            sx={{
                              background:
                                "linear-gradient(90deg, #7C3AED, #06B6D4)",
                              color: "#FFFFFF",
                              fontSize: "0.72rem",
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg, #6D28D9, #0891B2)",
                              },
                            }}
                          >
                            Live Demo
                          </Button>
                        )}
                      </Box>
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
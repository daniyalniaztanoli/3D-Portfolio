import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api/experiences";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(API_URL);

        if (Array.isArray(response.data)) {
          const data = response.data
            .filter((item) => item.status !== "draft")
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          setExperiences(data);
        } else {
          setExperiences([]);
        }
      } catch (error) {
        console.error("Error loading experience:", error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDateRange = (experience) => {
    const start = formatDate(experience.startDate);

    if (experience.currentlyWorking) {
      return `${start} — Present`;
    }

    const end = formatDate(experience.endDate);

    if (start && end) {
      return `${start} — ${end}`;
    }

    return start || end;
  };

  return (
    <Box
      id="experience"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: {
          xs: 7,
          sm: 9,
          md: 12,
        },
        backgroundColor: "#050505",
      }}
    >
      {/* Background Grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.05) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Purple Glow */}
      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 180,
            md: 320,
          },
          height: {
            xs: 180,
            md: 320,
          },
          borderRadius: "50%",
          backgroundColor: "rgba(124,58,237,0.12)",
          filter: "blur(100px)",
          left: {
            xs: -100,
            md: -120,
          },
          top: "15%",
          pointerEvents: "none",
        }}
      />

      {/* Cyan Glow */}
      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 160,
            md: 280,
          },
          height: {
            xs: 160,
            md: 280,
          },
          borderRadius: "50%",
          backgroundColor: "rgba(6,182,212,0.1)",
          filter: "blur(100px)",
          right: {
            xs: -90,
            md: -100,
          },
          bottom: "10%",
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
        {/* Header */}
        <Box
          sx={{
            mb: {
              xs: 5,
              md: 7,
            },
          }}
        >
          <Typography
            sx={{
              color: "#06B6D4",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              mb: 1.5,
            }}
          >
            04 / EXPERIENCE
          </Typography>

          <Typography
            component="h2"
            sx={{
              color: "#FFFFFF",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
              fontSize: {
                xs: "2.5rem",
                sm: "3.2rem",
                md: "4rem",
                lg: "4.4rem",
              },
            }}
          >
            Where I've
          </Typography>

          <Typography
            component="span"
            sx={{
              display: "block",
              color: "transparent",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
              fontSize: {
                xs: "2.5rem",
                sm: "3.2rem",
                md: "4rem",
                lg: "4.4rem",
              },
              background:
                "linear-gradient(90deg, #7C3AED, #06B6D4)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            Worked.
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 650,
              color: "#A1A1AA",
              lineHeight: 1.8,
              fontSize: {
                xs: "0.9rem",
                sm: "0.95rem",
                md: "1rem",
              },
            }}
          >
            A timeline of my professional experience,
            responsibilities and development journey.
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Typography
            sx={{
              color: "#A1A1AA",
              fontSize: "0.95rem",
            }}
          >
            Loading experience...
          </Typography>
        )}

        {/* Empty */}
        {!loading && experiences.length === 0 && (
          <Box
            sx={{
              py: 7,
              px: 3,
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography
              sx={{
                color: "#A1A1AA",
                fontSize: "0.95rem",
                mb: 1,
              }}
            >
              No experience found.
            </Typography>

            <Typography
              sx={{
                color: "#71717A",
                fontSize: "0.82rem",
              }}
            >
              Add experience from the Admin Panel.
            </Typography>
          </Box>
        )}

        {/* Experience */}
        {!loading && experiences.length > 0 && (
          <Box
            sx={{
              position: "relative",
            }}
          >
            {/* Timeline Line */}
            <Box
              sx={{
                position: "absolute",
                left: {
                  xs: 19,
                  sm: 23,
                  md: 29,
                },
                top: 20,
                bottom: 20,
                width: "1px",
                background:
                  "linear-gradient(180deg, #7C3AED, #06B6D4, rgba(6,182,212,0))",
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: {
                  xs: 3,
                  sm: 4,
                  md: 5,
                },
              }}
            >
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience._id || index}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "40px minmax(0, 1fr)",
                        sm: "48px minmax(0, 1fr)",
                        md: "60px minmax(0, 1fr)",
                      },
                      gap: {
                        xs: 1.5,
                        sm: 2,
                        md: 3,
                      },
                      alignItems: "start",
                    }}
                  >
                    {/* Timeline Dot */}
                    <Box
                      sx={{
                        width: {
                          xs: 40,
                          sm: 48,
                          md: 60,
                        },
                        height: {
                          xs: 40,
                          sm: 48,
                          md: 60,
                        },
                        borderRadius: "50%",
                        position: "relative",
                        zIndex: 2,
                        display: "grid",
                        placeItems: "center",
                        background:
                          "linear-gradient(135deg, #7C3AED, #06B6D4)",
                        border: "5px solid #050505",
                        boxShadow:
                          "0 0 25px rgba(124,58,237,0.25)",
                      }}
                    >
                      <Box
                        sx={{
                          width: {
                            xs: 8,
                            sm: 9,
                            md: 10,
                          },
                          height: {
                            xs: 8,
                            sm: 9,
                            md: 10,
                          },
                          borderRadius: "50%",
                          backgroundColor: "#FFFFFF",
                        }}
                      />
                    </Box>

                    {/* Card */}
                    <Box
                      sx={{
                        minWidth: 0,
                        p: {
                          xs: 2,
                          sm: 2.8,
                          md: 3.5,
                        },
                        borderRadius: 4,
                        backgroundColor:
                          "rgba(255,255,255,0.035)",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(14px)",
                        transition:
                          "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: {
                            xs: "none",
                            md: "translateY(-5px)",
                          },
                          borderColor:
                            "rgba(124,58,237,0.4)",
                          boxShadow:
                            "0 20px 60px rgba(124,58,237,0.1)",
                        },
                      }}
                    >
                      {/* Position + Company */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: {
                            xs: "column",
                            sm: "row",
                          },
                          justifyContent:
                            "space-between",
                          alignItems: {
                            xs: "flex-start",
                            sm: "center",
                          },
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            component="h3"
                            sx={{
                              color: "#FFFFFF",
                              fontWeight: 700,
                              fontSize: {
                                xs: "1rem",
                                sm: "1.15rem",
                              },
                              lineHeight: 1.3,
                              wordBreak: "break-word",
                            }}
                          >
                            {experience.position ||
                              "Position"}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.5,
                              color: "#06B6D4",
                              fontWeight: 600,
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.88rem",
                              },
                              wordBreak: "break-word",
                            }}
                          >
                            {experience.company ||
                              "Company"}
                          </Typography>
                        </Box>

                        {/* Date */}
                        {getDateRange(experience) && (
                          <Chip
                            label={getDateRange(
                              experience
                            )}
                            size="small"
                            sx={{
                              maxWidth: "100%",
                              color: "#A1A1AA",
                              backgroundColor:
                                "rgba(255,255,255,0.04)",
                              border:
                                "1px solid rgba(255,255,255,0.08)",
                              fontSize: "0.68rem",
                            }}
                          />
                        )}
                      </Box>

                      {/* Location */}
                      {experience.location && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              backgroundColor: "#7C3AED",
                              flexShrink: 0,
                            }}
                          />

                          <Typography
                            sx={{
                              color: "#71717A",
                              fontSize: "0.75rem",
                              wordBreak: "break-word",
                            }}
                          >
                            {experience.location}
                          </Typography>
                        </Box>
                      )}

                      {/* Description */}
                      {experience.description && (
                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: {
                              xs: "0.82rem",
                              sm: "0.88rem",
                            },
                            lineHeight: 1.8,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {experience.description}
                        </Typography>
                      )}

                      {/* Bottom */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                          mt:
                            experience.companyLogo ||
                            experience.currentlyWorking
                              ? 2.5
                              : 0,
                        }}
                      >
                        {/* Company Logo */}
                        {experience.companyLogo ? (
                          <Box
                            component="img"
                            src={
                              experience.companyLogo.startsWith(
                                "http"
                              )
                                ? experience.companyLogo
                                : `http://localhost:5000${experience.companyLogo}`
                            }
                            alt={
                              experience.company ||
                              "Company"
                            }
                            sx={{
                              width: 44,
                              height: 44,
                              objectFit: "contain",
                              borderRadius: 2,
                              p: 0.7,
                              backgroundColor:
                                "rgba(255,255,255,0.05)",
                              border:
                                "1px solid rgba(255,255,255,0.08)",
                            }}
                          />
                        ) : (
                          <Box />
                        )}

                        {/* Current Job */}
                        {experience.currentlyWorking && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                            }}
                          >
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor:
                                  "#06B6D4",
                                boxShadow:
                                  "0 0 10px rgba(6,182,212,0.8)",
                              }}
                            />

                            <Typography
                              sx={{
                                color: "#06B6D4",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                letterSpacing:
                                  "0.08em",
                              }}
                            >
                              CURRENTLY WORKING
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

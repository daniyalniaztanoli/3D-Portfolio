import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

const SERVER_URL = (
  import.meta.env.VITE_API_URL || "https://hearty-friendship-production-fec3.up.railway.app"
).replace(/\/$/, "");

const API_URL = `${SERVER_URL}/api/certificates`;

const headingSize = {
  xs: "2.5rem",
  sm: "3.2rem",
  md: "4rem",
  lg: "4.4rem",
};

export default function EducationSection() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await axios.get(API_URL);
        const educations = response.data?.educations || [];

        const data = educations
          .filter((item) => item.status !== "draft")
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setEducation(data);
      } catch (err) {
        console.error("Education API Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load education"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
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

  const getDateRange = (item) => {
    const start = formatDate(item.startDate);

    if (item.currentlyStudying) {
      return start ? `${start} — Present` : "Present";
    }

    const end = formatDate(item.endDate);

    if (start && end) return `${start} — ${end}`;

    return start || end;
  };

  const sectionLabelSx = {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#06B6D4",
  };

  const cardTitleSx = {
    color: "#C4B5FD",
    fontWeight: 700,
    fontSize: {
      xs: "1rem",
      sm: "1.15rem",
    },
    lineHeight: 1.4,
    wordBreak: "break-word",
  };

  const chipSx = {
    maxWidth: "100%",
    color: "#C4B5FD",
    backgroundColor: "rgba(124,58,237,0.09)",
    border: "1px solid rgba(124,58,237,0.25)",
    fontSize: "0.68rem",
    "& .MuiChip-label": {
      whiteSpace: "normal",
      py: 0.5,
    },
  };

  return (
    <Box
      id="education"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "500px",
        py: { xs: 7, sm: 9, md: 12 },
        backgroundColor: "#050505",
        color: "#C4B5FD",
      }}
    >
      {/* Background grid */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Purple glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          width: { xs: 180, md: 320 },
          height: { xs: 180, md: 320 },
          borderRadius: "50%",
          backgroundColor: "rgba(124,58,237,0.12)",
          filter: "blur(100px)",
          left: { xs: -100, md: -120 },
          top: "15%",
          pointerEvents: "none",
        }}
      />

      {/* Cyan glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          width: { xs: 160, md: 280 },
          height: { xs: 160, md: 280 },
          borderRadius: "50%",
          backgroundColor: "rgba(6,182,212,0.1)",
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
        {/* Section header */}
        <Box sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography sx={{ ...sectionLabelSx, mb: 2 }}>
            05 / EDUCATION
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: headingSize,
              fontWeight: 800,
              letterSpacing: {
                xs: "-0.035em",
                md: "-0.04em",
              },
              lineHeight: 1.08,
              color: "#C4B5FD",
              overflowWrap: "anywhere",
            }}
          >
            My Academic{" "}
            <Box
              component="span"
              sx={{
                display: "inline",
                color: "transparent",
                background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              Journey.
            </Box>
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
            My academic background, studies and the knowledge that shaped
            my development journey.
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Box
            role="status"
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(6,182,212,0.3)",
              backgroundColor: "rgba(6,182,212,0.05)",
            }}
          >
            <Typography sx={{ color: "#67E8F9", fontSize: "0.95rem" }}>
              Loading education...
            </Typography>
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <Box
            role="alert"
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(239,68,68,0.35)",
              backgroundColor: "rgba(239,68,68,0.06)",
            }}
          >
            <Typography
              sx={{ color: "#FCA5A5", fontWeight: 700, mb: 1 }}
            >
              Education API Error
            </Typography>

            <Typography
              sx={{
                color: "#FCA5A5",
                fontSize: "0.9rem",
                overflowWrap: "anywhere",
              }}
            >
              {error}
            </Typography>

            <Typography
              sx={{
                color: "#A1A1AA",
                fontSize: "0.75rem",
                mt: 1.5,
                overflowWrap: "anywhere",
              }}
            >
              API: {API_URL}
            </Typography>
          </Box>
        )}

        {/* Empty state */}
        {!loading && !error && education.length === 0 && (
          <Box
            sx={{
              py: 7,
              px: 3,
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(124,58,237,0.04)",
              border: "1px solid rgba(124,58,237,0.16)",
            }}
          >
            <Typography
              sx={{
                color: "#C4B5FD",
                fontSize: "1rem",
                fontWeight: 600,
                mb: 1,
              }}
            >
              No education found.
            </Typography>

            <Typography sx={{ color: "#A1A1AA", fontSize: "0.85rem" }}>
              Add education from the Admin Panel.
            </Typography>
          </Box>
        )}

        {/* Education timeline */}
        {!loading && !error && education.length > 0 && (
          <Box sx={{ position: "relative" }}>
            {/* Timeline line */}
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                left: { xs: 19, sm: 23, md: 29 },
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
                gap: { xs: 3, sm: 4, md: 5 },
              }}
            >
              {education.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "40px minmax(0, 1fr)",
                        sm: "48px minmax(0, 1fr)",
                        md: "60px minmax(0, 1fr)",
                      },
                      gap: { xs: 1.5, sm: 2, md: 3 },
                      alignItems: "start",
                    }}
                  >
                    {/* Timeline dot */}
                    <Box
                      sx={{
                        width: { xs: 40, sm: 48, md: 60 },
                        height: { xs: 40, sm: 48, md: 60 },
                        borderRadius: "50%",
                        position: "relative",
                        zIndex: 2,
                        display: "grid",
                        placeItems: "center",
                        background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                        border: "5px solid #050505",
                        boxShadow: "0 0 25px rgba(124,58,237,0.25)",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 8, sm: 9, md: 10 },
                          height: { xs: 8, sm: 9, md: 10 },
                          borderRadius: "50%",
                          backgroundColor: "#E9D5FF",
                        }}
                      />
                    </Box>

                    {/* Education card */}
                    <Box
                      sx={{
                        minWidth: 0,
                        p: { xs: 2, sm: 2.8, md: 3.5 },
                        borderRadius: 4,
                        backgroundColor: "rgba(124,58,237,0.045)",
                        border: "1px solid rgba(124,58,237,0.18)",
                        backdropFilter: "blur(14px)",
                        transition:
                          "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: {
                            xs: "none",
                            md: "translateY(-5px)",
                          },
                          borderColor: "rgba(6,182,212,0.4)",
                          boxShadow: "0 20px 60px rgba(124,58,237,0.1)",
                        },
                      }}
                    >
                      {/* Degree and date */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography component="h3" sx={cardTitleSx}>
                            {item.degree || "Degree"}
                          </Typography>

                          {item.field && (
                            <Typography
                              sx={{
                                mt: 0.5,
                                color: "#67E8F9",
                                fontWeight: 600,
                                fontSize: {
                                  xs: "0.8rem",
                                  sm: "0.88rem",
                                },
                                overflowWrap: "anywhere",
                              }}
                            >
                              {item.field}
                            </Typography>
                          )}
                        </Box>

                        {getDateRange(item) && (
                          <Chip
                            label={getDateRange(item)}
                            size="small"
                            sx={chipSx}
                          />
                        )}
                      </Box>

                      {/* Institution */}
                      {item.institution && (
                        <Typography
                          sx={{
                            color: "#DDD6FE",
                            fontWeight: 600,
                            fontSize: {
                              xs: "0.86rem",
                              sm: "0.92rem",
                            },
                            mb: 1,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.institution}
                        </Typography>
                      )}

                      {/* Location */}
                      {item.location && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 0.8,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              mt: "6px",
                              borderRadius: "50%",
                              backgroundColor: "#7C3AED",
                              flexShrink: 0,
                            }}
                          />

                          <Typography
                            sx={{
                              color: "#A1A1AA",
                              fontSize: "0.78rem",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {item.location}
                          </Typography>
                        </Box>
                      )}

                      {/* Description */}
                      {item.description && (
                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: {
                              xs: "0.82rem",
                              sm: "0.88rem",
                            },
                            lineHeight: 1.8,
                            whiteSpace: "pre-line",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}

                      {/* Bottom content */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                          mt:
                            item.institutionLogo ||
                            item.grade ||
                            item.currentlyStudying
                              ? 2.5
                              : 0,
                        }}
                      >
                        {/* Institution logo */}
                        {item.institutionLogo ? (
                          <Box
                            component="img"
                            src={
                              item.institutionLogo.startsWith("http")
                                ? item.institutionLogo
                                : `${SERVER_URL}${item.institutionLogo}`
                            }
                            alt={item.institution || "Institution"}
                            loading="lazy"
                            sx={{
                              width: 44,
                              height: 44,
                              objectFit: "contain",
                              borderRadius: 2,
                              p: 0.7,
                              backgroundColor: "rgba(124,58,237,0.08)",
                              border: "1px solid rgba(124,58,237,0.2)",
                            }}
                          />
                        ) : (
                          <Box />
                        )}

                        {/* Grade and current status */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1.5,
                          }}
                        >
                          {item.grade && (
                            <Chip
                              label={`Grade: ${item.grade}`}
                              size="small"
                              sx={chipSx}
                            />
                          )}

                          {item.currentlyStudying && (
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
                                  backgroundColor: "#06B6D4",
                                  boxShadow: "0 0 10px rgba(6,182,212,0.8)",
                                }}
                              />

                              <Typography
                                sx={{
                                  color: "#67E8F9",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  letterSpacing: "0.08em",
                                }}
                              >
                                CURRENTLY STUDYING
                              </Typography>
                            </Box>
                          )}
                        </Box>
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

import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Chip, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api/services";

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Services API:", API_URL);

        const response = await axios.get(API_URL);

        console.log("Services API Response:", response.data);

        const serviceData = response.data?.services || [];

        const data = serviceData
          .filter((item) => item.status !== "draft")
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setServices(data);
      } catch (err) {
        console.error("Services API Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load services"
        );

        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Box
      id="services"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "500px",
        py: { xs: 7, sm: 9, md: 12 },
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

      {/* Cyan Glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 160, md: 280 },
          height: { xs: 160, md: 280 },
          borderRadius: "50%",
          backgroundColor: "rgba(6,182,212,0.10)",
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
            07 / SERVICES
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
            What I
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
            Build.
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
            I create modern, responsive and scalable
            digital experiences using modern web
            technologies.
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(6,182,212,0.3)",
              backgroundColor: "rgba(6,182,212,0.05)",
            }}
          >
            <Typography
              sx={{
                color: "#06B6D4",
                fontSize: "0.95rem",
              }}
            >
              Loading services...
            </Typography>
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(239,68,68,0.35)",
              backgroundColor: "rgba(239,68,68,0.06)",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Services API Error
            </Typography>

            <Typography
              sx={{
                color: "#FCA5A5",
                fontSize: "0.9rem",
                wordBreak: "break-word",
              }}
            >
              {error}
            </Typography>

            <Typography
              sx={{
                color: "#71717A",
                fontSize: "0.75rem",
                mt: 1.5,
                wordBreak: "break-word",
              }}
            >
              API: {API_URL}
            </Typography>
          </Box>
        )}

        {/* Empty */}
        {!loading && !error && services.length === 0 && (
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
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: 600,
                mb: 1,
              }}
            >
              No services found.
            </Typography>

            <Typography
              sx={{
                color: "#71717A",
                fontSize: "0.82rem",
              }}
            >
              Add services from the Admin Panel.
            </Typography>
          </Box>
        )}

        {/* Services */}
        {!loading && !error && services.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service._id || index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                style={{
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    minWidth: 0,
                    p: {
                      xs: 2.5,
                      sm: 2.8,
                      md: 3.2,
                    },
                    borderRadius: 4,
                    overflow: "hidden",
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
                        md: "translateY(-8px)",
                      },
                      borderColor:
                        "rgba(124,58,237,0.45)",
                      boxShadow:
                        "0 25px 70px rgba(124,58,237,0.12)",
                    },
                  }}
                >
                  {/* Top Glow */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      backgroundColor:
                        index % 2 === 0
                          ? "rgba(124,58,237,0.12)"
                          : "rgba(6,182,212,0.10)",
                      filter: "blur(45px)",
                      top: -60,
                      right: -50,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Number */}
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 18,
                      right: 20,
                      color:
                        "rgba(255,255,255,0.06)",
                      fontSize: {
                        xs: "2.5rem",
                        md: "3rem",
                      },
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Typography>

                  {/* Icon / Image */}
                  {service.image ? (
                    <Box
                      component="img"
                      src={
                        service.image.startsWith("http")
                          ? service.image
                          : `http://localhost:5000${service.image}`
                      }
                      alt={service.title || "Service"}
                      sx={{
                        width: { xs: 52, sm: 58 },
                        height: { xs: 52, sm: 58 },
                        objectFit: "cover",
                        borderRadius: 3,
                        mb: 3,
                        border:
                          "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: { xs: 52, sm: 58 },
                        height: { xs: 52, sm: 58 },
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 3,
                        mb: 3,
                        background:
                          "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))",
                        border:
                          "1px solid rgba(124,58,237,0.25)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#06B6D4",
                          fontSize: "1.2rem",
                          fontWeight: 800,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </Typography>
                    </Box>
                  )}

                  {/* Title */}
                  <Typography
                    component="h3"
                    sx={{
                      position: "relative",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: {
                        xs: "1rem",
                        sm: "1.1rem",
                        md: "1.15rem",
                      },
                      lineHeight: 1.35,
                      mb: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {service.title || "Service"}
                  </Typography>

                  {/* Description */}
                  {service.description && (
                    <Typography
                      sx={{
                        position: "relative",
                        color: "#A1A1AA",
                        fontSize: {
                          xs: "0.82rem",
                          sm: "0.88rem",
                        },
                        lineHeight: 1.8,
                        mb:
                          service.features?.length > 0
                            ? 2.5
                            : 0,
                        wordBreak: "break-word",
                      }}
                    >
                      {service.description}
                    </Typography>
                  )}

                  {/* Features */}
                  {Array.isArray(service.features) &&
                    service.features.length > 0 && (
                      <Box
                        sx={{
                          position: "relative",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.8,
                        }}
                      >
                        {service.features.map(
                          (feature, featureIndex) => (
                            <Chip
                              key={featureIndex}
                              label={feature}
                              size="small"
                              sx={{
                                maxWidth: "100%",
                                color:
                                  featureIndex % 2 === 0
                                    ? "#C4B5FD"
                                    : "#67E8F9",
                                backgroundColor:
                                  "rgba(255,255,255,0.035)",
                                border:
                                  "1px solid rgba(255,255,255,0.08)",
                                fontSize: "0.65rem",
                                "& .MuiChip-label": {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                            />
                          )
                        )}
                      </Box>
                    )}

                  {/* Bottom Line */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "2px",
                      background:
                        "linear-gradient(90deg, #7C3AED, #06B6D4)",
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition:
                        "transform 0.3s ease",
                      ".MuiBox-root:hover &": {
                        transform: "scaleX(1)",
                      },
                    }}
                  />
                </Box>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

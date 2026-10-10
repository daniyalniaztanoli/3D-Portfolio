import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

const API_URL = "http://localhost:5000/api/certificates";
const SERVER_URL = "http://localhost:5000";

const PURPLE = "#7C3AED";
const CYAN = "#06B6D4";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`${API_URL}?public=true`);

        if (response.data?.success) {
          const published = (response.data.certificates || [])
            .filter(
              (certificate) => certificate.status === "published"
            )
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          setCertificates(published);
        } else {
          setError("Certificates could not be loaded.");
        }
      } catch (err) {
        console.error("Public certificates error:", err);
        setError("Unable to load certificates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <Box
      component="section"
      id="certificates"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 7, sm: 9, md: 12 },
        color: "#F8FAFC",
        background:
          "radial-gradient(ellipse at 15% 15%, rgba(124,58,237,0.11), transparent 35%), radial-gradient(ellipse at 85% 60%, rgba(6,182,212,0.08), transparent 35%)",
      }}
    >
      {/* DECORATIVE BACKGROUND */}

      <Box
        sx={{
          position: "absolute",
          top: "12%",
          left: "-100px",
          width: { xs: 160, sm: 220 },
          height: { xs: 160, sm: 220 },
          borderRadius: "50%",
          background: "rgba(124,58,237,0.07)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          right: "-100px",
          bottom: "8%",
          width: { xs: 180, sm: 250 },
          height: { xs: 180, sm: 250 },
          borderRadius: "50%",
          background: "rgba(6,182,212,0.07)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* SECTION HEADING */}

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          textAlign="center"
          mb={{ xs: 5, md: 7 }}
        >
          {/* SECTION LABEL: 06 / CERTIFICATES */}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            sx={{ mb: 3 }}
          >
            <Typography
              sx={{
                color: CYAN,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: 2,
                whiteSpace: "nowrap",
              }}
            >
              06 / CERTIFICATES
            </Typography>

          </Stack>

          {/* ACHIEVEMENTS CHIP */}

          <Chip
            icon={
              <WorkspacePremiumRoundedIcon
                sx={{ color: `${CYAN} !important` }}
              />
            }
            label="LEARNING & ACHIEVEMENTS"
            sx={{
              mb: 2.5,
              px: 1.2,
              height: 36,
              color: "#C4B5FD",
              background: "rgba(124,58,237,0.10)",
              border: "1px solid rgba(124,58,237,0.28)",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: 1.5,
              "& .MuiChip-icon": { ml: 1 },
            }}
          />

          {/* MAIN TITLE */}

          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.6rem",
                md: "3rem",
              },
              fontWeight: 850,
              letterSpacing: "-1.5px",
              lineHeight: 1.2,
              overflowWrap: "anywhere",
            }}
          >
            My{" "}
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(90deg, #A78BFA 0%, #7C3AED 45%, #06B6D4 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Certifications
            </Box>
          </Typography>

          <Box
            sx={{
              width: 75,
              height: 3,
              mx: "auto",
              mt: 3,
              borderRadius: 10,
              background: `linear-gradient(90deg, ${PURPLE}, ${CYAN})`,
            }}
          />
        </Box>

        {/* LOADING */}

        {loading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            py={8}
          >
            <CircularProgress sx={{ color: CYAN }} />

            <Typography
              sx={{
                color: "#A1A1AA",
                fontSize: "0.9rem",
              }}
            >
              Loading achievements...
            </Typography>
          </Box>
        )}

        {/* ERROR */}

        {!loading && error && (
          <Alert
            severity="warning"
            sx={{
              maxWidth: 650,
              mx: "auto",
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* EMPTY STATE */}

        {!loading && !error && certificates.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              maxWidth: 600,
              mx: "auto",
              py: 6,
              px: 3,
              textAlign: "center",
              color: "#F8FAFC",
              background: "rgba(15,15,25,0.75)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 4,
            }}
          >
            <WorkspacePremiumRoundedIcon
              sx={{
                fontSize: 50,
                color: "#A78BFA",
                mb: 1.5,
              }}
            />

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              New achievements coming soon
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#A1A1AA",
                fontSize: "0.9rem",
              }}
            >
              My published certificates will appear here.
            </Typography>
          </Paper>
        )}

        {/* CERTIFICATE CARDS */}

        {!loading && !error && certificates.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2.5, md: 3 },
              alignItems: "stretch",
            }}
          >
            {certificates.map((certificate, index) => (
              <Box
                key={certificate._id}
                component={motion.div}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.1, 0.3),
                }}
                sx={{
                  minWidth: 0,
                  height: "100%",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minWidth: 0,
                    overflow: "hidden",
                    p: { xs: 2, sm: 2.5 },
                    color: "#F8FAFC",
                    background:
                      "linear-gradient(145deg, rgba(20,20,32,0.97), rgba(10,10,16,0.98))",
                    border: "1px solid rgba(167,139,250,0.18)",
                    borderRadius: 4,
                    transition:
                      "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: {
                        xs: "none",
                        md: "translateY(-7px)",
                      },
                      borderColor: "rgba(6,182,212,0.65)",
                      boxShadow:
                        "0 18px 45px rgba(0,0,0,0.25), 0 0 24px rgba(124,58,237,0.10)",
                    },
                    "&:hover .certificate-image": {
                      transform: "scale(1.035)",
                    },
                  }}
                >
                  {/* TOP ACCENT */}

                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "12%",
                      width: "76%",
                      height: "2px",
                      background:
                        "linear-gradient(90deg, transparent, #7C3AED, #06B6D4, transparent)",
                    }}
                  />

                  {/* CERTIFICATE IMAGE */}

                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 2.5,
                      mb: 2.5,
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {certificate.image ? (
                      <Box
                        component="img"
                        className="certificate-image"
                        src={getImageUrl(certificate.image)}
                        alt={`${certificate.title} certificate`}
                        loading="lazy"
                        sx={{
                          display: "block",
                          width: "100%",
                          height: { xs: 190, sm: 205 },
                          objectFit: "contain",
                          backgroundColor: "#08080B",
                          transition: "transform 0.4s ease",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: { xs: 190, sm: 205 },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          background:
                            "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)",
                        }}
                      >
                        <WorkspacePremiumRoundedIcon
                          sx={{
                            fontSize: 58,
                            color: "#A78BFA",
                          }}
                        />

                        <Typography
                          sx={{
                            color: CYAN,
                            fontWeight: 800,
                            letterSpacing: 2,
                            fontSize: "0.7rem",
                          }}
                        >
                          CERTIFICATE
                        </Typography>
                      </Box>
                    )}

                    {/* CARD NUMBER */}

                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 1.5,
                        background: "rgba(8,8,15,0.88)",
                        border: "1px solid rgba(167,139,250,0.3)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          color: "#C4B5FD",
                        }}
                      >
                        CERT. {String(index + 1).padStart(2, "0")}
                      </Typography>
                    </Box>
                  </Box>

                  {/* TITLE AND ISSUER */}

                  <Box
                    sx={{
                      flexGrow: 1,
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          component="h3"
                          sx={{
                            fontSize: "1.05rem",
                            fontWeight: 750,
                            lineHeight: 1.55,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {certificate.title}
                        </Typography>
                      </Box>

                      <VerifiedRoundedIcon
                        sx={{
                          mt: 0.3,
                          fontSize: 20,
                          flexShrink: 0,
                          color: CYAN,
                        }}
                      />
                    </Stack>

                    {certificate.issuer && (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#67E8F9",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {certificate.issuer}
                      </Typography>
                    )}

                    {certificate.issueDate && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.8}
                        sx={{ mt: 1.5 }}
                      >
                        <CalendarMonthRoundedIcon
                          sx={{
                            fontSize: 16,
                            color: "#A78BFA",
                          }}
                        />

                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: "0.8rem",
                          }}
                        >
                          Issued {formatDate(certificate.issueDate)}
                        </Typography>
                      </Stack>
                    )}

                    {certificate.description && (
                      <Typography
                        sx={{
                          mt: 1.7,
                          color: "#A1A1AA",
                          fontSize: "0.87rem",
                          lineHeight: 1.85,
                          overflowWrap: "anywhere",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {certificate.description}
                      </Typography>
                    )}
                  </Box>

                  {/* ACTION BUTTONS */}

                  {(certificate.credentialUrl ||
                    certificate.fileUrl) && (
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={1.2}
                      sx={{ mt: 3 }}
                    >
                      {certificate.credentialUrl && (
                        <Button
                          variant="outlined"
                          size="medium"
                          fullWidth
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<OpenInNewRoundedIcon />}
                          sx={{
                            minHeight: 42,
                            px: 1.5,
                            color: "#C4B5FD",
                            borderColor:
                              "rgba(167,139,250,0.45)",
                            textTransform: "none",
                            fontWeight: 650,
                            fontSize: "0.78rem",
                            whiteSpace: "nowrap",
                            "&:hover": {
                              borderColor: "#A78BFA",
                              backgroundColor:
                                "rgba(124,58,237,0.12)",
                            },
                          }}
                        >
                          Verify
                        </Button>
                      )}

                      {certificate.fileUrl && (
                        <Button
                          variant="contained"
                          size="medium"
                          fullWidth
                          href={getImageUrl(certificate.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<ArrowOutwardRoundedIcon />}
                          sx={{
                            minHeight: 42,
                            px: 1.5,
                            color: "#FFFFFF",
                            background:
                              "linear-gradient(100deg, #7C3AED, #5B5BD6, #0891B2)",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            whiteSpace: "nowrap",
                            boxShadow: "none",
                            "&:hover": {
                              background:
                                "linear-gradient(100deg, #6D28D9, #0891B2)",
                              boxShadow:
                                "0 5px 18px rgba(124,58,237,0.25)",
                            },
                          }}
                        >
                          View Certificate
                        </Button>
                      )}
                    </Stack>
                  )}
                </Paper>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

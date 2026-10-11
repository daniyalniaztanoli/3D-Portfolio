import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

const API_URL = "https://hearty-friendship-production-fec3.up.railway.app/api/messages";

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderRadius: 2.5,
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(124,58,237,0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7C3AED",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#71717A",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#06B6D4",
  },
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await axios.post(API_URL, form);

      console.log("Contact API Response:", response.data);

      setSuccess(
        response.data?.message ||
          "Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact API Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      id="contact"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "700px",
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
          width: { xs: 200, md: 360 },
          height: { xs: 200, md: 360 },
          borderRadius: "50%",
          backgroundColor: "rgba(124,58,237,0.13)",
          filter: "blur(110px)",
          left: { xs: -120, md: -140 },
          top: "10%",
          pointerEvents: "none",
        }}
      />

      {/* Cyan Glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 180, md: 320 },
          height: { xs: 180, md: 320 },
          borderRadius: "50%",
          backgroundColor: "rgba(6,182,212,0.1)",
          filter: "blur(110px)",
          right: { xs: -110, md: -130 },
          bottom: "8%",
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
            08 / CONTACT
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
            Let's Work
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
            Together.
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
            Have a project, idea or opportunity?
            Send me a message and let's build
            something meaningful together.
          </Typography>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "0.75fr 1.25fr",
            },
            gap: { xs: 3, md: 5 },
            alignItems: "stretch",
          }}
        >
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                height: "100%",
                p: { xs: 2.5, sm: 3, md: 3.5 },
                borderRadius: 4,
                backgroundColor:
                  "rgba(255,255,255,0.035)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
              }}
            >
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem",
                  },
                  mb: 1.5,
                }}
              >
                Get in touch
              </Typography>

              <Typography
                sx={{
                  color: "#A1A1AA",
                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.88rem",
                  },
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                I'm always open to discussing new
                projects, development opportunities
                and interesting ideas.
              </Typography>

              {/* Email */}
              <Box
                sx={{
                  mb: 2.5,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "rgba(124,58,237,0.06)",
                  border:
                    "1px solid rgba(124,58,237,0.12)",
                }}
              >
                <Typography
                  sx={{
                    color: "#7C3AED",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    mb: 0.6,
                  }}
                >
                  EMAIL
                </Typography>

                <Typography
                  component="a"
                  href="mailto:storedna639@gmail.com"
                  sx={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                    fontSize: {
                      xs: "0.78rem",
                      sm: "0.86rem",
                    },
                    wordBreak: "break-word",
                    "&:hover": {
                      color: "#06B6D4",
                    },
                  }}
                >
                  dniaz0122@gmail.com
                </Typography>
              </Box>

              {/* Location */}
              <Box
                sx={{
                  mb: 2.5,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "rgba(6,182,212,0.05)",
                  border:
                    "1px solid rgba(6,182,212,0.12)",
                }}
              >
                <Typography
                  sx={{
                    color: "#06B6D4",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    mb: 0.6,
                  }}
                >
                  LOCATION
                </Typography>

                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: {
                      xs: "0.78rem",
                      sm: "0.86rem",
                    },
                  }}
                >
                  Karachi, Pakistan
                </Typography>
              </Box>

              {/* Availability */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 3,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#06B6D4",
                    boxShadow:
                      "0 0 12px rgba(6,182,212,0.8)",
                  }}
                />

                <Typography
                  sx={{
                    color: "#06B6D4",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  AVAILABLE FOR OPPORTUNITIES
                </Typography>
              </Box>
            </Box>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: { xs: 2.5, sm: 3, md: 3.5 },
                borderRadius: 4,
                backgroundColor:
                  "rgba(255,255,255,0.035)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
              }}
            >
              {/* Name + Email */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  required
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  sx={inputStyles}
                />

                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  sx={inputStyles}
                />
              </Box>

              {/* Subject */}
              <TextField
                required
                fullWidth
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                sx={{
                  ...inputStyles,
                  mb: 2,
                }}
              />

              {/* Message */}
              <TextField
                required
                fullWidth
                multiline
                minRows={6}
                label="Your Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                sx={{
                  ...inputStyles,
                  mb: 2.5,
                }}
              />

              {/* Success */}
              {success && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1.8,
                    borderRadius: 2.5,
                    backgroundColor:
                      "rgba(6,182,212,0.08)",
                    border:
                      "1px solid rgba(6,182,212,0.25)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#67E8F9",
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {success}
                  </Typography>
                </Box>
              )}

              {/* Error */}
              {error && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1.8,
                    borderRadius: 2.5,
                    backgroundColor:
                      "rgba(239,68,68,0.07)",
                    border:
                      "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FCA5A5",
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{
                  minHeight: 50,
                  color: "#FFFFFF",
                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.9rem",
                  },
                  background:
                    "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  boxShadow:
                    "0 10px 35px rgba(124,58,237,0.2)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #6D28D9, #0891B2)",
                    boxShadow:
                      "0 15px 45px rgba(124,58,237,0.3)",
                  },
                  "&:disabled": {
                    color: "#A1A1AA",
                    background:
                      "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={22}
                    sx={{ color: "#FFFFFF" }}
                  />
                ) : (
                  "Send Message"
                )}
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

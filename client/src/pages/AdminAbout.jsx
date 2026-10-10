import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const API_URL = "http://localhost:5000/api/about";

const emptyAbout = {
  heading: "",
  description: "",
  yearsOfExperience: "",
  projectsCompleted: "",
  clients: "",
};

function AdminAbout() {
  const [about, setAbout] = useState(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const getAbout = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const data = response.data?.about;

      if (data) {
        setAbout({
          heading: data.heading || "",
          description: data.description || "",
          yearsOfExperience: data.yearsOfExperience ?? "",
          projectsCompleted: data.projectsCompleted ?? "",
          clients: data.clients ?? "",
        });
      }
    } catch (error) {
      console.error("About fetch error:", error);

      setMessage({
        type: "error",
        text: "Failed to load About information.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAbout();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAbout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage({
        type: "",
        text: "",
      });

      const token = localStorage.getItem("adminToken");

      if (!token) {
        setMessage({
          type: "error",
          text: "Admin session expired. Please login again.",
        });
        return;
      }

      await axios.put(API_URL, about, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await getAbout();

      setMessage({
        type: "success",
        text: "About information updated successfully.",
      });
    } catch (error) {
      console.error("About update error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update About information.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#050505",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={42}
          sx={{ color: "#7C3AED" }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 10%, rgba(124,58,237,0.12), transparent 30%), radial-gradient(circle at 85% 80%, rgba(6,182,212,0.08), transparent 30%), #050505",
        py: {
          xs: 4,
          sm: 5,
          md: 6,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#06B6D4",
              fontSize: {
                xs: "0.68rem",
                sm: "0.72rem",
              },
              fontWeight: 700,
              letterSpacing: "0.18em",
              mb: 1,
            }}
          >
            ADMIN / ABOUT
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "2.5rem",
                sm: "3.2rem",
                md: "4rem",
                lg: "4.4rem",
              },
              lineHeight: 1,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
            }}
          >
            About{" "}
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(90deg, #7C3AED, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Me.
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#A1A1AA",
              fontSize: {
                xs: "0.9rem",
                sm: "0.95rem",
                md: "1rem",
              },
              maxWidth: 650,
              lineHeight: 1.7,
            }}
          >
            Manage the About section displayed on your public portfolio.
          </Typography>
        </Box>

        {message.text && (
          <Alert
            severity={message.type}
            onClose={() =>
              setMessage({
                type: "",
                text: "",
              })
            }
            sx={{
              mb: 3,
              borderRadius: 2,
              background:
                message.type === "success"
                  ? "rgba(16,185,129,0.10)"
                  : "rgba(239,68,68,0.10)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {message.text}
          </Alert>
        )}

        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            borderRadius: 4,
            background: "rgba(15,15,15,0.78)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 25px 80px rgba(0,0,0,0.35)",
          }}
        >
          <Stack spacing={3}>
            {/* Main Content */}
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: {
                    xs: "1.05rem",
                    sm: "1.15rem",
                  },
                  fontWeight: 700,
                  mb: 0.7,
                }}
              >
                About Content
              </Typography>

              <Typography
                sx={{
                  color: "#71717A",
                  fontSize: "0.85rem",
                }}
              >
                Update your introduction and professional summary.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Heading"
              name="heading"
              value={about.heading}
              onChange={handleChange}
              placeholder="More Than A Developer."
            />

            <TextField
              fullWidth
              multiline
              minRows={6}
              label="Description"
              name="description"
              value={about.description}
              onChange={handleChange}
              placeholder="Write your professional introduction..."
            />

            {/* Stats */}
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: {
                    xs: "1.05rem",
                    sm: "1.15rem",
                  },
                  fontWeight: 700,
                  mb: 0.7,
                }}
              >
                Portfolio Statistics
              </Typography>

              <Typography
                sx={{
                  color: "#71717A",
                  fontSize: "0.85rem",
                  mb: 2,
                }}
              >
                These numbers can be displayed in your About section.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Years of Experience"
                  name="yearsOfExperience"
                  value={about.yearsOfExperience}
                  onChange={handleChange}
                  inputProps={{
                    min: 0,
                  }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Projects Completed"
                  name="projectsCompleted"
                  value={about.projectsCompleted}
                  onChange={handleChange}
                  inputProps={{
                    min: 0,
                  }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Clients"
                  name="clients"
                  value={about.clients}
                  onChange={handleChange}
                  inputProps={{
                    min: 0,
                  }}
                />
              </Box>
            </Box>

            {/* Save */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                pt: 1,
              }}
            >
              <Button
                type="submit"
                disabled={saving}
                variant="contained"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  minWidth: {
                    sm: 170,
                  },
                  py: 1.4,
                  px: 3,
                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.9rem",
                  },
                  background:
                    "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #6D28D9, #0891B2)",
                  },
                }}
              >
                {saving ? (
                  <CircularProgress
                    size={22}
                    sx={{ color: "#fff" }}
                  />
                ) : (
                  "Save About"
                )}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminAbout;
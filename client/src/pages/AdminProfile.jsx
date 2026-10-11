
import React, { useEffect, useState } from "react";
import api, { API_URL } from "../api";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const initialForm = {
  name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  resumeUrl: "",
};

const AdminProfile = () => {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const getFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;

    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profile");
        const data = response.data?.profile || response.data;

        if (data) {
          setForm((previous) => ({
            ...previous,
            ...data,
            resumeUrl: data.resumeUrl || "",
          }));

          if (data.profileImage) {
            setImagePreview(getFileUrl(data.profileImage));
          }
        }
      } catch (error) {
        console.error("Profile fetch error:", error);

        setMessage(
          error.response?.data?.message ||
            "Profile load nahi ho saka. Backend check karo."
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please valid image select karo.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessage("CV sirf PDF format mein upload karo.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("CV file ka size 5 MB se kam hona chahiye.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    setResumeFile(file);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const formData = new FormData();

      formData.append("name", form.name || "");
      formData.append("title", form.title || "");
      formData.append("bio", form.bio || "");
      formData.append("email", form.email || "");
      formData.append("phone", form.phone || "");
      formData.append("location", form.location || "");
      formData.append("githubUrl", form.githubUrl || "");
      formData.append("linkedinUrl", form.linkedinUrl || "");
      formData.append("resumeUrl", form.resumeUrl || "");

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await api.put("/api/profile", formData);

      const data = response.data?.profile || response.data;

      if (data && typeof data === "object") {
        setForm((previous) => ({
          ...previous,
          ...data,
          resumeUrl: data.resumeUrl || previous.resumeUrl,
        }));

        if (data.profileImage) {
          setImagePreview(getFileUrl(data.profileImage));
        }
      }

      setImageFile(null);
      setResumeFile(null);

      setMessage(
        response.data?.message || "Profile successfully update ho gaya!"
      );
      setMessageType("success");
    } catch (error) {
      console.error("Profile update error:", error);

      setMessage(
        error.response?.data?.message ||
          "Profile update nahi hua. Backend routes aur controller check karo."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const textFieldStyles = {
    "& .MuiInputLabel-root": {
      color: "#A1A1AA",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#06B6D4",
    },
    "& .MuiOutlinedInput-root": {
      color: "#FFFFFF",
      borderRadius: 2,
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.15)",
      },
      "&:hover fieldset": {
        borderColor: "#7C3AED",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#06B6D4",
      },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#09090F",
        }}
      >
        <CircularProgress sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#09090F",
        color: "#FFFFFF",
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#06B6D4",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
            }}
          >
            ADMIN PANEL
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "1.7rem", sm: "2rem", md: "2.3rem" },
              fontWeight: 800,
            }}
          >
            Manage Profile
          </Typography>

          <Typography
            sx={{
              color: "#A1A1AA",
              fontSize: "0.9rem",
              mt: 1,
              lineHeight: 1.8,
            }}
          >
            Update your personal information, profile image, links and CV.
          </Typography>
        </Box>

        {message && (
          <Alert
            severity={messageType}
            onClose={() => setMessage("")}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="stretch"
          >
            {/* Profile image card */}
            <Box sx={{ width: { xs: "100%", md: "32%" } }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  height: "100%",
                  background: "#11111B",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 4,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "1rem",
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Profile Picture
                </Typography>

                <Avatar
                  src={imagePreview || undefined}
                  alt={form.name || "Profile"}
                  sx={{
                    width: { xs: 125, sm: 145 },
                    height: { xs: 125, sm: 145 },
                    mx: "auto",
                    mb: 2.5,
                    border: "3px solid #7C3AED",
                    bgcolor: "#27203D",
                    fontSize: "2rem",
                  }}
                >
                  {form.name?.charAt(0)?.toUpperCase() || "D"}
                </Avatar>

                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "1rem",
                    overflowWrap: "anywhere",
                  }}
                >
                  {form.name || "Your Name"}
                </Typography>

                <Typography
                  sx={{
                    color: "#06B6D4",
                    fontSize: "0.85rem",
                    mt: 0.7,
                    mb: 3,
                    overflowWrap: "anywhere",
                  }}
                >
                  {form.title || "Your Professional Title"}
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: "#C4B5FD",
                    borderColor: "#7C3AED",
                    py: 1.2,
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#06B6D4",
                    },
                  }}
                >
                  Choose Profile Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>

                {imageFile && (
                  <Typography
                    sx={{
                      color: "#06B6D4",
                      fontSize: "0.75rem",
                      mt: 1.5,
                      overflowWrap: "anywhere",
                    }}
                  >
                    Selected: {imageFile.name}
                  </Typography>
                )}
              </Paper>
            </Box>

            {/* Profile details */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  background: "#11111B",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 4,
                }}
              >
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Personal Information
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2.5,
                  }}
                >
                  <TextField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyles}
                  />

                  <TextField
                    label="Professional Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyles}
                  />

                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyles}
                  />

                  <TextField
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyles}
                  />

                  <TextField
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyles}
                  />

                  <TextField
                    label="GitHub URL"
                    name="githubUrl"
                    value={form.githubUrl}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyles}
                  />

                  <TextField
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyles}
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <TextField
                    label="Bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    multiline
                    minRows={4}
                    fullWidth
                    sx={textFieldStyles}
                  />
                </Box>

                <Divider
                  sx={{
                    my: 4,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />

                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  CV / Resume
                </Typography>

                <Typography
                  sx={{
                    color: "#A1A1AA",
                    fontSize: "0.85rem",
                    lineHeight: 1.8,
                    mb: 2.5,
                  }}
                >
                  Upload your latest CV in PDF format. Maximum file size: 5 MB.
                </Typography>

                <Box
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    border: "1px solid rgba(124,58,237,0.35)",
                    background: "rgba(124,58,237,0.06)",
                  }}
                >
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.3,
                      color: "#C4B5FD",
                      borderColor: "rgba(124,58,237,0.7)",
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#06B6D4",
                        background: "rgba(6,182,212,0.08)",
                      },
                    }}
                  >
                    Choose CV PDF
                    <input
                      hidden
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleResumeChange}
                    />
                  </Button>

                  {resumeFile && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Selected: {resumeFile.name}
                    </Alert>
                  )}

                  {!resumeFile && form.resumeUrl && (
                    <Button
                      component="a"
                      href={getFileUrl(form.resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{
                        mt: 1.5,
                        color: "#06B6D4",
                        textTransform: "none",
                      }}
                    >
                      View Current CV
                    </Button>
                  )}

                  {!resumeFile && !form.resumeUrl && (
                    <Typography
                      sx={{
                        color: "#A1A1AA",
                        fontSize: "0.8rem",
                        mt: 2,
                        textAlign: "center",
                      }}
                    >
                      Abhi koi CV upload nahi hai.
                    </Typography>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={saving}
                  sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #6D28D9 0%, #0891B2 100%)",
                    },
                    "&.Mui-disabled": {
                      color: "#FFFFFF",
                      opacity: 0.6,
                    },
                  }}
                >
                  {saving ? (
                    <CircularProgress size={23} color="inherit" />
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </Paper>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminProfile;
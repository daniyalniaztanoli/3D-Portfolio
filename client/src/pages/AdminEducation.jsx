import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const API_URL = "http://localhost:5000/api/educations";
const SERVER_URL = "http://localhost:5000";

const emptyForm = {
  institution: "",
  degree: "",
  field: "",
  description: "",
  startDate: "",
  endDate: "",
  currentlyStudying: false,
  location: "",
  grade: "",
  order: 0,
  status: "published",
};

function AdminEducation() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const getEducations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const data = response.data?.educations || [];

      setEducations(data);
    } catch (error) {
      console.error("Education fetch error:", error);

      setMessage({
        type: "error",
        text: "Failed to load education records.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEducations();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLogoFile(file);

    const preview = URL.createObjectURL(file);

    setLogoPreview(preview);
  };

  const openAddDialog = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
    });

    setLogoFile(null);
    setLogoPreview("");

    setMessage({
      type: "",
      text: "",
    });

    setOpen(true);
  };

  const openEditDialog = (education) => {
    setEditingId(education._id);

    setForm({
      institution: education.institution || "",
      degree: education.degree || "",
      field: education.field || "",
      description: education.description || "",
      startDate: education.startDate
        ? education.startDate.substring(0, 10)
        : "",
      endDate: education.endDate
        ? education.endDate.substring(0, 10)
        : "",
      currentlyStudying:
        education.currentlyStudying || false,
      location: education.location || "",
      grade: education.grade || "",
      order: education.order ?? 0,
      status: education.status || "published",
    });

    setLogoFile(null);

    setLogoPreview(
      education.institutionLogo
        ? education.institutionLogo.startsWith("http")
          ? education.institutionLogo
          : `${SERVER_URL}${education.institutionLogo}`
        : ""
    );

    setMessage({
      type: "",
      text: "",
    });

    setOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);

    setLogoFile(null);
    setLogoPreview("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.institution.trim()) {
      setMessage({
        type: "error",
        text: "Institution name is required.",
      });

      return;
    }

    if (!form.degree.trim()) {
      setMessage({
        type: "error",
        text: "Degree is required.",
      });

      return;
    }

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

      const formData = new FormData();

      formData.append(
        "institution",
        form.institution.trim()
      );

      formData.append(
        "degree",
        form.degree.trim()
      );

      formData.append(
        "field",
        form.field.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      if (form.startDate) {
        formData.append(
          "startDate",
          form.startDate
        );
      }

      if (
        !form.currentlyStudying &&
        form.endDate
      ) {
        formData.append(
          "endDate",
          form.endDate
        );
      }

      formData.append(
        "currentlyStudying",
        String(form.currentlyStudying)
      );

      formData.append(
        "location",
        form.location.trim()
      );

      formData.append(
        "grade",
        form.grade.trim()
      );

      formData.append(
        "order",
        String(Number(form.order))
      );

      formData.append(
        "status",
        form.status
      );

      if (logoFile) {
        formData.append(
          "institutionLogo",
          logoFile
        );
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          formData,
          config
        );
      } else {
        await axios.post(
          API_URL,
          formData,
          config
        );
      }

      await getEducations();

      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setLogoFile(null);
      setLogoPreview("");

      setMessage({
        type: "success",
        text: editingId
          ? "Education updated successfully."
          : "Education added successfully.",
      });
    } catch (error) {
      console.error(
        "Education save error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save education.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setMessage({
          type: "error",
          text: "Admin session expired. Please login again.",
        });

        return;
      }

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await getEducations();

      setMessage({
        type: "success",
        text: "Education deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Education delete error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to delete education.",
      });
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${SERVER_URL}${image}`;
  };

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
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#06B6D4",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                mb: 1,
              }}
            >
              ADMIN / EDUCATION
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
              My{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Education.
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
              }}
            >
              Manage your academic background and qualifications.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={openAddDialog}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                sm: 150,
              },
              py: 1.35,
              background:
                "linear-gradient(90deg, #7C3AED, #06B6D4)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #6D28D9, #0891B2)",
              },
            }}
          >
            + Add Education
          </Button>
        </Box>

        {/* Message */}
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
            }}
          >
            {message.text}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              sx={{
                color: "#7C3AED",
              }}
            />
          </Box>
        ) : educations.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 4,
              background: "rgba(15,15,15,0.75)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: 700,
              }}
            >
              No education found
            </Typography>

            <Typography
              sx={{
                color: "#71717A",
                mt: 1,
                fontSize: "0.9rem",
              }}
            >
              Add your first education record.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2.5}>
            {educations
              .slice()
              .sort(
                (a, b) =>
                  (a.order || 0) -
                  (b.order || 0)
              )
              .map((education) => (
                <Paper
                  key={education._id}
                  elevation={0}
                  sx={{
                    p: {
                      xs: 2,
                      sm: 2.5,
                      md: 3,
                    },
                    borderRadius: 3,
                    background:
                      "rgba(15,15,15,0.78)",
                    backdropFilter: "blur(16px)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    transition: "0.25s ease",
                    "&:hover": {
                      borderColor:
                        "rgba(124,58,237,0.35)",
                      transform:
                        "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      gap: 2.5,
                    }}
                  >
                    {/* Logo */}
                    <Box
                      sx={{
                        width: {
                          xs: 58,
                          sm: 72,
                        },
                        height: {
                          xs: 58,
                          sm: 72,
                        },
                        flexShrink: 0,
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.12))",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {education.institutionLogo ? (
                        <Box
                          component="img"
                          src={getImageUrl(
                            education.institutionLogo
                          )}
                          alt={
                            education.institution
                          }
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Typography
                          sx={{
                            color: "#7C3AED",
                            fontSize: {
                              xs: "1.2rem",
                              sm: "1.5rem",
                            },
                            fontWeight: 800,
                          }}
                        >
                          {education.institution
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "E"}
                        </Typography>
                      )}
                    </Box>

                    {/* Content */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: {
                              xs: "1.05rem",
                              sm: "1.2rem",
                            },
                            fontWeight: 800,
                          }}
                        >
                          {education.degree}
                        </Typography>

                        {education.currentlyStudying && (
                          <Chip
                            label="Currently Studying"
                            size="small"
                            sx={{
                              height: 24,
                              color: "#10B981",
                              background:
                                "rgba(16,185,129,0.1)",
                              fontSize: "0.68rem",
                            }}
                          />
                        )}

                        {education.status ===
                          "draft" && (
                          <Chip
                            label="Draft"
                            size="small"
                            sx={{
                              height: 24,
                              color: "#F59E0B",
                              background:
                                "rgba(245,158,11,0.1)",
                              fontSize: "0.68rem",
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        sx={{
                          color: "#06B6D4",
                          fontSize: {
                            xs: "0.9rem",
                            sm: "0.95rem",
                          },
                          fontWeight: 600,
                          mt: 0.5,
                        }}
                      >
                        {education.institution}
                      </Typography>

                      {education.field && (
                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: "0.82rem",
                            mt: 0.5,
                          }}
                        >
                          {education.field}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          color: "#71717A",
                          fontSize: "0.8rem",
                          mt: 0.7,
                        }}
                      >
                        {education.startDate
                          ? new Date(
                              education.startDate
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Start date"}{" "}
                        —{" "}
                        {education.currentlyStudying
                          ? "Present"
                          : education.endDate
                          ? new Date(
                              education.endDate
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "End date"}
                      </Typography>

                      {education.location && (
                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: "0.8rem",
                            mt: 0.5,
                          }}
                        >
                          {education.location}
                        </Typography>
                      )}

                      {education.grade && (
                        <Chip
                          label={`Grade: ${education.grade}`}
                          size="small"
                          sx={{
                            mt: 1.2,
                            height: 25,
                            color: "#C4B5FD",
                            background:
                              "rgba(124,58,237,0.1)",
                            fontSize: "0.7rem",
                          }}
                        />
                      )}

                      {education.description && (
                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: {
                              xs: "0.85rem",
                              sm: "0.9rem",
                            },
                            lineHeight: 1.7,
                            mt: 1.5,
                            whiteSpace:
                              "pre-line",
                          }}
                        >
                          {education.description}
                        </Typography>
                      )}
                    </Box>

                    {/* Actions */}
                    <Stack
                      direction={{
                        xs: "row",
                        sm: "column",
                      }}
                      spacing={1}
                      sx={{
                        flexShrink: 0,
                        width: {
                          xs: "100%",
                          sm: 110,
                        },
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          openEditDialog(
                            education
                          )
                        }
                        sx={{
                          flex: 1,
                          borderColor:
                            "rgba(255,255,255,0.15)",
                          color: "#fff",
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            education._id
                          )
                        }
                        sx={{
                          flex: 1,
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              ))}
          </Stack>
        )}
      </Container>

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#0F0F0F",
            border:
              "1px solid rgba(255,255,255,0.08)",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "1.35rem",
          }}
        >
          {editingId
            ? "Edit Education"
            : "Add Education"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.2} sx={{ mt: 1 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Institution"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="University / College"
                required
              />

              <TextField
                fullWidth
                label="Degree"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="BS Computer Science"
                required
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Field of Study"
                name="field"
                value={form.field}
                onChange={handleChange}
                placeholder="Computer Science"
              />

              <TextField
                fullWidth
                label="Grade / CGPA"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                placeholder="3.30 / 4.00"
              />
            </Box>

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your education..."
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                disabled={
                  form.currentlyStudying
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Karachi, Pakistan"
              />

              <TextField
                fullWidth
                type="number"
                label="Display Order"
                name="order"
                value={form.order}
                onChange={handleChange}
                inputProps={{
                  min: 0,
                }}
              />
            </Box>

            {/* Currently Studying */}
            <TextField
              select
              fullWidth
              label="Currently Studying"
              name="currentlyStudying"
              value={form.currentlyStudying}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  currentlyStudying:
                    event.target.value ===
                    "true",
                }))
              }
            >
              <MenuItem value="false">
                No
              </MenuItem>

              <MenuItem value="true">
                Yes
              </MenuItem>
            </TextField>

            {/* Status */}
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="published">
                Published
              </MenuItem>

              <MenuItem value="draft">
                Draft
              </MenuItem>
            </TextField>

            {/* Logo Upload */}
            <Box>
              <Typography
                sx={{
                  color: "#A1A1AA",
                  fontSize: "0.8rem",
                  mb: 1,
                }}
              >
                Institution Logo
              </Typography>

              <Button
                component="label"
                variant="outlined"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  borderColor:
                    "rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              >
                Choose Logo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </Button>

              {logoPreview && (
                <Box
                  sx={{
                    mt: 2,
                    width: 90,
                    height: 90,
                    borderRadius: 2,
                    overflow: "hidden",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Box
                    component="img"
                    src={logoPreview}
                    alt="Institution preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            gap: 1,
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
          }}
        >
          <Button
            onClick={closeDialog}
            disabled={saving}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              color: "#A1A1AA",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={saving}
            variant="contained"
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                sm: 150,
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
                size={21}
                sx={{ color: "#fff" }}
              />
            ) : editingId ? (
              "Update Education"
            ) : (
              "Add Education"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminEducation;
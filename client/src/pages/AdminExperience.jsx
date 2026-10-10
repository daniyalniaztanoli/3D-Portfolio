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

const API_URL = "http://localhost:5000/api/experiences";

const emptyForm = {
  company: "",
  position: "",
  description: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  location: "",
  order: 0,
  status: "published",
};

function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const getExperiences = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const data = response.data?.experiences || [];

      setExperiences(data);
    } catch (error) {
      console.error("Experience fetch error:", error);

      setMessage({
        type: "error",
        text: "Failed to load experiences.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExperiences();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddDialog = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setMessage({
      type: "",
      text: "",
    });

    setOpen(true);
  };

  const openEditDialog = (experience) => {
    setEditingId(experience._id);

    setForm({
      company: experience.company || "",
      position: experience.position || "",
      description: experience.description || "",
      startDate: experience.startDate
        ? experience.startDate.substring(0, 10)
        : "",
      endDate: experience.endDate
        ? experience.endDate.substring(0, 10)
        : "",
      currentlyWorking:
        experience.currentlyWorking || false,
      location: experience.location || "",
      order: experience.order ?? 0,
      status: experience.status || "published",
    });

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.company.trim()) {
      setMessage({
        type: "error",
        text: "Company name is required.",
      });

      return;
    }

    if (!form.position.trim()) {
      setMessage({
        type: "error",
        text: "Position is required.",
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        company: form.company.trim(),
        position: form.position.trim(),
        description: form.description.trim(),
        startDate: form.startDate || null,
        endDate: form.currentlyWorking
          ? null
          : form.endDate || null,
        currentlyWorking: Boolean(
          form.currentlyWorking
        ),
        location: form.location.trim(),
        order: Number(form.order),
        status: form.status,
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          payload,
          config
        );
      } else {
        await axios.post(
          API_URL,
          payload,
          config
        );
      }

      await getExperiences();

      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setMessage({
        type: "success",
        text: editingId
          ? "Experience updated successfully."
          : "Experience added successfully.",
      });
    } catch (error) {
      console.error("Experience save error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save experience.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
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

      await getExperiences();

      setMessage({
        type: "success",
        text: "Experience deleted successfully.",
      });
    } catch (error) {
      console.error("Experience delete error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to delete experience.",
      });
    }
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
              ADMIN / EXPERIENCE
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
              Work{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Experience.
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
              Manage your professional experience and career timeline.
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
                sm: 160,
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
            + Add Experience
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
        ) : experiences.length === 0 ? (
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
              No experience found
            </Typography>

            <Typography
              sx={{
                color: "#71717A",
                mt: 1,
                fontSize: "0.9rem",
              }}
            >
              Add your first work experience.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2.5}>
            {experiences
              .slice()
              .sort(
                (a, b) =>
                  (a.order || 0) -
                  (b.order || 0)
              )
              .map((experience) => (
                <Paper
                  key={experience._id}
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
                      justifyContent:
                        "space-between",
                      gap: 2,
                    }}
                  >
                    {/* Content */}
                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: {
                              xs: "1.1rem",
                              sm: "1.2rem",
                            },
                            fontWeight: 800,
                          }}
                        >
                          {experience.position}
                        </Typography>

                        {experience.currentlyWorking && (
                          <Chip
                            label="Currently Working"
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

                        {experience.status ===
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
                        }}
                      >
                        {experience.company}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#71717A",
                          fontSize: "0.8rem",
                          mt: 0.7,
                        }}
                      >
                        {experience.startDate
                          ? new Date(
                              experience.startDate
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Start date"}{" "}
                        —{" "}
                        {experience.currentlyWorking
                          ? "Present"
                          : experience.endDate
                          ? new Date(
                              experience.endDate
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "End date"}
                      </Typography>

                      {experience.location && (
                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: "0.8rem",
                            mt: 0.5,
                          }}
                        >
                          {experience.location}
                        </Typography>
                      )}

                      {experience.description && (
                        <Typography
                          sx={{
                            color: "#A1A1AA",
                            fontSize: {
                              xs: "0.85rem",
                              sm: "0.9rem",
                            },
                            lineHeight: 1.7,
                            mt: 2,
                            maxWidth: 900,
                            whiteSpace:
                              "pre-line",
                          }}
                        >
                          {experience.description}
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
                            experience
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
                            experience._id
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
            ? "Edit Experience"
            : "Add Experience"}
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
                label="Company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                required
              />

              <TextField
                fullWidth
                label="Position"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Frontend Developer"
                required
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
              placeholder="Describe your responsibilities and achievements..."
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
                disabled={form.currentlyWorking}
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

            <TextField
              select
              fullWidth
              label="Currently Working"
              name="currentlyWorking"
              value={form.currentlyWorking}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  currentlyWorking:
                    event.target.value === "true",
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
              "Update Experience"
            ) : (
              "Add Experience"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminExperience;
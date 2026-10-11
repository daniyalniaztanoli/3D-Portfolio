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

const API_URL = "https://hearty-friendship-production-fec3.up.railway.app/api/skills";

const emptyForm = {
  name: "",
  category: "Frontend",
  level: 80,
  order: 0,
  status: "published",
};

function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const getSkills = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const data = response.data?.skills || [];

      setSkills(data);
    } catch (error) {
      console.error("Skills fetch error:", error);

      setMessage({
        type: "error",
        text: "Failed to load skills.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkills();
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

  const openEditDialog = (skill) => {
    setEditingId(skill._id);

    setForm({
      name: skill.name || "",
      category: skill.category || "Frontend",
      level: skill.level ?? 80,
      order: skill.order ?? 0,
      status: skill.status || "published",
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

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Skill name is required.",
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
        name: form.name.trim(),
        category: form.category,
        level: Number(form.level),
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

      await getSkills();

      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setMessage({
        type: "success",
        text: editingId
          ? "Skill updated successfully."
          : "Skill added successfully.",
      });
    } catch (error) {
      console.error("Skill save error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save skill.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
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

      await getSkills();

      setMessage({
        type: "success",
        text: "Skill deleted successfully.",
      });
    } catch (error) {
      console.error("Skill delete error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to delete skill.",
      });
    }
  };

  const getCategoryColor = (category) => {
    if (category === "Frontend") return "#7C3AED";
    if (category === "Backend") return "#06B6D4";
    return "#A1A1AA";
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
              ADMIN / SKILLS
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
                Skills.
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
              Manage the technologies displayed on your portfolio.
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
            + Add Skill
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
              sx={{ color: "#7C3AED" }}
            />
          </Box>
        ) : skills.length === 0 ? (
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
              No skills found
            </Typography>

            <Typography
              sx={{
                color: "#71717A",
                mt: 1,
                fontSize: "0.9rem",
              }}
            >
              Add your first skill to get started.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
            }}
          >
            {skills.map((skill) => (
              <Paper
                key={skill._id}
                elevation={0}
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                  },
                  borderRadius: 3,
                  background:
                    "rgba(15,15,15,0.78)",
                  backdropFilter: "blur(16px)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  transition: "0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor:
                      "rgba(124,58,237,0.35)",
                  },
                }}
              >
                {/* Top */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: {
                          xs: "1rem",
                          sm: "1.05rem",
                        },
                        fontWeight: 700,
                        wordBreak: "break-word",
                      }}
                    >
                      {skill.name}
                    </Typography>

                    <Chip
                      label={skill.category}
                      size="small"
                      sx={{
                        mt: 1,
                        height: 24,
                        color: getCategoryColor(
                          skill.category
                        ),
                        border: `1px solid ${getCategoryColor(
                          skill.category
                        )}55`,
                        background: `${getCategoryColor(
                          skill.category
                        )}12`,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>

                  <Chip
                    label={
                      skill.status === "draft"
                        ? "Draft"
                        : "Published"
                    }
                    size="small"
                    sx={{
                      flexShrink: 0,
                      height: 24,
                      fontSize: "0.68rem",
                      color:
                        skill.status === "draft"
                          ? "#F59E0B"
                          : "#10B981",
                      background:
                        skill.status === "draft"
                          ? "rgba(245,158,11,0.1)"
                          : "rgba(16,185,129,0.1)",
                    }}
                  />
                </Box>

                {/* Level */}
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#71717A",
                        fontSize: "0.75rem",
                      }}
                    >
                      Skill Level
                    </Typography>

                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {skill.level}%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: 7,
                      borderRadius: 10,
                      background:
                        "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.min(
                          Math.max(skill.level || 0, 0),
                          100
                        )}%`,
                        height: "100%",
                        borderRadius: 10,
                        background:
                          "linear-gradient(90deg, #7C3AED, #06B6D4)",
                      }}
                    />
                  </Box>
                </Box>

                {/* Actions */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      openEditDialog(skill)
                    }
                    sx={{
                      flex: 1,
                      minWidth: 90,
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
                      handleDelete(skill._id)
                    }
                    sx={{
                      flex: 1,
                      minWidth: 90,
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Box>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
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
          {editingId ? "Edit Skill" : "Add Skill"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Skill Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="React.js"
              required
            />

            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <MenuItem value="Frontend">
                Frontend
              </MenuItem>

              <MenuItem value="Backend">
                Backend
              </MenuItem>

              <MenuItem value="Tools">
                Tools
              </MenuItem>

              <MenuItem value="Other">
                Other
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Skill Level (%)"
              name="level"
              value={form.level}
              onChange={handleChange}
              inputProps={{
                min: 0,
                max: 100,
              }}
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
                sm: 130,
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
              "Update Skill"
            ) : (
              "Add Skill"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminSkills;
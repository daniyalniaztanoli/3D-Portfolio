import { useEffect, useState } from "react";
import api, { API_URL } from "../api";
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

const emptyForm = {
  title: "",
  description: "",
  icon: "",
  features: "",
  order: 0,
  status: "active",
};

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const getServices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/services");

      const data = response.data?.services || [];

      setServices(data);
    } catch (error) {
      console.error("Services fetch error:", error);

      setMessage({
        type: "error",
        text: "Failed to load services.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openAddDialog = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
    });

    setImageFile(null);
    setImagePreview("");

    setMessage({
      type: "",
      text: "",
    });

    setOpen(true);
  };

  const openEditDialog = (service) => {
    setEditingId(service._id);

    const existingFeatures = Array.isArray(
      service.features
    )
      ? service.features.join(", ")
      : service.features || "";

    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      features: existingFeatures,
      order: service.order ?? 0,
      status: service.status || "active",
    });

    setImageFile(null);

    setImagePreview(
      service.image
        ? service.image.startsWith("http")
          ? service.image
          : `${API_URL}${service.image}`
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

    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage({
        type: "error",
        text: "Service title is required.",
      });

      return;
    }

    if (!form.description.trim()) {
      setMessage({
        type: "error",
        text: "Service description is required.",
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
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "icon",
        form.icon.trim()
      );

      const featuresArray = form.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      featuresArray.forEach((feature) => {
        formData.append("features", feature);
      });

      formData.append(
        "order",
        String(Number(form.order))
      );

      formData.append(
        "status",
        form.status
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingId) {
        await api.put(`/api/services/${editingId}`, formData);
      } else {
        await api.post("/api/services", formData);
      }

      await getServices();

      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setImageFile(null);
      setImagePreview("");

      setMessage({
        type: "success",
        text: editingId
          ? "Service updated successfully."
          : "Service added successfully.",
      });
    } catch (error) {
      console.error("Service save error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save service.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/services/${id}`);

      await getServices();

      setMessage({
        type: "success",
        text: "Service deleted successfully.",
      });
    } catch (error) {
      console.error("Service delete error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to delete service.",
      });
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${API_URL}${image}`;
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
              ADMIN / SERVICES
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
                Services.
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
              Manage the services displayed on your portfolio.
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
            + Add Service
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
        ) : services.length === 0 ? (
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
              No services found
            </Typography>

            <Typography
              sx={{
                color: "#71717A",
                mt: 1,
                fontSize: "0.9rem",
              }}
            >
              Add your first service to get started.
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
            {services
              .slice()
              .sort(
                (a, b) =>
                  (a.order || 0) -
                  (b.order || 0)
              )
              .map((service) => (
                <Paper
                  key={service._id}
                  elevation={0}
                  sx={{
                    overflow: "hidden",
                    borderRadius: 3,
                    background:
                      "rgba(15,15,15,0.78)",
                    backdropFilter: "blur(16px)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    transition: "0.25s ease",
                    "&:hover": {
                      transform:
                        "translateY(-4px)",
                      borderColor:
                        "rgba(124,58,237,0.35)",
                    },
                  }}
                >
                  {/* Image */}
                  {service.image && (
                    <Box
                      sx={{
                        height: {
                          xs: 170,
                          sm: 190,
                        },
                        overflow: "hidden",
                        background:
                          "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
                      }}
                    >
                      <Box
                        component="img"
                        src={getImageUrl(
                          service.image
                        )}
                        alt={service.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },
                    }}
                  >
                    {/* Top */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: {
                              xs: "1.05rem",
                              sm: "1.15rem",
                            },
                            fontWeight: 800,
                            wordBreak:
                              "break-word",
                          }}
                        >
                          {service.title}
                        </Typography>

                        {service.icon && (
                          <Typography
                            sx={{
                              color: "#7C3AED",
                              fontSize:
                                "0.72rem",
                              mt: 0.5,
                            }}
                          >
                            Icon: {service.icon}
                          </Typography>
                        )}
                      </Box>

                      <Chip
                        label={
                          service.status ===
                          "inactive"
                            ? "Inactive"
                            : "Active"
                        }
                        size="small"
                        sx={{
                          flexShrink: 0,
                          height: 24,
                          fontSize:
                            "0.68rem",
                          color:
                            service.status ===
                            "inactive"
                              ? "#F59E0B"
                              : "#10B981",
                          background:
                            service.status ===
                            "inactive"
                              ? "rgba(245,158,11,0.1)"
                              : "rgba(16,185,129,0.1)",
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Typography
                      sx={{
                        mt: 1.5,
                        color: "#A1A1AA",
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.9rem",
                        },
                        lineHeight: 1.7,
                        display:
                          "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient:
                          "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {service.description}
                    </Typography>

                    {/* Features */}
                    {Array.isArray(
                      service.features
                    ) &&
                      service.features.length >
                        0 && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap:
                              "wrap",
                            gap: 0.7,
                            mt: 2,
                          }}
                        >
                          {service.features
                            .slice(0, 5)
                            .map(
                              (
                                feature,
                                index
                              ) => (
                                <Chip
                                  key={
                                    `${service._id}-${index}`
                                  }
                                  label={
                                    feature
                                  }
                                  size="small"
                                  sx={{
                                    height: 25,
                                    color:
                                      "#C4B5FD",
                                    background:
                                      "rgba(124,58,237,0.1)",
                                    border:
                                      "1px solid rgba(124,58,237,0.15)",
                                    fontSize:
                                      "0.68rem",
                                  }}
                                />
                              )
                            )}
                        </Box>
                      )}

                    {/* Actions */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mt: 3,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          openEditDialog(
                            service
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
                            service._id
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
          </Box>
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
            ? "Edit Service"
            : "Add Service"}
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
                label="Service Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Web Development"
                required
              />

              <TextField
                fullWidth
                label="Icon Name"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="code"
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
              placeholder="Describe the service you provide..."
              required
            />

            <TextField
              fullWidth
              label="Features"
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder="Responsive UI, API Integration, SEO"
              helperText="Separate multiple features with commas."
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
                <MenuItem value="active">
                  Active
                </MenuItem>

                <MenuItem value="inactive">
                  Inactive
                </MenuItem>
              </TextField>
            </Box>

            {/* Image */}
            <Box>
              <Typography
                sx={{
                  color: "#A1A1AA",
                  fontSize: "0.8rem",
                  mb: 1,
                }}
              >
                Service Image
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
                Choose Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreview && (
                <Box
                  sx={{
                    mt: 2,
                    width: "100%",
                    maxWidth: 360,
                    height: 190,
                    borderRadius: 2,
                    overflow: "hidden",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Service preview"
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
                sm: 140,
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
              "Update Service"
            ) : (
              "Add Service"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminServices;
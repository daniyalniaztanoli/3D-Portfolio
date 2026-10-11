
import { useCallback, useEffect, useState } from "react";
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
  issuer: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  fileUrl: "",
  description: "",
  order: 0,
  status: "published",
};

function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("adminToken");

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Backend se certificates load karo.
  // Tumhare existing controller ke mutabiq GET /api/certificates use hoga.
  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/certificates");

      if (response.data?.success) {
        setCertificates(response.data.certificates || []);
      } else {
        setCertificates([]);
        setError("Certificates load nahi ho sake.");
      }
    } catch (err) {
      console.error("Fetch certificates error:", err);
      setError(
        err.response?.data?.message ||
          "Certificates load nahi ho sake. Backend check karo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setImage(null);
    setImagePreview("");
    setEditingId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setError("");
    setOpen(true);
  };

  const openEditDialog = (certificate) => {
    setEditingId(certificate._id);

    setForm({
      title: certificate.title || "",
      issuer: certificate.issuer || "",
      issueDate: certificate.issueDate
        ? certificate.issueDate.slice(0, 10)
        : "",
      credentialId: certificate.credentialId || "",
      credentialUrl: certificate.credentialUrl || "",
      fileUrl: certificate.fileUrl || "",
      description: certificate.description || "",
      order: certificate.order ?? 0,
      status: certificate.status || "published",
    });

    setImage(null);
    setImagePreview(getImageUrl(certificate.image));
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setOpen(false);
    setError("");
  };

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
      setError("Sirf image file select karo.");
      event.target.value = "";
      return;
    }

    // 5 MB image limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image ka size 5 MB se kam hona chahiye.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!getToken()) {
      setError("Session expire ho gaya hai. Dobara login karo.");
      return;
    }

    if (!form.title.trim() || !form.issuer.trim()) {
      setError("Certificate title aur issuer required hain.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(
          key,
          key === "order" ? String(Number(value) || 0) : value
        );
      });

      if (image) {
        data.append("image", image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      if (editingId) {
        await api.put(`/api/certificates/${editingId}`, data);
        setSuccess("Certificate successfully update ho gaya.");
      } else {
        await api.post("/api/certificates", data);
        setSuccess("Certificate successfully add ho gaya.");
      }

      setOpen(false);
      resetForm();

      await fetchCertificates();
    } catch (err) {
      console.error("Save certificate error:", err);

      setError(
        err.response?.data?.message ||
          "Certificate save nahi ho saka. Login aur backend check karo."
      );
    } finally {
      setSaving(false);
    }
  };
const handleDelete = async (id) => {
    if (!getToken()) {
      setError("Session expire ho gaya hai. Dobara login karo.");
      return;
    }

    const confirmed = window.confirm(
      "Kya tum is certificate ko delete karna chahte ho?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/api/certificates/${id}`);

      setCertificates((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setSuccess("Certificate delete ho gaya.");
    } catch (err) {
      console.error("Delete certificate error:", err);

      setError(
        err.response?.data?.message ||
          "Certificate delete nahi ho saka."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, sm: 4, md: 6 },
        color: "#F8FAFC",
        background:
          "radial-gradient(circle at 10% 0%, rgba(124,58,237,0.12), transparent 35%), #050505",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={4}
        >
          <Box>
            <Typography
              sx={{
                color: "#06B6D4",
                fontSize: "0.7rem",
                letterSpacing: 3,
                mb: 1,
              }}
            >
              ADMIN / PORTFOLIO
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.7rem",
                  md: "3.2rem",
                },
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              Manage{" "}
              <Box component="span" sx={{ color: "#A78BFA" }}>
                Certificates.
              </Box>
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Apne certificates add, edit aur manage karo.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={openAddDialog}
            sx={{
              py: 1.4,
              px: 3,
              background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
              "&:hover": { opacity: 0.9 },
            }}
          >
            + Add Certificate
          </Button>
        </Stack>

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        {error && !open && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            color: "#F8FAFC",
            border: "1px solid rgba(124,58,237,0.25)",
            background: "rgba(15,15,15,0.85)",
          }}
        >
          <Typography color="text.secondary" fontSize="0.85rem">
            TOTAL CERTIFICATES
          </Typography>

          <Typography fontSize="2rem" fontWeight={800} mt={1}>
            {certificates.length}
          </Typography>
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress sx={{ color: "#06B6D4" }} />
          </Box>
        ) : certificates.length === 0 ? (
          <Paper
            sx={{
              p: { xs: 3, sm: 6 },
              textAlign: "center",
              color: "#F8FAFC",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <Typography fontSize="1.2rem" fontWeight={700}>
              Abhi koi certificate nahi hai
            </Typography>

            <Typography color="text.secondary" mt={1} mb={3}>
              Apna pehla certificate add karne ke liye button dabao.
            </Typography>

            <Button variant="outlined" onClick={openAddDialog}>
              Add First Certificate
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2.5,
            }}
          >
            {certificates.map((certificate) => (
              <Paper
                key={certificate._id}
                sx={{
                  p: 2,
                  minWidth: 0,
                  overflow: "hidden",
                  color: "#F8FAFC",
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "0.25s",
                  "&:hover": {
                    borderColor: "#7C3AED",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {certificate.image ? (
                  <Box
                    component="img"
                    src={getImageUrl(certificate.image)}
                    alt={certificate.title}
                    sx={{
                      display: "block",
                      width: "100%",
                      height: 190,
                      objectFit: "contain",
                      borderRadius: 2,
                      background: "#09090B",
                      mb: 2,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 150,
                      mb: 2,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,.2), rgba(6,182,212,.1))",
                      color: "#A78BFA",
                      fontSize: "2.5rem",
                      fontWeight: 800,
                    }}
                  >
                    CERT
                  </Box>
                )}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                  mb={1}
                >
                  <Chip
                    size="small"
                    label={certificate.status}
                    color={
                      certificate.status === "published"
                        ? "success"
                        : "default"
                    }
                  />

                  <Typography variant="caption" color="text.secondary">
                    Order: {certificate.order ?? 0}
                  </Typography>
                </Stack>

                <Typography
                  fontWeight={750}
                  fontSize="1.1rem"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {certificate.title}
                </Typography>

                <Typography
                  sx={{ color: "#06B6D4", mt: 0.7, fontSize: "0.9rem" }}
                >
                  {certificate.issuer}
                </Typography>

                {certificate.issueDate && (
                  <Typography
                    color="text.secondary"
                    fontSize="0.8rem"
                    mt={1}
                  >
                    Issued:{" "}
                    {new Date(certificate.issueDate).toLocaleDateString()}
                  </Typography>
                )}

                {certificate.credentialId && (
                  <Typography
                    color="text.secondary"
                    fontSize="0.8rem"
                    mt={1}
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    ID: {certificate.credentialId}
                  </Typography>
                )}

                {certificate.credentialUrl && (
                  <Button
                    size="small"
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Verify Certificate
                  </Button>
                )}

                {certificate.fileUrl && (
                  <Button
                    size="small"
                    href={certificate.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Open Certificate File
                  </Button>
                )}

                <Stack direction="row" gap={1} mt={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => openEditDialog(certificate)}
                  >
                    Edit
                  </Button>

                  <Button
                    fullWidth
                    color="error"
                    variant="outlined"
                    disabled={deletingId === certificate._id}
                    onClick={() => handleDelete(certificate._id)}
                  >
                    {deletingId === certificate._id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Box>
        )}

        <Dialog
          open={open}
          onClose={closeDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              color: "#F8FAFC",
              background: "#101014",
              backgroundImage: "none",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 3,
              m: { xs: 1, sm: 3 },
            },
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle sx={{ fontWeight: 800 }}>
              {editingId ? "Edit Certificate" : "Add Certificate"}
            </DialogTitle>

            <DialogContent>
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  sx={{ mb: 2 }}
                >
                  {error}
                </Alert>
              )}

              <Stack spacing={2.2} mt={1}>
                <TextField
                  label="Certificate Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  label="Issuing Organization"
                  name="issuer"
                  value={form.issuer}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={form.issueDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Credential ID"
                  name="credentialId"
                  value={form.credentialId}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Credential Verification URL"
                  name="credentialUrl"
                  type="url"
                  value={form.credentialUrl}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Certificate File URL (optional)"
                  name="fileUrl"
                  type="url"
                  value={form.fileUrl}
                  onChange={handleChange}
                  helperText="PDF ya online certificate ka link paste karo."
                  fullWidth
                />

                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  minRows={3}
                  fullWidth
                />

                <TextField
                  label="Display Order"
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 1 }}
                  fullWidth
                />

                <TextField
                  select
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </TextField>

                <Button
                  variant="outlined"
                  component="label"
                  sx={{ py: 1.3 }}
                >
                  {image
                    ? "Change Selected Image"
                    : "Upload Certificate Image"}

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>

                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Certificate preview"
                    sx={{
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "contain",
                      borderRadius: 2,
                      background: "#08080B",
                    }}
                  />
                )}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={closeDialog}
                disabled={saving}
                color="inherit"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{
                  px: 3,
                  background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Certificate"
                    : "Save Certificate"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}

export default AdminCertificates;
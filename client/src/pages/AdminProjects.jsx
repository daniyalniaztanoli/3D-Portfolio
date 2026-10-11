import { useEffect, useState } from "react";
import axios from "axios";

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    category: "Web Development",
    featured: false,
    status: "published",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // Fetch Projects
  // =========================

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "https://hearty-friendship-production-fec3.up.railway.app/api/projects"
      );

      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // Form Change
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // =========================
  // Image Select
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =========================
  // Reset Form
  // =========================

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      description: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      category: "Web Development",
      featured: false,
      status: "published",
    });

    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  // =========================
  // Add / Update Project
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("slug", form.slug);
      formData.append("description", form.description);

      formData.append(
        "technologies",
        JSON.stringify(
          form.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean)
        )
      );

      formData.append("githubUrl", form.githubUrl);
      formData.append("liveUrl", form.liveUrl);
      formData.append("category", form.category);
      formData.append("featured", form.featured);
      formData.append("status", form.status);

      // New image only if selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // =========================
      // UPDATE
      // =========================

      if (editingId) {
        await axios.put(
          `https://hearty-friendship-production-fec3.up.railway.app/api/projects/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Project updated successfully ✅");
      }

      // =========================
      // CREATE
      // =========================

      else {
        await axios.post(
          "https://hearty-friendship-production-fec3.up.railway.app/api/projects",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Project added successfully ✅");
      }

      resetForm();

      await fetchProjects();
    } catch (error) {
      console.error("Project Save Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save project"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Edit Project
  // =========================

  const handleEdit = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title || "",
      slug: project.slug || "",
      description: project.description || "",
      technologies:
        project.technologies?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      category:
        project.category || "Web Development",
      featured: project.featured || false,
      status: project.status || "published",
    });

    setImageFile(null);

    if (project.image) {
      setImagePreview(
        `https://hearty-friendship-production-fec3.up.railway.app${project.image}`
      );
    } else {
      setImagePreview("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setMessage("");
  };

  // =========================
  // Delete Project
  // =========================

  const handleDelete = async (
    projectId,
    projectTitle
  ) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${projectTitle}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(projectId);
      setMessage("");

      const token = localStorage.getItem("adminToken");

      await axios.delete(
        `https://hearty-friendship-production-fec3.up.railway.app/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Project deleted successfully ✅");

      await fetchProjects();
    } catch (error) {
      console.error(
        "Delete Project Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to delete project"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: "40px",
      }}
    >
      <h1>Projects Management</h1>

      {/* Message */}

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "#222",
            borderRadius: "8px",
          }}
        >
          {message}
        </div>
      )}

      {/* =========================
          Add / Edit Form
      ========================= */}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          background: "#1f1f1f",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "25px",
        }}
      >
        <h2>
          {editingId
            ? "Edit Project"
            : "Add New Project"}
        </h2>

        <input
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          name="slug"
          placeholder="Project Slug"
          value={form.slug}
          onChange={handleChange}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            boxSizing: "border-box",
          }}
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
          required
          rows="5"
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            boxSizing: "border-box",
          }}
        />

        {/* Image */}

        <label
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Project Image
        </label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <div style={{ marginTop: "15px" }}>
            <p>
              {editingId
                ? "Current / New Image:"
                : "Image Preview:"}
            </p>

            <img
              src={imagePreview}
              alt="Project Preview"
              style={{
                width: "250px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        <input
          name="technologies"
          placeholder="React, Node.js, MongoDB"
          value={form.technologies}
          onChange={handleChange}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          name="githubUrl"
          placeholder="GitHub URL"
          value={form.githubUrl}
          onChange={handleChange}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          name="liveUrl"
          placeholder="Live Website URL"
          value={form.liveUrl}
          onChange={handleChange}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            boxSizing: "border-box",
          }}
        />

        <label
          style={{
            display: "block",
            marginTop: "20px",
          }}
        >
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />

          {" "}Featured Project
        </label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
          }}
        >
          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>
        </select>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: "13px",
            marginTop: "20px",
            cursor: saving
              ? "not-allowed"
              : "pointer",
          }}
        >
          {saving
            ? "Saving..."
            : editingId
            ? "Update Project"
            : "Add Project"}
        </button>

        {/* Cancel Edit */}

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* =========================
          Projects List
      ========================= */}

      <h2 style={{ marginTop: "40px" }}>
        Existing Projects ({projects.length})
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              background: "#1f1f1f",
              padding: "20px",
              marginTop: "15px",
              borderRadius: "10px",
            }}
          >
            {/* Project Image */}

            {project.image && (
              <img
                src={`https://hearty-friendship-production-fec3.up.railway.app${project.image}`}
                alt={project.title}
                style={{
                  width: "250px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                  marginBottom: "15px",
                }}
              />
            )}

            <h3>{project.title}</h3>

            <p>{project.description}</p>

            <p>
              <strong>Technologies:</strong>{" "}
              {project.technologies?.join(", ")}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {project.category}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {project.status}
            </p>

            <p>
              <strong>Featured:</strong>{" "}
              {project.featured ? "Yes" : "No"}
            </p>

            {/* Edit Button */}

            <button
              onClick={() => handleEdit(project)}
              style={{
                marginTop: "15px",
                marginRight: "10px",
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Edit Project
            </button>

            {/* Delete Button */}

            <button
              onClick={() =>
                handleDelete(
                  project._id,
                  project.title
                )
              }
              disabled={
                deletingId === project._id
              }
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background:
                  deletingId === project._id
                    ? "#555"
                    : "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor:
                  deletingId === project._id
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {deletingId === project._id
                ? "Deleting..."
                : "Delete Project"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminProjects;
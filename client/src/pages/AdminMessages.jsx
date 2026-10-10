import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const API_URL = "http://localhost:5000/api/messages";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const token = localStorage.getItem("adminToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        API_URL,
        authConfig
      );

      console.log(
        "Messages API Response:",
        response.data
      );

      const data = response.data?.messages || [];

      setMessages(data);
    } catch (err) {
      console.error("Messages API Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/${id}`,
        { status: "read" },
        authConfig
      );

      setMessages((prev) =>
        prev.map((message) =>
          message._id === id
            ? { ...message, status: "read" }
            : message
        )
      );
    } catch (err) {
      console.error(
        "Mark as read error:",
        err
      );
    }
  };

  const markAsUnread = async (id) => {
    try {
      await axios.put(
        `${API_URL}/${id}`,
        { status: "unread" },
        authConfig
      );

      setMessages((prev) =>
        prev.map((message) =>
          message._id === id
            ? { ...message, status: "unread" }
            : message
        )
      );
    } catch (err) {
      console.error(
        "Mark as unread error:",
        err
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `${API_URL}/${deleteId}`,
        authConfig
      );

      setMessages((prev) =>
        prev.filter(
          (message) => message._id !== deleteId
        )
      );

      setDeleteId(null);
    } catch (err) {
      console.error(
        "Delete message error:",
        err
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const unreadCount = messages.filter(
    (message) => message.status !== "read"
  ).length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "#FFFFFF",
        py: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#06B6D4",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                mb: 1,
              }}
            >
              ADMIN / MESSAGES
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: "#FFFFFF",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                fontSize: {
                  xs: "2rem",
                  sm: "2.6rem",
                  md: "3rem",
                },
              }}
            >
              Contact Messages
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#71717A",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.9rem",
                },
              }}
            >
              Manage messages received from
              your portfolio.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Chip
              label={`${messages.length} Total`}
              sx={{
                color: "#FFFFFF",
                backgroundColor:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            />

            <Chip
              label={`${unreadCount} Unread`}
              sx={{
                color: "#67E8F9",
                backgroundColor:
                  "rgba(6,182,212,0.08)",
                border:
                  "1px solid rgba(6,182,212,0.2)",
              }}
            />
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Box
            sx={{
              mb: 3,
              p: 2.5,
              borderRadius: 3,
              backgroundColor:
                "rgba(239,68,68,0.07)",
              border:
                "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <Typography
              sx={{
                color: "#FCA5A5",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              minHeight: 300,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress
              sx={{ color: "#7C3AED" }}
            />
          </Box>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          messages.length === 0 && (
            <Box
              sx={{
                minHeight: 300,
                display: "grid",
                placeItems: "center",
                p: 4,
                borderRadius: 4,
                backgroundColor:
                  "rgba(255,255,255,0.035)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#7C3AED",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  @
                </Typography>

                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  No messages yet
                </Typography>

                <Typography
                  sx={{
                    color: "#71717A",
                    fontSize: "0.85rem",
                  }}
                >
                  Messages submitted through
                  your contact form will appear here.
                </Typography>
              </Box>
            </Box>
          )}

        {/* Messages */}
        {!loading &&
          !error &&
          messages.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {messages.map((message) => {
                const isUnread =
                  message.status !== "read";

                return (
                  <Box
                    key={message._id}
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                        md: 3,
                      },
                      borderRadius: 4,
                      backgroundColor: isUnread
                        ? "rgba(124,58,237,0.055)"
                        : "rgba(255,255,255,0.025)",
                      border: isUnread
                        ? "1px solid rgba(124,58,237,0.25)"
                        : "1px solid rgba(255,255,255,0.07)",
                      transition:
                        "transform 0.25s ease, border-color 0.25s ease",
                      "&:hover": {
                        transform: {
                          xs: "none",
                          md: "translateY(-3px)",
                        },
                        borderColor:
                          "rgba(124,58,237,0.4)",
                      },
                    }}
                  >
                    {/* Top */}
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
                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 0.8,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#FFFFFF",
                              fontWeight: 700,
                              fontSize: {
                                xs: "0.95rem",
                                sm: "1rem",
                              },
                            }}
                          >
                            {message.name}
                          </Typography>

                          <Chip
                            size="small"
                            label={
                              isUnread
                                ? "Unread"
                                : "Read"
                            }
                            sx={{
                              height: 23,
                              color: isUnread
                                ? "#C4B5FD"
                                : "#A1A1AA",
                              backgroundColor:
                                isUnread
                                  ? "rgba(124,58,237,0.12)"
                                  : "rgba(255,255,255,0.05)",
                              border: isUnread
                                ? "1px solid rgba(124,58,237,0.2)"
                                : "1px solid rgba(255,255,255,0.08)",
                              fontSize: "0.62rem",
                            }}
                          />
                        </Box>

                        <Typography
                          component="a"
                          href={`mailto:${message.email}`}
                          sx={{
                            color: "#06B6D4",
                            textDecoration: "none",
                            fontSize: "0.78rem",
                            wordBreak:
                              "break-word",
                            "&:hover": {
                              textDecoration:
                                "underline",
                            },
                          }}
                        >
                          {message.email}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color: "#71717A",
                          fontSize: "0.7rem",
                          whiteSpace: {
                            xs: "normal",
                            sm: "nowrap",
                          },
                        }}
                      >
                        {formatDate(
                          message.createdAt
                        )}
                      </Typography>
                    </Box>

                    {/* Subject */}
                    <Typography
                      sx={{
                        mt: 2,
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: {
                          xs: "0.9rem",
                          sm: "0.95rem",
                        },
                        wordBreak: "break-word",
                      }}
                    >
                      {message.subject}
                    </Typography>

                    {/* Message Preview */}
                    <Typography
                      sx={{
                        mt: 1,
                        color: "#A1A1AA",
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.85rem",
                        },
                        lineHeight: 1.7,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {message.message}
                    </Typography>

                    {/* Actions */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 2.5,
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedMessage(
                            message
                          );

                          if (isUnread) {
                            markAsRead(
                              message._id
                            );
                          }
                        }}
                        sx={{
                          color: "#A78BFA",
                          fontSize: "0.72rem",
                          "&:hover": {
                            backgroundColor:
                              "rgba(124,58,237,0.08)",
                          },
                        }}
                      >
                        View Message
                      </Button>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() =>
                            isUnread
                              ? markAsRead(
                                  message._id
                                )
                              : markAsUnread(
                                  message._id
                                )
                          }
                          sx={{
                            minWidth: "auto",
                            color: "#06B6D4",
                            fontSize: "0.68rem",
                          }}
                        >
                          {isUnread
                            ? "Mark Read"
                            : "Mark Unread"}
                        </Button>

                        <Button
                          size="small"
                          onClick={() =>
                            setDeleteId(
                              message._id
                            )
                          }
                          sx={{
                            minWidth: "auto",
                            color: "#F87171",
                            fontSize: "0.68rem",
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
      </Container>

      {/* View Dialog */}
      <Dialog
        open={Boolean(selectedMessage)}
        onClose={() =>
          setSelectedMessage(null)
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#0F0F0F",
            color: "#FFFFFF",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: 3,
          },
        }}
      >
        {selectedMessage && (
          <>
            <DialogTitle
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
              }}
            >
              {selectedMessage.subject}
            </DialogTitle>

            <DialogContent>
              <Typography
                sx={{
                  color: "#06B6D4",
                  fontSize: "0.8rem",
                  mb: 0.5,
                }}
              >
                {selectedMessage.name}
              </Typography>

              <Typography
                component="a"
                href={`mailto:${selectedMessage.email}`}
                sx={{
                  display: "inline-block",
                  color: "#A78BFA",
                  textDecoration: "none",
                  fontSize: "0.78rem",
                  mb: 2.5,
                }}
              >
                {selectedMessage.email}
              </Typography>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor:
                    "rgba(255,255,255,0.035)",
                  border:
                    "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Typography
                  sx={{
                    color: "#D4D4D8",
                    fontSize: "0.88rem",
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {selectedMessage.message}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#52525B",
                  fontSize: "0.7rem",
                  mt: 2,
                }}
              >
                {formatDate(
                  selectedMessage.createdAt
                )}
              </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button
                onClick={() =>
                  setSelectedMessage(null)
                }
                sx={{
                  color: "#A1A1AA",
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#0F0F0F",
            color: "#FFFFFF",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#FFFFFF",
            fontWeight: 700,
          }}
        >
          Delete Message?
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#A1A1AA",
              fontSize: "0.85rem",
              lineHeight: 1.7,
            }}
          >
            This message will be permanently
            removed from the database.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            gap: 1,
          }}
        >
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              color: "#A1A1AA",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              backgroundColor: "#DC2626",
              "&:hover": {
                backgroundColor: "#B91C1C",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

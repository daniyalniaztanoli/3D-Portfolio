import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Certificates", href: "#certificates" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = (href) => {
    const section = document.querySelector(href);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMobileOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "rgba(5, 5, 5, 0.92)",
          backgroundImage: "none",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 66, md: 78 },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Logo */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                component="button"
                onClick={() => handleScroll("#home")}
                sx={{
                  border: 0,
                  padding: 0,
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: { xs: "1.5rem", md: "1.7rem" },
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  backgroundImage:
                    "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Daniyal.
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 0.25,
              }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.04,
                  }}
                >
                  <Button
                    onClick={() => handleScroll(item.href)}
                    sx={{
                      color: "#B8B8C5",
                      fontSize: "0.82rem",
                      px: 1,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        color: "#FFFFFF",
                        backgroundColor: "rgba(124,58,237,0.16)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "flex", lg: "none" },
                color: "#FFFFFF",
                border: "1px solid rgba(124,58,237,0.4)",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(124,58,237,0.18)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: { xs: "85%", sm: 360 },
            maxWidth: "100%",
            color: "#FFFFFF !important",
            backgroundColor: "#09090F !important",
            backgroundImage:
              "radial-gradient(circle at top right, rgba(124,58,237,0.2), transparent 45%) !important",
            borderLeft: "1px solid rgba(124,58,237,0.3)",
            boxSizing: "border-box",
            opacity: 1,
            isolation: "isolate",
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(4px)",
          },
          "& .MuiDrawer-paper": {
            color: "#FFFFFF !important",
            backgroundColor: "#09090F !important",
            backgroundImage:
              "radial-gradient(circle at top right, rgba(124,58,237,0.2), transparent 45%) !important",
          },
        }}
      >
        <Box
          sx={{
            minHeight: "100%",
            p: { xs: 2, sm: 2.5 },
            boxSizing: "border-box",
            color: "#FFFFFF",
            backgroundColor: "transparent",
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 800,
                backgroundImage:
                  "linear-gradient(90deg, #A78BFA, #06B6D4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Daniyal.
            </Typography>

            <IconButton
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  color: "#06B6D4",
                  backgroundColor: "rgba(6,182,212,0.12)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Mobile Links */}
          <List disablePadding>
            {navItems.map((item, index) => (
              <ListItem
                key={item.label}
                disablePadding
                sx={{ mb: 0.7 }}
              >
                <ListItemButton
                  onClick={() => handleScroll(item.href)}
                  sx={{
                    py: 1.35,
                    px: 2,
                    borderRadius: 2,
                    color: "#E5E7EB !important",
                    border: "1px solid transparent",
                    backgroundColor: "transparent !important",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#FFFFFF !important",
                      backgroundColor:
                        "rgba(124,58,237,0.18) !important",
                      borderColor: "rgba(124,58,237,0.4)",
                      transform: "translateX(-3px)",
                    },
                    "& .MuiListItemText-primary": {
                      color: "#E5E7EB !important",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      width: 28,
                      flexShrink: 0,
                      mr: 1.5,
                      fontSize: "0.75rem",
                      color: "#06B6D4",
                      fontWeight: 700,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Typography>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "#E5E7EB !important",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}


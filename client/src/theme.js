import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#050505",
      paper: "#0f0f0f",
    },

    primary: {
      main: "#7c3aed",
    },

    secondary: {
      main: "#06b6d4",
    },

    text: {
      primary: "#ffffff",
      secondary: "#a1a1aa",
    },
  },

  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background:
            "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
  },
});

export default theme;
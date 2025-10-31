import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store";
import App from "./App";
import "./main.css";

const theme = createTheme({
  // Optional: override MUI defaults if needed
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Resets MUI styles */}
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);

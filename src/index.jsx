import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App/App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { SavedProvider } from "./context/SavedContext";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDom.createRoot(document.getElementById("root"));

root.render(
  <>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SavedProvider>
            <App />
          </SavedProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </>,
);

import { AxiosInterceptor } from "./axiosConfig";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { SnackbarProvider } from "notistack";
import store from "./store";
import { theme } from "./theme/theme";
import { OopsError } from "./components/OopsError";
import { GlobalRoutes } from "./routes/routes.config";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <SnackbarProvider>
          <AxiosInterceptor>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                  <ErrorBoundary FallbackComponent={OopsError}>
                    <GlobalRoutes />
                  </ErrorBoundary>
              </ThemeProvider>
            </StyledEngineProvider>
          </AxiosInterceptor>
        </SnackbarProvider>
      </Router>
    </Provider>
  );
}

export default App;

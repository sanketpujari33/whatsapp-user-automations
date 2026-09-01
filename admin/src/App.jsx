// Import Dependencies
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { useRef } from "react";

// Local Imports
import { AuthProvider } from "app/contexts/auth/Provider";
import { BreakpointProvider } from "app/contexts/breakpoint/Provider";
import { LocaleProvider } from "app/contexts/locale/Provider";
import { SidebarProvider } from "app/contexts/sidebar/Provider";
import { ThemeProvider } from "app/contexts/theme/Provider";
import { TeamTypeProvider } from "app/contexts/TeamType/Provider";
import router from "app/router/router";
import { stores } from "./store/store";

// ----------------------------------------------------------------------

function App() {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = stores;
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeProvider>
        <BreakpointProvider>
          <LocaleProvider>
            <SidebarProvider>
              <AuthProvider>
                <TeamTypeProvider>
                  <RouterProvider router={router} />
                </TeamTypeProvider>
              </AuthProvider>
            </SidebarProvider>
          </LocaleProvider>
        </BreakpointProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
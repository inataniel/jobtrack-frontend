import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import ApplicationPage from "./pages/ApplicationPage";
import LoginPage from "./pages/LoginPage";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <ApplicationPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

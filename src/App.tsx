import { Routes, Route } from "react-router-dom";
import SignUpForm from "./lib/auth/signup";
import SignInForm from "./lib/auth/sign-in";
import SearchPage from "./lib/home";
import { AuthProvider, ProtectedRoute } from "./lib/auth/authProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

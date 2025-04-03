import { Routes, Route } from "react-router-dom";
import SignUpForm from "./lib/auth/signup";
import SignInForm from "./lib/auth/sign-in";
import SearchPage from "./lib/home";
import { AuthProvider, ProtectedRoute } from "./lib/auth/authProvider";
import LikedDogs from "./lib/favourite";
import ListsPage from "./lib/lists/ListsPage";

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
        <Route
          path="/liked"
          element={
            <ProtectedRoute>
              <LikedDogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists"
          element={
            <ProtectedRoute>
              <ListsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

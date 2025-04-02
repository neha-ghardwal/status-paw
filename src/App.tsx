import {Routes, Route} from 'react-router-dom'
import SignUpForm from "./lib/auth/signup"
import SignInForm from "./lib/auth/sign-in"


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<SignInForm/>} />
      <Route path="/signup" element={<SignUpForm/>} />
    </Routes>
    </>
  )
}

export default App

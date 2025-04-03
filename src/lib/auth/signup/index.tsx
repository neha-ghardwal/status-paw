"use client"
import type React from "react"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { cn } from "@/lib/utils"
import { useEffect,useState } from "react"
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function SignUpForm() {
  const auth = getAuth()
  const navigate = useNavigate()

  // State variables
  const [authing, setAuthing] = useState(false)
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home")
      }
    })

    return () => unsubscribe()
  }, [auth, navigate])

  // Google Sign-Up
  const signUpWithGoogle = async () => {
    setAuthing(true)

    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (response) => {
        console.log(response.user.uid)

        // If user has no display name, update it
        if (!response.user.displayName) {
          await updateProfile(response.user, {
            displayName: `${firstname} ${lastname}`,
          })
        }
        toast.success("Sign up successful!", { position: "top-right" });
        setTimeout(() => navigate("/home"), 1000);        
      })
      .catch((error) => {
        console.error(error)
        setAuthing(false)
        setError(error.message)
        toast.error(error.message, { position: "top-right" })
      })
  }

  // Email Sign-Up
  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthing(true)
    setError("")

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        console.log(response.user.uid)

        await updateProfile(response.user, {
          displayName: `${firstname} ${lastname}`,
        })
        toast.success("Sign up successful!", { position: "top-right" });
        setTimeout(() => navigate("/home"), 1000);
        
      })
      .catch((error) => {
        console.error(error)
        setError(error.message)
        setAuthing(false)
        toast.error(error.message, { position: "top-right" })
      })
  }

  return (
    <>
      <div className="w-full h-[100vh] flex justify-center p-10 bg-black">
        <div className="shadow-input mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8 dark:bg-black">
          <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <h2 className="text-xl font-bold text-neutral-200">
            Welcome to
            <span className="inline-block bg-gradient-to-b from-red-400 to-pink-500 px-2 rotate-[357deg] transform origin-center m-1 clip-triangle">
              🐾Status Paw🐾
            </span>
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-300">
            Sign up to create your account.
          </p>

          <form className="my-8" onSubmit={signUpWithEmail}>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input
                  id="lastname"
                  placeholder="Durden"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                title="Please enter a valid email address."
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$"
                title="Must be at least 8 characters and include uppercase, lowercase, numeric, and special characters."
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-transparent text-white font-semibold text-sm border-2 border-neutral-400 cursor-pointer"
              type="submit"
              disabled={authing}
            >
              Sign up &rarr;
              <BottomGradient />
            </button>
            <p className="mt-4 text-sm text-neutral-300">
              Already have an account?{" "}
              <a href="/" className="text-cyan-500 hover:underline">
                Sign in
              </a>
            </p>
            <button
              disabled={authing}
              onClick={signUpWithGoogle}
              className="w-full flex items-center justify-center gap-x-3 p-3 mt-3 border rounded-lg text-sm font-medium cursor-pointer text-white hover:bg-gray-100 hover:text-black transition duration-300 active:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_17_40)">
                  <path
                    d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                    fill="#4285F4"
                  />
                  <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                  <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                  <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                </g>
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
  </>
)

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
)

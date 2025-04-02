"use client"
import type React from "react"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { cn } from "@/lib/utils"

export default function SignInForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted")
  }
  return (
    <div className="w-full h-[100vh] flex justify-center p-10 bg-black">
        <div className="shadow-input mx-auto w-full max-w-md rounded-none  p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <h2 className="text-xl font-bold text-neutral-200">Welcome back to
                <span className="inline-block bg-gradient-to-b from-red-400 to-pink-500 px-2 rotate-[357deg] transform origin-center m-1 clip-triangle">
                 🐾Status Paw🐾
                </span>            
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-300">
                Sign in to get back to your account.
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-transparent text-white font-semibold text-sm border-2 border-neutral-400 cursor-pointer "
                    type="submit"
                    >
                    Log in &rarr;
                    <BottomGradient />
                </button>
                <p className="mt-4 text-sm text-neutral-300">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-cyan-500 hover:underline">
                    Create Account
                    </a>
                </p>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            </form>
        </div>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-1 w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}


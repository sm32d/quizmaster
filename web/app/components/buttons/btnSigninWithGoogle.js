"use client";
import { signIn } from "next-auth/react";
import { BrandGoogle } from "tabler-icons-react";
const SignInWithGoogle = () => {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="btn btn-wide btn-neutral"
    >
      <BrandGoogle size={20} /> Sign In With Google
    </button>
  );
};

export default SignInWithGoogle;
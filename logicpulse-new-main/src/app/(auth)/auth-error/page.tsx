"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthError() {
  const router = useRouter();
  const errorMessage = router.query.error;

  useEffect(() => {
    if (errorMessage) {
      console.error("Authentication Error:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{errorMessage || "An unknown error occurred."}</p>
      <a href="/login">Back to Login</a>
    </div>
  );
}

// app/verify/[token]/page.tsx
"use client";

import { useParams } from "next/navigation";
const VerifyPage = () => {
  const { token } = useParams();

  return (
    <div>
      <h1>Email Verification</h1>
      {token ? <p>Verifying with token: {token}</p> : <p>Loading...</p>}
    </div>
  );
};

export default VerifyPage;

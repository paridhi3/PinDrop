"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

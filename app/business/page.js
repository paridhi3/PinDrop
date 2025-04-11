// app/business/page.js
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import BusinessForm from "@/components/Business/Form";
import BusinessDashboard from "@/components/Business/Dashboard";
import { useLoader } from "@/context/LoaderContext";
import Loader from "@/components/Loader";

export default function Business() {
  const { data: session, status } = useSession();
  const [business, setBusiness] = useState(null);
  const router = useRouter();
  const { setLoading } = useLoader();

  useEffect(() => {
    const checkBusiness = async () => {
      if (status === "authenticated" && session?.user?.email) {
        setLoading(true);
        try {
          const res = await fetch(`/api/business/check?email=${session.user.email}`);
          const data = await res.json();
          setBusiness(data.business || null);
          console.log("page.js: data.business:", data.business);
        } catch (err) {
          console.error("Failed to check business:", err);
          setBusiness(null);
        } finally {
          setLoading(false);
        }
      }
    };

    checkBusiness();
  }, [session, status, setLoading]);

  // Redirect if authenticated but session.user is missing
  useEffect(() => {
    if (status === "authenticated" && !session?.user) {
      router.push("/");
    }
  }, [status, session, router]);

  // While loading session or fetching business info
  if (status === "loading" || (status === "authenticated" && business === null && !session?.user)) {
    return <Loader />;
  }

  // Don't render anything if no user (redirect already triggered)
  if (!session?.user) return null;

  return business ? (
    <BusinessDashboard business={business} />
  ) : (
    <BusinessForm onSuccess={setBusiness} />
  );
}

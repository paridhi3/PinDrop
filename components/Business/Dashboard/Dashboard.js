import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import DeleteAccount from "./DeleteAccount";
import Map from "./Map";
import UpdateForm from "./UpdateForm";

const BusinessDashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(
          `/api/business/check?email=${session.user.email}`
        );
        const data = await res.json();
        setBusiness(data.business);
      } catch (err) {
        console.error("Failed to fetch business:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) fetchBusiness();
  }, [session]);

  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-20 my-10 bg-white/70 backdrop-blur-md py-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Business Dashboard</h2>
      
      <div className="flex flex-col lg:flex-row gap-14">
        <div className="w-full lg:w-[35%]">
          <UpdateForm business={business} setBusiness={setBusiness} />
        </div>
        <div className="w-full lg:w-[65%]">
          <Map business={business} />
        </div>
      </div>

      <DeleteAccount />
    </div>
  );
};

export default BusinessDashboard;

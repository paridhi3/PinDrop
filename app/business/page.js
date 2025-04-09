'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import BusinessForm from '@/components/Business/Form';
import BusinessDashboard from '@/components/Business/Dashboard';
import { useLoader } from '@/context/LoaderContext';
import Loader from '@/components/Loader';

export default function Business() {
  const { data: session, status } = useSession();
  const [business, setBusiness] = useState(null); // ✅ Store the full object
  const router = useRouter();
  const { setLoading } = useLoader();

  useEffect(() => {
    const checkBusiness = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        setLoading(true);
        try {
          const res = await fetch(`/api/business/check?email=${session.user.email}`);
          const data = await res.json();
          setBusiness(data.business || null); // ✅ store business or null
        } catch (err) {
          console.error('Failed to check business:', err);
          setBusiness(null);
        } finally {
          setLoading(false);
        }
      }
    };

    checkBusiness();
  }, [session, status, setLoading]);

  if (status === 'loading' || (status === 'authenticated' && business === null)) {
    return <Loader />;
  }

  if (!session?.user) {
    router.push('/');
    return null;
  }

  return business
    ? <BusinessDashboard business={business} /> // ✅ pass down the business object
    : <BusinessForm onSuccess={setBusiness} />; // ✅ Form will provide new business
}

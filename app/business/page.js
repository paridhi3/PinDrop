// app/business/page.js
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
  const [businessExists, setBusinessExists] = useState(null);
  const router = useRouter();
  const { setLoading } = useLoader();

  useEffect(() => {
    const checkBusiness = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        setLoading(true); // 👈 show loader
        try {
          const res = await fetch(`/api/business/check?email=${session.user.email}`);
          const data = await res.json();
          setBusinessExists(data.exists);
        } catch (err) {
          console.error('Failed to check business:', err);
          setBusinessExists(false); // fallback to form
        } finally {
          setLoading(false); // 👈 hide loader
        }
      }
    };

    checkBusiness();
  }, [session, status, setLoading]);

  if (status === 'loading' || businessExists === null) {
    return <Loader />
  }


  if (!session?.user) {
    router.push('/');
    return null;
  }

  return businessExists
  ? <BusinessDashboard />
  : <BusinessForm onSuccess={() => setBusinessExists(true)} />;
}



import React from "react";
import { useSession, signOut } from "next-auth/react";

const DeleteAccount = () => {
  const { data: session } = useSession();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your business account?"))
      return;

    if (!session?.user?.email) {
      alert("User session not found");
      return;
    }

    try {
      const res = await fetch("/api/business/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (res.ok) {
        alert("Business deleted");
        signOut({ callbackUrl: "/" });
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting business");
    }
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded"
        onClick={handleDelete}
      >
        Delete Business Account
      </button>
    </div>
  );
};

export default DeleteAccount;

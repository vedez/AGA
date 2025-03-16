"use client";

import { useAuth } from "@/app/utils/AuthContext";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      router.push("/account");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      {currentUser ? (
        <div>
          <p className="mb-2"><strong>Email:</strong> {currentUser.email}</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
} 
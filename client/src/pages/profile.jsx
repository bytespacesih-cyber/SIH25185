import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Profile />
      </div>
    </div>
  );
}
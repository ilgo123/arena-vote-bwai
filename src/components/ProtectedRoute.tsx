import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface ProtectedRouteProps {
  requiredRole?: "voter" | "admin";
}

export default function ProtectedRoute({
  requiredRole = "voter",
}: ProtectedRouteProps) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 1. Kalau belum login, tendang ke Gate (Hard Redirect)
      if (!session) {
        window.location.replace("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("peserta")
        .select("role")
        .eq("email", session.user.email)
        .single();

      // 2. Kalau email gak ada di database, kick & hapus sesi
      if (error || !userData) {
        await supabase.auth.signOut();
        alert("Akses Ditolak: Email tidak terdaftar di The Arena.");
        window.location.replace("/login");
        return;
      }

      // 3. THE HACKER TRAP: Kalau Voter maksa masuk ke layar Admin
      if (requiredRole === "admin" && userData.role !== "admin") {
        console.warn("Unauthorized access detected. Kicking back to Arena...");
        window.location.replace("/dashboard"); // HARD REDIRECT! (Anti-nyangkut)
        return;
      }

      // 4. Lolos semua sensor
      setIsAllowed(true);
    };

    checkAccess();
  }, [requiredRole]);

  // Layar loading sementara sebelum keputusan diambil
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-bwai-bg flex items-center justify-center">
        <p className="text-bwai-googleBlue font-pixel animate-pulse text-sm tracking-widest">
          VERIFYING AGENT CLEARANCE...
        </p>
      </div>
    );
  }

  // Render halaman aslinya
  return <Outlet />;
}

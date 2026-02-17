import { useMemo, useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { useDealerStaffStore } from "@/store/dealerStaff";
import { useProfile } from "@/hooks/useProfile";
import { useStaff } from "./useStaff";
import { API_URL } from "@/lib/config";
import { getCredentials } from "@/lib/credential";

export type UserRole = "dealer" | "accountant" | "seller" | "hr";

export function useUserRole() {
  const { user } = useUserStore();
  const [role, setRole] = useState<UserRole>("dealer");
  const [isLoading, setIsLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const credential = await getCredentials();
      if (!credential?.access) {
        setRole("dealer");
        return;
      }

      const res = await fetch(`${API_URL}/dealers/staff/me`, {
        headers: {
          Authorization: `Bearer ${credential.access}`,
        },
      });

      if (res.ok) {
        const staff = await res.json();
        setRole(staff.role || "dealer");
      } else {
        setRole("dealer");
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      setRole("dealer");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.email) {
      fetchStaff();
    } else {
      setRole("dealer");
      setIsLoading(false);
    }
  }, [user.email]);

  // Refetch role when user changes or on focus
  useEffect(() => {
    const handleFocus = () => {
      fetchStaff();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user.email]);

  return { role, isLoading };
}

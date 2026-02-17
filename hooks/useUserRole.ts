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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("useEffect triggered, user.email:", user.email);
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const credential = await getCredentials();
        console.log("Credential:", credential);

        if (!credential?.access) {
          console.log("No access token found");
          setRole("dealer");
          return;
        }

        const res = await fetch(`${API_URL}/dealers/staff/me`, {
          headers: {
            Authorization: `Bearer ${credential.access}`,
          },
        });

        console.log("Response status:", res.status);

        if (res.ok) {
          const staff = await res.json();
          console.log("Staff:", staff);
          setRole(staff.role || "dealer");
        } else {
          console.log("Response not ok, defaulting to dealer");
          setRole("dealer");
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole("dealer");
      } finally {
        console.log("isLoading finished, setting to false");
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [user.email]);

  return { role, isLoading };
}

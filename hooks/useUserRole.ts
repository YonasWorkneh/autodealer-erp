import { useMemo, useEffect } from "react";
import { useUserStore } from "@/store/user";
import { useDealerStaffStore } from "@/store/dealerStaff";
import { useProfile } from "@/hooks/useProfile";

export type UserRole = "dealer" | "accountant" | "seller" | "hr";

export function useUserRole(): UserRole {
  const { user } = useUserStore();
  const staff = useDealerStaffStore((state) => state.staff);
  const { dealer } = useProfile();
  const fetchStaff = useDealerStaffStore((state) => state.fetchStaff);

  useEffect(() => {
    if (user.email) {
      fetchStaff().catch(() => {
        console.log("error getting staff");
      });
    }
  }, [user.email, fetchStaff]);

  const userRole = useMemo<UserRole>(() => {
    if (dealer?.role) {
      const dealerRole = dealer.role.toLowerCase();
      if (
        dealerRole === "hr" ||
        dealerRole === "dealer" ||
        dealerRole === "accountant" ||
        dealerRole === "seller"
      ) {
        return dealerRole as UserRole;
      }
      return "dealer";
    }

    if (user.is_staff) {
      return "hr";
    }

    const currentUserStaff = staff.find((s) => s.user.email === user.email);
    if (currentUserStaff) {
      if (currentUserStaff.role === "accountant") {
        return "accountant";
      }
      if (currentUserStaff.role === "seller") {
        return "seller";
      }
    }

    return "dealer";
  }, [user, staff, dealer]);

  return userRole;
}

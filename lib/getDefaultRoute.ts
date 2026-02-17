import { UserRole } from "@/hooks/useUserRole";

/**
 * Get the default route for a user based on their role
 */
export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case "accountant":
      return "/accounting";
    case "hr":
      return "/hr";
    case "seller":
      return "/listing"; // Cars listing page
    case "finance":
      return "/finance";
    case "dealer":
    default:
      return "/"; // Dashboard
  }
}

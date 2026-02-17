import { API_URL } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const { data: profile } = useQuery({
    queryKey: ["user-profile-detail"],
    queryFn: () => fetch(`${API_URL}/api/profile`).then((res) => res.json()),
  });
  return {
    profile,
  };
};

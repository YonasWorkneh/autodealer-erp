import { getProfile } from "@/lib/profileApi";
import { useQuery } from "@tanstack/react-query";

export function useProfileDetail() {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  return {
    profile,
    isLoadingProfile,
    profileError,
    refetchProfile,
  };
}

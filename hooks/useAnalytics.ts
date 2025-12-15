import { useAnalyticsStore } from "@/store/analytics";
import { useEffect } from "react";

export const useAnalytics = () => {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const isLoading = useAnalyticsStore((state) => state.isLoading);
  const topSellers = useAnalyticsStore((state) => state.topSellers);
  const highSaleCars = useAnalyticsStore((state) => state.highSaleCars);
  const error = useAnalyticsStore((state) => state.error);
  const getCarViewsAnalytics = useAnalyticsStore(
    (state) => state.getCarViewsAnalytics
  );
  const getDealerAnalytics = useAnalyticsStore(
    (state) => state.getDealerAnalytics
  );
  const getHighSaleCars = useAnalyticsStore((state) => state.getHighSaleCars);
  const getTopSellers = useAnalyticsStore((state) => state.getTopSellers);

  useEffect(() => {
    getCarViewsAnalytics();
    getDealerAnalytics();
  }, [getCarViewsAnalytics, getDealerAnalytics]);

  // By default load current month/year
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    getHighSaleCars(month, year);
    getTopSellers(month, year);
  }, [getHighSaleCars, getTopSellers]);

  return {
    analytics,
    isLoading,
    error,
    getCarViewsAnalytics,
    getDealerAnalytics,
    getHighSaleCars,
    getTopSellers,
    topSellers,
    highSaleCars,
  };
};

import { api } from "@/lib/api";
import { create } from "zustand";

interface CarView {
  car_id: number;
  car_make: string;
  car_model: string;
  total_unique_views: number;
  viewer_emails: string[];
}

interface ModelStats {
  make_name: string;
  model_name: string;
  total_sold: number;
  total_sales: number;
  avg_price: number;
}

interface DealerAnalytics {
  total_cars: number;
  sold_cars: number;
  average_price: number;
  model_stats: ModelStats[];
}

interface Analytics {
  carViews: CarView[];
  dealerAnalytics: DealerAnalytics | null;
}

interface HighSaleCar {
  car_details: string;
  sale_count: number;
  month: number;
  year: number;
}

interface TopSeller {
  user_email: string;
  total_sales: number;
  month: number;
  year: number;
}

interface AnalyticsState {
  analytics: Analytics;
  isLoading: boolean;
  error: string | null;
  topSellers: TopSeller[];
  highSaleCars: HighSaleCar[];
  getCarViewsAnalytics: () => Promise<void>;
  getDealerAnalytics: () => Promise<void>;
  getHighSaleCars: (month?: number, year?: number) => Promise<void>;
  getTopSellers: (month?: number, year?: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: {
    carViews: [],
    dealerAnalytics: null,
  },
  topSellers: [],
  highSaleCars: [],
  isLoading: false,
  error: null,
  getCarViewsAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<CarView[]>("/analytics/dealer-view-analytics/", {
        method: "GET",
      });
      set((state) => ({
        analytics: { ...state.analytics, carViews: res },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  getDealerAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<DealerAnalytics>("/analytics/dealer-analytics/", {
        method: "GET",
      });
      set((state) => ({
        analytics: { ...state.analytics, dealerAnalytics: res },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  getHighSaleCars: async (month?: number, year?: number) => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date();
      const params = new URLSearchParams();
      params.append("month", String(month ?? now.getMonth() + 1));
      params.append("year", String(year ?? now.getFullYear()));

      const res = await api<HighSaleCar[]>(
        `/analytics/high-sales-cars/?${params.toString()}`,
        {
          method: "GET",
        }
      );

      set((state) => ({
        highSaleCars: res,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching high sale cars:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  getTopSellers: async (month?: number, year?: number) => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date();
      const params = new URLSearchParams();
      params.append("month", String(month ?? now.getMonth() + 1));
      params.append("year", String(year ?? now.getFullYear()));

      const res = await api<TopSeller[]>(
        `/analytics/top-sellers/?${params.toString()}`,
        { method: "GET" }
      );
      console.log("Top sellers response:", res);
      set((state) => ({
        topSellers: res,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching top sellers:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

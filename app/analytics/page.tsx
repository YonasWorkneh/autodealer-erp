"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BarChart3, TrendingUp, Car, DollarSign, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const {
    analytics,
    topSellers,
    highSaleCars,
    isLoading,
    error,
    getTopSellers,
    getHighSaleCars,
  } = useAnalytics();
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analytics
            </h1>
            <p className="text-muted-foreground">
              View your dealership analytics and insights
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
            <label className="flex items-center gap-1">
              Month
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value) || month)}
                className="w-14 border rounded px-2 py-1 text-sm"
              />
            </label>
            <label className="flex items-center gap-1">
              Year
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value) || year)}
                className="w-16 border rounded px-2 py-1 text-sm"
              />
            </label>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                getTopSellers(month, year);
                getHighSaleCars(month, year);
              }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.dealerAnalytics?.total_cars || 0}
            </div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Cars</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.dealerAnalytics?.sold_cars || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.dealerAnalytics
                ? `$${analytics.dealerAnalytics.average_price.toLocaleString()}`
                : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">Per car</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.carViews.reduce(
                (sum, car) => sum + (car.total_unique_views || 0),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Car views</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Sellers */}
      {topSellers.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Top Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{seller.user_email}</p>
                    <p className="text-sm text-muted-foreground">
                      {seller.month}/{seller.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{seller.total_sales}</p>
                    <p className="text-xs text-muted-foreground">sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Sale Cars */}
      {highSaleCars.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>High Sale Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highSaleCars.map((car, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{car.car_details}</p>
                    <p className="text-sm text-muted-foreground">
                      {car.month}/{car.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{car.sale_count}</p>
                    <p className="text-xs text-muted-foreground">sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Stats */}
      {analytics.dealerAnalytics?.model_stats &&
        analytics.dealerAnalytics.model_stats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Model Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.dealerAnalytics.model_stats.map((model, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {model.make_name} {model.model_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Avg: ${model.avg_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{model.total_sold}</p>
                      <p className="text-xs text-muted-foreground">sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

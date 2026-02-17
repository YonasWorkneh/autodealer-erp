"use client";

import { FileText, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayslip } from "@/hooks/payslip";

interface PayslipItem {
  employee: number;
  gross_earnings: string;
  total_deductions: string;
  net_salary: string;
  earnings: string;
  deductions: string;
}

export default function PayslipPage() {
  console.log("Pay slip page reached");
  const { payslipData, isLoadingPayslip, payslipError, refetchPayslip } =
    usePayslip();

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? amount : `ETB ${num.toLocaleString()}`;
  };

  if (isLoadingPayslip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading payslip data...</p>
      </div>
    );
  }

  if (payslipError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading payslip data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Payslip
          </h1>
          <p className="text-muted-foreground">
            View your payroll payslip information and earnings details
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <Button
            onClick={() => refetchPayslip()}
            disabled={isLoadingPayslip}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Payslip Data */}
        {payslipData?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Payslip Data</h3>
              <p className="text-muted-foreground">
                No payslip information available at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {payslipData?.map((payslip: PayslipItem, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <CardTitle>Employee #{payslip.employee}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Earnings Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-3">
                        Earnings
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-green-50 rounded">
                          <span className="font-medium">Gross Earnings:</span>
                          <span className="font-bold text-green-700">
                            {formatCurrency(payslip.gross_earnings)}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground mb-1">
                            Earnings Details:
                          </p>
                          <p className="text-sm">{payslip.earnings}</p>
                        </div>
                      </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-3">
                        Deductions
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-red-50 rounded">
                          <span className="font-medium">Total Deductions:</span>
                          <span className="font-bold text-red-700">
                            {formatCurrency(payslip.total_deductions)}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground mb-1">
                            Deductions Details:
                          </p>
                          <p className="text-sm">{payslip.deductions}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary */}
                  <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-800">
                        Net Salary:
                      </span>
                      <span className="text-xl font-bold text-blue-800">
                        {formatCurrency(payslip.net_salary)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

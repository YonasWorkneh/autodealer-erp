"use client";

import { useState } from "react";
import {
  Plus,
  Play,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePayrollRuns } from "@/hooks/payrollRuns";
import { useToast } from "@/hooks/use-toast";

interface PayrollRun {
  id: number;
  period: string;
  status: "draft" | "running" | "completed" | "failed";
  created_at: string;
}

export default function FinancePage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const {
    payrollRuns,
    isLoadingPayrollRuns,
    payrollRunsError,
    createPayroll,
    runPayrollById,
    isCreatingPayroll,
    isRunningPayroll,
  } = usePayrollRuns();

  const handleCreatePayroll = async () => {
    try {
      const period = new Date().toISOString();
      await createPayroll(period);
      setShowCreateDialog(false);
      toast({
        title: "Payroll Succeess",
        variant: "success",
        description: "Payroll sucessfully created for the peirod.",
      });
    } catch (error) {
      console.error("Error creating payroll:", error);
      toast({
        title: "Failed to create payroll",
        variant: "destructive",
        description: "Please try again.",
      });
    }
  };

  const handleRunPayroll = async (id: number) => {
    try {
      await runPayrollById(id);
      toast({
        title: "Payroll run started successfully",
        variant: "success",
        description: "Payroll run started successfully.",
      });
    } catch (error) {
      console.error("Error running payroll:", error);
      toast({
        title: "Failed to run payroll",
        variant: "destructive",
        description: "Please try again.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "running":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Play className="h-3 w-3 mr-1" />
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoadingPayrollRuns) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading payroll data...</p>
      </div>
    );
  }

  if (payrollRunsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading payroll data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Finance Management
          </h1>
          <p className="text-muted-foreground">
            Manage payroll runs and financial operations
          </p>
        </div>

        {/* Payroll Runs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payroll Runs</CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage payroll processing schedules
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Payroll
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Payroll Run</DialogTitle>
                  <DialogDescription>
                    Create a new payroll run for the current period.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    A new payroll run will be created with the current timestamp
                    as the period.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePayroll}
                    disabled={isCreatingPayroll}
                  >
                    {isCreatingPayroll ? "Creating..." : "Create Payroll"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRuns?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No payroll runs found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create your first payroll run to get started
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollRuns?.map((payroll: PayrollRun) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">
                        {payroll.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(payroll.period).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payroll.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunPayroll(payroll.id)}
                          disabled={
                            payroll.status !== "draft" || isRunningPayroll
                          }
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {isRunningPayroll ? "Running..." : "Run Payroll"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

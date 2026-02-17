"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  MessageSquare,
  Trash2,
  FileUp,
  Filter,
  Settings2,
  ArrowRight,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Salary Component Type
interface SalaryComponent {
  id: number;
  name: string;
  component_type: "earning" | "deduction";
}

// Overtime Type
interface Overtime {
  id: number;
  overtime_type: string;
  hours: string;
  approved: boolean;
  date: string;
  created_at: string;
  employee: number;
}

interface Employee {
  id: number;
  user_email_display: string;
  full_name: string;
  hire_date: string;
  position: string;
  salary: string;
  is_active: boolean;
}

// Mock data matching the image
const mockEmployees = [
  {
    id: 303940,
    name: "Benjamin Thompson",
    hasMessage: true,
    basicSalary: 10500.0,
    healthInsurance: 600.0,
    totalSalary: 11100.0,
    totalAdditions: 1600.0,
    totalDeduction: 1400.0,
  },
  {
    id: 493039,
    name: "Emily Williams",
    hasMessage: false,
    basicSalary: 9500.0,
    healthInsurance: 800.0,
    totalSalary: 10300.0,
    totalAdditions: 1150.0,
    totalDeduction: 1520.0,
  },
  {
    id: 384729,
    name: "Michael Davis",
    hasMessage: true,
    basicSalary: 12000.0,
    healthInsurance: 700.0,
    totalSalary: 12700.0,
    totalAdditions: 2000.0,
    totalDeduction: 1800.0,
  },
  {
    id: 293847,
    name: "Sarah Johnson",
    hasMessage: true,
    basicSalary: 11000.0,
    healthInsurance: 650.0,
    totalSalary: 11650.0,
    totalAdditions: 1750.0,
    totalDeduction: 1650.0,
  },
  {
    id: 192837,
    name: "Matthew Brown",
    hasMessage: true,
    basicSalary: 10000.0,
    healthInsurance: 750.0,
    totalSalary: 10750.0,
    totalAdditions: 1400.0,
    totalDeduction: 1300.0,
    hasDetail: true,
  },
  {
    id: 485736,
    name: "Joseph Rodriguez",
    hasMessage: false,
    basicSalary: 9800.0,
    healthInsurance: 600.0,
    totalSalary: 10400.0,
    totalAdditions: 1200.0,
    totalDeduction: 1450.0,
  },
];

export default function PayrollPage() {
  const { toast } = useToast();
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalEmployees = 45;
  const totalAmount = 4304940.0;

  // Salary Components State
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>(
    [],
  );
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [showComponentDialog, setShowComponentDialog] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<SalaryComponent | null>(null);
  const [componentForm, setComponentForm] = useState({
    name: "",
    component_type: "earning" as "earning" | "deduction",
  });

  // Overtime State
  const [overtimeEntries, setOvertimeEntries] = useState<Overtime[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingOvertime, setIsLoadingOvertime] = useState(false);
  const [showOvertimeDialog, setShowOvertimeDialog] = useState(false);
  const [editingOvertime, setEditingOvertime] = useState<Overtime | null>(null);
  const [overtimeForm, setOvertimeForm] = useState({
    overtime_type: "1.5",
    hours: "",
    approved: false,
    date: new Date().toISOString().split("T")[0],
    employee: "",
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(mockEmployees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, id]);
    } else {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    }
  };

  const isAllSelected =
    selectedEmployees.length === mockEmployees.length &&
    mockEmployees.length > 0;
  const isIndeterminate =
    selectedEmployees.length > 0 &&
    selectedEmployees.length < mockEmployees.length;

  const totalPages = Math.ceil(totalEmployees / itemsPerPage);

  // Fetch Salary Components
  const fetchSalaryComponents = async () => {
    setIsLoadingComponents(true);
    try {
      const data = await api<SalaryComponent[]>("/hr/salary-components/", {
        method: "GET",
      });
      setSalaryComponents(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch salary components",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComponents(false);
    }
  };

  // Create or Update Salary Component
  const handleComponentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingComponent) {
        await api<SalaryComponent>(
          `/hr/salary-components/${editingComponent.id}/`,
          {
            method: "PATCH",
            body: componentForm,
          } as any,
        );
        toast({
          title: "Success",
          description: "Salary component updated successfully",
          variant: "success",
        });
      } else {
        await api<SalaryComponent>("/hr/salary-components/", {
          method: "POST",
          body: componentForm,
        } as any);
        toast({
          title: "Success",
          description: "Salary component created successfully",
          variant: "success",
        });
      }
      setShowComponentDialog(false);
      setEditingComponent(null);
      setComponentForm({ name: "", component_type: "earning" });
      fetchSalaryComponents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save salary component",
        variant: "destructive",
      });
    }
  };

  // Delete Salary Component
  const handleDeleteComponent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this salary component?")) {
      return;
    }
    try {
      await api(`/hr/salary-components/${id}/`, {
        method: "DELETE",
      });
      toast({
        title: "Success",
        description: "Salary component deleted successfully",
        variant: "success",
      });
      fetchSalaryComponents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete salary component",
        variant: "destructive",
      });
    }
  };

  // Handle Edit
  const handleEditComponent = (component: SalaryComponent) => {
    setEditingComponent(component);
    setComponentForm({
      name: component.name,
      component_type: component.component_type,
    });
    setShowComponentDialog(true);
  };

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const data = await api<Employee[]>("/hr/employees/", {
        method: "GET",
      });
      setEmployees(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch employees",
        variant: "destructive",
      });
    }
  };

  // Fetch Overtime Entries
  const fetchOvertime = async () => {
    setIsLoadingOvertime(true);
    try {
      const data = await api<Overtime[]>("/hr/overtime/", {
        method: "GET",
      });
      setOvertimeEntries(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch overtime entries",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOvertime(false);
    }
  };

  // Create or Update Overtime Entry
  const handleOvertimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        overtime_type: overtimeForm.overtime_type,
        hours: overtimeForm.hours,
        approved: overtimeForm.approved,
        date: overtimeForm.date,
        employee: parseInt(overtimeForm.employee),
      };

      if (editingOvertime) {
        await api<Overtime>(`/hr/overtime/${editingOvertime.id}/`, {
          method: "PATCH",
          body: payload,
        } as any);
        toast({
          title: "Success",
          description: "Overtime entry updated successfully",
          variant: "success",
        });
      } else {
        await api<Overtime>("/hr/overtime/", {
          method: "POST",
          body: payload,
        } as any);
        toast({
          title: "Success",
          description: "Overtime entry created successfully",
          variant: "success",
        });
      }
      setShowOvertimeDialog(false);
      setEditingOvertime(null);
      setOvertimeForm({
        overtime_type: "1.5",
        hours: "",
        approved: false,
        date: new Date().toISOString().split("T")[0],
        employee: "",
      });
      fetchOvertime();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save overtime entry",
        variant: "destructive",
      });
    }
  };

  // Delete Overtime Entry
  const handleDeleteOvertime = async (id: number) => {
    if (!confirm("Are you sure you want to delete this overtime entry?")) {
      return;
    }
    try {
      await api(`/hr/overtime/${id}/`, {
        method: "DELETE",
      });
      toast({
        title: "Success",
        description: "Overtime entry deleted successfully",
        variant: "success",
      });
      fetchOvertime();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete overtime entry",
        variant: "destructive",
      });
    }
  };

  // Handle Edit Overtime
  const handleEditOvertime = (overtime: Overtime) => {
    setEditingOvertime(overtime);
    setOvertimeForm({
      overtime_type: overtime.overtime_type,
      hours: overtime.hours,
      approved: overtime.approved,
      date: overtime.date,
      employee: overtime.employee.toString(),
    });
    setShowOvertimeDialog(true);
  };

  // Toggle Approval
  const handleToggleApproval = async (overtime: Overtime) => {
    try {
      await api<Overtime>(`/hr/overtime/${overtime.id}/`, {
        method: "PATCH",
        body: { approved: !overtime.approved },
      } as any);
      toast({
        title: "Success",
        description: `Overtime entry ${!overtime.approved ? "approved" : "unapproved"} successfully`,
        variant: "success",
      });
      fetchOvertime();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update approval status",
        variant: "destructive",
      });
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchSalaryComponents();
    fetchEmployees();
    fetchOvertime();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  Payroll Management
                </h1>
                <p className="text-muted-foreground">
                  Manage employee salaries, components, and overtime calculations
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Current Period</div>
              <div className="text-lg font-semibold text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees-salary" className="w-full">
          <TabsList className="mb-6 pt-4 px-4 h-fit flex justify-between items-center">
            <TabsTrigger
              value="employees-salary"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary cursor-pointer"
            >
              Employees Salary
            </TabsTrigger>
            <TabsTrigger
              value="components"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary cursor-pointer"
            >
              Components
            </TabsTrigger>
            <TabsTrigger
              value="overtime"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary cursor-pointer"
            >
              Overtime
            </TabsTrigger>
          </TabsList>

          {/* Employees Salary Tab */}
          <TabsContent value="employees-salary">
            {/* Top Control Bar */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employee by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Main Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-background">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      {/* Employee Details Header */}
                      <TableHead className="bg-background min-w-[200px]">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          className="mr-4"
                        />
                        Employee Details
                      </TableHead>
                      <TableHead className="bg-background min-w-[120px]">
                        ID
                      </TableHead>
                      <TableHead className="bg-background min-w-[200px]">
                        Name
                      </TableHead>

                      {/* Earnings Header */}
                      <TableHead
                        className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]"
                        colSpan={3}
                      >
                        <div className="flex items-center justify-between">
                          Earnings
                          <ChevronsLeft className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]">
                        Basic salary
                      </TableHead>
                      <TableHead className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]">
                        Overtime
                      </TableHead>
                      <TableHead className="bg-blue-50 dark:bg-blue-950/20 min-w-[150px]">
                        Total salary
                      </TableHead>

                      {/* Additions Header */}
                      <TableHead className="bg-green-50 dark:bg-green-950/20 min-w-[150px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            Additions +
                            <Plus className="h-4 w-4" />
                          </div>
                          <ChevronsLeft className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="bg-green-50 dark:bg-green-950/20 min-w-[150px]">
                        Total additions
                      </TableHead>

                      {/* Deductions Header */}
                      <TableHead className="bg-red-50 dark:bg-red-950/20 min-w-[150px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            Deductions +
                            <Plus className="h-4 w-4" />
                          </div>
                          <ChevronsLeft className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="bg-red-50 dark:bg-red-950/20 min-w-[150px]">
                        Total deduction
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmployees.map((employee) => (
                      <TableRow key={employee.id} className="border-b">
                        {/* Employee Details */}
                        <TableCell className="bg-background">
                          <Checkbox
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={(checked) =>
                              handleSelectEmployee(
                                employee.id,
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="bg-background font-medium">
                          {employee.id}
                        </TableCell>
                        <TableCell className="bg-background">
                          <div className="flex items-center gap-2">
                            {employee.name}
                            {employee.hasMessage ? (
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>

                        {/* Earnings Section Header */}
                        <TableCell className="bg-blue-50 dark:bg-blue-950/20"></TableCell>

                        {/* Earnings */}
                        <TableCell className="bg-blue-50 dark:bg-blue-950/20">
                          {employee.basicSalary.toFixed(2)}
                        </TableCell>
                        <TableCell className="bg-blue-50 dark:bg-blue-950/20">
                          {employee.healthInsurance.toFixed(2)}
                        </TableCell>
                        <TableCell className="bg-blue-50 dark:bg-blue-950/20 font-medium">
                          {employee.totalSalary.toFixed(2)}
                        </TableCell>

                        {/* Additions Section Header */}
                        <TableCell className="bg-green-50 dark:bg-green-950/20"></TableCell>

                        {/* Additions */}
                        <TableCell className="bg-green-50 dark:bg-green-950/20 font-medium">
                          {employee.totalAdditions.toFixed(2)}
                        </TableCell>

                        {/* Deductions Section Header */}
                        <TableCell className="bg-red-50 dark:bg-red-950/20"></TableCell>

                        {/* Deductions */}
                        <TableCell className="bg-red-50 dark:bg-red-950/20">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {employee.totalDeduction.toFixed(2)}
                            </span>
                            {employee.hasDetail && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                >
                                  Detail
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="border-t bg-muted/30 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                {/* Left side - Summary and Pagination */}
                <div className="flex flex-col gap-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      Total employees {totalEmployees}
                    </span>
                    {" • "}
                    <span className="font-medium">
                      Total amount $
                      {totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {1 + (currentPage - 1) * itemsPerPage}-
                      {Math.min(currentPage * itemsPerPage, totalEmployees)} of{" "}
                      {totalEmployees} results
                    </span>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from(
                        { length: Math.min(7, totalPages) },
                        (_, i) => {
                          if (i === 0) {
                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === 1 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                className="min-w-[40px]"
                              >
                                01
                              </Button>
                            );
                          } else if (i === 6 && totalPages > 7) {
                            return (
                              <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                disabled
                                className="min-w-[40px]"
                              >
                                ...
                              </Button>
                            );
                          } else if (i === 6) {
                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === totalPages
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                className="min-w-[40px]"
                              >
                                {String(totalPages).padStart(2, "0")}
                              </Button>
                            );
                          } else {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="min-w-[40px]"
                              >
                                {String(pageNum).padStart(2, "0")}
                              </Button>
                            );
                          }
                        },
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right side - Total and Submit */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      $
                      {totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Submit payroll
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components">
            <Card className="border border-border rounded-lg bg-transparent overflow-hidden shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Salary Components</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage salary components used in payroll calculations
                  </p>
                </div>
                <Dialog
                  open={showComponentDialog}
                  onOpenChange={setShowComponentDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingComponent(null);
                        setComponentForm({
                          name: "",
                          component_type: "earning",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Component
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingComponent
                          ? "Edit Salary Component"
                          : "Add New Salary Component"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingComponent
                          ? "Update the salary component details below."
                          : "Create a new salary component that can be assigned to employees."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleComponentSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Component Name</Label>
                          <Input
                            id="name"
                            value={componentForm.name}
                            onChange={(e) =>
                              setComponentForm({
                                ...componentForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., Basic Salary, Health Insurance"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="component_type">Component Type</Label>
                          <Select
                            value={componentForm.component_type}
                            onValueChange={(value: "earning" | "deduction") =>
                              setComponentForm({
                                ...componentForm,
                                component_type: value,
                              })
                            }
                          >
                            <SelectTrigger id="component_type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="earning">Earning</SelectItem>
                              <SelectItem value="deduction">
                                Deduction
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowComponentDialog(false);
                            setEditingComponent(null);
                            setComponentForm({
                              name: "",
                              component_type: "earning",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingComponent ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoadingComponents ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : salaryComponents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No salary components found
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingComponent(null);
                        setComponentForm({
                          name: "",
                          component_type: "earning",
                        });
                        setShowComponentDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Component
                    </Button>
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salaryComponents.map((component) => (
                          <TableRow key={component.id}>
                            <TableCell className="font-medium">
                              {component.id}
                            </TableCell>
                            <TableCell>{component.name}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  component.component_type === "earning"
                                    ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                                    : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                }`}
                              >
                                {component.component_type === "earning"
                                  ? "Earning"
                                  : "Deduction"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditComponent(component)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteComponent(component.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overtime Tab */}
          <TabsContent value="overtime">
            <Card className="border border-border rounded-lg bg-transparent overflow-hidden shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Overtime Entries</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage overtime entries for employees. Finance users may audit and approve.
                  </p>
                </div>
                <Dialog open={showOvertimeDialog} onOpenChange={setShowOvertimeDialog}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingOvertime(null);
                        setOvertimeForm({
                          overtime_type: "1.5",
                          hours: "",
                          approved: false,
                          date: new Date().toISOString().split("T")[0],
                          employee: "",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Overtime Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingOvertime
                          ? "Edit Overtime Entry"
                          : "Add New Overtime Entry"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingOvertime
                          ? "Update the overtime entry details below."
                          : "Create a new overtime entry for an employee."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleOvertimeSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="employee">Employee</Label>
                          <Select
                            value={overtimeForm.employee}
                            onValueChange={(value) =>
                              setOvertimeForm({
                                ...overtimeForm,
                                employee: value,
                              })
                            }
                            required
                          >
                            <SelectTrigger id="employee">
                              <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees
                                .filter((emp) => emp.is_active)
                                .map((employee) => (
                                  <SelectItem
                                    key={employee.id}
                                    value={employee.id.toString()}
                                  >
                                    {employee.full_name} ({employee.position})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={overtimeForm.date}
                              onChange={(e) =>
                                setOvertimeForm({
                                  ...overtimeForm,
                                  date: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="hours">Hours</Label>
                            <Input
                              id="hours"
                              type="number"
                              step="0.5"
                              min="0"
                              value={overtimeForm.hours}
                              onChange={(e) =>
                                setOvertimeForm({
                                  ...overtimeForm,
                                  hours: e.target.value,
                                })
                              }
                              placeholder="e.g., 8.5"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="overtime_type">Overtime Type (Multiplier)</Label>
                          <Select
                            value={overtimeForm.overtime_type}
                            onValueChange={(value) =>
                              setOvertimeForm({
                                ...overtimeForm,
                                overtime_type: value,
                              })
                            }
                          >
                            <SelectTrigger id="overtime_type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.5">1.5x (Time and a Half)</SelectItem>
                              <SelectItem value="2.0">2.0x (Double Time)</SelectItem>
                              <SelectItem value="2.5">2.5x</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="approved">Approved</Label>
                            <p className="text-xs text-muted-foreground">
                              Mark this overtime entry as approved
                            </p>
                          </div>
                          <Switch
                            id="approved"
                            checked={overtimeForm.approved}
                            onCheckedChange={(checked) =>
                              setOvertimeForm({
                                ...overtimeForm,
                                approved: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowOvertimeDialog(false);
                            setEditingOvertime(null);
                            setOvertimeForm({
                              overtime_type: "1.5",
                              hours: "",
                              approved: false,
                              date: new Date().toISOString().split("T")[0],
                              employee: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingOvertime ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoadingOvertime ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : overtimeEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No overtime entries found
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingOvertime(null);
                        setOvertimeForm({
                          overtime_type: "1.5",
                          hours: "",
                          approved: false,
                          date: new Date().toISOString().split("T")[0],
                          employee: "",
                        });
                        setShowOvertimeDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Entry
                    </Button>
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overtimeEntries.map((entry) => {
                          const employee = employees.find(
                            (emp) => emp.id === entry.employee
                          );
                          return (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">
                                {employee?.full_name || `Employee #${entry.employee}`}
                              </TableCell>
                              <TableCell>
                                {new Date(entry.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{entry.hours} hrs</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
                                  {entry.overtime_type}x
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={entry.approved}
                                    onCheckedChange={() =>
                                      handleToggleApproval(entry)
                                    }
                                  />
                                  <span
                                    className={`text-xs ${
                                      entry.approved
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {entry.approved ? "Approved" : "Pending"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(entry.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditOvertime(entry)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteOvertime(entry.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

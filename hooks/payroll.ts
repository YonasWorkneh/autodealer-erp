import { useQuery } from "@tanstack/react-query";
import { getSalaryComponents } from "@/lib/payroll";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const useSalaryCpts = () => {
  const { toast } = useToast();
  const {
    data: salaryCpts,
    isLoading: isLoadingSalaryComponents,
    error: salaryCptErr,
    refetch: refetchSalaryCpts,
  } = useQuery({
    queryKey: ["salary-components"],
    queryFn: () => getSalaryComponents(),
  });

  useEffect(() => {
    if (salaryCptErr) {
      toast({
        title: "Error",
        description: "Failed to fetch salary components",
        variant: "destructive",
      });
    }
  }, [salaryCptErr, toast]);

  return {
    salaryCpts,
    isLoadingSalaryComponents,
    salaryCptErr,
    refetchSalaryCpts,
  };
};

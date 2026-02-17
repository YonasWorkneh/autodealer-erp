import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPayrollRuns, createPayrollRun, runPayroll } from "@/lib/payroll";

export const usePayrollRuns = () => {
  const queryClient = useQueryClient();

  const {
    data: payrollRuns,
    isLoading: isLoadingPayrollRuns,
    error: payrollRunsError,
  } = useQuery({
    queryKey: ["payroll-runs"],
    queryFn: () => getPayrollRuns(),
  });

  const createPayrollMutation = useMutation({
    mutationFn: (period: string) => createPayrollRun(period),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
    },
  });

  const runPayrollMutation = useMutation({
    mutationFn: (id: number) => runPayroll(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
    },
  });

  const createPayroll = async (period: string) => {
    return createPayrollMutation.mutateAsync(period);
  };

  const runPayrollById = async (id: number) => {
    return runPayrollMutation.mutateAsync(id);
  };

  return {
    payrollRuns,
    isLoadingPayrollRuns,
    payrollRunsError,
    createPayroll,
    runPayrollById,
    isCreatingPayroll: createPayrollMutation.isPending,
    isRunningPayroll: runPayrollMutation.isPending,
  };
};

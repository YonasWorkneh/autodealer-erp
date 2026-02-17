import { useQuery } from "@tanstack/react-query";
import { getSalaryComponents } from "@/lib/payroll";

export const useSalaryCpts = () => {
  const {
    data: salaryCpts,
    isLoading: isLoadingSalaryComponents,
    error: salaryCptErr,
    refetch: refetchSalaryCpts,
  } = useQuery({
    queryKey: ["salary-components"],
    queryFn: () => getSalaryComponents(),
  });
  return {
    salaryCpts,
    isLoadingSalaryComponents,
    salaryCptErr,
    refetchSalaryCpts,
  };
};

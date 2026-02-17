import { API_URL } from "./config";
import { getCredentials } from "./credential";

export const createSalaryComponent = async (
  name: string,
  component_type: string,
) => {
  const credential = await getCredentials();
  const { access } = credential;
  try {
    const response = await fetch(`${API_URL}/hr/salary-components`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({
        name,
        component_type,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create salary component");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getSalaryComponents = async () => {
  try {
    const credential = await getCredentials();
    const { access } = credential;
    const response = await fetch(`${API_URL}/hr/salary-components`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch salary components");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const assignSalaryComponent = async (
  employee: number,
  component: number,
  amount: number,
) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/hr/employee-salaries/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      employee,
      component,
      amount,
    }),
  });
  return response.json();
};

export const createOvertime = async (
  employee: number,
  overtime_type: string,
  hours: number,
  approved: boolean,
  date: string,
) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/hr/overtime`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      overtime_type,
      hours,
      approved,
      date,
    }),
  });
  return response.json();
};

export const getPayrollRuns = async () => {
  try {
    const credential = await getCredentials();
    const { access } = credential;
    const response = await fetch(`${API_URL}/payroll/payroll-runs`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch payroll runs");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createPayrollRun = async (period: string) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/payroll/payroll-runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      period,
    }),
  });
  return response.json();
};

export const runPayroll = async (id: number) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/payroll/payroll-runs/${id}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return response.json();
};

export const getPayslip = async () => {
  try {
    const credential = await getCredentials();
    const { access } = credential;
    const response = await fetch(`${API_URL}/payroll/payslips`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch payslip");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

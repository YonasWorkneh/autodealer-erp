import { API_URL } from "./config";
import { getCredentials } from "./credential";

export const createSalaryComponent = async (
  name: string,
  component_type: string,
) => {
  const response = await fetch(`${API_URL}/hr/salary-components`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      component_type,
    }),
  });
  return response.json();
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
    console.error(error);
    return [];
  }
};

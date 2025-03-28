import { jwtDecode } from 'jwt-decode';

export const getRoleFromToken = (accessToken) => {
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      return decoded.role;
    } catch (error) {
      console.error("Invalid token:", error);
      return "user";
    }
  }
  return "user";
};

// Fetch role from backend
export const fetchUserRole = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/getUserRole`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch role");
    const data = await response.json();
    return data.role;
  } catch (error) {
    console.error("Error fetching role:", error);
    return "user";
  }
};

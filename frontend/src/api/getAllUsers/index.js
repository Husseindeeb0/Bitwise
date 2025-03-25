const getAllUsers = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/getAllUsers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch users: ${response.status}`
      );
    }
    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

export default getAllUsers;

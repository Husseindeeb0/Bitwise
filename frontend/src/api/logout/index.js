const logout = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data.message || "Logout failed!");
      throw new Error(data.message || "Logout failed!");
    }

    if (data.status === "failed") {
      return false;
    }

    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default logout;

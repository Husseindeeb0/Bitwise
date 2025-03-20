const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token found!");
      return false;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data.message || "Authentication failed!");
      throw new Error(data.message || "Authentication failed!");
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

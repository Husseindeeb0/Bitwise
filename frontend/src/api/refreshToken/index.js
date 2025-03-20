const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken")
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ refreshToken }`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data.message || 'Authentication failed!');
      throw new Error(data.message || 'Authentication failed!');
    }

    if (data.status === "failed") {
      return false;
    }

    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

export default refreshToken;

const checkTokenValidity = async (accessToken) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verifyJWT`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

    return true;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

export default checkTokenValidity;

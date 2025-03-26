const changeUserRole = async (accessToken, userId, newRole) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/user/changeUserRole`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ newRole, userId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch users: ${response.status}`
    );
  }
  const data = await response.json();

  return data;
};

export default changeUserRole;

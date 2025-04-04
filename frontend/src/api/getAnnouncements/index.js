const getAnnouncements = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/announcements/getAnnouncements`,
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
        errorData.message || `Failed to fetch announcements: ${response.status}`
      );
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    throw error;
  }
};

export default getAnnouncements;

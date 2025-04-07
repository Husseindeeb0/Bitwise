const deleteAnnouncements = async (id, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/announcements/deleteAnnouncements`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id }),
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
    console.error("Error deleting announcement:", error);
    throw error;
  }
};

export default deleteAnnouncements;

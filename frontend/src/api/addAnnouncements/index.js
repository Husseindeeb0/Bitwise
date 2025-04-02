const addAnnouncements = async (newAnnouncement, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/addAnnouncements`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ newAnnouncement }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // hanlde error with json and different format
      throw new Error(
        errorData.message || `Failed to fetch announcements: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.errpr("Error adding announcement:", error);
    throw error;
  }
};

export default addAnnouncements;

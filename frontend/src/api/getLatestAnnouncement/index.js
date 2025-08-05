const getLatestAnnouncement = async (accessToken) => {
  console.log(import.meta.env.VITE_API_URL);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/announcements/getLatestAnnouncement`,
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
    console.log(error);
  }
};

export default getLatestAnnouncement;
const authenticateUser = async (userDetails, action) => {
  const url = `${import.meta.env.VITE_API_URL}/auth/${action}`; // Dynamic URL based on action (signup or login)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data.message || 'Authentication failed!');
      throw new Error(data.message || 'Authentication failed!');
    }

    return data;
  } catch (error) {
    console.error('Error:', error.message || 'Unknown error occurred');
    throw error;
  }
};

export default authenticateUser;

export const getEmbedUrl = (url) => {
  // YouTube watch link
  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1].split("&")[0];
    console.log(url);
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`;
  }

  // YouTube short URL (youtu.be/...)
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&modestbranding=1&rel=0&end=60`;
  }

  // Google Drive file link
  if (url.includes("drive.google.com")) {
    let fileId = "";

    if (url.includes("/file/d/")) {
      fileId = url.split("/file/d/")[1].split("/")[0];
    } else if (url.includes("open?id=")) {
      fileId = url.split("open?id=")[1].split("&")[0];
    }

    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview?autoplay=1&mute=1`;
    }
  }

  // if not drive or youtube url return it directly
  return url;
};

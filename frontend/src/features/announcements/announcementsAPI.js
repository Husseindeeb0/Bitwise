import { axiosInstance } from "../../lib/axios";

export const addAnnouncementsAPI = (newAnnouncement) =>
  axiosInstance.post("/announcements/addAnnouncements", { newAnnouncement });
export const editAnnouncementsAPI = (updatedAnnouncement) =>
  axiosInstance.patch("/announcements/editAnnouncements", {
    updatedAnnouncement,
  });
export const deleteAnnouncementsAPI = (id) =>
  axiosInstance.delete(`/announcements/deleteAnnouncements/${id}`);
export const getAnnouncementsAPI = () =>
  axiosInstance.get("/announcements/getAnnouncements");
export const getAnnouncementsByIdAPI = (id) =>
  axiosInstance.get(`/announcements/getAnnouncementsById/${id}`);
export const getLatestAnnouncementAPI = () =>
  axiosInstance.get("/announcements/getLatestAnnouncement");

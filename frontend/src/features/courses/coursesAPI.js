import { axiosInstance } from "../../lib/axios";

export const addCourseAPI = (newCourse) =>
  axiosInstance.post("/courses/addCourse", { newCourse });
export const editCourseAPI = (updatedCourse) =>
  axiosInstance.patch("/courses/editCourse", {
    updatedCourse,
  });
export const deleteCourseAPI = (id) =>
  axiosInstance.delete(`/courses/deleteCourse/${id}`);
export const getCoursesAPI = () =>
  axiosInstance.get("/courses/getCourses");
export const getCourseByIdAPI = (id) =>
  axiosInstance.get(`/courses/getCourseById/${id}`);
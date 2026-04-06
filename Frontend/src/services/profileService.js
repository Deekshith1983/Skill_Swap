import API from "./api";

export const getMyProfile = () => API.get("/profile/me");
export const getProfileById = (id) => API.get(`/profile/${id}`);
export const updateProfile = (id, data) => API.put(`/profile/${id}`, data);
export const uploadProfilePic = (file) => {
  const formData = new FormData();
  formData.append("profilePic", file);
  return API.patch("/profile/me/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export default API;

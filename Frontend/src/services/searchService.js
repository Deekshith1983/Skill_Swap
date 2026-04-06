import API from "./api";

export const searchUsers = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return API.get(`/search?${queryString}`);
};

export const getSkillSuggestions = (q) => API.get("/search/suggestions", { params: { q } });

export default API;

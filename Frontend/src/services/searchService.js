import API from "./api";

export const searchUsers = (params) => {
  // Filter out undefined values
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );
  const queryString = new URLSearchParams(filteredParams).toString();
  console.log("Search API call:", `/search?${queryString}`);
  return API.get(`/search?${queryString}`);
};

export const getSkillSuggestions = (q) => API.get("/search/suggestions", { params: { q } });

export default API;

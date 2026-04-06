import API from "./api";

export const getComplementaryMatches = () => API.get("/match");

export default API;

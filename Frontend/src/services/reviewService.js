import API from "./api";

export const addReview = (sessionId, score, feedback) =>
  API.post(`/reviews/${sessionId}/add`, { score, feedback });

export default API;

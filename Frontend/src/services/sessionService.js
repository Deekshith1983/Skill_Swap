import API from "./api";

export const createSession = (sessionId, dateTime, durationMins, note) =>
  API.post("/sessions/create", { sessionId, dateTime, durationMins, note });

export const getMySessions = () => API.get("/sessions/mine");
export const getSessionById = (id) => API.get(`/sessions/${id}`);

export const updateSessionStatus = (id, status, dateTime, durationMins) => {
  const payload = { status };
  if (dateTime) payload.dateTime = dateTime;
  if (durationMins !== undefined) payload.durationMins = durationMins;
  return API.patch(`/sessions/${id}/status`, payload);
};

// Dedicated reschedule endpoint (allows unlimited reschedules)
export const rescheduleSession = (id, dateTime, durationMins) =>
  API.patch(`/sessions/${id}/reschedule`, { dateTime, durationMins });

export const submitReview = (sessionId, score, feedback) =>
  API.post(`/sessions/${sessionId}/review`, { score, feedback });

export default API;

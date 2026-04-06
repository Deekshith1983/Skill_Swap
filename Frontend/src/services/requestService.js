import API from "./api";

export const sendRequest = (toUserId, skillOffered, skillNeeded) =>
  API.post("/requests/send", { toUserId, skillOffered, skillNeeded });

export const getIncomingRequests = () => API.get("/requests/incoming");
export const getSentRequests = () => API.get("/requests/sent");

export const acceptRequest = (id) => API.put(`/requests/${id}/accept`);
export const rejectRequest = (id) => API.put(`/requests/${id}/reject`);

// Check if there's an accepted request between two users
export const getAcceptedRequest = (userId) =>
  API.get(`/requests/accepted/${userId}`);

export default API;

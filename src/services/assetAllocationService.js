import api from "./api";

export const getAllocations = () =>
  api.get("/asset-allocations");

export const getAllocation = (id) =>
  api.get(`/asset-allocations/${id}`);

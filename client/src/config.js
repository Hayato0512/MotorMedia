import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "https://motor-media-api.herokuapp.com/api",
  baseURL: "http://localhost:8800/api/",
});

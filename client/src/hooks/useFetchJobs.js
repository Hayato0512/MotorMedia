import { useState, useEffect, useCallback } from "react";

import { axiosInstance } from "../config";
import { logMessage } from "../util/logging";

//My First Custom Hook!!! ^...^
const useFetchJobs = (currentUser, tags) => {
  const [jobList, setJobList] = useState([]);

  const fetchJobs = useCallback(async () => {
    try {
      if (tags.length == 0) {
        const res = await axiosInstance.get("/jobs/alljobs");
        setJobList(res.data);
      } else {
        const res = await axiosInstance.post("/jobs/tags", { tags });
        setJobList(res.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }, [currentUser, tags]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    logMessage(
      `tags changed in useFetchJobs : ${tags}`,
      "INFO",
      "useFetchJobs"
    );
  }, [tags]);

  return { jobList, setJobList };
};

export default useFetchJobs;

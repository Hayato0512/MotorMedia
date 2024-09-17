import { useState, useEffect, useCallback } from "react";

import { axiosInstance } from "../config";

//My First Custom Hook!!! ^...^
const useFetchQuestions = (currentUser, tags) => {
  const [questionList, setQuestionList] = useState([]);

  const fetchQuestions = useCallback(async () => {
    try {
      if (tags.length == 0) {
        const res = await axiosInstance.get(
          "/questions/feed/" + currentUser._id
        );
        setQuestionList(res.data);
      } else {
        const res = await axiosInstance.post("/questions/tags", { tags });
        setQuestionList(res.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }, [currentUser, tags]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return { questionList, setQuestionList };
};

export default useFetchQuestions;

import { React, useEffect, useState, useCallback } from "react";
import "../../pages/QuestionForum/questionForum.css";
import { TextField, List, ListItem, ListItemButton } from "@mui/material";
import { axiosInstance } from "../../config";
import debounce from "lodash.debounce"; // Install lodash for debounce functionality
import { useNavigate } from "react-router-dom";

export default function QuestionTextSearch({ onChange }) {
  const [tagTextFieldValue, setTagTextFieldValue] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Matching tag suggestions
  const [cache, setCache] = useState({}); // to store input

  const navigate = useNavigate();

  // Debounced function to handle input changes
  const debouncedFetchQuestions = debounce(async (value) => {
    if (value.trim()) {
      if (cache[value]) {
        console.log(
          "QuestionTextSearch: since the input already exist in the cache, no need to make api calls. "
        );
        setSuggestions(cache[value]);
        return;
      }

      try {
        //here, no need to make a new schema, directly intertact with Question Schema. and actually fetch question.
        // so that on click of those suggestion, we directly jump into the questionDetail page.
        const response = await axiosInstance.get(
          `/questions/suggest?search=${value}`
        );

        // just in case let's keep the cache logic. user input -> delete some input -> come back to the same input -> just get them from cache
        setCache((prevCache) => ({
          ...prevCache,
          [value]: response.data,
        }));
        console.log(
          "TagSearch: since newly input tag wasn't in cache, just added in the cache",
          [value],
          response.data
        );
        setSuggestions(response.data); // Assuming response.data contains the matched tags
      } catch (err) {
        console.error("Error fetching tag suggestions", err);
      }
    } else {
      setSuggestions([]);
    }
  }, 300); // 300ms debounce

  //keep this, as if cache hasn't change, no need to re-create the debounce fetch function.
  const memoizedFetchQuestions = useCallback(
    (value) => debouncedFetchQuestions(value),
    [cache]
  );

  // Effect to fetch suggestions when the input changes
  useEffect(() => {
    memoizedFetchQuestions(tagTextFieldValue);
    return () => debouncedFetchQuestions.cancel(); // Cleanup debounce on unmount
  }, [tagTextFieldValue]);

  const selectSuggestion = (id) => {
    //directly take the user to the QuestionDetail page here
    navigate("/questionDetail", { state: { questionId: id } });
  };

  return (
    <div className="questionForumTagsContainer">
      <TextField
        id="outlined-multiline-flexible"
        label="Search"
        multiline
        value={tagTextFieldValue}
        fullWidth
        onChange={(e) => setTagTextFieldValue(e.target.value)}
        sx={{
          height: "40px", // Set the height of the TextField
          "& .MuiOutlinedInput-root": {
            height: "100%", // Ensure the outlined input field takes the full height
            alignItems: "flex-start", // Aligns the input content to the top
          },
          "& .MuiOutlinedInput-input": {
            height: "100%", // Ensure the input area takes the full height
            overflowY: "scroll", // Enable vertical scrolling for overflowing content
            boxSizing: "border-box", // Ensure padding is considered inside the height
          },
        }}
      ></TextField>

      {/* Render suggestions below the input */}
      {suggestions.length > 0 && (
        <List
          sx={{
            maxHeight: "100px",
            overflowY: "auto",
            border: "1px solid lightgray",
          }}
        >
          {suggestions.map((suggestion) => (
            <ListItem key={suggestion._id}>
              <ListItemButton onClick={() => selectSuggestion(suggestion._id)}>
                {suggestion.title}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}

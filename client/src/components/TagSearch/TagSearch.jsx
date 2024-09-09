import {
  React,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import "../../pages/QuestionForum/questionForum.css";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { TextField, List, ListItem, ListItemButton } from "@mui/material";
import { axiosInstance } from "../../config";
import debounce from "lodash.debounce"; // Install lodash for debounce functionality

export default function TagSearch({ onChange }) {
  const [tags, setTags] = useState([]); //so I need these tags here, to show the chips. but also I wanna let the parent component
  // know that the tag is changed as well as the new set of tags. how should I do it?
  const [tagTextFieldValue, setTagTextFieldValue] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Matching tag suggestions
  const [cache, setCache] = useState({}); // to store input

  // Debounced function to handle input changes
  const debouncedFetchTags = debounce(async (value) => {
    if (value.trim()) {
      if (cache[value]) {
        console.log(
          "TagSearch: since the input already exist in the cache, no need to make api calls. "
        );
        setSuggestions(cache[value]);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/tags/suggest?search=${value}`
        );

        //asdfasdf
        for (let suggestion of response.data) {
          if (suggestion.name.trim() == tagTextFieldValue.trim()) {
            response.data = response.data.filter(
              (name) => name.trim() != tagTextFieldValue.trim
            );
          }
        }

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

  const memoizedFetchTags = useCallback(
    (value) => debouncedFetchTags(value),
    [cache]
  );

  // Effect to fetch suggestions when the input changes
  useEffect(() => {
    memoizedFetchTags(tagTextFieldValue);
    return () => debouncedFetchTags.cancel(); // Cleanup debounce on unmount
  }, [tagTextFieldValue]);

  const addTag = (value) => {
    if (value.trim() && !tags.includes(value)) {
      setTags((prevTags) => [...prevTags, value]);
      onChange([...tags, value]); // to let QuestionForum.jsx know that tag has changed
      setTagTextFieldValue(""); // Clear the input after adding a tag
      setSuggestions([]); // Clear suggestions after adding the tag
    }
  };

  const handleTagDeletion = (tagToDelete) => {
    console.log("QuestionDialog: before setTag, tags are like this , ", tags);
    onChange([...tags].filter((tag) => tag !== tagToDelete));
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    console.log("QuestionDialog: after setTag, tags are like this , ", tags);
    // setOpen(false);
  };

  const selectSuggestion = (tag) => {
    // setTagTextFieldValue(tag); // Fill the input with the selected tag
    addTag(tag);
    // setSuggestions([]); // Hide suggestions after selecting
  };

  return (
    <div className="questionForumTagsContainer">
      <Stack direction="row" spacing={1}>
        {tags.map((tag) => (
          <Chip key={tag} label={tag} onDelete={() => handleTagDeletion(tag)} />
        ))}
      </Stack>

      <TextField
        id="outlined-multiline-flexible"
        label="tags"
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
              <ListItemButton onClick={() => selectSuggestion(suggestion.name)}>
                {suggestion.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <Button onClick={() => addTag(tagTextFieldValue)}>Add Tag</Button>
    </div>
  );
}

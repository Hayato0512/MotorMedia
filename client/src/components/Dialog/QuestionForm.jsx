// QuestionForm.jsx
import * as React from "react";
import { TextField } from "@mui/material";
import TagSearch from "../TagSearch/TagSearch";

export default function QuestionForm({
  title,
  setTitle,
  body,
  setBody,
  tags,
  setTags,
}) {
  return (
    <>
      <TextField
        autoFocus
        required
        margin="dense"
        label="Question Title"
        fullWidth
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        id="outlined-multiline-flexible"
        label="Question Body"
        multiline
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
        sx={{
          height: "200px",
          "& .MuiOutlinedInput-root": {
            height: "100%",
            alignItems: "flex-start",
          },
          "& .MuiOutlinedInput-input": {
            height: "100%",
            overflowY: "scroll",
            boxSizing: "border-box",
          },
        }}
      />
      <TagSearch onChange={setTags} />
    </>
  );
}

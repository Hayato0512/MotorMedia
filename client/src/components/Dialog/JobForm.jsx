// JobForm.jsx
import * as React from "react";
import { TextField } from "@mui/material";
import TagSearch from "../TagSearch/TagSearch";

export default function JobForm({
  title,
  setTitle,
  body,
  setBody,
  salary,
  setSalary,
  tags,
  setTags,
}) {
  return (
    <>
      <TextField
        autoFocus
        required
        margin="dense"
        label="Job Title"
        fullWidth
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        id="outlined-multiline-flexible"
        label="Job Description"
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
      <TextField
        id="outlined-multiline-flexible"
        label="Salary"
        fullWidth
        type="number"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <TagSearch onChange={setTags} />
    </>
  );
}

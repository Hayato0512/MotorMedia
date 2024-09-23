// JobForm.jsx
import * as React from "react";
import { TextField } from "@mui/material";

//what information we need to apply? name, email, and two files. (resume, cover letter)
export default function JobApplicationForm({
  name,
  setName,
  email,
  setEmail,
  comment,
  setComment,
}) {
  return (
    <>
      <TextField
        autoFocus
        required
        margin="dense"
        label="Name"
        fullWidth
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        id="outlined-multiline-flexible"
        label="email"
        fullWidth
        multiline
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      File Upload logic comes here
      <TextField
        id="outlined-multiline-flexible"
        label="Comment"
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
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
    </>
  );
}

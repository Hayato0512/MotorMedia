// JobForm.jsx
import * as React from "react";
import { TextField } from "@mui/material";
import { logMessage } from "../../util/logging";
import JobApplicationDialog from "./JobApplicationDialog";

const fileName = "JobApplicationForm";
//what information we need to apply? name, email, and two files. (resume, cover letter)
export default function JobApplicationForm({
  name,
  setName,
  email,
  setEmail,
  comment,
  setComment,
  setFile,
}) {
  const handleFileChange = (e) => {
    const tempFile = e.target.files[0];

    // Ensure there's a file before proceeding
    if (tempFile) {
      logMessage(
        `File selected: ${tempFile},,,${tempFile.name}, File type: ${tempFile.type}, File size: ${tempFile.size}`,
        "INFO",
        fileName
      );
      setFile(tempFile); // Set file to state
    } else {
      logMessage(`No File selected`, "ERROR", fileName);
    }
  };
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
      <form>
        <input type="file" onChange={handleFileChange} />
      </form>
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

import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";

import TagSearch from "../TagSearch/TagSearch";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

import "./questionDialog.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuestionDialog({ isOpen, onClose, onPost }) {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const { user: currentUser } = React.useContext(AuthContext);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmission = async () => {
    console.log(
      "handleSubmission: title " + title + " and body " + body + " and tags ",
      tags
    );
    const newQuestion = {
      userId: currentUser._id,
      title: title,
      body: body,
      upvotes: [],
      downvotes: [],
      isResolved: false,
      tags: tags,
    };
    //here, let's submit.
    try {
      const res = await axiosInstance.post("/questions", newQuestion);
      console.log(
        `SUCCESS. creating a new commentthe res.data is ${JSON.stringify(
          res.data
        )}`
      );
      onPost((prev) => !prev);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", bgcolor: "#ffc0cb" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Question
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Title"
            type="email"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            id="outlined-multiline-flexible"
            label="Body"
            multiline
            fullWidth
            value={body}
            onChange={(e) => setBody(e.target.value)}
            sx={{
              height: "200px", // Set the height of the TextField
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
          />

          <TagSearch onChange={setTags} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmission}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

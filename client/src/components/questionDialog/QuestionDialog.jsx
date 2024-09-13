import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import "./questionDialog.css";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  keyframes,
} from "@mui/material";
import TagSearch from "../TagSearch/TagSearch";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuestionDialog({ isOpen, onClose, onPost }) {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tagTextFieldValue, setTagTextFieldValue] = React.useState("");
  const { user: currentUser } = React.useContext(AuthContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleTagDeletion = (tagToDelete) => {
    console.log("QuestionDialog: before setTag, tags are like this , ", tags);
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    console.log("QuestionDialog: after setTag, tags are like this , ", tags);
    // setOpen(false);
  };

  const addTag = () => {
    setTags((prevTags) => [...prevTags, tagTextFieldValue]);
    //clear the field
    setTagTextFieldValue("");
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
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button> */}
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
          {/* <Stack direction="row" spacing={1}>
            {tags.map((tag) => (
              <Chip label={tag} onDelete={() => handleTagDeletion(tag)} />
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
          <Button onClick={addTag}>Add Tag</Button> */}
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

// GenericDialog.jsx
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { DialogContent, DialogActions } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GenericDialog({
  isOpen,
  onClose,
  onSubmit,
  dialogTitle,
  children, // Pass content here (like form fields)
  submitButtonText,
}) {
  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
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
            {dialogTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} type="submit">
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

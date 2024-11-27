import "./job.css";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { MoreVert, FavoriteBorder, TwoWheeler } from "@material-ui/icons";
import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { logMessage } from "../../util/logging";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Job({ job, onChange }) {
  // const [like, setLike] = useState(question.likes.length);
  // const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //for pop up for post deletion
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Example useState for toast messages

  const likeHandler = async () => {
    //   try {
    //     await axiosInstance.put("/posts/" + post._id + "/like", {
    //       userId: currentUser._id,
    //     });
    //     console.log("alright");
    //   } catch (error) {}
    //   if (isLiked) {
    //     setLike(like - 1);
    //     setIsLiked(false);
    //   } else {
    //     //if it is not,
    //     setLike(like + 1);
    //     setIsLiked(true);
    //   }
    //   setLike(isLiked ? like - 1 : like + 1);
  };

  const threeDotsClicked = () => {
    console.log("debug: lets show some pop up to delete");
  };

  const deleteCancelClicked = () => {
    setShow(false);
  };

  const toastId = useRef(null);

  useEffect(() => {
    return () => {
      toast.dismiss(); // Clear toasts on component unmount
    };
  }, []);

  const deleteClicked = async (e) => {
    if (isDeleting) return; // Prevent multiple calls if already in progress
    setIsDeleting(true);

    // delete the job, and jobapplications whose jobId matches, and delete all the documents from AWS S3, that is What I need to do.
    //I think I only need jobId. as long as I know the jobId, all the operations can be done.
    //oh, check if the currentUser Id matches the job EmployerId.
    e.preventDefault(); //what is this for?
    if (job.employerId !== currentUser._id) {
      //show message, and then 2 seconds, close the dialog
      //return
      toast.error("You are not authorized to delete this job."); // Error toast
      setTimeout(() => setShow(false), 1000); // Close the dialog after 1 second
      setIsDeleting(false); // Reset after error

      return; // Exit the function
    } else {
      if (toastId.current) {
        // Avoid duplicate toasts
        toast.update(toastId.current, {
          render: "Operation in progress...",
          autoClose: false,
        });
      } else {
        toastId.current = toast.info("Deleting job...", { autoClose: false });
      }
      try {
        const res = await axiosInstance.delete(`/jobs/${job._id}`);
        console.log(res);
        toast.update(toastId.current, {
          render: "Job deleted successfully!",
          type: "success",
          autoClose: 3000,
        });
        setShow(false);
        onChange();
      } catch (error) {
        console.log(error);
        logMessage("Job Deletion Failed. ", "ERROR", "Job");
        toast.update(toastId.current, {
          render: "Failed to delete the job.",
          type: "error",
          autoClose: 3000,
        });
        setTimeout(() => setShow(false), 1000); // Close the dialog
      } finally {
        setIsDeleting(false); // Reset after error
        toastId.current = null; // Reset the toast ID
      }
    }
  };

  return (
    <div className="job">
      <ToastContainer />
      <div className="jobWrapper">
        <div className="jobTop">
          <div className="jobTopleft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + "person/" + user.profilePicture
                    : PF + "person/" + "andrew.jpg"
                }
                alt=""
                className="jobProfileImg"
              />
            </Link>
            <span className="jobUsername">{job.employerId}</span>
            <span className="jobDate">{job.createdAt}</span>
          </div>
          <div className="jobTopRight">
            <MoreVert className="jobThreeDots" onClick={handleShow} />
          </div>
        </div>
        <div className="jobCenter">
          <Modal show={show}>
            <Modal.Header closeButton>
              <Modal.Title>delete the post?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={deleteClicked}>
                delete
              </Button>

              <Button variant="secondary" onClick={deleteCancelClicked}>
                cancel
              </Button>
            </Modal.Footer>
          </Modal>
          <Link
            to={{
              pathname: "/jobDetail/",
            }}
            state={{ jobId: job._id }}
            style={{ textDecoration: "none" }}
            // key={commenter.data.username}
          >
            <span className="jobTitle">{job.title}</span>
          </Link>
          <span className="jobDesc">{job.body}</span>
          {/* <img src={PF + "posts/" + post.img} alt="" className="postImg" /> */}
          <img alt="" className="jobImg" />
        </div>
        <div className="jobBottom">
          <div className="jobButtomLeft">
            <FavoriteBorder className="likeIcon" onClick={likeHandler} />
            <TwoWheeler className="likeIcon" onClick={likeHandler} />
            <span className="jobLikeCounter">5 people liked</span>
          </div>
          <div className="jobButtomRight">
            <div className="jobCommentText" onClick={() => {}}>
              comments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from "../../config";
import { MoreVert } from "@material-ui/icons";
import { Modal, Button } from "react-bootstrap";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  //for pop up for post deletion
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    //currentuseじゃない方をとって、そいつを見せるのか

    const getUser = async () => {
      try {
        const res = await axiosInstance("/users?userId=" + friendId);
        setUser(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  //Next time, start from here. What I need to do, is get the conversation id to delete. I think that is it. then I can delete all the messages as well as the converation itself. not difficult at all. Very nice
  const deleteClicked = async (e) => {
    e.preventDefault();
    //get the conversation ID
    try {
      const res = await axiosInstance.delete(
        `/conversations/${conversation._id}`
      );
      console.log(res);
      if (res.status == 200) {
        setShow(false);
      } else {
        console.log(
          "Conversation Deletion Failed : Conversation.jsx:deleteClicked"
        );
      }
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCancelClicked = () => {
    setShow(false);
  };

  return (
    <div className="conversation">
      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>delete the conversation?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <></>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={deleteClicked}>
            delete
          </Button>

          <Button variant="secondary" onClick={deleteCancelClicked}>
            cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="conversationLeft">
        <img
          src={
            user
              ? PF + "person/" + user.profilePicture
              : PF + "person/andrew.jpg"
          }
          alt=""
          className="conversationImg"
        />
        <span className="conversationName">
          {user ? user.username : "Loading..."}
        </span>
      </div>
      <MoreVert className="conversationThreeDots" onClick={handleShow} />
    </div>
  );
}

import { React, useRef, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./communityRightbar.css";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import { Modal, Button, Form } from "react-bootstrap";
export default function CommunityRightbar({ chosenCommunity, hidden }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [isLeader, setIsLeader] = useState(false);
  const [members, setMembers] = useState([]);
  console.log("in CommunityRightbar, user._id is liek this ", user._id);
  console.log(chosenCommunity.leaderId);
  const navigate = useNavigate();

  //for pop up for community deletion
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (user._id === chosenCommunity.leaderId) {
      setIsLeader(true);
    }
  }, [user, chosenCommunity]);

  useEffect(() => {
    //fetchUsers
    const fetchUsers = async () => {
      const list = await Promise.all(
        chosenCommunity.members.map(
          async (username) =>
            await axiosInstance.get("/users?username=" + username)
        )
      );
      list.map((member) => {
        console.log(`member is ${member.data.username}`);
      });
      setMembers(list);
    };
    fetchUsers();
  }, [chosenCommunity]);

  const deleteGroupButtonClicked = async () => {
    //first, go through everyone, and then take the community List,
    console.log(chosenCommunity.members);
    try {
      //First, remove this community from every members personal data.
      const list = await Promise.all(
        chosenCommunity.members.map(
          async (member) => await axiosInstance.get(`/users?username=${member}`)
        )
      );

      list.map(async (member) => {
        const originalCommunityArray = member.data.communities;
        const newCommunityArray = originalCommunityArray.filter(
          (communityId) => communityId !== chosenCommunity._id
        );

        const memberId = member.data._id;
        const userUpdateObject = {
          userId: user._id,
          communities: newCommunityArray,
        };
        try {
          await axiosInstance.put(`/users/${memberId}`, userUpdateObject);
          console.log("the user's community has been updated");
        } catch (error) {
          console.log(error);
        }

        //then delete the community from communityDB
        const res = await axiosInstance.delete(
          `/communities/${chosenCommunity._id}/${user._id}`
        );
        console.log(`after the deletion, the res is liek this ${res.data}`);
        //Here, I want to exit this community detailed page, open community page with the updated list of community(the removed comunity shouldn't be there.)
        //I guess, I can just navigate to Community page.
        navigate("/community");
        //use this id, to update the users community array.
      });
    } catch (error) {
      // var currentUser2 = await axiosInstance.get(
      //   `/users?userId=${currentUser._id}`
      // );
    }
  };

  const deleteCancelClicked = () => {
    setShow(false);
  };

  const leaveGroupButtonClicked = async () => {
    console.log(`leave button clicekd`);
    //first, get rid of current user ID from chosenCommunity.members
    console.log(`user's community list ${user.communities}`);
    console.log(`community's member list ${chosenCommunity.members}`);
    const newMembers = chosenCommunity.members.filter((member) => {
      return member !== user.username;
    });
    const newCommunities = user.communities.filter((communityId) => {
      return communityId !== chosenCommunity._id;
    });
    //let's update user first.
    try {
      const userUpdateObject = {
        userId: user._id,
        communities: newCommunities,
      };
      await axiosInstance.put(`/users/${user._id}`, userUpdateObject);
      console.log(
        "congratsration. you just added the community id into your aray."
      );
    } catch (error) {
      console.log(error);
    }
    //this trycatch updates the community's members
    try {
      const bodyToPass = {
        members: newMembers,
      };
      const res = await axiosInstance.put(
        "/communities/" + chosenCommunity._id + "/update",
        bodyToPass
      );
      console.log(`res.data is like this ${res.data}`);
    } catch (error) {}
  };
  if (chosenCommunity) {
    return (
      <div className="communityRightbar">
        <div className="communityRightbarWrapper">
          <div className="communityRightbarMembersTitle">Member List</div>
          <div className="communityRightbarMembers">
            {members.map((member, i) => (
              <div key={member._id ? member._id : i}>
                <Link
                  to={"/profile/" + member.data.username}
                  style={{ textDecoration: "none" }}
                  key={member.data.username}
                >
                  <div className="communityRightbarMember">
                    <img
                      src={
                        member.data.profilePicture
                          ? PF + `person/${member.data.profilePicture}`
                          : PF + `person/andrew.jpg`
                      }
                      alt=""
                      className="communityRightBarUserImage"
                    />
                    <h3 className="communityRightbarUsername">
                      {member.data.username}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Modal show={show}>
          <Modal.Header closeButton>
            <Modal.Title>delete the community?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={deleteGroupButtonClicked}>
              delete
            </Button>

            <Button variant="secondary" onClick={deleteCancelClicked}>
              cancel
            </Button>
          </Modal.Footer>
        </Modal>
        {isLeader ? (
          <button onClick={handleShow} className="communityDeleteLeaveButton">
            delete the group
          </button>
        ) : (
          <button
            onClick={leaveGroupButtonClicked}
            className="communityDeleteLeaveButton"
          >
            {hidden ? "" : "leave the group"}
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div className="communityRightbar">
        <div className="communityRightbarWrapper">
          <div className="communityRightbarMembersTitle">Member List</div>
          <div className="communityRightbarMembers">
            <div className="communityRightbarMember">member1</div>
            <div className="communityRightbarMember">member1</div>
            <div className="communityRightbarMember">member1</div>
          </div>
        </div>
      </div>
    );
  }
}

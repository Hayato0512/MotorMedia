import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ownersList.css";
import { useNavigate } from "react-router-dom";

// export default function OwnersList({ ownerObjectsArray }) {
//   return ownerObjectsArray.length ? (
//     <div>
//       {ownerObjectsArray.map((ownerObject) => (
//         <div key={ownerObject.username}>
//           <h3>{ownerObject.username}</h3>
//           <button>contact</button>
//         </div>
//       ))}
//       OwnersList
//     </div>
//   ) : (
//     <h2>Loading...</h2>
//   );
// }
export default function OwnersList({ ownerObjectsArray }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [theArray, setTheArray] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      if (ownerObjectsArray.length !== 0) {
        console.log(
          "thre array is not empty, so I will set this as State using setTheARray",
          ownerObjectsArray
        );
        setTheArray(ownerObjectsArray);
      } else {
        //this is the legendary block of code that doesn't make sence(having 3 elements but retrurn length 0 after.)
        //   console.log(
        //     "AND THEN THE ARAY ITSELF LOOK LIKE THIS ",
        //     ownerObjectsArray,
        //     "ownerObjectsArray.length is like this ",
        //     ownerObjectsArray.length
        //   );
      }
    }, 700);
    //this thing works only becuase of setTImeOUt（邪道）, so, eventually, analyze how you can make this better.
  }, [ownerObjectsArray]);
  const ownersEntryClicked = async (event) => {
    console.log("You just clicked this ", event.target.id);
    //name ok, now, how to jump to the page??
    navigate(`/profile/${event.target.id}`);
  };
  if (ownerObjectsArray.length === 0) {
    return <h2>no owners here</h2>;
  } else {
    return (
      <div className="ownersList">
        <div className="ownersEntries">
          {theArray.map((ownerObject) => {
            return (
              <div className="ownersEntry" key={ownerObject.username}>
                <img
                  className="ownersEntryImg"
                  src={PF + `person/${ownerObject.profilePicture}`}
                  alt=""
                />
                <h3>{ownerObject.username}</h3>
                <button
                  id={ownerObject.username}
                  onClick={ownersEntryClicked}
                  key={ownerObject.username}
                  className="contactOwnerButton"
                >
                  contact
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

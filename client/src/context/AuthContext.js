import { createContext, useReducer } from "react";

import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: null,
  isfetching: false,
  error: false,
};

/**json.parse(localstorage.getitem("user")){
 {
    _id: "62bf0eba312fc29582f9ecaf",
    username: "hayato",
    email: "hayato@gmail.com",
    password: "hayato",
    profilePicture: "hayato.jpg",
    coverPicture: "river.jpg",
    isAdmin: false,
    followers: [],
    followings: [],
  } */
export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  // console.log(
  //   "in authContext:  localStorage gives meaa",
  //   JSON.parse(localStorage.getItem("user"))
  // );
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  // localStorage.setItem("items", JSON.stringify(items));
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  // const userFromStorage = {
  //   _id: "62bf0eba312fc29582f9ecaf",
  //   username: "hayato",
  //   email: "hayato@gmail.com",
  //   password: "hayato",
  //   profilePicture: "hayato.jpg",
  //   coverPicture: "river.jpg",
  //   isAdmin: false,
  //   followers: [],
  //   followings: [],
  // };
  return (
    <AuthContext.Provider
      value={{
        user: userFromStorage ? userFromStorage : state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// user: state.user,

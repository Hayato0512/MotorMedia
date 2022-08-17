const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case "FOLLOW":
      console.log("action.payload is this in FOLLOW", action.payload);
      //action payload is the id of person who gets followed
      console.log(`in FOLLOW, state is like this ${JSON.stringify(state)}   `);
      //so state.user is null here. why?? let's see what state look like
      return {
        ...state, //exactly the same state as above one.
        // user: {
        //   ...state.user,
        //   followings: [...state.user.followings, action.payload],
        // },
      };
    case "UNFOLLOW":
      return {
        ...state, //exactly the same state as above one.
        // user: {
        //   ...state.user,
        //   followings: state.user.followings.filter(
        //     (following) => following !== action.payload
        //   ),
        // },
      };
    default:
      return state;
  }
};

export default AuthReducer;

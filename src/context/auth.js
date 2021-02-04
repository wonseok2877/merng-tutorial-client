import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("jwtToken")) {
  // decode the encoded token
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  // expiration time. 유효기간
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    // console.log(decodedToken.exp * 1000);
    // console.log(Date.now());
    // 로컬스토리지의 토큰이 유효할 경우, 유저에다가 토큰을 넣어준다.
    initialState.user = decodedToken;
  }
}

// createContext
const AuthContext = createContext({
  user: null,
  loggingin: (userData) => {},
  loggingout: () => {},
});

/* Reducer ? 
: recieves an action with type & payload,
then determine what to do with those functionality of your application.
설명 필요
 */
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        // when we logging in, we get some data and we should set user state this data .
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        // logging out
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  /* useReducer() ? 
    설명필요*/
  const [state, dispatch] = useReducer(authReducer, initialState);
  /*now we have dispatch and use it to dispatch any action
    and then attach to it some payload
    설명 필요*/
  function loggingin(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }
  function loggingout() {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  }

  return (
    // pass to our components underneath this provider
    <AuthContext.Provider
      value={{ user: state.user, loggingin, loggingout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };

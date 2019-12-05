import axios from "axios";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from "../actions/types";
import { returnErrors } from "./errorActions";

//check token and load user
export const loadUser = () => (dispatch, getState) => {
  //User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

//reg user
export const register = ({username, email, password}) => dispatch => {
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  //Request body
  const body = JSON.stringify({
    username: username, 
    email: email,
    password: password
  })

  axios
    .post("/api/users", body, config)
    .then(res => dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, "REGISTER_FAIL"));
      dispatch({
        type: REGISTER_FAIL
      })
    })
}

//logout user
export const logout = () => {
  console.log(localStorage);
  return {
    type: LOGOUT_SUCCESS
  }
}

// Setup config/header and token
export const tokenConfig = getState => {
  //Get token from localstorage
  const token = getState().auth.token;

  //Headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  //If token => add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

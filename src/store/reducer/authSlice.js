import { createSlice } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import FirebaseData from "../../utils/Firebase";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequested: (state) => {
      state.loading = true;
    },
    authSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { authRequested, authSuccess, authFailure, userLogout } = authSlice.actions;

// Selector para obtener el usuario del estado
export const selectUser = (state) => state.User_signup.user;

export default authSlice.reducer;

// Thunks
export const loginUser = (email, password) => async (dispatch) => {
  const { authentication } = FirebaseData();
  dispatch(authRequested());
  try {
    const userCredential = await signInWithEmailAndPassword(authentication, email, password);
    dispatch(authSuccess(userCredential.user));
  } catch (error) {
    dispatch(authFailure(error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
  const { authentication } = FirebaseData();
  dispatch(authRequested());
  try {
    await signOut(authentication);
    dispatch(userLogout());
  } catch (error) {
    dispatch(authFailure(error.message));
  }
};

// Observer to keep user logged in
export const observeAuthState = () => (dispatch) => {
  const { authentication } = FirebaseData();
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      dispatch(authSuccess(user));
    } else {
      dispatch(userLogout());
    }
  });
};

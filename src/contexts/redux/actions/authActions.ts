// Action Types
export const SET_USER = 'SET_USER';

// Action creator
export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

import { UPDATE_POMODORO_STATUS } from '../actions/actionTypes';
const initialState = {
  status: ''
};
export const clickReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_POMODORO_STATUS:
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  }
};
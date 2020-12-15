import { UPDATE_POMODORO_STATUS, IS_PAUSED, IS_PLAYING } from '../actions/actionTypes';
const initialState = {
  status: '',
  isPlaying: false,
  isPaused: false
};
export const clickReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_POMODORO_STATUS:
      return {
        ...state,
        status: action.status
      };
    case IS_PLAYING:
      return {
        ...state,
        isPlaying: action.isPlaying
      };
    case IS_PAUSED:
      return {
        ...state,
        isPaused: action.isPaused
      };
    default:
      return state;
  }
};
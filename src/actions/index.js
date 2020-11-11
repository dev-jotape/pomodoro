import { UPDATE_POMODORO_STATUS, IS_PAUSED, IS_PLAYING } from './actionTypes';
export const updatePomodoroStatusAction = value => ({
  type: UPDATE_POMODORO_STATUS,
  newValue: value
});
export const isPlayingAction = value => ({
  type: IS_PLAYING,
  newValue: value
});
export const isPausedAction = value => ({
  type: IS_PAUSED,
  newValue: value
});
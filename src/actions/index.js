import { UPDATE_POMODORO_STATUS } from './actionTypes';
export const updatePomodoroStatusAction = value => ({
  type: UPDATE_POMODORO_STATUS,
  newValue: value
});
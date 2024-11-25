import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import {notifyError} from "src/utils/devExtremeUtils";

/**
 * Log a warning and show a toast!
 */
export const errorLoggingMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    notifyError(action.payload);
  }

  return next(action);
};

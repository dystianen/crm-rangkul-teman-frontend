import * as Toolkit from "@reduxjs/toolkit";
import * as midd from "src/store/middlewares/errorLogging.middleware";
import menuSlice from "./slices/menuSlice";
import contactSlice from "./slices/contactSlice";
import loanappSlice from "./slices/loanappSlice";

export const store: any = Toolkit.configureStore({
  reducer: {
    menu: menuSlice,
    contact: contactSlice,
    loanapp: loanappSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(midd.errorLoggingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

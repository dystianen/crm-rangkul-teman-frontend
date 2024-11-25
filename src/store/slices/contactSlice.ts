import {
  createAction,
  createAsyncThunk,
  createSlice,
  PrepareAction,
} from "@reduxjs/toolkit";
import * as API from "src/api/contact";

interface contactState {
  contacts: any[];
  contact: any;
  totalCount: number;
  filter: any;
  paginate: any;
  idNumber?: string;
}

const initialState: contactState = {
  contacts: [],
  contact: {},
  totalCount: 0,
  filter: {},
  paginate: {},
};
export const setContactIdNumber = createAction<PrepareAction<any>>(
  "contact/setContactIdNumber",
  (data) => {
    return {
      payload: data,
    };
  }
);
export const setContact = createAction<PrepareAction<any>>(
  "contact/setContact",
  (data) => {
    return {
      payload: data,
    };
  }
);

export const setFilter = createAction<PrepareAction<any>>(
  "contact/setFilter",
  (newFilter) => {
    return {
      payload: newFilter,
    };
  }
);

export const doFindAll = createAsyncThunk(
  "contact/findAll",
  async (payload: any, { dispatch }) => {
    dispatch(setFilter(payload));
    return API.findAll(payload).then((res) => {
      let { data } = res;
      data = data.map((result: any) => ({ key: result.id, ...result }));
      const result: any = { ...res, data: data };
      return result;
    });
  }
);

export const doFind = createAsyncThunk("contact/find", async (id: string) => {
  return API.contactDetailApi(id);
});

export const doUpdate = createAsyncThunk("contact/edit", async (data: any) => {
  return API.updateContact(data.id, data);
});

export const doCreate = createAsyncThunk(
  "contact/create",
  async (data: any) => {
    return API.createContact(data);
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(doFindAll.fulfilled, (state: any, action: any) => {
      state.contacts = action.payload.data;
      state.totalCount = action.payload.totalCount;
    });
    builder.addCase(doFind.fulfilled, (state: any, action: any) => {
      state.contact = action.payload.data;
    });
    builder.addCase(setFilter, (state: any, action: any) => {
      state.filter = action.payload;
    });
    builder.addCase(setContact, (state: any, action: any) => {
      state.contact = action.payload;
    });
    builder.addCase(setContactIdNumber, (state: any, action: any) => {
      state.idNumber = action.payload;
    });
  },
});

export default contactSlice.reducer;

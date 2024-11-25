import {
  PrepareAction,
  createAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

interface ILoanAppState {
  loanappStep1: {
    amount: number;
    termId: string;
    bankId: string;
    bankAccNumber: string;
    purposeId: string;
    monthlyIncome: number;
  };
  incomeProof: string;
  customData: Array<{ name: string; value: string }>;
}

const initialState: ILoanAppState = {
  loanappStep1: {
    amount: 0,
    termId: "",
    bankId: "",
    bankAccNumber: "",
    purposeId: "",
    monthlyIncome: 0,
  },

  incomeProof: "",
  customData: [],
};

export const setLoanAppStep1 = createAction<PrepareAction<any>>(
  "loanapp/setLoanAppStep1",
  (data) => {
    console.log("redux : ", data);
    return {
      payload: data,
    };
  }
);

export const setCustomeData = createAction<PrepareAction<any>>(
  "loanapp/setCustomeData",
  (data) => {
    return {
      payload: data,
    };
  }
);

export const setIncomeProof = createAction<PrepareAction<any>>(
  "loanapp/setIncomeProof",
  (data) => {
    return {
      payload: data,
    };
  }
);

const loanAppSlice = createSlice({
  name: "loanApp",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setLoanAppStep1, (state: any, action: any) => {
      state.loanappStep1 = action.payload;
    });
    builder.addCase(setCustomeData, (state: any, action: any) => {
      state.customData = [
        ...state.customData,
        {
          no: Number(state.customData.length) + 1,
          name: action.payload.name,
          value: action.payload.value,
        },
      ];
    });
    builder.addCase(setIncomeProof, (state: any, action: any) => {
      state.incomeProof = action.payload;
    });
  },
});

export default loanAppSlice.reducer;

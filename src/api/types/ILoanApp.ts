export type TRequestRejection = {
  appId: string;
  approvalId?: string;
  description: string;
  rejectList: string[];
};

export type TResponsePreverification = {
  showPopup: boolean;
  url: string;
  message: string;
};

export type TResCheckAccessStep2 = {
  access: boolean;
  message: string;
};

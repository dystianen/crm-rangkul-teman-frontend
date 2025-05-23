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

export type TResCommodityDetail = {
  type: {
    createdOn: string;
    modifiedOn: string;
    createdBy: string;
    modifiedBy: string;
    id: string;
    name: string;
    isActive: boolean;
    displayOrder: number;
    hibernateLazyInitializer: string;
  };
};

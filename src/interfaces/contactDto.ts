export interface ContactRequest {
  idNumber: string;
  contactId?: string;
  nameBorrower?: string;
  birthPlace: string;
  birthDate: string;
  idGender: string;
  idReligion: string;
  idEducation: string;
  idMarital: string;
  motherMaidenName: string;
  lengthOfJob: number | null;

  idCountry: string;
  idCity: string;
  idProvince: string;
  districtId: string;
  subdistrictId: string;
  address: string;
  postalCode: string;
  neighborhoodUnit: string;
  communityUnit: string;
  livingAddressStatus: string;

  mobilePhone: string;
  email: string;

  ktpImage: string;
  typeOfGood: string;
  salesChannelId: string;
  marketAddress: string;
}

export const initContactValue: ContactRequest & TResInfoEkyc = {
  idNumber: "",
  nameBorrower: "",
  birthPlace: "",
  birthDate: "",
  idGender: "",
  idReligion: "",
  idEducation: "",
  idMarital: "",
  motherMaidenName: "",
  lengthOfJob: null,

  idCountry: "",
  idCity: "",
  idProvince: "",
  districtId: "",
  subdistrictId: "",
  address: "",
  postalCode: "",
  neighborhoodUnit: "",
  communityUnit: "",
  livingAddressStatus: "",

  mobilePhone: "",
  email: "",

  ktpImage: "",
  typeOfGood: "",
  salesChannelId: "",
  marketAddress: ""
};

export interface ContactRelativeDto {
  id: string;
  name: string;
  phone: string;
  typeId: string;
  contactId: string;
  ktpImage: string;
  typeOfGood: string;
  salesChannelId: string;
}

export type TResCheckEkyc = {
  isEkycWaiting: boolean;
  message: string[];
  isResend: boolean;
  isShowResult: boolean;
  isCancel: boolean;
  appId: string;
  referenceNumber: string;
};

export type TReqCreateLeads = {
  name: string;
  mobileNumber: string;
  idNumber: string;
  marketAddress: string;
  branchId: string;
};

export const InitLeadsValue: TReqCreateLeads = {
  name: "",
  mobileNumber: "",
  idNumber: "",
  marketAddress: "",
  branchId: ""
};

export type TResInfoEkyc = {
  createdOn?: Date;
  modifiedOn?: Date;
  privyId?: null;
  email?: string;
  rejectReason?: string;
  isResend?: boolean;
  referenceNumber?: string;
};

export type TResContactOCR =  {
  identity:        string;
  name:            string;
  dateOfBirth:     string;
  placeOfBirth:    string;
  occupation:      string;
  nationality:     string;
  religionId:      string;
  genderId:        string;
  maritalStatusId: string;
  bloodType:       string;
  countryId:       string;
  provinceId:      string;
  cityId:          string;
  districtId:      string;
  subDistrictId:   string;
  address:         string;
  rt:              string;
  rw:              string;
  department:      null;
  validityPeriod:  string;
  issueTime:       null;
}

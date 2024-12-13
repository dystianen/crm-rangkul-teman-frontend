export interface ContactRequest {
  idNumber: string;
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
}

export const initContactValue: ContactRequest = {
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
  salesChannelId: ""
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
  appId: string;
};

export type TReqCreateLeads = {
  name: string;
  mobileNumber: string;
  idNumber: string;
  marketAddress: string;
};

export const InitLeadsValue: TReqCreateLeads = {
  name: "",
  mobileNumber: "",
  idNumber: "",
  marketAddress: ""
};

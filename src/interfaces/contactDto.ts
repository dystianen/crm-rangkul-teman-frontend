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
}

export const initContactValue:ContactRequest = {
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
}

export interface ContactRelativeDto{
    id: string;
    name: string;
    phone: string;
    typeId: string;
    contactId: string;
}

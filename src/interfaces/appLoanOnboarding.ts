import { VisibleSection } from "src/pages/loan-app/step-2";

export interface AppLoanRequest {
    id: string;
    loanAmount: number;
    loanTermId: string;
    loanTerm: string;
    bankId: string;
    bankName: string;
    bankAccNumber: string;
    loanPurposeId: string;
    loanPurpose: string;
    monthlyIncome: number;
    customData: {
        no: number;
        name: string;
        value: string;
    }[];
    incomeProof: {
        id: string;
        fileName: string;
        fileType: string;
        fileContent: string;
    };
    items?: VisibleSection
}

export interface AppLoanOnboardingRequest {
    branchId?: string;
    contactIdentity: string;
}

export interface AppLoanOnboardingStep1Request {
    amount: number;
    termId: string;
    bankId: string;
    bankAccNumber: string;
    purposeId: string;
    monthlyIncome?: number;
    commodityId: string;
}

export interface AppLoanCustomeDataRequest {
    name: string;
    value: string;
}

export interface AppLoanIncomeProofRequest {
    incomeProof: string;
}

export interface AppLoanDetailRequest {
    application: {
        id: string;
        transactionDate: string;
        loanAmount: number;
        loanTerm: string;
        loanStatus: string;
    };
    client: {
        id: string;
        name: string;
        phoneNumber: string;
        email: string;
    };
    disbursement: {
        bank: string;
        bankAccNumber: string;
    };
    additionalInformation: {
        loanPurpose: string;
        monthlyIncome: number;
    };
    customData: {
        no: number;
        name: string;
        value: string;
    }[];
    document: {
        incomeProofDocPath: string | null;
        signedDocPath: string | null;
        unsignedDocPath: string | null;
    };
    approvalId?: string;
}

export const initLoanAppValue: AppLoanRequest = {
    id: "",
    loanAmount: 0,
    loanTermId: "",
    loanTerm: "",
    bankId: "",
    bankName: "",
    bankAccNumber: "",
    loanPurposeId: "",
    loanPurpose: "",
    monthlyIncome: 0,
    customData: [],
    incomeProof: {
        id: "",
        fileName: "",
        fileType: "",
        fileContent: "",
    },
    items: [],
};

export const initLoanIncomeProofValue: AppLoanIncomeProofRequest = {
    incomeProof: "",
};

export const initLoanOnboardingValue: AppLoanOnboardingRequest = {
    contactIdentity: "",
};

export const initLoanOnboardingStep1Value: AppLoanOnboardingStep1Request = {
    amount: 0,
    termId: "",
    bankId: "",
    bankAccNumber: "",
    purposeId: "",
    monthlyIncome: 0,
    commodityId: ""
};

export const initLoanCustomeDataValue: AppLoanCustomeDataRequest = {
    name: "",
    value: "",
};

export const initAppLoanDetailValue: AppLoanDetailRequest = {
    application: {
        id: "",
        transactionDate: "",
        loanAmount: 0,
        loanTerm: "",
        loanStatus: "",
    },
    client: {
        id: "",
        name: "",
        phoneNumber: "",
        email: "",
    },
    disbursement: {
        bank: "",
        bankAccNumber: "",
    },
    additionalInformation: {
        loanPurpose: "",
        monthlyIncome: 0,
    },
    customData: [
        {
            no: 1,
            name: "aaa",
            value: "bbb",
        },
        {
            no: 2,
            name: "xxx",
            value: "yyy",
        },
    ],
    document: {
        incomeProofDocPath: null,
        signedDocPath: null,
        unsignedDocPath: null,
    },
};

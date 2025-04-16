export const dayOfWeekData: any[] = [
  {
    ID: 1,
    dayName: 'Monday',
  },
  {
    ID: 2,
    dayName: 'Tuesday',
  },
  {
    ID: 3,
    dayName: 'Wednesday',
  },
  {
    ID: 4,
    dayName: 'Thursday',
  },
  {
    ID: 5,
    dayName: 'Friday',
  },
  {
    ID: 6,
    dayName: 'Saturday',
  },
  {
    ID: 7,
    dayName: 'Sunday',
  },
];

export const appStatusIncomplete: string[] = [
  "f95a1ecc-2f6f-4553-bbbe-a5e976a78bef"
  // ,"364f4c25-41ee-4e76-8f1a-f2caaa7ce59d"
  ,"2c031a75-52a4-4e7f-a12a-a6e79e3c98d8"
  ,"8db1d5b1-028f-491c-b4dc-77a6ce0c233b"
];

export const appStatusNotAllowToCancel: string[] = [
  "8bd8aa39-059c-4c1c-a089-35a981863c89"
  ,"e5057c26-57fe-4adb-9ede-6be0d1d38d2e"
  ,"66ffc847-23a6-49fd-aa6f-fe370b740188"
];


export const statusApp = {
  approved:"8bd8aa39-059c-4c1c-a089-35a981863c89",
  rejected:"e5057c26-57fe-4adb-9ede-6be0d1d38d2e",
  on_verifcation:"1a5bc29b-9f88-4c31-bfec-cd0203c6957e",
  signed:"2c031a75-52a4-4e7f-a12a-a6e79e3c98d8",
  discarded:"ddf85662-9f33-477c-a72a-71bb7599af6d",
  incomplete:"f95a1ecc-2f6f-4553-bbbe-a5e976a78bef",
  unsigned:"364f4c25-41ee-4e76-8f1a-f2caaa7ce59d",
  completed:"228018f9-00d1-4894-8800-3d9469edb08e",
  disbursement_failed:"d9885f43-2481-4f2e-932d-1812538c3593",
  canceled:"66ffc847-23a6-49fd-aa6f-fe370b740188",
  to_verify:"8db1d5b1-028f-491c-b4dc-77a6ce0c233b",
  unsigned_changes:"e40318f1-764c-4dde-8c5f-1fa2a2ab70f9",
}

export const backofficeAccess = {
  backoffice_master_contact_write:"800e5c98-4a29-47e1-b1e7-1ff1d5ea0737",
  backoffice_master_contact_read:"e6afc73b-62b6-4724-9d3b-1b421e92e8dc",
  backoffice_master_contact:"3b7441e6-b6f9-454f-9ca6-ebc485198e87",
  backoffice_master:"a889c141-6ede-47f8-9597-2abee67e2397",
  backoffice_home:"d82ab9d2-5f19-4c5e-8685-5e1cdd8b9294",
  backoffice_application_read:"cb253400-9572-4bed-8b03-e03b9a854f9c",
  backoffice_application_download_unsigned:"fcebd11d-5095-4d76-91ce-5b86c48b82ab",
  backoffice_application_download_signed:"2d52a07e-5c0a-4c6b-a59e-902c3644789c",
  backoffice_application_upload_signed:"11916af1-4682-40a7-b817-517f7f8d7686",
  backoffice_application_create:"2a6fa651-a582-4b49-920c-86c3b9e588a6",
  backoffice_approval_level_1:"b6bf6bd4-b8e1-4d1b-9010-b4747f9f7b36",
  backoffice_approval_level_2:"4e254440-b31e-4f30-a369-33914edf7a80",
  backoffice_administration_user_read:"b8bca982-b136-4adb-90ae-d6a6f8a790bc",
  backoffice_login:"0ed02696-b930-4708-aef7-2b3876ba68cb",
  backoffice_contract_read:"75d621c0-669b-4970-83ee-8b8e4f70d85a",
  backoffice_contract_write:"e27e8100-a321-4d90-a5af-81bbfeeb33a4",
  backoffice_disbursement_read:"494be617-fbc7-4584-937b-6a837bbd50a8",
  backoffice_disbursement_write:"dc1d6faf-07af-4f61-818b-810522fe75e2",
  backoffice_payment_read:"1071288f-5c54-468b-a0e8-0780e4211245",
  backoffice_payment_write:"900e65ee-71eb-411a-a42d-9e743c3a61ec",
  backoffice_transaction_read:"55961d18-ce15-4641-a1dc-06fab89a83c6",
  backoffice_transaction_write:"5fe41b78-a4b3-4e39-8b51-98f6ddc57b0e",
  backoffice_approval:"95e02d56-f233-4be5-8b82-fe1d655cca33",
  backoffice_application_step_1:"625aecb5-395e-42ce-8a6b-5129752f9012",
  backoffice_application_step_2:"0c0983ad-20b2-446d-8462-328aa64915f7",
  backoffice_application_submit:"d8b5626f-4dca-43ad-8e0a-08f87e50c7ab",
  backoffice_contact_activity_read:"6774b440-f074-42c4-aee0-d8790a184874",
  backoffice_contact_activity_create:"324ef906-834b-4561-ab7b-c815f0c81a67",
  backoffice_contact_activity_update:"8a7112a5-87a5-459d-8399-a062bfa55bbe",
  backoffice_application_canceling:"8f955ac1-8be0-4b3a-a374-e5b219067f24",
  backoffice_contact_activity_type_collection:"c5b4c4eb-899a-490b-a534-0e6ec8545e24",
  backoffice_contact_activity_type_sales:"8fc25c7b-2bfe-4210-ada4-6e2a1d19cc8c",
  backoffice_utility:"a5662435-91f0-47cc-9fa0-d06d318cf5cf",
  backoffice_restructure_write:"f368736c-43aa-4674-98b2-48857d28cd8b",
  backoffice_restructure_read:"c7f0e9ce-21aa-4b3d-adb9-476b6ae81c67",
  backoffice_restructure_approve:"ac1f09b9-94cf-44b4-ae69-95ed1e6ed801",
  backoffice_restructure_reject:"dfc1382f-6dd3-4fa2-9f18-82f9b8383c94",
}

export const restructure_category = {
  restruktur:"3a4a01a6-a050-4aa2-a191-b1c7a2869aeb",
  restructure2:"07f484b1-81e4-4c10-b570-626669eeb842",
}


export const restructure_max_periods = {
  "4be35245-f515-4c22-a8e4-9b36bf7d20b4": 156,
  "76ae8eaa-9721-4e55-b16a-12a12b272288": 78,
  "f1bd3cec-d445-4967-bcff-a50f4be64fb1": 36
}

export const contactActivityFieldForm = {
  RESULT: "ACTIVITY_TYPE_RESULT",
  PHOTO: "PHOTO",
  CURRENT_GEO_POSITION: "CURRENT_GEO_POSITION",
  COMMENT: "COMMENT",
  PTP_DATE: "PTP_DATE",
  PTP_AMOUNT: "PTP_AMOUNT",
  PURPOSE_OF_VISIT: "PURPOSE_OF_VISIT",
  SALES_OFFERING: "SALES_OFFERING",
  PURPOSE_OF_CALL: "PURPOSE_OF_CALL",
}

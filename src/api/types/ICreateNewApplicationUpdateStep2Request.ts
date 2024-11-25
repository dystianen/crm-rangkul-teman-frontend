/*
Create new application, update step 2
POST: http://{{host-api}}/api/trx/application/create/step/2/9605a530-2d2f-43c8-a85e-8d7f120e3f8a
*/
export interface ICreateNewApplicationUpdateStep2 { 
  customData: {  name: string; 
  value: string; 
}[]; 
  incomeProof: string; 
}
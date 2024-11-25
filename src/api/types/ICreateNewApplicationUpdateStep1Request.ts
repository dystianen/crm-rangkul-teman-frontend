/*
Create new application, update step 1
POST: http://{{host-api}}/api/trx/application/create/step/1/9605a530-2d2f-43c8-a85e-8d7f120e3f8a
*/
export interface ICreateNewApplicationUpdateStep1 { 
  amount: number; 
  termId: string; 
  bankId: string; 
  bankAccNumber: string; 
  purposeId: string; 
  monthlyIncome: number; 
}
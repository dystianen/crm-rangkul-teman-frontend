/*
Create new application
POST: http://{{host-api}}/api/trx/application/create
*/
export interface ICreateNewApplication { 
  productId: string; 
  contactIdentity: string; 
}
/*
Get application
GET: http://{{host-api}}/api/trx/application/1426f2c8-1c85-4a1a-a15a-5c218309e3ac
*/
export interface IGetApplication { 
  productId: string; 
  contactIdentity: string; 
}
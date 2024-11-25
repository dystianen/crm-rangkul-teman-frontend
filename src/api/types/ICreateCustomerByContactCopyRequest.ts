/*
Create customer by contact Copy
POST: http://{{host-api}}/api/vendor/im/va/create
*/
export interface ICreateCustomerByContactCopy { 
  contactId: string; 
  bankId: string; 
  refId: string; 
}
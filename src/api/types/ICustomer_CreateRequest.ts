/*
Customer - create
POST: https://api.xendit.co/customers
*/
export interface ICustomer_Create { 
  reference_id: string; 
  type: string; 
  individual_detail: {  given_names: string; 
  surname: string; 
}; 
  email: string; 
  mobile_number: string; 
}
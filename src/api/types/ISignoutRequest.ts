/*
signout
GET: http://{{host-api}}/api/auth/signout
*/
export interface ISignout { 
  email: string; 
  password: string; 
}
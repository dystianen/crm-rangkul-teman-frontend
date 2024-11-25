/*
signin
POST: http://{{host-api}}/api/auth/signin
*/
export interface ISignin { 
  name: string; 
  password: string; 
}
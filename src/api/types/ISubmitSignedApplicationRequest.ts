/*
Submit signed application
POST: http://{{host-api}}/api/trx/application/submit/signed/9605a530-2d2f-43c8-a85e-8d7f120e3f8a
*/
export interface ISubmitSignedApplication { 
  signedDoc: string; 
}
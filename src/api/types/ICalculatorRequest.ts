/*
Calculator
POST: http://{{host-api}}/api/product/calc
*/
export interface ICalculator { 
  productId: string; 
  amount: number; 
  term: number; 
}
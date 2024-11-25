/*
Calculator
POST: http://{{host-api}}/api/product/calc
*/
export interface IGetProductList {
  id: string;
  name: string;
  parentId: any;
  selected: boolean;
}

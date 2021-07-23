export interface IProduct {
  id: string
  name: string;
  price: number;
  productImage: string;
  description?: string;
  categories: Array<string>;
  reques?: {
    type: string,
    url: string
  }
}

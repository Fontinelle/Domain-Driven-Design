import Product from '../entity/product';

export default class ProductService {
  static increasePrice(products: Product[], percentage: number): void {
    products.forEach(product => {
      product.changePrice((1 + percentage / 100) * product.price);
    });
  }
}

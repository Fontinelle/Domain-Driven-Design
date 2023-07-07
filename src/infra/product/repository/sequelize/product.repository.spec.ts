import { Sequelize } from 'sequelize-typescript';
import ProductModel from './product.model';
import Product from '../../../../domain/product/entity/product';
import ProductRepository from './product.repository';

describe('Product repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: '1' } });

    expect(productModel?.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 1',
      price: 100,
    });
  });

  it('should update a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: '1' } });

    expect(productModel?.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 1',
      price: 100,
    });

    product.changeName('Product 2');
    product.changePrice(200);

    await productRepository.update(product.id, product);

    const productModel2 = await ProductModel.findOne({ where: { id: '1' } });

    expect(productModel2?.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 2',
      price: 200,
    });
  });

  it('should find a product', async () => {
    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: '1' } });

    const findProduct = await productRepository.find(product.id);

    expect(productModel?.toJSON()).toStrictEqual({
      id: findProduct.id,
      name: findProduct.name,
      price: findProduct.price,
    });
  });

  it('should find all a product', async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product('1', 'Product 1', 100);
    await productRepository.create(product1);

    const product2 = new Product('2', 'Product 2', 200);
    await productRepository.create(product2);

    const product3 = new Product('3', 'Product 3', 300);
    await productRepository.create(product3);

    const findProducts = await productRepository.findAll();
    const products = [product1, product2, product3];

    expect(products).toEqual(findProducts);
  });

  it('should delete a product', async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product('1', 'Product 1', 100);
    await productRepository.create(product1);

    const product2 = new Product('2', 'Product 2', 100);
    await productRepository.create(product2);

    let findProducts = await productRepository.findAll();
    let products = [product1, product2];

    expect(products).toEqual(findProducts);

    await productRepository.delete(product1.id);

    findProducts = await productRepository.findAll();
    products = [product2];

    expect(products).toEqual(findProducts);
  });
});

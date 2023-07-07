import { Sequelize } from 'sequelize-typescript';
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository';
import ProductRepository from '../../../product/repository/sequelize/product.repository';
import OrderRepository from './order.repository';
import Customer from '../../../../domain/customer/entity/customer';
import Address from '../../../../domain/customer/value-object/address';
import Product from '../../../../domain/product/entity/product';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import Order from '../../../../domain/checkout/entity/order';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';
import ProductModel from '../../../product/repository/sequelize/product.model';
import CustomerModel from '../../../customer/repository/sequelize/customer.model';

describe('Order repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      OrderItemModel,
      CustomerModel,
      ProductModel,
      OrderModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer('1', 'Customer 1');
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );

    customer.changeAddress(address);
    customer.addRewardPoints(10);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order('1', customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    });

    expect(orderModel?.toJSON()).toStrictEqual({
      id: '1',
      customer_id: '1',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: '1',
          product_id: '1',
        },
      ],
    });
  });

  it('should update a order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer('1', 'Customer 1');
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );

    customer.changeAddress(address);
    customer.addRewardPoints(10);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product('1', 'Product 1', 100);
    const product2 = new Product('2', 'Product 2', 200);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2,
    );

    const order = new Order('1', customer.id, [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    });

    expect(orderModel?.toJSON()).toStrictEqual({
      id: '1',
      customer_id: '1',
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: '1',
          product_id: '1',
        },
      ],
    });

    const orderItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      10,
    );
    const updatedOrder = new Order(order.id, customer.id, [
      orderItem1,
      orderItem2,
    ]);

    await orderRepository.update(order.id, updatedOrder);

    const updatedOrderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    });

    expect(updatedOrderModel?.toJSON()).toStrictEqual({
      id: '1',
      customer_id: '1',
      total: updatedOrder.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: '1',
          product_id: '1',
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: '1',
          product_id: '2',
        },
      ],
    });
  });

  it('should throw an error when order is not found on update', async () => {
    const orderItem1 = new OrderItem('1', 'product 1', 100, '1', 2);

    const order = new Order('2', '1', [orderItem1]);
    expect(async () => {
      const orderRepository = new OrderRepository();
      await orderRepository.update('1', order);
    }).rejects.toThrow('Order not found');
  });

  it('should find a order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer('1', 'Customer 1');
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );

    customer.changeAddress(address);
    customer.addRewardPoints(10);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order('1', customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const findOrder = await orderRepository.find(order.id);

    expect(order).toStrictEqual(findOrder);
  });

  it('should throw an error when order is not found on find', async () => {
    expect(async () => {
      const orderRepository = new OrderRepository();
      await orderRepository.find('1');
    }).rejects.toThrow('Order not found');
  });

  it('should find all orders', async () => {
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );

    const customerRepository = new CustomerRepository();
    const customer = new Customer('1', 'Customer 1');

    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem1 = new OrderItem('1', 'product 1', 100, '1', 2);
    const orderItem2 = new OrderItem('2', 'product 2', 200, '1', 2);
    const orderItem3 = new OrderItem('3', 'product 3', 300, '1', 2);
    const orderRepository = new OrderRepository();

    const order1 = new Order('1', '1', [orderItem1]);
    const order2 = new Order('2', '1', [orderItem2]);
    const order3 = new Order('3', '1', [orderItem3]);
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
    expect(orders).not.toContainEqual(order3);
  });

  it('should delete a order', async () => {
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );

    const customerRepository = new CustomerRepository();
    const customer = new Customer('1', 'Customer 1');

    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem1 = new OrderItem('1', 'product 1', 100, '1', 2);
    const orderItem2 = new OrderItem('2', 'product 2', 200, '1', 2);
    const orderItem3 = new OrderItem('3', 'product 3', 300, '1', 2);
    const orderRepository = new OrderRepository();

    const order1 = new Order('1', '1', [orderItem1]);
    const order2 = new Order('2', '1', [orderItem2]);
    const order3 = new Order('3', '1', [orderItem3]);
    await orderRepository.create(order1);
    await orderRepository.create(order2);
    await orderRepository.create(order3);

    let orders = await orderRepository.findAll();

    expect(orders).toHaveLength(3);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
    expect(orders).toContainEqual(order3);

    await orderRepository.delete(order2.id);
    orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).not.toContainEqual(order2);
    expect(orders).toContainEqual(order3);
  });

  it('should throw an error when order is not found on delete', async () => {
    expect(async () => {
      const orderRepository = new OrderRepository();
      await orderRepository.delete('1');
    }).rejects.toThrow('Order not found');
  });
});

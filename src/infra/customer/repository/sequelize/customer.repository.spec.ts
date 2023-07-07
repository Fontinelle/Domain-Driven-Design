import { Sequelize } from 'sequelize-typescript';
import CustomerModel from './customer.model';
import CustomerRepository from './customer.repository';
import Address from '../../../../domain/customer/value-object/address';
import Customer from '../../../../domain/customer/entity/customer';

describe('Customer repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
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

    const customerModel = await CustomerModel.findOne({ where: { id: '1' } });

    expect(customerModel?.toJSON()).toStrictEqual({
      id: '1',
      name: 'Customer 1',
      city: 'São Paulo',
      state: 'São Paulo',
      number: 5,
      street: 'Rua A',
      zipcode: '9000-90',
      active: false,
      rewardPoints: 10,
    });
  });

  it('should update a customer', async () => {
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

    const customerModel = await CustomerModel.findOne({ where: { id: '1' } });

    expect(customerModel?.toJSON()).toStrictEqual({
      id: '1',
      name: 'Customer 1',
      city: 'São Paulo',
      state: 'São Paulo',
      number: 5,
      street: 'Rua A',
      zipcode: '9000-90',
      active: false,
      rewardPoints: 10,
    });

    customer.changeName('Customer 2');
    customer.addRewardPoints(20);

    await customerRepository.update(customer.id, customer);

    const customerModel2 = await CustomerModel.findOne({ where: { id: '1' } });

    expect(customerModel2?.toJSON()).toStrictEqual({
      id: '1',
      name: 'Customer 2',
      city: 'São Paulo',
      state: 'São Paulo',
      number: 5,
      street: 'Rua A',
      zipcode: '9000-90',
      active: false,
      rewardPoints: 30,
    });
  });

  it('should find a customer', async () => {
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

    const findCustomer = await customerRepository.find(customer.id);

    expect(customer).toStrictEqual(findCustomer);
  });

  it('should throw an error when customer is not found', async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find('1');
    }).rejects.toThrow('Customer not found');
  });

  it('should find all a customer', async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );
    const customer1 = new Customer('1', 'Customer 1');
    customer1.changeAddress(address);
    customer1.addRewardPoints(10);
    customer1.activate();

    await customerRepository.create(customer1);

    const customer2 = new Customer('2', 'Customer 2');
    customer2.changeAddress(address);
    customer2.addRewardPoints(20);
    await customerRepository.create(customer2);

    const customer3 = new Customer('3', 'Customer 3');
    customer3.changeAddress(address);
    customer3.addRewardPoints(30);
    await customerRepository.create(customer3);

    const customers = await customerRepository.findAll();

    expect(customers).toHaveLength(3);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
    expect(customers).toContainEqual(customer3);
  });

  it('should delete a customer', async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );

    const customer1 = new Customer('1', 'Customer 1');
    customer1.changeAddress(address);
    await customerRepository.create(customer1);

    const customer2 = new Customer('2', 'Customer 2');
    customer2.changeAddress(address);
    await customerRepository.create(customer2);

    let customers = await customerRepository.findAll();

    expect(customers).toHaveLength(2);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);

    await customerRepository.delete(customer1.id);

    customers = await customerRepository.findAll();

    expect(customers).toHaveLength(1);
    expect(customers).not.toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
  });
});

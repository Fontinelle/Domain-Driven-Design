import Address from '../value-object/address';
import Customer from './customer';

describe('Customer unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      const customer = new Customer('', 'João');
    }).toThrowError('Id is required');
  });

  it('should throw error when name is empty', () => {
    expect(() => {
      const customer = new Customer('12', '');
    }).toThrowError('Name is required');
  });

  it('should change name', () => {
    const customer = new Customer('12', 'João');

    customer.changeName('Maria');
    expect(customer.name).toBe('Maria');
  });

  it('should change name throw error when name is empty', () => {
    expect(() => {
      const customer = new Customer('12', 'João');

      customer.changeName('');
    }).toThrowError('Name is required');
  });

  it('should activate customer', () => {
    const customer = new Customer('12', 'João');
    const address = new Address(
      'Rua A',
      5,
      '9000-90',
      'São Paulo',
      'São Paulo',
    );

    customer.changeAddress(address);
    customer.activate();
    expect(customer.isActive()).toBe(true);
  });

  it('should deactivate customer', () => {
    const customer = new Customer('12', 'João');

    customer.deactivate();
    expect(customer.isActive()).toBe(false);
  });

  it('should throw error when address is undefined', () => {
    expect(() => {
      const customer = new Customer('12', 'João');

      customer.activate();
    }).toThrowError('Address is mandatory to activate a customer');
  });

  it('should add reward points', () => {
    const customer = new Customer('1', 'Customer 1');
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(100);
    expect(customer.rewardPoints).toBe(110);
  });
});

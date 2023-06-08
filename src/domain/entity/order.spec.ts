import Order from './order';
import OrderItem from './order_item';

describe('Customer unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      const order = new Order('', '12', []);
    }).toThrowError('Id is required');
  });

  it('should throw error when customerId is empty', () => {
    expect(() => {
      const order = new Order('12', '', []);
    }).toThrowError('CustomerId is required');
  });

  it('should throw error when customerId is empty', () => {
    expect(() => {
      const order = new Order('12', '12', []);
    }).toThrowError('Items are required');
  });

  it('should calculate total', () => {
    const item1 = new OrderItem('1', 'Item 1', 100, 'p1', 2);
    const item2 = new OrderItem('2', 'Item 2', 200, 'p2', 2);

    const order = new Order('1', 'c1', [item1]);

    let total = order.total();
    expect(total).toBe(200);

    const order2 = new Order('2', 'c1', [item1, item2]);

    total = order2.total();
    expect(total).toBe(600);
  });

  it('should return price', () => {
    const item = new OrderItem('1', 'Item 1', 100, 'p1', 2);

    expect(item.price).toBe(100);
  });

  it('should throw error if the item qtd is less or equal zero', () => {
    expect(() => {
      const item1 = new OrderItem('1', 'Item 1', 100, 'p1', 0);

      const order = new Order('1', 'c1', [item1]);
    }).toThrowError('Quantity must be greater than zero');
  });
});

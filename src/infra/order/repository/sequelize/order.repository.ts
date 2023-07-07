import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      { include: [{ model: OrderItemModel }] },
    );
  }

  async update(id: string, entity: Order): Promise<void> {
    try {
      const orderModel = await OrderModel.findOne({
        where: { id },
        include: ['items'],
      });

      await orderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        { fields: ['customer_id', 'total'] },
      );

      const orderItems = entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: orderModel.id,
      }));

      await OrderItemModel.destroy({ where: { order_id: orderModel.id } });
      await OrderItemModel.bulkCreate(orderItems);
    } catch (error) {
      throw new Error('Order not found');
    }
  }

  async find(id: string): Promise<Order> {
    try {
      const orderModel = await OrderModel.findOne({
        where: { id },
        include: ['items'],
        rejectOnEmpty: true,
      });

      const orderItems = orderModel.items.map(
        (item: any) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          ),
      );

      const order = new Order(
        orderModel.id,
        orderModel.customer_id,
        orderItems,
      );

      return order;
    } catch (error) {
      throw new Error('Order not found');
    }
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ['items'] });

    const orders = orderModels.map((orderModel: any) => {
      const orderItems = orderModel.items.map(
        (item: any) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          ),
      );

      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });

    return orders;
  }

  async delete(id: string): Promise<void> {
    try {
      const orderModel = await OrderModel.findOne({
        where: { id },
        include: ['items'],
        rejectOnEmpty: true,
      });
      await orderModel.items.map(item => item.destroy());
      await orderModel.destroy();
    } catch (error) {
      throw new Error('Order not found');
    }
  }
}

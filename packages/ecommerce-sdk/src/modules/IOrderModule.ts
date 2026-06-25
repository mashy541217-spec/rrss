import { CommerceOrder, OrderStatus } from '../entities/CommerceOrder';

export interface IOrderModule {
  getOrder(id: string): Promise<CommerceOrder | null>;
  createOrder(data: Partial<CommerceOrder>): Promise<CommerceOrder>;
  updateOrderStatus(id: string, newStatus: OrderStatus): Promise<boolean>;
  refundOrder(id: string, amount: number): Promise<boolean>;
}

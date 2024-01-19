import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';

type ItemType = {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type OrderType = {
  customer_id: number;
  total_price: number;
  item_list: ItemType[];
};

@Controller()
export class OrderController {
  constructor(private readonly appService: OrderService) {}

  @Post('create-order')
  createOrder(
    @Body() { customer_id, total_price, item_list }: OrderType,
  ): Promise<string> {
    return this.appService.createOrder({
      customer_id,
      total_price,
      item_list,
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

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

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createOrder({
    customer_id,
    total_price,
    item_list,
  }: OrderType): Promise<string> {
    const itens: ItemType[] = [];

    item_list.map((item: ItemType) => {
      itens.push(item);
    });

    try {
      const Order = await this.prismaService.order.create({
        data: {
          customer_id,
          order_date: new Date(),
          total_price,
          order_items: {
            create: itens,
          },
        },
        include: {
          order_items: true,
        },
      });

      this.logger.debug(this.configService.get<string>('EMAIL_SERVICE_ROUTE'));

      const resMSEmail = await fetch(
        this.configService.get<string>('EMAIL_SERVICE_ROUTE'),
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Marcos',
            emailTo: 'chaletmarcos@gmail.com',
            message:
              'Seu pagamento foi processado com sucesso! Aguarde a confirmação do pagamento.',
          }),
        },
      );

      if (resMSEmail.ok) {
        this.logger.log('E-mail de confirmação enviado');
      } else {
        this.logger.warn('Erro ao enviar e-mail');
      }

      this.logger.log(
        `Ordem criada com sucesso (ID = ${Order.order_id}) | ` +
          `${Order.order_date.getDate()}/${Order.order_date.getMonth()}/${Order.order_date.getFullYear()} - ` +
          `${Order.order_date.getHours()}:${Order.order_date.getMinutes()}:${Order.order_date.getSeconds()}`,
      );

      return 'Ordem criada com sucesso';
    } catch (err) {
      this.logger.error(err);
    }
  }
}

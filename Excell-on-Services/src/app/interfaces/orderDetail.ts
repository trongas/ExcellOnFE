export interface OrderDetail {
  orderId: number;
  serviceChargeId: number;
  serviceChargesName?: string;
  price?: number;
  serviceChargesDescription?:string;
}

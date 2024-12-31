export class CheckInRecordDetailForm {
  id?: number;
  checkInRecordId?: number;
  name?: string;
  phone?: string;
  goodsId?: number;
  goodsName?: string;
  goodsPrice?: number;
  qty?: number;
  price?: number;
  amount?: number;

  constructor(values: Partial<CheckInRecordDetailForm>) {
    Object.assign(this, values);
  }
}

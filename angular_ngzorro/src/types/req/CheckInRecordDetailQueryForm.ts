export class CheckInRecordDetailQueryForm {
  checkInRecordId?: number;
  name?: string;
  phone?: string;
  goodsId?: number;
  goodsName?: string;
  goodsPrice?: number;

  constructor(values: Partial<CheckInRecordDetailQueryForm>) {
    Object.assign(this, values);
  }
}

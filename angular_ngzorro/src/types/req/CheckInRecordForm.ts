export class CheckInRecordForm {
  id?: number;
  reservationRecordId?: number;
  preName?: string;
  prePhone?: string;
  roomId?: number;
  roomNumber?: string;
  name?: string;
  phone?: string;
  checkInTime?: string;
  checkOutTime?: string;
  roomAmount?: number;
  goodsAmount?: number;
  amount?: number;
  remark?: string;
  status?: number | undefined;

  constructor(values: Partial<CheckInRecordForm>) {
    Object.assign(this, values);
  }
}

export class ReservationRecordForm {
  id?: number;
  roomId?: number;
  roomNumber?: string;
  name?: string;
  phone?: string;
  checkInTime?: string;
  remark?: string;
  status?: number | undefined;

  constructor(values: Partial<ReservationRecordForm>) {
    Object.assign(this, values);
  }
}

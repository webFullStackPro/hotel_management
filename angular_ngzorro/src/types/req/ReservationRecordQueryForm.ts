export class ReservationRecordQueryForm {
  roomId?: number;
  roomNumber?: string;
  name?: string;
  phone?: string;
  status?: number | undefined;

  constructor(values: Partial<ReservationRecordQueryForm>) {
    Object.assign(this, values);
  }
}

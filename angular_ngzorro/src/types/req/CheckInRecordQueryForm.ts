export class CheckInRecordQueryForm {
  reservationRecordId?: number;
  preName?: string;
  prePhone?: string;
  roomId?: number;
  roomNumber?: string;
  name?: string;
  phone?: string;
  status?: number | undefined;

  constructor(values: Partial<CheckInRecordQueryForm>) {
    Object.assign(this, values);
  }
}

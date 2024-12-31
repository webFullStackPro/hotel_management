export class RoomQueryForm {
  roomNumber?: string;
  roomType?: number | undefined;
  status?: number | undefined;

  constructor(values: Partial<RoomQueryForm>) {
    Object.assign(this, values);
  }
}

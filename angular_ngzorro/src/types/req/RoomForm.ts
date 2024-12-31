export class RoomForm {
  id?: number;
  roomNumber?: string;
  roomType?: number | undefined;
  price?: number;
  area?: string;
  floorNumber?: string;
  bedType?: string;
  maxOccupancy?: number;
  freeWifi?: number | undefined;
  existWindow?: number | undefined;
  freeBreakfast?: number | undefined;

  constructor(values: Partial<RoomForm>) {
    Object.assign(this, values);
  }
}

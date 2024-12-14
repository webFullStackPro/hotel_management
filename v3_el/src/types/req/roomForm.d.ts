export interface RoomForm {
  id?: number;
  roomNumber: string;
  roomType: number | undefined;
  price: number;
  area: string;
  floorNumber: string;
  bedType: string;
  maxOccupancy: number;
  freeWifi: number | undefined;
  existWindow: number | undefined;
  freeBreakfast: number | undefined;
}

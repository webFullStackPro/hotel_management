export interface Room {
  id: number;
  roomNumber: string;
  roomType: number;
  status: number;
  price: number;
  area: string;
  floorNumber: string;
  bedType: string;
  maxOccupancy: number;
  freeWifi: number;
  existWindow: number;
  freeBreakfast: number;
  createTime: string;
  modifyTime: string;
}
export interface ReservationRecord {
  id: number;
  roomId: number;
  roomNumber: string;
  name: string;
  phone: string;
  checkInTime: string;
  remark: string;
  status: number;
  createTime: string;
  modifyTime: string;
}
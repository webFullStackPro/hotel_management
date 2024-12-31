export interface CheckInRecord {
  id: number;
  reservationRecordId: number;
  preName: string;
  prePhone: string;
  roomId: number;
  roomNumber: string;
  name: string;
  phone: string;
  checkInTime: string;
  checkOutTime: string;
  roomAmount: number;
  goodsAmount: number;
  amount: number;
  remark: string;
  status: number;
  createTime: string;
  modifyTime: string;
}
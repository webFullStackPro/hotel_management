export interface ReservationRecordForm {
  id?: number;
  roomId: number;
  roomNumber: string;
  name: string;
  phone: string;
  checkInTime: Dayjs;
  remark: string;
  status: number | undefined;
}

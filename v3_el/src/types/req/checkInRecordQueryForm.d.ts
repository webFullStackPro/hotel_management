export interface CheckInRecordQueryForm {
  roomId: number;
  roomNumber: string;
  name: string;
  phone: string;
  status: number | undefined;
}
export const roomTypeMap: { [key: number]: string } = {
  10: '标准单人间',
  11: '豪华单人间',
  20: '标准双人间',
  21: '豪华双人间',
  90: '标准套房',
  91: '豪华套房'
};

export function getRoomTypeText(roomType: number): string {
  return roomTypeMap[roomType] || '';
}

export const roomStatusMap: { [key: number]: string } = {
  10: '空房',
  20: '已预定',
  30: '已入住',
  40: '已退房(待清理)',
  50: '维修中'
};

export function getRoomStatusText(roomStatus: number): string {
  return roomStatusMap[roomStatus] || '';
}

export const yesNoMap: { [key: number]: string } = {
  1: '是',
  0: '否'
};

export function getYesOrNoText(yesNo: number): string {
  return yesNoMap[yesNo] || '';
}

export const reservationRecordStatusMap: { [key: number]: string } = {
  10: '已预定',
  20: '已入驻',
  30: '已取消'
};

export function getReservationRecordStatusText(status: number): string {
  return reservationRecordStatusMap[status] || '';
}

export function getGenderText(gender: number): string {
  return gender === 1 ? '男' : '女'
}


export const checkInRecordStatusMap: { [key: number]: string } = {
  10: '已预定',
  20: '已入驻',
  30: '已取消',
  40: '已退房'
};

export function getCheckInRecordStatusText(status: number): string {
  return checkInRecordStatusMap[status] || '';
}

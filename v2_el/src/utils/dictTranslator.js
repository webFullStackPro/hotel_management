export const roomTypeMap = {
  10: '标准单人间',
  11: '豪华单人间',
  20: '标准双人间',
  21: '豪华双人间',
  90: '标准套房',
  91: '豪华套房'
};

export function getRoomTypeText(roomType) {
  return roomTypeMap[roomType] || '';
}

export function getGenderText(gender) {
  return gender === 1 ? '男' : '女'
}

export const roomStatusMap = {
  10: '空房',
  20: '已预定',
  30: '已入住',
  40: '已退房(待清理)',
  50: '维修中'
};

export function getRoomStatusText(roomStatus) {
  return roomStatusMap[roomStatus] || '';
}

export const yesNoMap = {
  1: '是',
  0: '否'
};

export function getYesOrNoText(yesNo) {
  return yesNoMap[yesNo] || '';
}

export const reservationRecordStatusMap = {
  10: '已预定',
  20: '已入驻',
  30: '已取消'
};

export function getReservationRecordStatusText(status) {
  return reservationRecordStatusMap[status] || '';
}

export const checkInRecordStatusMap = {
  10: '已预定',
  20: '已入驻',
  30: '已取消',
  40: '已退房'
};

export function getCheckInRecordStatusText(status) {
  return checkInRecordStatusMap[status] || '';
}
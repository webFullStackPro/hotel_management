import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table, TableProps} from 'antd';
import type {CheckInRecord} from "@/types/resp/checkInRecord";
import checkInRecordApi from '@/api/checkInRecordApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import ReservationRecordSelector from "@/pages/reservationRecord/ReservationRecordSelector.tsx";
import RoomSelector from "@/pages/room/RoomSelector.tsx";


interface CheckInRecordSelectorProps {
  visible: boolean;
  onCheckInRecordSelected: (selectedCheckInRecord: { checkInRecordId?: number; name?: string; phone?: string; }) => void;
  onCloseCheckInRecordSelector: () => void;
}

const CheckInRecordSelector: React.FC<CheckInRecordSelectorProps> = ({visible, onCheckInRecordSelected, onCloseCheckInRecordSelector}) => {

  const [checkInRecordSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    checkInRecordSelectorForm.resetFields();
  };

  const [data, setData] = useState<CheckInRecord[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<CheckInRecord>> = await checkInRecordApi.find(checkInRecordSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<CheckInRecord> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<CheckInRecord>['columns'] = [
    {title: '预定人员姓名', dataIndex: 'preName', key: 'preName'},
    {title: '预定人员联系电话', dataIndex: 'prePhone', key: 'prePhone'},
    {title: '房号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '姓名', dataIndex: 'name', key: 'name'},
    {title: '联系电话', dataIndex: 'phone', key: 'phone'},
    {title: '入驻时间', key: 'checkInTime', render: (_, record) => (
      <div>{record.checkInTime.format('YYYY-MM-DD HH:mm:ss')}</div>
    )},
    {title: '退房时间', key: 'checkOutTime', render: (_, record) => (
      <div>{record.checkOutTime.format('YYYY-MM-DD HH:mm:ss')}</div>
    )},
    {title: '房费', dataIndex: 'roomAmount', key: 'roomAmount'},
    {title: '商品消费', dataIndex: 'goodsAmount', key: 'goodsAmount'},
    {title: '总金额', dataIndex: 'amount', key: 'amount'},
    {title: 'remark', dataIndex: 'remark', key: 'remark'},
    {title: '状态', key: 'status', render: (_, record) => (
        <span>
        {(function () {
          if (record.status === 20) return '已入驻';
          else if (record.status === 30) return '已取消';
          else if (record.status === 40) return '已退房';
          else return '未知';
        })()}
      </span>
      ),
    },
  ];

  const handleRowDoubleClick = (row: CheckInRecord) => {
    onCheckInRecordSelected({
      checkInRecordId: row.id,
      name: row.name,
      phone: row.phone,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseCheckInRecordSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  const [reservationRecordSelectorVisible, setReservationRecordSelectorVisible] = useState(false);
  const findReservationRecord = () => {
    setReservationRecordSelectorVisible(true);
  }
  const handleReservationRecordSelected = (selectedReservationRecord: { reservationRecordId?: number; preName?: string; prePhone?: string; }) => {
    setReservationRecordSelectorVisible(false)
    if (selectedReservationRecord && 'reservationRecordId' in selectedReservationRecord) {
      checkInRecordSelectorForm.setFieldsValue(Object.assign(checkInRecordSelectorForm.getFieldsValue(), {
      reservationRecordId: selectedReservationRecord['reservationRecordId'],
      preName: selectedReservationRecord['preName'],
      prePhone: selectedReservationRecord['prePhone'],
      }));
    }
  };
  const handleCloseReservationRecordSelector = () => {
    setReservationRecordSelectorVisible(false)
  };
  const [roomSelectorVisible, setRoomSelectorVisible] = useState(false);
  const findRoom = () => {
    setRoomSelectorVisible(true);
  }
  const handleRoomSelected = (selectedRoom: { roomId?: number; roomNumber?: string; }) => {
    setRoomSelectorVisible(false)
    if (selectedRoom && 'roomId' in selectedRoom) {
      checkInRecordSelectorForm.setFieldsValue(Object.assign(checkInRecordSelectorForm.getFieldsValue(), {
      roomId: selectedRoom['roomId'],
      roomNumber: selectedRoom['roomNumber'],
      }));
    }
  };
  const handleCloseRoomSelector = () => {
    setRoomSelectorVisible(false)
  };

  return (
    <Modal title={"入住记录选择器(双击行选中)"} open={visible} onCancel={onCloseCheckInRecordSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={checkInRecordSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="preName" label="预定人员姓名">
          <Input.Search placeholder="请选择预定人员姓名" onSearch={findReservationRecord} readOnly={true} />
        </Form.Item>
        <Form.Item name="prePhone" label="预定人员联系电话">
          <Input.Search placeholder="请选择预定人员联系电话" onSearch={findReservationRecord} readOnly={true} />
        </Form.Item>
        <Form.Item name="roomNumber" label="房号">
          <Input.Search placeholder="请选择房号" onSearch={findRoom} readOnly={true} />
        </Form.Item>
        <Form.Item name="name" label="姓名">
          <Input maxLength={64} placeholder="请输入姓名"/>
        </Form.Item>
        <Form.Item name="phone" label="联系电话">
          <Input maxLength={20} placeholder="请输入联系电话"/>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" options={[
            { value: 20, label: <span>已入驻</span> },
            { value: 30, label: <span>已取消</span> },
            { value: 40, label: <span>已退房</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<CheckInRecord> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <ReservationRecordSelector visible={reservationRecordSelectorVisible} onReservationRecordSelected={handleReservationRecordSelected} onCloseReservationRecordSelector={handleCloseReservationRecordSelector} />
      <RoomSelector visible={roomSelectorVisible} onRoomSelected={handleRoomSelected} onCloseRoomSelector={handleCloseRoomSelector} />
    </Modal>
  );
};

export default CheckInRecordSelector;

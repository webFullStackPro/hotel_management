import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table, TableProps} from 'antd';
import type {ReservationRecord} from "@/types/resp/reservationRecord";
import reservationRecordApi from '@/api/reservationRecordApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import RoomSelector from "@/pages/room/RoomSelector.tsx";


interface ReservationRecordSelectorProps {
  visible: boolean;
  onReservationRecordSelected: (selectedReservationRecord: { reservationRecordId?: number; preName?: string; prePhone?: string; }) => void;
  onCloseReservationRecordSelector: () => void;
}

const ReservationRecordSelector: React.FC<ReservationRecordSelectorProps> = ({visible, onReservationRecordSelected, onCloseReservationRecordSelector}) => {

  const [reservationRecordSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    reservationRecordSelectorForm.resetFields();
  };

  const [data, setData] = useState<ReservationRecord[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<ReservationRecord>> = await reservationRecordApi.find(reservationRecordSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<ReservationRecord> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<ReservationRecord>['columns'] = [
    {title: '房号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '姓名', dataIndex: 'name', key: 'name'},
    {title: '联系电话', dataIndex: 'phone', key: 'phone'},
    {title: '预定入驻时间', key: 'checkInTime', render: (_, record) => (
      <div>{record.checkInTime.format('YYYY-MM-DD HH:mm:ss')}</div>
    )},
    {title: '备注', dataIndex: 'remark', key: 'remark'},
    {title: '状态', key: 'status', render: (_, record) => (
        <span>
        {(function () {
          if (record.status === 10) return '已预定';
          else if (record.status === 20) return '已入驻';
          else if (record.status === 30) return '已取消';
          else return '未知';
        })()}
      </span>
      ),
    },
  ];

  const handleRowDoubleClick = (row: ReservationRecord) => {
    onReservationRecordSelected({
      reservationRecordId: row.id,
      preName: row.name,
      prePhone: row.phone,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseReservationRecordSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  const [roomSelectorVisible, setRoomSelectorVisible] = useState(false);
  const findRoom = () => {
    setRoomSelectorVisible(true);
  }
  const handleRoomSelected = (selectedRoom: { roomId?: number; roomNumber?: string; }) => {
    setRoomSelectorVisible(false)
    if (selectedRoom && 'roomId' in selectedRoom) {
      reservationRecordSelectorForm.setFieldsValue(Object.assign(reservationRecordSelectorForm.getFieldsValue(), {
      roomId: selectedRoom['roomId'],
      roomNumber: selectedRoom['roomNumber'],
      }));
    }
  };
  const handleCloseRoomSelector = () => {
    setRoomSelectorVisible(false)
  };

  return (
    <Modal title={"预定记录选择器(双击行选中)"} open={visible} onCancel={onCloseReservationRecordSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={reservationRecordSelectorForm} onFinish={onFinish} layout={"inline"}>
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
            { value: 10, label: <span>已预定</span> },
            { value: 20, label: <span>已入驻</span> },
            { value: 30, label: <span>已取消</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<ReservationRecord> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <RoomSelector visible={roomSelectorVisible} onRoomSelected={handleRoomSelected} onCloseRoomSelector={handleCloseRoomSelector} />
    </Modal>
  );
};

export default ReservationRecordSelector;

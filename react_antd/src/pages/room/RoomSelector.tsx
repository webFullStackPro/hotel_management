import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table, TableProps} from 'antd';
import type {Room} from "@/types/resp/room";
import roomApi from '@/api/roomApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";


interface RoomSelectorProps {
  visible: boolean;
  onRoomSelected: (selectedRoom: { roomId?: number; roomNumber?: string; }) => void;
  onCloseRoomSelector: () => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({visible, onRoomSelected, onCloseRoomSelector}) => {

  const [roomSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    roomSelectorForm.resetFields();
  };

  const [data, setData] = useState<Room[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Room>> = await roomApi.find(roomSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Room> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Room>['columns'] = [
    {title: '房号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '房型', key: 'roomType', render: (_, record) => (
        <span>
        {(function () {
          if (record.roomType === 10) return '标准单人间';
          else if (record.roomType === 11) return '豪华单人间';
          else if (record.roomType === 20) return '标准双人间';
          else if (record.roomType === 21) return '豪华双人间';
          else if (record.roomType === 90) return '标准套房';
          else if (record.roomType === 91) return '豪华套房';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '状态', key: 'status', render: (_, record) => (
        <span>
        {(function () {
          if (record.status === 10) return '空房';
          else if (record.status === 20) return '已预定';
          else if (record.status === 30) return '已入住';
          else if (record.status === 40) return '已退房(待清理)';
          else if (record.status === 50) return '维修中';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '价格', dataIndex: 'price', key: 'price'},
    {title: '面积', dataIndex: 'area', key: 'area'},
    {title: '楼层', dataIndex: 'floorNumber', key: 'floorNumber'},
    {title: '床型', dataIndex: 'bedType', key: 'bedType'},
    {title: '入住人数', dataIndex: 'maxOccupancy', key: 'maxOccupancy'},
    {title: 'wifi是否免费', key: 'freeWifi', render: (_, record) => (
        <span>
        {(function () {
          if (record.freeWifi === 0) return '否';
          else if (record.freeWifi === 1) return '是';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '是否有窗', key: 'existWindow', render: (_, record) => (
        <span>
        {(function () {
          if (record.existWindow === 0) return '否';
          else if (record.existWindow === 1) return '是';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '是否有免费早餐', key: 'freeBreakfast', render: (_, record) => (
        <span>
        {(function () {
          if (record.freeBreakfast === 0) return '否';
          else if (record.freeBreakfast === 1) return '是';
          else return '未知';
        })()}
      </span>
      ),
    },
  ];

  const handleRowDoubleClick = (row: Room) => {
    onRoomSelected({
      roomId: row.id,
      roomNumber: row.roomNumber,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseRoomSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);


  return (
    <Modal title={"房间选择器(双击行选中)"} open={visible} onCancel={onCloseRoomSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={roomSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="roomNumber" label="房号">
          <Input maxLength={32} placeholder="请输入房号"/>
        </Form.Item>
        <Form.Item name="roomType" label="房型">
          <Select placeholder="请选择房型" options={[
            { value: 10, label: <span>标准单人间</span> },
            { value: 11, label: <span>豪华单人间</span> },
            { value: 20, label: <span>标准双人间</span> },
            { value: 21, label: <span>豪华双人间</span> },
            { value: 90, label: <span>标准套房</span> },
            { value: 91, label: <span>豪华套房</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" options={[
            { value: 10, label: <span>空房</span> },
            { value: 20, label: <span>已预定</span> },
            { value: 30, label: <span>已入住</span> },
            { value: 40, label: <span>已退房(待清理)</span> },
            { value: 50, label: <span>维修中</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<Room> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
    </Modal>
  );
};

export default RoomSelector;

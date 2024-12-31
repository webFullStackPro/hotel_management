import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {ReservationRecord} from "@/types/resp/reservationRecord";
import reservationRecordApi from '@/api/reservationRecordApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import ReservationRecordAdd from "@/pages/reservationRecord/ReservationRecordAdd.tsx";
import ReservationRecordView from "@/pages/reservationRecord/ReservationRecordView.tsx";
import RoomSelector from "@/pages/room/RoomSelector.tsx";
import {exportToExcel} from "@/utils/exportUtil.ts";
import {getReservationRecordStatusText} from "@/utils/dictTranslator.ts";


const ReservationRecordList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '预定记录列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<ReservationRecord[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<ReservationRecord>> = await reservationRecordApi.find(form.getFieldsValue())
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
    {
      title: '操作',
      key: 'action',
      width: '250px',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editRow(record.id)}>编辑</Button>
          <Button danger onClick={() => delRow(record.id)}>删除</Button>
          <Button color="primary" variant="outlined" onClick={() => detailRow(record)}>详情</Button>
        </Space>
      ),
    },
  ];

  const [reservationRecordAddVisible, setReservationRecordAddVisible] = useState(false);
  const [reservationRecordViewVisible, setReservationRecordViewVisible] = useState(false);
  const [selectedReservationRecordId, setSelectedReservationRecordId] = useState(0)
  const [selectedReservationRecord, setSelectedReservationRecord] = useState({})

  const onAdd = () => {
    setSelectedReservationRecordId(0)
    setReservationRecordAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedReservationRecordId(id)
    setReservationRecordAddVisible(true)
  };

  const delRow = useCallback(async (id: number) => {
    const confirmed = await modal.confirm({
      title: '删除提示',
      content: (
        <>
          确定要删除吗?
        </>
      ),
      okText: '确定',
      cancelText: '取消',
      type: 'warning'
    });

    if (confirmed) {
      reservationRecordApi.del(id)
        .then((resp) => {
          if (resp && resp.code === 1) {
            messageApi.success('删除成功!')
            onSearch()
          } else {
            messageApi.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
          }
        })
        .catch(error => {
          console.error('操作失败:', error)
        })
    }
  }, [modal]);

  const detailRow = (record: ReservationRecord) => {
    setSelectedReservationRecord(record)
    setReservationRecordViewVisible(true)
  };

  const [roomSelectorVisible, setRoomSelectorVisible] = useState(false);
  const findRoom = () => {
    setRoomSelectorVisible(true);
  }
  const handleRoomSelected = (selectedRoom: { roomId?: number; roomNumber?: string; }) => {
    setRoomSelectorVisible(false)
    if (selectedRoom && 'roomId' in selectedRoom) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      roomId: selectedRoom['roomId'],
      roomNumber: selectedRoom['roomNumber'],
      }));
    }
  };
  const handleCloseRoomSelector = () => {
    setRoomSelectorVisible(false)
  };

  const handleCloseReservationRecordAdd = () => {
    setReservationRecordAddVisible(false)
  };

  const handleCloseReservationRecordView = () => {
    setReservationRecordViewVisible(false)
  };

  const onExport = () => {
    const headers = ['房号','姓名','联系电话','预定入驻时间','备注','状态']
    reservationRecordApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.roomNumber, d.name, d.phone, d.checkInTime, d.remark, getReservationRecordStatusText(d.status)])
      }
      exportToExcel(headers, exportData)
    })
  }

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="reservationRecordList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<ReservationRecord> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <RoomSelector visible={roomSelectorVisible} onRoomSelected={handleRoomSelected} onCloseRoomSelector={handleCloseRoomSelector} />
      <ReservationRecordAdd visible={reservationRecordAddVisible} onCloseReservationRecordAdd={handleCloseReservationRecordAdd} id={selectedReservationRecordId} />
      <ReservationRecordView visible={reservationRecordViewVisible} onCloseReservationRecordView={handleCloseReservationRecordView} viewRow={selectedReservationRecord} />
    </div>
  );
};

export default ReservationRecordList;

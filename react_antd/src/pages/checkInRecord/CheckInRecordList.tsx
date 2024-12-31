import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {CheckInRecord} from "@/types/resp/checkInRecord";
import checkInRecordApi from '@/api/checkInRecordApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import CheckInRecordAdd from "@/pages/checkInRecord/CheckInRecordAdd.tsx";
import CheckInRecordView from "@/pages/checkInRecord/CheckInRecordView.tsx";
import ReservationRecordSelector from "@/pages/reservationRecord/ReservationRecordSelector.tsx";
import RoomSelector from "@/pages/room/RoomSelector.tsx";
import {exportToExcel} from "@/utils/exportUtil.ts";
import {getCheckInRecordStatusText} from "@/utils/dictTranslator.ts";


const CheckInRecordList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '入住记录列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<CheckInRecord[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<CheckInRecord>> = await checkInRecordApi.find(form.getFieldsValue())
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

  const [checkInRecordAddVisible, setCheckInRecordAddVisible] = useState(false);
  const [checkInRecordViewVisible, setCheckInRecordViewVisible] = useState(false);
  const [selectedCheckInRecordId, setSelectedCheckInRecordId] = useState(0)
  const [selectedCheckInRecord, setSelectedCheckInRecord] = useState({})

  const onAdd = () => {
    setSelectedCheckInRecordId(0)
    setCheckInRecordAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedCheckInRecordId(id)
    setCheckInRecordAddVisible(true)
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
      checkInRecordApi.del(id)
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

  const detailRow = (record: CheckInRecord) => {
    setSelectedCheckInRecord(record)
    setCheckInRecordViewVisible(true)
  };

  const [reservationRecordSelectorVisible, setReservationRecordSelectorVisible] = useState(false);
  const findReservationRecord = () => {
    setReservationRecordSelectorVisible(true);
  }
  const handleReservationRecordSelected = (selectedReservationRecord: { reservationRecordId?: number; preName?: string; prePhone?: string; }) => {
    setReservationRecordSelectorVisible(false)
    if (selectedReservationRecord && 'reservationRecordId' in selectedReservationRecord) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
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
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      roomId: selectedRoom['roomId'],
      roomNumber: selectedRoom['roomNumber'],
      }));
    }
  };
  const handleCloseRoomSelector = () => {
    setRoomSelectorVisible(false)
  };

  const handleCloseCheckInRecordAdd = () => {
    setCheckInRecordAddVisible(false)
  };

  const handleCloseCheckInRecordView = () => {
    setCheckInRecordViewVisible(false)
  };

  const onExport = () => {
    const headers = ['预定人员姓名', '预定人员联系电话', '房号', '姓名', '联系电话', '入驻时间', '退房时间', '房费', '商品消费', '总金额', '备注', '状态']
    checkInRecordApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.preName, d.prePhone, d.roomNumber, d.name, d.phone, d.checkInTime,
          d.checkOutTime, d.roomAmount, d.goodsAmount, d.amount, d.remark, getCheckInRecordStatusText(d.status)])
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
    <div className="checkInRecordList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="preName" label="预定人员姓名">
          <Input.Search placeholder="请选择预定记录" onSearch={findReservationRecord} readOnly={true} />
        </Form.Item>
        <Form.Item name="prePhone" label="预定人员联系电话">
          <Input.Search placeholder="请选择预定记录" onSearch={findReservationRecord} readOnly={true} />
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<CheckInRecord> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <ReservationRecordSelector visible={reservationRecordSelectorVisible} onReservationRecordSelected={handleReservationRecordSelected} onCloseReservationRecordSelector={handleCloseReservationRecordSelector} />
      <RoomSelector visible={roomSelectorVisible} onRoomSelected={handleRoomSelected} onCloseRoomSelector={handleCloseRoomSelector} />
      <CheckInRecordAdd visible={checkInRecordAddVisible} onCloseCheckInRecordAdd={handleCloseCheckInRecordAdd} id={selectedCheckInRecordId} />
      <CheckInRecordView visible={checkInRecordViewVisible} onCloseCheckInRecordView={handleCloseCheckInRecordView} viewRow={selectedCheckInRecord} />
    </div>
  );
};

export default CheckInRecordList;

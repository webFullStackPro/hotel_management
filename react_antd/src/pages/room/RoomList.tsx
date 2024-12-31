import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Room} from "@/types/resp/room";
import roomApi from '@/api/roomApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import RoomAdd from "@/pages/room/RoomAdd.tsx";
import RoomView from "@/pages/room/RoomView.tsx";
import {getRoomStatusText, getRoomTypeText, getYesOrNoText} from "@/utils/dictTranslator.ts";
import {exportToExcel} from "@/utils/exportUtil.ts";


const RoomList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '房间列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Room[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Room>> = await roomApi.find(form.getFieldsValue())
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

  const [roomAddVisible, setRoomAddVisible] = useState(false);
  const [roomViewVisible, setRoomViewVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState({})

  const onAdd = () => {
    setSelectedRoomId(0)
    setRoomAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedRoomId(id)
    setRoomAddVisible(true)
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
      roomApi.del(id)
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

  const detailRow = (record: Room) => {
    setSelectedRoom(record)
    setRoomViewVisible(true)
  };


  const handleCloseRoomAdd = () => {
    setRoomAddVisible(false)
  };

  const handleCloseRoomView = () => {
    setRoomViewVisible(false)
  };

  const onExport = () => {
    const headers = ['房号','房型','状态','价格','面积','楼层','床型','入住人数','wifi是否免费','是否有窗','是否有免费早餐']
    roomApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.roomNumber, getRoomTypeText(d.roomType), getRoomStatusText(d.status), d.price, d.area,
          d.floorNumber, d.bedType, d.maxOccupancy, getYesOrNoText(d.freeWifi), getYesOrNoText(d.existWindow),
          getYesOrNoText(d.freeBreakfast)])
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
    <div className="roomList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<Room> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <RoomAdd visible={roomAddVisible} onCloseRoomAdd={handleCloseRoomAdd} id={selectedRoomId} />
      <RoomView visible={roomViewVisible} onCloseRoomView={handleCloseRoomView} viewRow={selectedRoom} />
    </div>
  );
};

export default RoomList;

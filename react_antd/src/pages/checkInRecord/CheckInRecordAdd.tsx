import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import checkInRecordApi from "@/api/checkInRecordApi.ts";
import {CheckInRecord} from "@/types/resp/checkInRecord";
import ReservationRecordSelector from "@/pages/reservationRecord/ReservationRecordSelector.tsx";
import RoomSelector from "@/pages/room/RoomSelector.tsx";

interface CheckInRecordAddProps {
  visible: boolean;
  id: number;
  onCloseCheckInRecordAdd: () => void;
}

const CheckInRecordAdd: React.FC<CheckInRecordAddProps> = ({visible, id, onCloseCheckInRecordAdd}) => {

  const [form] = Form.useForm<CheckInRecord>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    preName: [
      { required: true, message: '请选择预定记录' }
    ],
    prePhone: [
      { required: true, message: '请选择预定记录' }
    ],
    roomNumber: [
      { required: true, message: '请输入房号' }
    ],
    name: [
      { required: true, message: '请输入姓名' }
    ],
    checkInTime: [
      { required: true, message: '请输入入驻时间' }
    ],
  };

  let checkInRecordForm: Partial<CheckInRecord> = {}

  const [title, setTitle] = useState('新增入住记录');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑入住记录')
      initCheckInRecordFormById(id)
    } else {
      setTitle('新增入住记录')
      form.resetFields();
    }
  }, [visible]);

  const initCheckInRecordFormById = async (id: number) => {
    const resp: Result<CheckInRecord> = await checkInRecordApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      checkInRecordForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let checkInRecord2Save:CheckInRecord = form.getFieldsValue()
      if (id) {
        checkInRecord2Save = Object.assign(checkInRecordForm, checkInRecord2Save)
      }
      const resp: Result<void> = await checkInRecordApi.save(checkInRecord2Save);
      if (!resp || resp.code !== 1) {
        messageApi.error('保存失败:' + (resp.msg ? resp.msg : '未知异常'));
        return
      }
      messageApi.success('保存成功');
      onBack()
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const onReset = () => {
    setTitle('新增入住记录')
    form.resetFields();
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

  const onBack = () => {
    onCloseCheckInRecordAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseCheckInRecordAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="checkInRecordForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="preName" label="预定人员姓名" rules={rules.preName}>
              <Input.Search placeholder="请选择预定记录" onSearch={findReservationRecord} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="prePhone" label="预定人员联系电话" rules={rules.prePhone}>
              <Input.Search placeholder="请选择预定记录" onSearch={findReservationRecord} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房号" rules={rules.roomNumber}>
              <Input.Search placeholder="请选择房号" onSearch={findRoom} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="姓名" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="phone" label="联系电话">
              <Input maxLength={20} placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="checkInTime" label="入驻时间" rules={rules.checkInTime}>
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="checkOutTime" label="退房时间">
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="roomAmount" label="房费">
              <InputNumber min={1} max={99999999} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="goodsAmount" label="商品消费">
              <InputNumber min={1} max={99999999} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="amount" label="总金额">
              <InputNumber min={1} max={99999999} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="remark" label="remark">
              <Input maxLength={255} placeholder="请输入remark"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" options={[
                { value: 20, label: <span>已入驻</span> },
                { value: 30, label: <span>已取消</span> },
                { value: 40, label: <span>已退房</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ReservationRecordSelector visible={reservationRecordSelectorVisible} onReservationRecordSelected={handleReservationRecordSelected} onCloseReservationRecordSelector={handleCloseReservationRecordSelector} />
      <RoomSelector visible={roomSelectorVisible} onRoomSelected={handleRoomSelected} onCloseRoomSelector={handleCloseRoomSelector} />
    </Modal>
  )
}

export default CheckInRecordAdd;

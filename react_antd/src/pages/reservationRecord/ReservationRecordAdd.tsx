import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import reservationRecordApi from "@/api/reservationRecordApi.ts";
import {ReservationRecord} from "@/types/resp/reservationRecord";
import RoomSelector from "@/pages/room/RoomSelector.tsx";

interface ReservationRecordAddProps {
  visible: boolean;
  id: number;
  onCloseReservationRecordAdd: () => void;
}

const ReservationRecordAdd: React.FC<ReservationRecordAddProps> = ({visible, id, onCloseReservationRecordAdd}) => {

  const [form] = Form.useForm<ReservationRecord>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    roomNumber: [
      { required: true, message: '请输入房号' }
    ],
    name: [
      { required: true, message: '请输入姓名' }
    ],
  };

  let reservationRecordForm: Partial<ReservationRecord> = {}

  const [title, setTitle] = useState('新增预定记录');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑预定记录')
      initReservationRecordFormById(id)
    } else {
      setTitle('新增预定记录')
      form.resetFields();
    }
  }, [visible]);

  const initReservationRecordFormById = async (id: number) => {
    const resp: Result<ReservationRecord> = await reservationRecordApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      reservationRecordForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let reservationRecord2Save:ReservationRecord = form.getFieldsValue()
      if (id) {
        reservationRecord2Save = Object.assign(reservationRecordForm, reservationRecord2Save)
      }
      const resp: Result<void> = await reservationRecordApi.save(reservationRecord2Save);
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
    setTitle('新增预定记录')
    form.resetFields();
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
    onCloseReservationRecordAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseReservationRecordAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="reservationRecordForm" labelCol={{span: 6}}>
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
            <Form.Item name="checkInTime" label="预定入驻时间">
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="remark" label="备注">
              <Input maxLength={255} placeholder="请输入备注"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" options={[
                { value: 10, label: <span>已预定</span> },
                { value: 20, label: <span>已入驻</span> },
                { value: 30, label: <span>已取消</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <RoomSelector visible={roomSelectorVisible} onRoomSelected={handleRoomSelected} onCloseRoomSelector={handleCloseRoomSelector} />
    </Modal>
  )
}

export default ReservationRecordAdd;

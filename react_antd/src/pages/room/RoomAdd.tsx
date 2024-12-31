import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import roomApi from "@/api/roomApi.ts";
import {Room} from "@/types/resp/room";

interface RoomAddProps {
  visible: boolean;
  id: number;
  onCloseRoomAdd: () => void;
}

const RoomAdd: React.FC<RoomAddProps> = ({visible, id, onCloseRoomAdd}) => {

  const [form] = Form.useForm<Room>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    roomNumber: [
      { required: true, message: '请输入房号' }
    ],
    roomType: [
      { required: true, message: '请输入房型' }
    ],
  };

  let roomForm: Partial<Room> = {}

  const [title, setTitle] = useState('新增房间');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑房间')
      initRoomFormById(id)
    } else {
      setTitle('新增房间')
      form.resetFields();
    }
  }, [visible]);

  const initRoomFormById = async (id: number) => {
    const resp: Result<Room> = await roomApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      roomForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let room2Save:Room = form.getFieldsValue()
      if (id) {
        room2Save = Object.assign(roomForm, room2Save)
      }
      const resp: Result<void> = await roomApi.save(room2Save);
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
    setTitle('新增房间')
    form.resetFields();
  };
  

  const onBack = () => {
    onCloseRoomAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseRoomAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="roomForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房号" rules={rules.roomNumber}>
              <Input maxLength={32} placeholder="请输入房号"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="roomType" label="房型" rules={rules.roomType}>
              <Select placeholder="请选择房型" options={[
                { value: 10, label: <span>标准单人间</span> },
                { value: 11, label: <span>豪华单人间</span> },
                { value: 20, label: <span>标准双人间</span> },
                { value: 21, label: <span>豪华双人间</span> },
                { value: 90, label: <span>标准套房</span> },
                { value: 91, label: <span>豪华套房</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="price" label="价格">
              <InputNumber min={1} max={99999999} precision={2} step={0.1} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="area" label="面积">
              <Input maxLength={64} placeholder="请输入面积"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="floorNumber" label="楼层">
              <Input maxLength={32} placeholder="请输入楼层"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="bedType" label="床型">
              <Input maxLength={50} placeholder="请输入床型"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="maxOccupancy" label="入住人数">
              <InputNumber min={1} max={10} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="freeWifi" label="wifi是否免费">
              <Select placeholder="请选择wifi是否免费" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="existWindow" label="是否有窗">
              <Select placeholder="请选择是否有窗" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="freeBreakfast" label="是否有免费早餐">
              <Select placeholder="请选择是否有免费早餐" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default RoomAdd;

import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {Room} from "@/types/resp/room";

interface RoomViewProps {
  visible: boolean;
  viewRow: object;
  onCloseRoomView: () => void;
}

const RoomView: React.FC<RoomViewProps> = ({visible, viewRow, onCloseRoomView}) => {

  const [form] = Form.useForm<Room>();

  const onBack = () => {
    onCloseRoomView()
  };

  useEffect(() => {
    if (!visible) {
      return
    }
    if (viewRow) {
      form.setFieldsValue(viewRow);
    }
  }, [viewRow]);

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onBack}>关闭</Button>
    </div>
  );

  return (
    <Modal title={"房间详情"} open={visible} onCancel={onCloseRoomView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房号">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="roomType" label="房型">
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
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" options={[
                { value: 10, label: <span>空房</span> },
                { value: 20, label: <span>已预定</span> },
                { value: 30, label: <span>已入住</span> },
                { value: 40, label: <span>已退房(待清理)</span> },
                { value: 50, label: <span>维修中</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="price" label="价格">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="area" label="面积">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="floorNumber" label="楼层">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="bedType" label="床型">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="maxOccupancy" label="入住人数">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="freeWifi" label="wifi是否免费">
              <Select placeholder="请选择wifi是否免费" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="existWindow" label="是否有窗">
              <Select placeholder="请选择是否有窗" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="freeBreakfast" label="是否有免费早餐">
              <Select placeholder="请选择是否有免费早餐" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="modifyTime" label="最后修改时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default RoomView;

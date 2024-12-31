import React, {useEffect} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select} from "antd";
import {ReservationRecord} from "@/types/resp/reservationRecord";

interface ReservationRecordViewProps {
  visible: boolean;
  viewRow: object;
  onCloseReservationRecordView: () => void;
}

const ReservationRecordView: React.FC<ReservationRecordViewProps> = ({visible, viewRow, onCloseReservationRecordView}) => {

  const [form] = Form.useForm<ReservationRecord>();

  const onBack = () => {
    onCloseReservationRecordView()
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
    <Modal title={"预定记录详情"} open={visible} onCancel={onCloseReservationRecordView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房号">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="姓名">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="phone" label="联系电话">
              <Input/>
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
              <Input/>
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
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
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

export default ReservationRecordView;

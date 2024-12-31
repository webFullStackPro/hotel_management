import React, {useEffect} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select} from "antd";
import {CheckInRecord} from "@/types/resp/checkInRecord";

interface CheckInRecordViewProps {
  visible: boolean;
  viewRow: object;
  onCloseCheckInRecordView: () => void;
}

const CheckInRecordView: React.FC<CheckInRecordViewProps> = ({visible, viewRow, onCloseCheckInRecordView}) => {

  const [form] = Form.useForm<CheckInRecord>();

  const onBack = () => {
    onCloseCheckInRecordView()
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
    <Modal title={"入住记录详情"} open={visible} onCancel={onCloseCheckInRecordView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="preName" label="预定人员姓名">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="prePhone" label="预定人员联系电话">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
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
            <Form.Item name="checkInTime" label="入驻时间">
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
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="goodsAmount" label="商品消费">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="amount" label="总金额">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="remark" label="remark">
              <Input/>
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

export default CheckInRecordView;

import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {CheckInRecordDetail} from "@/types/resp/checkInRecordDetail";

interface CheckInRecordDetailViewProps {
  visible: boolean;
  viewRow: object;
  onCloseCheckInRecordDetailView: () => void;
}

const CheckInRecordDetailView: React.FC<CheckInRecordDetailViewProps> = ({visible, viewRow, onCloseCheckInRecordDetailView}) => {

  const [form] = Form.useForm<CheckInRecordDetail>();

  const onBack = () => {
    onCloseCheckInRecordDetailView()
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
    <Modal title={"入住消费商品详情"} open={visible} onCancel={onCloseCheckInRecordDetailView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="姓名">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="phone" label="联系电话">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="goodsName" label="商品名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="goodsPrice" label="价格">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="qty" label="数量">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="price" label="单价">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="amount" label="总价">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CheckInRecordDetailView;

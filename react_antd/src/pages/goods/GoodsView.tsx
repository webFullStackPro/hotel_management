import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {Goods} from "@/types/resp/goods";

interface GoodsViewProps {
  visible: boolean;
  viewRow: object;
  onCloseGoodsView: () => void;
}

const GoodsView: React.FC<GoodsViewProps> = ({visible, viewRow, onCloseGoodsView}) => {

  const [form] = Form.useForm<Goods>();

  const onBack = () => {
    onCloseGoodsView()
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
    <Modal title={"商品详情"} open={visible} onCancel={onCloseGoodsView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="商品名称">
              <Input/>
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

export default GoodsView;

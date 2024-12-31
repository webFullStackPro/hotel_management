import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import goodsApi from "@/api/goodsApi.ts";
import {Goods} from "@/types/resp/goods";

interface GoodsAddProps {
  visible: boolean;
  id: number;
  onCloseGoodsAdd: () => void;
}

const GoodsAdd: React.FC<GoodsAddProps> = ({visible, id, onCloseGoodsAdd}) => {

  const [form] = Form.useForm<Goods>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    name: [
      { required: true, message: '请输入商品名称' }
    ],
    price: [
      { required: true, message: '请输入价格' }
    ],
  };

  let goodsForm: Partial<Goods> = {}

  const [title, setTitle] = useState('新增商品');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑商品')
      initGoodsFormById(id)
    } else {
      setTitle('新增商品')
      form.resetFields();
    }
  }, [visible]);

  const initGoodsFormById = async (id: number) => {
    const resp: Result<Goods> = await goodsApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      goodsForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let goods2Save:Goods = form.getFieldsValue()
      if (id) {
        goods2Save = Object.assign(goodsForm, goods2Save)
      }
      const resp: Result<void> = await goodsApi.save(goods2Save);
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
    setTitle('新增商品')
    form.resetFields();
  };
  

  const onBack = () => {
    onCloseGoodsAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseGoodsAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="goodsForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="商品名称" rules={rules.name}>
              <Input maxLength={255} placeholder="请输入商品名称"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="price" label="价格" rules={rules.price}>
              <InputNumber min={1} max={9999} precision={2} step={0.1} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default GoodsAdd;

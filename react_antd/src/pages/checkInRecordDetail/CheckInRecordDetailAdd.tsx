import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import checkInRecordDetailApi from "@/api/checkInRecordDetailApi.ts";
import {CheckInRecordDetail} from "@/types/resp/checkInRecordDetail";
import CheckInRecordSelector from "@/pages/checkInRecord/CheckInRecordSelector.tsx";
import GoodsSelector from "@/pages/goods/GoodsSelector.tsx";

interface CheckInRecordDetailAddProps {
  visible: boolean;
  id: number;
  onCloseCheckInRecordDetailAdd: () => void;
}

const CheckInRecordDetailAdd: React.FC<CheckInRecordDetailAddProps> = ({visible, id, onCloseCheckInRecordDetailAdd}) => {

  const [form] = Form.useForm<CheckInRecordDetail>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    name: [
      { required: true, message: '请输入入住人员姓名' }
    ],
    phone: [
      { required: true, message: '请输入入住人员联系电话' }
    ],
    goodsName: [
      { required: true, message: '请输入商品名称' }
    ],
    goodsPrice: [
      { required: true, message: '请输入商品价格' }
    ],
    qty: [
      { required: true, message: '请输入数量' }
    ],
    price: [
      { required: true, message: '请输入单价' }
    ],
  };

  let checkInRecordDetailForm: Partial<CheckInRecordDetail> = {}

  const [title, setTitle] = useState('新增入住消费商品');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑入住消费商品')
      initCheckInRecordDetailFormById(id)
    } else {
      setTitle('新增入住消费商品')
      form.resetFields();
    }
  }, [visible]);

  const initCheckInRecordDetailFormById = async (id: number) => {
    const resp: Result<CheckInRecordDetail> = await checkInRecordDetailApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      checkInRecordDetailForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let checkInRecordDetail2Save:CheckInRecordDetail = form.getFieldsValue()
      if (id) {
        checkInRecordDetail2Save = Object.assign(checkInRecordDetailForm, checkInRecordDetail2Save)
      }
      const resp: Result<void> = await checkInRecordDetailApi.save(checkInRecordDetail2Save);
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
    setTitle('新增入住消费商品')
    form.resetFields();
  };
  
  const [checkInRecordSelectorVisible, setCheckInRecordSelectorVisible] = useState(false);
  const findCheckInRecord = () => {
    setCheckInRecordSelectorVisible(true);
  }
  const handleCheckInRecordSelected = (selectedCheckInRecord: { checkInRecordId?: number; name?: string; phone?: string; }) => {
    setCheckInRecordSelectorVisible(false)
    if (selectedCheckInRecord && 'checkInRecordId' in selectedCheckInRecord) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      checkInRecordId: selectedCheckInRecord['checkInRecordId'],
      name: selectedCheckInRecord['name'],
      phone: selectedCheckInRecord['phone'],
      }));
    }
  };
  const handleCloseCheckInRecordSelector = () => {
    setCheckInRecordSelectorVisible(false)
  };
  const [goodsSelectorVisible, setGoodsSelectorVisible] = useState(false);
  const findGoods = () => {
    setGoodsSelectorVisible(true);
  }
  const handleGoodsSelected = (selectedGoods: { goodsId?: number; goodsName?: string; goodsPrice?: number; }) => {
    setGoodsSelectorVisible(false)
    if (selectedGoods && 'goodsId' in selectedGoods) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      goodsId: selectedGoods['goodsId'],
      goodsName: selectedGoods['goodsName'],
      goodsPrice: selectedGoods['goodsPrice'],
      }));
    }
  };
  const handleCloseGoodsSelector = () => {
    setGoodsSelectorVisible(false)
  };

  const onBack = () => {
    onCloseCheckInRecordDetailAdd()
  };


  const calculateAmount = (qty: number, price: number) => {
    return (qty || 0) * (price || 0);
  }

  const handleQtyChange = (qty: number | null) => {
    const price = form.getFieldValue('price')
    if (qty && price) {
      form.setFieldValue('amount', calculateAmount(qty, parseFloat(price)))
    }
  }

  const handlePriceChange = (price: number | null) => {
    const qty = form.getFieldValue('qty')
    if (qty && price) {
      form.setFieldValue('amount', calculateAmount( parseFloat(qty), price))
    }
  }

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseCheckInRecordDetailAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="checkInRecordDetailForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="入住人员姓名" rules={rules.name}>
              <Input.Search placeholder="请选择入住人员" onSearch={findCheckInRecord} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="phone" label="入住人员联系电话" rules={rules.phone}>
              <Input.Search placeholder="请选择入住人员" onSearch={findCheckInRecord} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="goodsName" label="商品名称" rules={rules.goodsName}>
              <Input.Search placeholder="请选择商品" onSearch={findGoods} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="goodsPrice" label="商品价格" rules={rules.goodsPrice}>
              <Input.Search placeholder="请选择商品" onSearch={findGoods} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="qty" label="数量" rules={rules.qty}>
              <InputNumber min={1} max={9999} onChange={(value) => handleQtyChange(value)} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="price" label="单价" rules={rules.price}>
              <InputNumber min={1} max={9999} step={0.1} precision={2} onChange={(value) => handlePriceChange(value)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="amount" label="总价">
              <InputNumber min={1} max={99999999} disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <CheckInRecordSelector visible={checkInRecordSelectorVisible} onCheckInRecordSelected={handleCheckInRecordSelected} onCloseCheckInRecordSelector={handleCloseCheckInRecordSelector} />
      <GoodsSelector visible={goodsSelectorVisible} onGoodsSelected={handleGoodsSelected} onCloseGoodsSelector={handleCloseGoodsSelector} />
    </Modal>
  )
}

export default CheckInRecordDetailAdd;

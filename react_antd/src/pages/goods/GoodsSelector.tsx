import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Table, TableProps} from 'antd';
import type {Goods} from "@/types/resp/goods";
import goodsApi from '@/api/goodsApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";


interface GoodsSelectorProps {
  visible: boolean;
  onGoodsSelected: (selectedGoods: { goodsId?: number; goodsName?: string; goodsPrice?: number; }) => void;
  onCloseGoodsSelector: () => void;
}

const GoodsSelector: React.FC<GoodsSelectorProps> = ({visible, onGoodsSelected, onCloseGoodsSelector}) => {

  const [goodsSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    goodsSelectorForm.resetFields();
  };

  const [data, setData] = useState<Goods[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Goods>> = await goodsApi.find(goodsSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Goods> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Goods>['columns'] = [
    {title: '商品名称', dataIndex: 'name', key: 'name'},
    {title: '价格', dataIndex: 'price', key: 'price'},
  ];

  const handleRowDoubleClick = (row: Goods) => {
    onGoodsSelected({
      goodsId: row.id,
      goodsName: row.name,
      goodsPrice: row.price,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseGoodsSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);


  return (
    <Modal title={"商品选择器(双击行选中)"} open={visible} onCancel={onCloseGoodsSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={goodsSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="商品名称">
          <Input maxLength={255} placeholder="请输入商品名称"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<Goods> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
    </Modal>
  );
};

export default GoodsSelector;

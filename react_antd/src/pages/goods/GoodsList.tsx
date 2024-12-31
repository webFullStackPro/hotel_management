import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Goods} from "@/types/resp/goods";
import goodsApi from '@/api/goodsApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import GoodsAdd from "@/pages/goods/GoodsAdd.tsx";
import GoodsView from "@/pages/goods/GoodsView.tsx";
import {exportToExcel} from "@/utils/exportUtil.ts";


const GoodsList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '商品列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Goods[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Goods>> = await goodsApi.find(form.getFieldsValue())
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
    {
      title: '操作',
      key: 'action',
      width: '250px',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editRow(record.id)}>编辑</Button>
          <Button danger onClick={() => delRow(record.id)}>删除</Button>
          <Button color="primary" variant="outlined" onClick={() => detailRow(record)}>详情</Button>
        </Space>
      ),
    },
  ];

  const [goodsAddVisible, setGoodsAddVisible] = useState(false);
  const [goodsViewVisible, setGoodsViewVisible] = useState(false);
  const [selectedGoodsId, setSelectedGoodsId] = useState(0)
  const [selectedGoods, setSelectedGoods] = useState({})

  const onAdd = () => {
    setSelectedGoodsId(0)
    setGoodsAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedGoodsId(id)
    setGoodsAddVisible(true)
  };

  const delRow = useCallback(async (id: number) => {
    const confirmed = await modal.confirm({
      title: '删除提示',
      content: (
        <>
          确定要删除吗?
        </>
      ),
      okText: '确定',
      cancelText: '取消',
      type: 'warning'
    });

    if (confirmed) {
      goodsApi.del(id)
        .then((resp) => {
          if (resp && resp.code === 1) {
            messageApi.success('删除成功!')
            onSearch()
          } else {
            messageApi.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
          }
        })
        .catch(error => {
          console.error('操作失败:', error)
        })
    }
  }, [modal]);

  const detailRow = (record: Goods) => {
    setSelectedGoods(record)
    setGoodsViewVisible(true)
  };


  const handleCloseGoodsAdd = () => {
    setGoodsAddVisible(false)
  };

  const handleCloseGoodsView = () => {
    setGoodsViewVisible(false)
  };

  const onExport = () => {
    const headers = ['商品名称', '价格']
    goodsApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.name, d.price])
      }
      exportToExcel(headers, exportData)
    })
  }

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="goodsList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="商品名称">
          <Input maxLength={255} placeholder="请输入商品名称"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<Goods> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <GoodsAdd visible={goodsAddVisible} onCloseGoodsAdd={handleCloseGoodsAdd} id={selectedGoodsId} />
      <GoodsView visible={goodsViewVisible} onCloseGoodsView={handleCloseGoodsView} viewRow={selectedGoods} />
    </div>
  );
};

export default GoodsList;

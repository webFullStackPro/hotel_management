import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {CheckInRecordDetail} from "@/types/resp/checkInRecordDetail";
import checkInRecordDetailApi from '@/api/checkInRecordDetailApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import CheckInRecordDetailAdd from "@/pages/checkInRecordDetail/CheckInRecordDetailAdd.tsx";
import CheckInRecordDetailView from "@/pages/checkInRecordDetail/CheckInRecordDetailView.tsx";
import CheckInRecordSelector from "@/pages/checkInRecord/CheckInRecordSelector.tsx";
import GoodsSelector from "@/pages/goods/GoodsSelector.tsx";


const CheckInRecordDetailList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '入住消费商品列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<CheckInRecordDetail[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<CheckInRecordDetail>> = await checkInRecordDetailApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<CheckInRecordDetail> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<CheckInRecordDetail>['columns'] = [
    {title: '入住人员姓名', dataIndex: 'name', key: 'name'},
    {title: '入住人员联系电话', dataIndex: 'phone', key: 'phone'},
    {title: '商品名称', dataIndex: 'goodsName', key: 'goodsName'},
    {title: '商品价格', dataIndex: 'goodsPrice', key: 'goodsPrice'},
    {title: '数量', dataIndex: 'qty', key: 'qty'},
    {title: '单价', dataIndex: 'price', key: 'price'},
    {title: '总价', dataIndex: 'amount', key: 'amount'},
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

  const [checkInRecordDetailAddVisible, setCheckInRecordDetailAddVisible] = useState(false);
  const [checkInRecordDetailViewVisible, setCheckInRecordDetailViewVisible] = useState(false);
  const [selectedCheckInRecordDetailId, setSelectedCheckInRecordDetailId] = useState(0)
  const [selectedCheckInRecordDetail, setSelectedCheckInRecordDetail] = useState({})

  const onAdd = () => {
    setSelectedCheckInRecordDetailId(0)
    setCheckInRecordDetailAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedCheckInRecordDetailId(id)
    setCheckInRecordDetailAddVisible(true)
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
      checkInRecordDetailApi.del(id)
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

  const detailRow = (record: CheckInRecordDetail) => {
    setSelectedCheckInRecordDetail(record)
    setCheckInRecordDetailViewVisible(true)
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

  const handleCloseCheckInRecordDetailAdd = () => {
    setCheckInRecordDetailAddVisible(false)
  };

  const handleCloseCheckInRecordDetailView = () => {
    setCheckInRecordDetailViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="checkInRecordDetailList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="入住人员姓名">
          <Input.Search placeholder="请选择入住人员姓名" onSearch={findCheckInRecord} readOnly={true} />
        </Form.Item>
        <Form.Item name="phone" label="入住人员联系电话">
          <Input.Search placeholder="请选择入住人员联系电话" onSearch={findCheckInRecord} readOnly={true} />
        </Form.Item>
        <Form.Item name="goodsName" label="商品名称">
          <Input.Search placeholder="请选择商品名称" onSearch={findGoods} readOnly={true} />
        </Form.Item>
        <Form.Item name="goodsPrice" label="商品价格">
          <Input.Search placeholder="请选择商品价格" onSearch={findGoods} readOnly={true} />
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
      </Form>
      <Table<CheckInRecordDetail> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <CheckInRecordSelector visible={checkInRecordSelectorVisible} onCheckInRecordSelected={handleCheckInRecordSelected} onCloseCheckInRecordSelector={handleCloseCheckInRecordSelector} />
      <GoodsSelector visible={goodsSelectorVisible} onGoodsSelected={handleGoodsSelected} onCloseGoodsSelector={handleCloseGoodsSelector} />
      <CheckInRecordDetailAdd visible={checkInRecordDetailAddVisible} onCloseCheckInRecordDetailAdd={handleCloseCheckInRecordDetailAdd} id={selectedCheckInRecordDetailId} />
      <CheckInRecordDetailView visible={checkInRecordDetailViewVisible} onCloseCheckInRecordDetailView={handleCloseCheckInRecordDetailView} viewRow={selectedCheckInRecordDetail} />
    </div>
  );
};

export default CheckInRecordDetailList;

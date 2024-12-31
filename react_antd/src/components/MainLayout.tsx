import React, {useState} from "react";
import {Layout, Menu, MenuProps} from "antd";
import Header from "@/components/Header";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Home from "@/pages/Home.tsx";
import AdminList from "@/pages/admin/AdminList.tsx";
import StaffList from "@/pages/staff/StaffList.tsx";
import GoodsList from "@/pages/goods/GoodsList.tsx";
import RoomList from "@/pages/room/RoomList.tsx";
import ReservationRecordList from "@/pages/reservationRecord/ReservationRecordList.tsx";
import CheckInRecordList from "@/pages/checkInRecord/CheckInRecordList.tsx";
import CheckInRecordDetailList from "@/pages/checkInRecordDetail/CheckInRecordDetailList.tsx";
import RoomMaintenanceRecordList from "@/pages/roomMaintenanceRecord/RoomMaintenanceRecordList.tsx";
import ChartList from "@/pages/chart/ChartList.tsx";
import {
  AuditOutlined,
  BellOutlined,
  EditOutlined,
  HomeOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SolutionOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

const MainLayout: React.FC = () => {

  const {Sider, Content} = Layout;
  const { t } = useTranslation();

  const contentStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    padding: '10px 10px',
    overflowY: 'auto'
  };

  const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px'
  };

  const layoutStyle = {
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
  };

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: 'collapse', label: '收起', icon: collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined) },
    { key: '/Home', label: '主页', path: '/Home', icon: React.createElement(HomeOutlined) },
    { key: '/AdminList', label: '管理员', path: '/AdminList', icon: React.createElement(UserOutlined) },
    { key: '/StaffList', label: '员工', path: '/StaffList', icon: React.createElement(TeamOutlined) },
    { key: '/GoodsList', label: '商品', path: '/GoodsList', icon: React.createElement(TableOutlined) },
    { key: '/RoomList', label: '房间', path: '/RoomList', icon: React.createElement(LockOutlined) },
    { key: '/ReservationRecordList', label: '预定记录', path: '/ReservationRecordList', icon: React.createElement(SolutionOutlined) },
    { key: '/CheckInRecordList', label: '入住记录', path: '/CheckInRecordList', icon: React.createElement(AuditOutlined) },
    { key: '/CheckInRecordDetailList', label: '入住消费商品', path: '/CheckInRecordDetailList', icon: React.createElement(EditOutlined) },
    { key: '/RoomMaintenanceRecordList', label: '房间维护记录', path: '/RoomMaintenanceRecordList', icon: React.createElement(BellOutlined) },
    { key: '/ChartList', label: '数据统计', path: '/ChartList', icon: React.createElement(PieChartOutlined) },
  ];

  const navigate = useNavigate();

  const location = useLocation();
  const defaultLocation = location.pathname === '/' ? '/Home' : location.pathname;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'collapse') {
      setCollapsed(!collapsed)
      return
    }
    navigate(e.key);
  };

  return (
    <Layout style={layoutStyle}>
      <Header title={t('title')}/>
      <Layout>
        <Sider collapsible collapsed={collapsed} style={siderStyle} theme={"light"} trigger={null}>
          <Menu
            onClick={handleMenuClick}
            defaultSelectedKeys={[defaultLocation]}
            defaultOpenKeys={[defaultLocation]}
            mode="inline"
            items={menuItems}
          />
        </Sider>
        <Content style={contentStyle}>
          <Routes>
            <Route path="/Home" element={<Home/>} />
            <Route path="/AdminList" element={<AdminList/>} />
            <Route path="/StaffList" element={<StaffList/>} />
            <Route path="/GoodsList" element={<GoodsList/>} />
            <Route path="/RoomList" element={<RoomList/>} />
            <Route path="/ReservationRecordList" element={<ReservationRecordList/>} />
            <Route path="/CheckInRecordList" element={<CheckInRecordList/>} />
            <Route path="/CheckInRecordDetailList" element={<CheckInRecordDetailList/>} />
            <Route path="/RoomMaintenanceRecordList" element={<RoomMaintenanceRecordList/>} />
            <Route path="/ChartList" element={<ChartList/>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout;
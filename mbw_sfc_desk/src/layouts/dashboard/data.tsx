import {
  BarChartOutlined,
  FileDoneOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];
export const listMenu: MenuItem[] = [
  //dashboard
  {
    label: (
      <Link className={""} to="/">
          Dashboard
      </Link>
    ),
    icon: <BarChartOutlined style={{ fontSize: "22px" }} />,
    key: "dashboard",
  },
  //bảng công
  {
    label: (
      <Link className={""} to="/worksheet">
       Bảng công
      </Link>
    ),
    icon: <FileDoneOutlined style={{ fontSize: "22px" }} />,
    key: "worksheet",
  },
  //report
  {
    label: (
      <Link to={"#"} className={"text-[#212B36] hover:text-[#212B36]"}>
          Báo cáo
      </Link>
    ),
    icon: <ReconciliationOutlined style={{ fontSize: "22px" }} />,
    key: "report",
    children: [
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-customer">
              Báo cáo tồn kho khách hàng
          </Link>
        ),
        key: "report-customer",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-kpi">
              Báo cáo KPI
          </Link>
        ),
        key: "report_kpi",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-checkin">
              Báo cáo viếng thăm
          </Link>
        ),
        key: "report-checkin",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-sales">
              Báo cáo tổng hợp bán hàng
          </Link>
        ),
        key: "report-sales",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-saleorder">
              Báo cáo tổng hợp đặt hàng
          </Link>
        ),
        key: "report-saleorder",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-debt">
              Báo cáo công nợ khách hàng
          </Link>
        ),
        key: "report-debt",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-custom-new">
              Báo cáo khách hàng mới
          </Link>
        ),
        key: "report-custom-new",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-checkin-first">
              Báo cáo thống kê khách hàng viếng thăm lần đầu
            
          </Link>
        ),
        key: "report-checkin-first",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/report-distance">
              Báo cáo tổng hợp cự ly di chuyển từng nhân viên (km)
          </Link>
        ),
        key: "report-distance",
      },
    ],
  },
];

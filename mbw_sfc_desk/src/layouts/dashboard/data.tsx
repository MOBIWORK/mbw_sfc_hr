import {
  BarChartOutlined,
  FileDoneOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  GroupOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];
export const listMenu: MenuItem[] = [
  //bảng công
  {
    label: (
      <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/worksheet">
        Bảng công
      </Link>
    ),
    icon: <FileDoneOutlined style={{ fontSize: "22px" }} />,
    key: "worksheet",
  },
  {
    label: (
      <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/salary">
        Bảng lương
      </Link>
    ),
    icon: <GroupOutlined style={{ fontSize: "22px" }} />,
    key: "salary",
  },
];

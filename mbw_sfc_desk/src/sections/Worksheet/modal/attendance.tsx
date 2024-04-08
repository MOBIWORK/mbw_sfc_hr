import { TableColumnsType } from "antd";
import React from "react";
import { TableCustom } from "../../../components";

interface DataAttendance {
  key: React.Key;
  name: string;
  stt?: number;
  action: string;
  time: string;
  shift: string;
  area: string;
  distance: number;
  image: string;
}

const columns: TableColumnsType<DataAttendance> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    render: (_, record: any, index: number) => index + 1,
  },
  {
    title: "Hoạt động",
    dataIndex: "action",
    key: "action",
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Ca",
    dataIndex: "shift",
    key: "shift",
  },
  {
    title: "Khu vực chấm công",
    dataIndex: "area",
    key: "area",
  },
  {
    title: "Khoảng cách(m)",
    dataIndex: "distance",
    key: "distance",
  },
  {
    title: "Hình ảnh",
    dataIndex: "image",
    key: "image",
    render: (avatar: any) => (
      <img src={avatar} alt="Avatar" style={{ width: 50, height: 70 }} />
    ),
  },
];

const data: DataAttendance[] = [
  {
    key: "AAAA",
    name: "1asd1sb",
    action: "Vào",
    time: "08:00, 02/04/2024",
    shift: "Hành chính",
    area: "Văn phòng mobiwork MB",
    distance: 124,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    key: "BBBBB",
    name: "255232",
    action: "Ra",
    time: "12:00, 02/04/2024",
    shift: "Hành chính",
    area: "Văn phòng mobiwork MB",
    distance: 0,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
];

export default function Attendance() {
  return (
    <div className="pt-3">
      <TableCustom dataSource={data} columns={columns} pagination={false}/>
    </div>
  );
}

import { Tabs } from "antd";
import Overview from "./overview";
import Attendance from "./attendance";

export default function DetailModal() {
  return (
    <>
      <Tabs
        className="border border-b-0 border-solid border-[#F5F5F5] pt-6"
        defaultActiveKey="1"
        items={[
          {
            label: <p className="text-base font-medium pl-3 pr-5"> Tổng hợp</p>,
            key: "1",
            children: <Overview />,
          },
          {
            label: <p className="text-base font-medium px-5">Chấm công</p>,
            key: "2",
            children: <Attendance />,
          },
          {
            label: <p className="text-base font-medium px-5">Đơn từ</p>,
            key: "3",
            children: <>hi!!!</>,
          },
          {
            label: <p className="text-base font-medium px-5">Ngày nghỉ</p>,
            key: "4",
            children: <>.......</>,
          },
          {
            label: <p className="text-base font-medium px-5">Thông tin điều chỉnh</p>,
            key: "5",
            children: <>.......</>,
          },
        ]}
        indicatorSize={(origin) => origin - 1}
      />
    </>
  );
}

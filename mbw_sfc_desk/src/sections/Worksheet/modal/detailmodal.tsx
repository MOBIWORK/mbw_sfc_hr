import React from "react";
import { TabsModal } from "../components/tabmodal";
import { Avatar, Badge, Col, Row } from "antd";
import { TableCustom } from "@/components";
import { ClockBlue } from "../../../icons/clockblue";
import { CalenderRed } from "../../../icons/calenderred";

const { TabPane } = TabsModal;

const columns: any = [
  {
    title: <div className="text-center">STT</div>,
    dataIndex: "stt",
    key: "stt",
    render: (_, record: any, index: number) => (
      <div className="text-center">{index + 1}</div>
    ),
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
  {
    title: "%",
    dataIndex: "pt",
    key: "pt",
  },
];

const data: any[] = [
  {
    key: "AAAA",
    name: "1asd1sb",
    action: "Vào",
    time: "08:00, 01-02-2024",
    shift: "Hành chính",
    area: "Văn phòng mobiwork MB",
    distance: 124,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    pt: 40,
  },
  {
    key: "BBBBB",
    name: "255232",
    action: "Ra",
    time: "12:00, 01-02-2024",
    shift: "Hành chính",
    area: "Văn phòng mobiwork MB",
    distance: 0,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    pt: 40,
  },
];

export default function Detailmodal() {
  return (
    <TabsModal className="" defaultActiveKey="1">
      <TabPane tab="Tổng hợp" key="1">
        <div className="bg-[#F4F6F8] -mt-4">
          <div className="px-3 pb-4">
            <Row gutter={[12, 12]}>
              <Col className="w-[680px]">
                <Row className="bg-white pb-4 px-3 pt-2 mt-3">
                  <div className="text-[#222222] font-semibold text-sm leading-[22px] w-full">
                    Tổng quan
                  </div>
                  <Row gutter={[8, 8]} className="pt-2">
                    <Col className="bg-[#F4F6F8] p-2 mr-2 w-[180px] rounded-xl">
                      <Row className="items-center px-2">
                        <Avatar
                          style={{ backgroundColor: "#00B8D91F" }}
                          size={40}
                          icon={
                            <>
                              <ClockBlue />
                            </>
                          }
                        />
                        <p className="ml-[5px] text-left">
                          <p className="text-[#222222] font-normal leading-[22px] text-sm">
                            Số giờ
                          </p>
                          <p className="text-[#222222] font-semibold leading-[22px] text-sm">
                            7,5
                          </p>
                        </p>
                      </Row>
                    </Col>
                    <Col className="bg-[#F4F6F8] p-2 mr-2 w-[180px] rounded-xl">
                      <Row className="items-center px-2">
                        <Avatar
                          style={{ backgroundColor: "#00B8D91F" }}
                          size={40}
                          icon={
                            <>
                              <CalenderRed />
                            </>
                          }
                        />
                        <p className="ml-[5px] text-left">
                          <p className="text-[#222222] font-normal leading-[22px] text-sm">
                            Số công
                          </p>
                          <p className="text-[#222222] font-semibold leading-[22px] text-sm">
                            1
                          </p>
                        </p>
                      </Row>
                    </Col>
                    <Col className="bg-[#F4F6F8] p-2 mr-2 w-[268px] rounded-xl">
                      <p className="font-normal text-[#212B36] text-sm leading-[22px] px-2">
                        Thời gian chấm công
                      </p>
                      <div className="flex items-center justify-between px-2">
                        <div className="text-sm font-normal leading-[22px]">
                          <Badge className="mr-3 pt-1" dot />
                          08:00 - 12:00
                        </div>
                        <div className="text-sm font-normal leading-[22px]">
                          <Badge className="mr-3 pt-1" dot />
                          12:00 - 17:00
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="pt-3 w-full">
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Số phút đi muộn
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          12
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Số phút về sớm
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          3
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Số phút vắng mặt
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          0
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="pt-3 w-full">
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Số công tăng ca
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          0
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Số giờ tăng ca
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          0
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Row>

                <Row className="bg-white pb-4 px-3 pt-2 mt-3 ">
                  <div className="text-[#222222] font-semibold text-sm leading-[22px] w-full">
                    Ca làm việc
                  </div>
                  <Row gutter={[8, 8]} className="pt-2">
                    <Col className="bg-[#F4F6F8] p-2 mr-2 w-[180px] rounded-xl">
                      <Row className="items-center px-2">
                        <Avatar
                          style={{ backgroundColor: "#00B8D91F" }}
                          size={40}
                          icon={
                            <>
                              <CalenderRed />
                            </>
                          }
                        />
                        <p className="ml-[5px] text-left">
                          <p className="text-[#222222] font-semibold leading-[22px] text-sm">
                            08:00 - 17:00
                          </p>
                          <p className="text-[#222222] font-normal leading-[22px] text-sm">
                            Ca hành chính
                          </p>
                        </p>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="pt-3 w-full">
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Mã ca
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          HC
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Tên ca
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          Hành chính
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Giờ ca
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          7.5
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="pt-3 w-full">
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Bắt buộc chốt giữa ca
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          có
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Thời gian tạo
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          01-02-2024 08:05
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Người tạo
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          HCNS(group)
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="pt-3 w-full">
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Thời gian
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          08:00 - 17:00
                        </p>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p className="text-[#212B36] font-normal text-sm leading-[22px] whitespace-nowrap">
                          Thời gian nghỉ
                        </p>
                        <p className="text-[#212B36] font-semibold text-sm leading-[22px]">
                          12:00 - 13:30
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Row>
              </Col>
              <Col className="bg-white !px-3 pb-4 pt-2 mt-3 w-[290px] h-[260px]">
                <p className="text-[#222222] font-semibold text-sm leading-[22px]">
                  Thông tin nhân sự
                </p>
                <Col className="pt-2">
                  <Row className="items-center">
                    <Avatar style={{ backgroundColor: "#f56a00" }} size={32}>
                      BP
                    </Avatar>
                    <p className="text-[#212B36] font-medium leading-[22px] text-sm ml-[5px] text-left">
                      <p>Bùi Duy Phương</p>
                    </p>
                  </Row>
                </Col>
                <p className="text-[#212B36] font-normal text-sm leading-[22px] pt-2">
                  Mã nhân viên
                </p>
                <p className="text-[#212B36] font-semibold text-sm leading-[22px] pt-2">
                  NV-11
                </p>
                <p className="text-[#212B36] font-normal text-sm leading-[22px] pt-2">
                  Chức vụ
                </p>
                <p className="text-[#212B36] font-semibold text-sm leading-[22px] pt-2">
                  Nhân viên thiết kế
                </p>
                <p className="text-[#212B36] font-normal text-sm leading-[22px] pt-2">
                  Bộ phận
                </p>
                <p className="text-[#212B36] font-semibold text-sm leading-[22px] pt-2">
                  PTSP.ERP
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </TabPane>
      <TabPane tab="Chấm công" key="2">
        <TableCustom dataSource={data} columns={columns} pagination={false} />
      </TabPane>
      <TabPane tab="Đơn từ" key="3">
        <div className="pl-4 pb-6">
          <div className="text-[#222222] font-semibold text-sm leading-[22px] w-full">
            Ca làm việc
          </div>
          <Row gutter={[8, 8]} className="pt-2">
            <Col className="bg-[#F4F6F8] p-2 mr-4  rounded-xl">
              <Row className="items-center px-2">
                <Avatar
                  style={{ backgroundColor: "#00B8D91F" }}
                  size={40}
                  icon={
                    <>
                      <CalenderRed />
                    </>
                  }
                />
                <p className="ml-[5px] text-left">
                  <p className="text-[#222222] font-semibold leading-[22px] text-sm">
                    08:00 - 17:00
                  </p>
                  <p className="text-[#222222] font-normal leading-[22px] text-sm">
                    Ca hành chính
                  </p>
                </p>
              </Row>
            </Col>
            <Col className="bg-[#F4F6F8] p-2 mr-4  rounded-xl">
              <Row className="items-center px-2">
                <Avatar
                  style={{ backgroundColor: "#00B8D91F" }}
                  size={40}
                  icon={
                    <>
                      <CalenderRed />
                    </>
                  }
                />
                <p className="ml-[5px] text-left">
                  <p className="text-[#222222] font-semibold leading-[22px] text-sm">
                    08:00 - 17:00
                  </p>
                  <p className="text-[#222222] font-normal leading-[22px] text-sm">
                    Ca hành chính
                  </p>
                </p>
              </Row>
            </Col>
          </Row>
        </div>
      </TabPane>
      <TabPane tab="Ngày nghỉ" key="4"></TabPane>
      <TabPane tab="Thông tin điều chỉnh" key="5"></TabPane>
    </TabsModal>
  );
}

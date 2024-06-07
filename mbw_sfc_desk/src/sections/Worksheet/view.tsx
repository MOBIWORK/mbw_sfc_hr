import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Row,
  Select,
} from "antd";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Detailmodal from "./modal/detailmodal";
import { ModalDetail } from "./components/modal";
import dayjs from "dayjs";
import { monthAll } from "./modal/data";

import {
  DropDownCustom,
  FormItemCustom,
  HeaderPage,
  TableCustom,
} from "../../components";
import { ContentPage } from "../../components/content-page";
import { TabsCustom } from "../../components/tabs/tabs";
import useDebounce from "../../hooks/useDebount";
import { getDaysAndWeekdays } from "../../util";
import { AxiosService } from "../../services/server";
import { EllipsisOutlined } from "@ant-design/icons";
import { data1, data2, data3 } from "../Salary/data";
import { useResize } from "../../hooks";
import Tab2 from "./tab/tab2";

const { TabPane } = TabsCustom;
const { Column, ColumnGroup } = TableCustom;

// const data = [
//   {
//     key: "1",
//     employee: "Helllo",
//     tgc: "tgc",
//     depart: "Phòng Số 1",
//     t2: "1",
//   },
// ];

export default function Worksheet() {
  const [total, setTotal] = useState<number>(0);
  const [total1, setTotal1] = useState<number>(0);
  const [year, setYear] = useState<any>(dayjs().startOf("year"));
  const [month, setMonth] = useState(dayjs().month() + 1);
  // dayjs().month() + 1
  const [listDepartment, setListDepartment] = useState<any[]>([]);
  const [department, setDepartment] = useState("");
  const [keySDepartment, setKeySDepartment] = useState("");
  let keySearchDepartment = useDebounce(keySDepartment, 500);
  const [employee, setEmployee] = useState("");
  const PAGE_SIZE = 5;
  const [page, setPage] = useState<number>(1);
  const [page1, setPage1] = useState<number>(1);
  const [listEmployee, setListEmployee] = useState<any[]>([]);
  const [keySEmployee, setKeySEmployee] = useState("");
  let keySearchEmployee = useDebounce(keySEmployee, 500);
  const size = useResize();
  const [scrollYTable, setScrollYTable] = useState<number>(size?.h * 0.68);
  const containerRef = useRef(null);
  const [scrollYTable1, setScrollYTable1] = useState<number>(size?.h * 0.68);
  const containerRef1 = useRef(null);
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const [dataReort, setDataReport] = useState<{ data: any[] }>({ data: [] });
  const [dataReort1, setDataReport1] = useState<{ data: any[] }>({ data: [] });
  const [clDate, setClDate] = useState<{ date: number; dayOfWeek: string }[]>(
    getDaysAndWeekdays(month, year)
  );
  const [modal, setModal] = useState<{
    open: boolean;
    id: any;
  }>({
    open: false,
    id: null,
  });

  const closeModal = () => {
    setModal({
      open: false,
      id: null,
    });
  };

  useEffect(() => {
    setClDate(getDaysAndWeekdays(month, year));
  }, [month, year]);

  useEffect(() => {
    (async () => {
      let rsDepartment: any = await AxiosService.get(
        "/api/method/frappe.desk.search.search_link",
        {
          params: {
            txt: keySearchDepartment,
            doctype: "Department",
            ignore_user_permissions: 0,
            query: "",
          },
        }
      );

      let { message: results } = rsDepartment;

      setListDepartment(
        results.map((dtDepartment: any) => ({
          value: dtDepartment.value.trim(),
          label: dtDepartment.value.trim(),
        }))
      );
    })();
  }, [keySearchDepartment]);

  useEffect(() => {
    (async () => {
      let rsEmployee: any = await AxiosService.get(
        "/api/method/frappe.desk.search.search_link",
        {
          params: {
            txt: keySearchEmployee,
            doctype: "Employee",
            ignore_user_permissions: 0,
            query: "",
          },
        }
      );

      let { message: results } = rsEmployee;

      setListEmployee(
        results.map((dtEmployee: any) => ({
          value: dtEmployee.value.trim(),
          label: dtEmployee.description.trim(),
        }))
      );
    })();
  }, [keySearchEmployee]);

  useEffect(() => {
    (async () => {
      let columnDayWeek = getDaysAndWeekdays(month, year["$y"]);
      setClDate(getDaysAndWeekdays(month, year["$y"]));

      const rsData = await AxiosService.get(
        "/api/method/mbw_sfc_integrations.sfc_integrations.attendance.get_attendance",
        {
          params: {
            page_size: PAGE_SIZE,
            page_number: page,
            month: month,
            year: year["$y"],
            employee: employee,
            department: department,
          },
        }
      );

      let { result: results } = rsData;

      setDataReport({
        ...results,
        data: results?.data.map((dt: any) => {
          columnDayWeek.forEach((at: any) => {
            let dateW = dt.attendance_daily.find(
              (atdate: any) =>
                Number.parseInt(atdate.att_day.split("-")[2]) == at.date
            );
            dt[at.date] = { ...dateW, ...at };
          });
          return dt;
        }),
      });
      setTotal(results?.totals);
    })();
  }, [month, year, page, employee, department]);

  useEffect(() => {
    (async () => {
      const rsData = await AxiosService.get(
        "/api/method/mbw_sfc_integrations.sfc_integrations.attendance.get_attendance",
        {
          params: {
            page_size: PAGE_SIZE,
            page_number: page1,
            month: month,
            year: year["$y"],
            employee: employee,
            department: department,
          },
        }
      );

      let { result: results } = rsData;

      setDataReport1(results);
      setTotal1(results?.totals);
    })();
  }, [month, year, page1]);

  useEffect(() => {
    setScrollYTable(size.h * 0.52);
    setScrollYTable1(size.h * 0.52);
  }, [size]);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (containerElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          console.log("================",entry.contentRect.height);
          
          setContainerHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerElement);
      return () => resizeObserver.disconnect();
    }
  }, [containerRef]);

  useEffect(() => {
    if ( containerRef1.current) {
      const containerElement = containerRef1.current;
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerElement);
      return () => resizeObserver.disconnect();
    }
  }, [containerRef1]);

  console.log("abc", containerHeight);
  

  return (
    <>
      <HeaderPage
        title="Bảng chấm công"
        customButton={
          <>
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <DropDownCustom>
                  <div className="-m-2">
                    <div className="py-2 px-4 cursor-pointer hover:bg-[#f5f5f5] w-[168px]">
                      Xuất Excel
                    </div>
                    <div className="py-2 px-4 cursor-pointer hover:bg-[#f5f5f5] w-[168px]">
                      Đóng
                    </div>
                    <div className="py-2 px-4 cursor-pointer hover:bg-[#f5f5f5] w-[168px]">
                      Mở
                    </div>
                  </div>
                </DropDownCustom>
              )}
            >
              <Button className="!w-11" icon={<EllipsisOutlined />}></Button>
            </Dropdown>
          </>
        }
      />

      <ContentPage>
        <div className="bg-white border-[#EDEDED] border-x-[0.1px] border-[0.1px] border-solid justify-between items-end w-full p-4">
          <Row gutter={[8, 8]}>
            <Col className="pb-2" span={24}>
              <Form
                layout="vertical"
                className="flex flex-wrap justify-start items-center"
              >
                <FormItemCustom className="border-none mr-2 w-[200px]">
                  <Select
                    className="!bg-[#F4F6F8] options:bg-[#F4F6F8] !h-7 rounded-lg mt-[-2px]"
                    defaultValue={month.toString()}
                    options={monthAll}
                    onChange={(value) => {
                      setMonth(Number.parseInt(value));
                    }}
                    showSearch
                  />
                </FormItemCustom>
                <FormItemCustom className="border-none mr-2 w-[200px]">
                  <DatePicker
                    className="!bg-[#F4F6F8] !h-7 rounded-lg mt-[-2px]"
                    onChange={(value: any) => {
                      setYear(value);
                    }}
                    picker="year"
                    defaultValue={dayjs().startOf("year")}
                  />
                </FormItemCustom>
                <FormItemCustom className="border-none mr-2 w-[200px]">
                  <Select
                    className="!bg-[#F4F6F8] options:bg-[#F4F6F8] rounded-lg"
                    options={listDepartment}
                    onSelect={(value) => {
                      setDepartment(value);
                    }}
                    onSearch={(value: string) => {
                      setKeySDepartment(value);
                    }}
                    onClear={() => setDepartment("")}
                    filterOption={false}
                    allowClear
                    placeholder="Tất cả phòng ban"
                  />
                </FormItemCustom>
                <FormItemCustom className="border-none mr-2 w-[200px]">
                  <Select
                    className="!bg-[#F4F6F8] options:bg-[#F4F6F8] rounded-lg"
                    options={listEmployee}
                    onSelect={(value) => {
                      setEmployee(value);
                    }}
                    onSearch={(value: string) => {
                      setKeySEmployee(value);
                    }}
                    onClear={() => setEmployee("")}
                    filterOption={false}
                    allowClear
                    placeholder="Tất cả nhân viên"
                  />
                </FormItemCustom>
              </Form>
            </Col>
          </Row>
        </div>

        <TabsCustom defaultActiveKey="1">
          <TabPane className="bg-white pb-3" tab="Bảng công" key="1">
            <div ref={containerRef} className="w-full h-auto">
              <TableCustom
                dataSource={dataReort?.data?.map((report: any) => ({
                  key: report.name,
                  ...report,
                }))}
                pagination={
                  total && total > PAGE_SIZE
                    ? {
                        pageSize: PAGE_SIZE,
                        showSizeChanger: false,
                        total,
                        onChange(page) {
                          setPage(page);
                        },
                      }
                    : false
                }
                bordered
                scroll={{
                  x: true,
                  y: containerHeight < 300 ? undefined : scrollYTable,
                }}
              >
                <Column
                  title="STT"
                  dataIndex="stt"
                  key="stt"
                  className="!text-center !min-w-[60px]"
                  render={(_: any, record: any, index: number) => index + 1}
                />
                <Column
                  title="Nhân viên"
                  dataIndex="employee1"
                  key="employee1"
                  className="!text-left !p-2"
                  render={(_: any, record: any) => (
                    <Row className="items-center flex-nowrap">
                      <Avatar style={{ backgroundColor: "#f56a00" }} size={32}>
                        {!record?.user_image &&
                          record?.employee_name
                            .split(" ")
                            .reduce(
                              (prev: string, now: string) =>
                                `${prev[0] || ""}${now[0]}`,
                              ""
                            )}
                      </Avatar>
                      <p className="text-base font-medium  ml-[5px] text-left">
                        <p className="truncate">{record.employee_name}</p>
                        <p className="text-xs text-[#637381] font-normal">
                          {record.employee}
                        </p>
                      </p>
                    </Row>
                  )}
                />
                <Column
                  title="Chức danh"
                  dataIndex="job_title"
                  key="job_title"
                  className="!text-left !p-2 !min-w-[175px]"
                  render={(_: any, record: any) => <>{record.job_title}</>}
                />

                <Column
                  title="Phòng ban"
                  dataIndex="department"
                  key="department"
                  className="!text-left !p-2"
                  render={(_: any, record: any) => <>{record.department}</>}
                />

                {clDate.length > 0 &&
                  clDate.map((date) => (
                    <ColumnGroup
                      key={date.date}
                      title={date.date}
                      className="!w-full !text-center !p-2"
                    >
                      <Column
                        className="!text-center !whitespace-nowrap !min-w-[100px] !p-0"
                        title={date.dayOfWeek}
                        dataIndex={date.date}
                        key={date.dayOfWeek}
                        render={(value: any, record: any) => {
                          if (
                            value?.dayOfWeek === "Thứ 7" ||
                            value?.dayOfWeek === "Chủ nhật"
                          ) {
                            return (
                              <div className="bg-[#F4F6F8] !h-14 !text-center flex justify-center items-center">
                                OFF
                              </div>
                            );
                          }
                          if (value?.work_hours !== 0 && !!!value?.work_hours) {
                            switch (value?.sign) {
                              case "HE":
                                return (
                                  <div
                                    onClick={() => {
                                      // console.log(record.employee, value.att_day);
                                      setModal({
                                        open: true,
                                        id: {
                                          employee: record.employee,
                                          att_day: value.att_day,
                                        },
                                      });
                                    }}
                                    className="text-red-700 !h-14 flex justify-center items-center"
                                  >
                                    {value?.sign}
                                  </div>
                                );
                                break;
                              case "FID":
                                return (
                                  <div
                                    onClick={() => {
                                      // console.log(record.employee, value.att_day);
                                      setModal({
                                        open: true,
                                        id: {
                                          employee: record.employee,
                                          att_day: value.att_day,
                                        },
                                      });
                                    }}
                                    className="border-solid border-[red] !h-14 flex justify-center items-center"
                                  >
                                    {value?.sign}
                                  </div>
                                );
                                break;
                              case "ON":
                                return (
                                  <div
                                    onClick={() => {
                                      // console.log(record.employee, value.att_day);
                                      setModal({
                                        open: true,
                                        id: {
                                          employee: record.employee,
                                          att_day: value.att_day,
                                        },
                                      });
                                    }}
                                    className="text-yellow-500 !h-14 flex justify-center items-center"
                                  >
                                    {value?.sign}
                                  </div>
                                );
                                break;
                              case "EA":
                                return (
                                  <div
                                    onClick={() => {
                                      // console.log(record.employee, value.att_day);
                                      setModal({
                                        open: true,
                                        id: {
                                          employee: record.employee,
                                          att_day: value.att_day,
                                        },
                                      });
                                    }}
                                    className="text-green-500 !h-14 flex justify-center items-center"
                                  >
                                    v
                                  </div>
                                );
                                break;
                              default:
                                return <div>x</div>;
                            }
                          }

                          switch (value?.sign) {
                            case "HE":
                              return (
                                <div
                                  onClick={() => {
                                    // console.log(record.employee, value.att_day);
                                    setModal({
                                      open: true,
                                      id: {
                                        employee: record.employee,
                                        att_day: value.att_day,
                                        employee_name: record.employee_name,
                                        day: value.dayOfWeek,
                                      },
                                    });
                                  }}
                                  className="text-red-700 !h-14 flex justify-center items-center"
                                >
                                  {parseFloat(value?.work_hours.toFixed(2))}
                                </div>
                              );
                              break;
                            case "FID":
                              return (
                                <div
                                  onClick={() => {
                                    // console.log(record.employee, value.att_day);
                                    setModal({
                                      open: true,
                                      id: {
                                        employee: record.employee,
                                        att_day: value.att_day,
                                        employee_name: record.employee_name,
                                        day: value.dayOfWeek,
                                      },
                                    });
                                  }}
                                  className="border-solid border-[red] !h-14 flex justify-center items-center"
                                >
                                  {parseFloat(value?.work_hours.toFixed(2))}
                                </div>
                              );
                              break;
                            case "ON":
                              return (
                                <div
                                  onClick={() => {
                                    // console.log(record.employee, value.att_day);
                                    setModal({
                                      open: true,
                                      id: {
                                        employee: record.employee,
                                        att_day: value.att_day,
                                        employee_name: record.employee_name,
                                        day: value.dayOfWeek,
                                      },
                                    });
                                  }}
                                  className="text-yellow-500 !h-14 flex justify-center items-center"
                                >
                                  {parseFloat(value?.work_hours.toFixed(2))}
                                </div>
                              );
                              break;
                            case "EA":
                              return (
                                <div
                                  onClick={() => {
                                    // console.log(record.employee, value.att_day);
                                    setModal({
                                      open: true,
                                      id: {
                                        employee: record.employee,
                                        att_day: value.att_day,
                                        employee_name: record.employee_name,
                                        day: value.dayOfWeek,
                                      },
                                    });
                                  }}
                                  className="text-green-500 !h-14 flex justify-center items-center"
                                >
                                  v
                                </div>
                              );
                              break;
                            case "+":
                            case "P":
                            case "KL":
                            case "VM":
                            case "OT":
                            case "CT":
                            case "CD":
                            case "DC":
                            case "GT":
                              return (
                                <div
                                  onClick={() => {
                                    // console.log(record.employee, value.att_day);
                                    setModal({
                                      open: true,
                                      id: {
                                        employee: record.employee,
                                        att_day: value.att_day,
                                        employee_name: record.employee_name,
                                        day: value.dayOfWeek,
                                      },
                                    });
                                  }}
                                >
                                  {parseFloat(value?.work_hours.toFixed(2))}
                                  <sup>{value?.sign}</sup>
                                </div>
                              );
                              break;
                            default:
                              return (
                                <div
                                  onClick={() => {
                                    // console.log(record.employee, value.att_day);
                                    setModal({
                                      open: true,
                                      id: {
                                        employee: record.employee,
                                        att_day: value.att_day,
                                        employee_name: record.employee_name,
                                        day: value.dayOfWeek,
                                      },
                                    });
                                  }}
                                  className=" flex justify-center items-center"
                                >
                                  {parseFloat(value?.work_hours.toFixed(2))}
                                </div>
                              );
                          }
                        }}
                      />
                    </ColumnGroup>
                  ))}
              </TableCustom>
            </div>
          </TabPane>
          <TabPane className="bg-white pb-3" tab="Tổng công" key="2">
            <div ref={containerRef1} className="max-w-full">
              <TableCustom
              
                dataSource={dataReort1?.data?.map((report: any) => ({
                  key: report.name,
                  ...report,
                }))}
                bordered
                pagination={
                  total1 && total1 > PAGE_SIZE
                    ? {
                        pageSize: PAGE_SIZE,
                        showSizeChanger: false,
                        total:total1,
                        onChange(page) {
                          setPage1(page);
                        },
                      }
                    : false
                }
                scroll={{
                  x:"max-content",
                }}
              >
                <Column
                  title="STT"
                  dataIndex="stt"
                  key="stt"
                  className="!text-center"
                  render={(_: any, record: any, index: number) => index + 1}
                />
                <Column
                  title="Nhân viên"
                  dataIndex="employee1"
                  key="employee1"
                  // className="!text-left !p-2"
                  render={(_: any, record: any) => (
                    <Row className="items-center flex-nowrap">
                      <Avatar style={{ backgroundColor: "#f56a00" }} size={32}>
                        {!record?.user_image &&
                          record?.employee_name
                            .split(" ")
                            .reduce(
                              (prev: string, now: string) =>
                                `${prev[0] || ""}${now[0]}`,
                              ""
                            )}
                      </Avatar>
                      <p className="text-base font-medium  ml-[5px] text-left">
                        <p className="truncate">{record.employee_name}</p>
                        <p className="text-xs text-[#637381] font-normal">
                          {record.employee}
                        </p>
                      </p>
                    </Row>
                  )}
                />
                <Column
                  title="Chức danh"
                  dataIndex="job_title"
                  key="job_title"
                  className="!text-left !p-2"
                  // render={(_: any, record: any) => <>{record.job_title}</>}
                />

                <Column
                  title="Phòng ban"
                  dataIndex="department"
                  key="department"
                  className="!text-left !p-2"
                  // render={(_: any, record: any) => <>{record.department}</>}
                />

                <Column
                  title="Số phút đi muộn"
                  dataIndex="late_arrival_time_monthly"
                  key="late_arrival_time_monthly"
                  className="!text-center"
                  // render={(value: any, record: any) => <>{value}</>}
                />
                <Column
                  title="Số phút về sớm"
                  dataIndex="early_arrival_time_monthly"
                  key="early_arrival_time_monthly"
                  className="!text-center"
                  // render={(value: any, record: any) => <>{value}</>}
                />
                <ColumnGroup
                  className="!whitespace-normal !text-center"
                  title="Nghỉ hưởng nguyên lương"
                >
                  <Column
                    title="Phép năm"
                    dataIndex="pn"
                    key="pn"
                    className="!text-center"
                    render={(value: any) => <>-</>}
                  />
                  <Column
                    title="Lễ, chế độ"
                    dataIndex="lpd"
                    key="lpd"
                    className="!text-center"
                    render={(value: any) => <>-</>}
                  />
                  <Column
                    title="Nghỉ bù"
                    dataIndex="nb"
                    key="nb"
                    className="!text-center"
                    render={(value: any) => <>-</>}
                  />
                </ColumnGroup>
                <ColumnGroup
                  className="!whitespace-normal !text-center"
                  title="Công thường"
                >
                  <Column
                    title="Ca gẫy"
                    dataIndex="cg"
                    key="cg"
                    className="!text-center"
                    render={(value: any) => <>-</>}
                  />
                  <Column
                    title="Part time"
                    dataIndex="pt"
                    key="pt"
                    className="!text-center"
                    render={(value: any) => <>-</>}
                  />
                </ColumnGroup>
                <ColumnGroup
                  className="!whitespace-normal !text-center"
                  title="Công lễ"
                >
                  <Column
                    title="Câ gẫy"
                    dataIndex="cg1"
                    key="cg1"
                    className="!text-center"
                    render={(value: any) => <>-</>}
                  />
                  <Column
                    title="Part time"
                    dataIndex="pt1"
                    key="pt1"
                    className="!text-center"
                    render={(value: any) => <>-</>}
                  />
                </ColumnGroup>
                <Column
                  title="Công đào tạo"
                  dataIndex="cđt"
                  key="cđt"
                  className="!text-center"
                  render={(value: any) => <>-</>}
                />
                <Column
                  title="Tổng giờ công"
                  dataIndex="number_hour_shift_monthly"
                  key="number_hour_shift_monthly"
                  className="!text-center"
                  render={(value: any, record: any) => <>{value}</>}
                />
              </TableCustom>
            </div>
            {/* <Tab2 data={dataReort1}/> */}
          </TabPane>

          <TabPane className="bg-white pb-3" tab="Bảng ca" key="3">
            <TableCustom dataSource={data3} bordered scroll={{ x: true }}>
              <Column
                title="STT"
                dataIndex="stt"
                key="stt"
                className="!text-center"
                render={(_: any, record: any, index: number) => index + 1}
              />
              <Column
                title="Nhân viên"
                dataIndex="employee1"
                key="employee1"
                className="!text-left !p-2"
                render={(_: any, record: any) => (
                  <Row className="items-center flex-nowrap">
                    <Avatar style={{ backgroundColor: "#f56a00" }} size={32}>
                      {!record?.user_image &&
                        record?.employee_name
                          .split(" ")
                          .reduce(
                            (prev: string, now: string) =>
                              `${prev[0] || ""}${now[0]}`,
                            ""
                          )}
                    </Avatar>
                    <p className="text-base font-medium  ml-[5px] text-left">
                      <p className="truncate">{record.employee_name}</p>
                      <p className="text-xs text-[#637381] font-normal">
                        {record.employee}
                      </p>
                    </p>
                  </Row>
                )}
              />
              <Column
                title="Chức danh"
                dataIndex="cd11"
                key="cd11"
                className="!text-left"
                render={(value: any, record: any) => <>{value}</>}
              />
              <Column
                title="Phòng ban"
                dataIndex="depart"
                key="depart"
                className="!text-left"
                render={(value: any, record: any) => <>{value}</>}
              />
              <ColumnGroup className="!text-center" title="1">
                <Column title="Thứ 5" key="f1" dataIndex="f1" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="2">
                <Column title="Thứ 6" key="f2" dataIndex="f2" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="3">
                <Column title="Thứ 7" key="f2" dataIndex="f3" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="4">
                <Column title="Chủ Nhật" key="f3" dataIndex="f3" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="5">
                <Column title="Thứ 2" key="f5" dataIndex="f5" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="6">
                <Column title="Thứ 3" key="f6" dataIndex="f6" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="7">
                <Column title="Thứ 4" key="f7" dataIndex="f7" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="8">
                <Column title="Thứ 5" key="f8" dataIndex="f8" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="9">
                <Column title="Thứ 6" key="f9" dataIndex="f9" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="10">
                <Column title="Thứ 7" key="f10" dataIndex="f10" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="11">
                <Column title="Chủ nhật" key="f11" dataIndex="f11" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="12">
                <Column title="Thứ 2" key="f12" dataIndex="f12" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="13">
                <Column title="Thứ 3" key="f13" dataIndex="f13" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="14">
                <Column title="Thứ 4" key="f14" dataIndex="f14" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="15">
                <Column title="Thứ 5" key="f15" dataIndex="f15" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="16">
                <Column title="Thứ 6" key="f16" dataIndex="f16" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="17">
                <Column title="Thứ 7" key="f17" dataIndex="f17" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="18">
                <Column title="Chủ nhật" key="f18" dataIndex="f18" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="19">
                <Column title="Thứ 2" key="f19" dataIndex="f19" />
              </ColumnGroup>
              <ColumnGroup className="!text-center" title="20">
                <Column title="Thứ 3" key="f20" dataIndex="f20" />
              </ColumnGroup>
            </TableCustom>
          </TabPane>

          <TabPane className="bg-white pb-3" tab="Bảng giờ" key="4">
            <TableCustom dataSource={data2} bordered scroll={{ x: true }}>
              <Column
                title="STT"
                dataIndex="stt"
                key="stt"
                className="!text-center"
                render={(_: any, record: any, index: number) => index + 1}
              />
              <Column
                title="Nhân viên"
                dataIndex="employee1"
                key="employee1"
                className="!text-left !p-2"
                render={(_: any, record: any) => (
                  <Row className="items-center flex-nowrap">
                    <Avatar style={{ backgroundColor: "#f56a00" }} size={32}>
                      {!record?.user_image &&
                        record?.employee_name
                          .split(" ")
                          .reduce(
                            (prev: string, now: string) =>
                              `${prev[0] || ""}${now[0]}`,
                            ""
                          )}
                    </Avatar>
                    <p className="text-base font-medium  ml-[5px] text-left">
                      <p className="truncate">{record.employee_name}</p>
                      <p className="text-xs text-[#637381] font-normal">
                        {record.employee}
                      </p>
                    </p>
                  </Row>
                )}
              />
              <Column
                title="Chức danh"
                dataIndex="cd11"
                key="cd11"
                className="!text-left"
                render={(value: any, record: any) => <>{value}</>}
              />
              <Column
                title="Phòng ban"
                dataIndex="depart"
                key="depart"
                className="!text-left"
                render={(value: any, record: any) => <>{value}</>}
              />
              <Column
                title="Số phút đi muộn"
                dataIndex="mm"
                key="mm"
                className="!text-center"
                render={(value: any, record: any) => <>{value}</>}
              />
              <Column
                title="Số phút về sớm"
                dataIndex="mm1"
                key="mm1"
                className="!text-center"
                render={(value: any, record: any) => <>{value}</>}
              />
              <ColumnGroup
                className="!whitespace-normal !text-center"
                title="Nghỉ hưởng nguyên lương"
              >
                <Column
                  title="Phép năm"
                  dataIndex="pn"
                  key="pn"
                  className="!text-center"
                  render={(value: any) => <>{value}</>}
                />
                <Column
                  title="Lễ, chế độ"
                  dataIndex="lpd"
                  key="lpd"
                  className="!text-center"
                  render={(value: any) => <>{value}</>}
                />
                <Column
                  title="Nghỉ bù"
                  dataIndex="nb"
                  key="nb"
                  className="!text-center"
                  render={(value: any) => <>{value}</>}
                />
              </ColumnGroup>
              <ColumnGroup
                className="!whitespace-normal !text-center"
                title="Công thường"
              >
                <Column
                  title="Ca gẫy"
                  dataIndex="cg"
                  key="cg"
                  className="!text-center"
                  render={(value: any) => <>{value}</>}
                />
                <Column
                  title="Part time"
                  dataIndex="pt"
                  key="pt"
                  className="!text-center"
                  render={(value: any) => <>{value}</>}
                />
              </ColumnGroup>
              <ColumnGroup
                className="!whitespace-normal !text-center"
                title="Công lễ"
              >
                <Column
                  title="Câ gẫy"
                  dataIndex="cg1"
                  key="cg1"
                  className="!text-center"
                  render={(value: any) => <>{value}</>}
                />
                <Column
                  title="Part time"
                  dataIndex="pt1"
                  key="pt1"
                  className="!text-center"
                  render={(value: any) => <>{value}</>}
                />
              </ColumnGroup>
              <Column
                title="Công đào tạo"
                dataIndex="cđt"
                key="cđt"
                className="!text-center"
                render={(value: any) => <>{value}</>}
              />
              <Column
                title="Tổng giờ công"
                dataIndex="tgc"
                key="tgc"
                className="!text-center"
                render={(value: any) => <>{value}</>}
              />
            </TableCustom>
          </TabPane>
        </TabsCustom>

        <ModalDetail
          className="top-6"
          width={1000}
          title={
            <div className="font-semibold text-2xl leading-[22px] text-[#222222] p-5">
              {modal.id?.employee_name} - {modal.id?.day}, ngày{" "}
              {modal.id?.att_day
                ?.split("-")
                ?.reverse()
                ?.toString()
                ?.replaceAll(",", "-")}
            </div>
          }
          open={modal.open}
          onCancel={closeModal}
          footer={null}
        >
          <Detailmodal />
        </ModalDetail>
      </ContentPage>
    </>
  );
}

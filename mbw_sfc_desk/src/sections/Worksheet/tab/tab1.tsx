import React, { useEffect, useRef, useState } from "react";
import { TableCustom } from "../../../components";
import { Avatar, Row } from "antd";
import { useResize } from "../../../hooks";
import { ModalDetail } from "../components/modal";
import Detailmodal from "../modal/detailmodal";

const { Column, ColumnGroup } = TableCustom;

export default function Tab1({ data, total, setPage, page, clDate }: any) {
  const PAGE_SIZE = 20;
  const containerRef1 = useRef(null);
  const size = useResize();
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const [scrollYTable1, setScrollYTable1] = useState<number>(size?.h * 0.52);
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
    setScrollYTable1(size.h * 0.52);
  }, [size]);

  useEffect(() => {
    const containerElement = containerRef1.current;
    if (containerElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerElement);
      return () => resizeObserver.disconnect();
    }
  }, [containerRef1]);

  console.log(containerHeight);
  

  return (
    <div ref={containerRef1} className="w-full !h-auto">
      <TableCustom
        dataSource={data?.data?.map((report: any) => ({
          key: report.name,
          ...report,
        }))}
        pagination={
          total && total > PAGE_SIZE
            ? {
                pageSize: PAGE_SIZE,
                showSizeChanger: false,
                current: page,
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
          y: containerHeight < 330 ? undefined : scrollYTable1,
        }}
      >
        <Column
          title="STT"
          dataIndex="stt"
          key="stt"
          width={60}
          className="!text-center !min-w-[60px]"
          render={(_: any, record: any, index: number) => index + 1}
        />

        <Column
          title="Mã nhân viên"
          dataIndex="employee"
          key="employee"
          className="!text-left !p-2 !min-w-[150px]"
        />

        <Column
          title="Nhân viên"
          dataIndex="employee_name"
          key="employee_name"
          className="!text-left !p-2"
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
          clDate.map((date: any) => (
            <ColumnGroup
              key={date.date}
              title={date.date}
              className="!w-full !text-center !p-2 cl-c"
            >
              <Column
                className="!text-center !whitespace-nowrap !min-w-[100px] !p-0 cl-c"
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

      <ModalDetail
        className="top-6"
        width={1064}
        title={
          <div className="font-semibold text-2xl leading-[22px] text-[#222222] p-4">
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
    </div>
  );
}

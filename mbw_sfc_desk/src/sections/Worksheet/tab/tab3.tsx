import React, { useEffect, useRef, useState } from "react";
import { TableCustom } from "../../../components";
import { Avatar, Row } from "antd";
import { useResize } from "../../../hooks";

const { Column, ColumnGroup } = TableCustom;

export default function Tab3({ data, total, setPage, page, clDate }: any) {
  const PAGE_SIZE = 20;
  const containerRef1 = useRef(null);
  const size = useResize();
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const [scrollYTable1, setScrollYTable1] = useState<number>(size?.h * 0.52);

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

  return (
    <div ref={containerRef1} className="w-full h-auto">
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
                  } else if (value?.shift === undefined) {
                    return <div>x</div>;
                  } else {
                    return <div className="items-center">{value?.shift}</div>;
                  }
                }}
              />
            </ColumnGroup>
          ))}
      </TableCustom>
    </div>
  );
}

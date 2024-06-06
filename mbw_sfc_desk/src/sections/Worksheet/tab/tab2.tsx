import React, { useEffect, useRef, useState } from "react";
import { TableCustom } from "../../../components";
import { Avatar, Row } from "antd";
import { useResize } from "../../../hooks";

const { Column, ColumnGroup } = TableCustom;

export default function Tab2({  data, total, setPage, page }: any) {
  const PAGE_SIZE = 20;
  const containerRef1 = useRef(null);
  const size = useResize();
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const [scrollYTable1, setScrollYTable1] = useState<number>(size?.h * 0.68);
  // console.log("data", data);
  console.table({ page });

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

  console.log("bs", containerHeight);
  

  return (
    <div ref={containerRef1} className="w-full h-auto">
      <TableCustom
        dataSource={data?.data?.map((report: any) => ({
          key: report.name,
          ...report,
        }))}
        bordered
        pagination={
          total && total > PAGE_SIZE
            ? {
                pageSize: PAGE_SIZE,
                showSizeChanger: false,
                total,
                current:page,
                onChange(page) {
                  setPage(page);
                },
              }
            : false
        }
        scroll={{
          x: "max-content",
          y: containerHeight < 300 ? undefined : scrollYTable1,
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
          className="!text-left !p-2"
          render={(_: any, record: any) => <>{record.job_title}</>}
        />

        <Column
          title="Phòng ban"
          dataIndex="department"
          key="department"
          className="!text-left !p-2"
          render={(_: any, record: any) => <>{record.department}</>}
        />

        <Column
          title="Số phút đi muộn"
          dataIndex="late_arrival_time_monthly"
          key="late_arrival_time_monthly"
          className="!text-center"
          render={(value: any, record: any) => <>{value}</>}
        />
        <Column
          title="Số phút về sớm"
          dataIndex="early_arrival_time_monthly"
          key="early_arrival_time_monthly"
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
  );
}

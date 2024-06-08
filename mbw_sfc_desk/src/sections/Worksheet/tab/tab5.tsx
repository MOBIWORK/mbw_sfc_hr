import React, { useEffect, useRef, useState } from "react";
import { TableCustom } from "../../../components";
import { useResize } from "../../../hooks";

const { Column, ColumnGroup } = TableCustom;

export default function Tab5({ data, total, setPage, page }: any) {
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
        bordered
        pagination={
          total && total > PAGE_SIZE
            ? {
                pageSize: PAGE_SIZE,
                showSizeChanger: false,
                total,
                current: page,
                onChange(page) {
                  setPage(page);
                },
              }
            : false
        }
        scroll={{
          x: 2100,
          y: containerHeight < 300 ? undefined : scrollYTable1,
        }}
      >
        <Column
          title="STT"
          dataIndex="stt"
          key="stt"
          width={60}
          className="!text-center !min-w-[60px] c1"
          render={(_: any, record: any, index: number) => index + 1}
        />
        <Column
          title="Mã nhân viên"
          dataIndex="employee"
          key="employee"
          className="!text-left !p-2"
        />

        <Column
          title="Mã nhân viên"
          dataIndex="employee_name"
          key="employee_name"
          className="!text-left !p-2"
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
          width={130}
          dataIndex="late_arrival_time_monthly"
          key="late_arrival_time_monthly"
          className="!text-center"
          render={(value: any, record: any) => <>{value}</>}
        />
        <Column
          title="Số phút về sớm"
          width={130}
          dataIndex="early_arrival_time_monthly"
          key="early_arrival_time_monthly"
          className="!text-center"
          render={(value: any, record: any) => <>{value}</>}
        />
        <ColumnGroup
          className="!whitespace-normal !text-center !p-2"
          title="Nghỉ hưởng nguyên lương"
        >
          <Column
            width={90}
            title="Phép năm"
            // dataIndex="pn"
            key="pn"
            className="!text-center !p-2"
            render={(value: any) => <>-</>}
          />
          <Column
            width={90}
            title="Lễ, chế độ"
            // dataIndex="lpd"
            key="lpd"
            className="!text-center !p-2"
            render={(value: any) => <>-</>}
          />
          <Column
            width={90}
            title="Nghỉ bù"
            // dataIndex="nb"
            key="nb"
            className="!text-center !p-2"
            render={(value: any) => <>-</>}
          />
        </ColumnGroup>
        <ColumnGroup
          className="!whitespace-normal !text-center !p-2"
          title="Công thường"
        >
          <Column
            width={90}
            title="Ca gẫy"
            dataIndex="broken_shift_hours_monthly"
            key="broken_shift_hours_monthly"
            className="!text-center !p-2"
            render={(value: any) => <>{parseFloat(value?.toFixed(2))}</>}
          />
          <Column
            width={90}
            title="Part time"
            dataIndex="straight_shift_hours_monthly"
            key="straight_shift_hours_monthly"
            className="!text-center !p-2"
            render={(value: any) => <>{parseFloat(value?.toFixed(2))}</>}
          />
        </ColumnGroup>
        <ColumnGroup
          className="!whitespace-normal !text-center !p-2"
          title="Công lễ"
        >
          <Column
            width={90}
            title="Câ gãy"
            dataIndex="work_hours_broken_holidays_monthly"
            key="work_hours_broken_holidays_monthly"
            className="!text-center !p-2"
            render={(value: any) => <>{parseFloat(value?.toFixed(2))}</>}
          />
          <Column
            width={90}
            title="Part time"
            dataIndex="work_hours_straight_holidays_monthly"
            key="work_hours_straight_holidays_monthly"
            className="!text-center !p-2"
            render={(value: any) => <>{parseFloat(value?.toFixed(2))}</>}
          />
        </ColumnGroup>
        <Column
          width={130}
          title="Công đào tạo"
          // dataIndex="cđt"
          key="cđt"
          className="!text-center !p-2"
          render={(value: any) => <>-</>}
        />
        <Column
          width={150}
          title="Tổng ngày công"
          dataIndex="work_hours_monthly"
          key="work_hours_monthly"
          className="!text-center"
          render={(value: any) => <>{parseFloat(value?.toFixed(2))}</>}
        />
      </TableCustom>
    </div>
  );
}

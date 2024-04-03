import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { DatePicker, Select } from "antd";
import { monthAll } from "../ReportKPI/data";
import dayjs from "dayjs";
import { DatePickerProps } from "antd/lib";
import { AxiosService } from "../../services/server";
import { getDaysAndWeekdays } from "../../util";
const { Column, ColumnGroup } = TableCustom;



export default function Worksheet() {
  const [dataReort, setDataReport] = useState<any[]>([]);
  const [year,setYear] = useState(dayjs().startOf("year"))
  const [month,setMonth] = useState(dayjs().month() + 1)
  const [clDate,setClDate] = useState<{date:number,dayOfWeek: string}[]>(getDaysAndWeekdays(month,2024))
  const onChange: DatePickerProps["onChange"] = (date) => {
    // setFYear(date?.["$y"].toString());
    console.log(date);
  };
console.table({getDaysAndWeekdays: getDaysAndWeekdays(month,2024)});

  useEffect(() => {
    (async () => {
      const rsData = await AxiosService.get(
        "/api/method/mbw_sfc_integrations.sfc_integrations.attendance.get_attendance"
      );

      let { result: results } = rsData;
      console.log("data:", results);
      setDataReport(results);
    })();
  }, []);
  useEffect(() => {
    setClDate(getDaysAndWeekdays(month,year))
  },[month,year])

  return (
    <>
      <HeaderPage
        title="Bảng công"
        buttons={[
          {
            label: "Xuất dữ liệu",
            type: "primary",
            icon: <VerticalAlignBottomOutlined className="text-xl" />,
            size: "20px",
            className: "flex items-center",
          },
        ]}
      />
      <div className="bg-white rounded-md py-7  border-[#DFE3E8] border-[0.2px] border-solid">
        <div className="px-4 flex justify-start items-center">
          <FormItemCustom className="w-[200px] border-none mr-2">
            <Select
              className="!bg-[#F4F6F8] options:bg-[#F4F6F8]"
              defaultValue={month.toString()}
              options={monthAll}
              onChange={(value) => {
                setMonth(Number.parseInt(value))
                
              }}
              showSearch
            />
          </FormItemCustom>
          <FormItemCustom className="w-[200px] border-none mr-2">
            <DatePicker
              className="!bg-[#F4F6F8] !h-8"
              onChange={(value:any) => {
                setYear(value['$y'])
              }}
              picker="year"
              defaultValue={dayjs().startOf("year")}
            />
          </FormItemCustom>
        </div>

        <div className="pt-5">
          <TableCustom
            dataSource={dataReort?.data?.map((report: any) => ({
              key: report.name,
              ...report,
            }))}
            bordered
            scroll={{ x: true }}
          >
            <ColumnGroup title="Thông tin nhân viên" className="!min-w-[670px]">
              <Column
                className="!text-center"
                title="STT"
                dataIndex="stt"
                key="stt"
                render={(_: any, record: any, index: number) => index + 1}
              />
              <Column
                className="!text-center"
                title="Mã nhân viên"
                dataIndex="employee"
                key="employee"
              />
              <Column
                className="!text-center"
                title="Nhân viên"
                dataIndex="employee_name"
                key="employee_name"
              />
              <Column
                className="!text-center"
                title="Chức danh"
                dataIndex="job_title"
                key="job_title"
              />
              <Column
                className="!text-center"
                title="Phòng ban"
                dataIndex="department"
                key="department"
              />
            </ColumnGroup>
            <ColumnGroup title="Cộng tổng" className="!min-w-[205px]">
              <Column
                className="!text-center"
                title="Số giờ"
                dataIndex="number_of_hours_monthly"
                key="number_of_hours_monthly"
              />
              <Column
                className="!text-center"
                title="Số công"
                dataIndex="work_hours_monthly"
                key="work_hours_monthly"
              />
            </ColumnGroup>

            {/* cái này để map */}
            {clDate.length > 0 && clDate.map(date => <ColumnGroup title={date.dayOfWeek} className="!min-w-[100px] !text-center">
              <Column
                className="!text-center"
                title={date.date}
                dataIndex={date.date}
                key="f7"
              />
            </ColumnGroup>)}
            

            {/* {dateColumn.map((dColumn) => (
              <ColumnGroup
                key={dColumn.date}
                className="!whitespace-normal"
                width={180}
                title={`Ngày ${dayjs(dColumn.date, "DD/MM/YYYY").date()}`}
              >
                <Column
                  className="!text-center"
                  title={dColumn.dayOfWeek}
                  dataIndex="f7"
                  key="f7"
                />
              </ColumnGroup>
            ))} */}

            <ColumnGroup title="Tổng hợp đi muộn" className="!min-w-[320px]">
              <Column
                className="!text-center"
                title="Số phút"
                dataIndex="late_arrival_time_monthly"
                key="late_arrival_time_monthly"
              />
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="number_of_late_arrival"
                key="number_of_late_arrival"
              />
              <Column
                className="!text-center"
                title="Công muộn"
                dataIndex="late_arrival_work_monthly"
                key="late_arrival_work_monthly"
              />
            </ColumnGroup>
            <ColumnGroup title="Tổng hợp về sớm" className="!min-w-[320px]">
              <Column
                className="!text-center"
                title="Số phút"
                dataIndex="early_arrival_time_monthly"
                key="early_arrival_time_monthly"
              />
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="number_of_early_arrival"
                key="number_of_early_arrival"
              />
              <Column
                className="!text-center"
                title="Công sớm"
                dataIndex="early_arrival_work_monthly"
                key="early_arrival_work_monthly"
              />
            </ColumnGroup>
            <ColumnGroup title="Tổng hợp vắng mặt" className="!min-w-[320px]">
              <Column
                className="!text-center"
                title="Số phút"
                dataIndex="number_hour_absent_monthly"
                key="number_hour_absent_monthly"
              />
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="number_absent"
                key="number_absent"
              />
              <Column
                className="!text-center"
                title="Công sớm"
                dataIndex="number_work_absent_monthly"
                key="number_work_absent_monthly"
              />
            </ColumnGroup>
            <ColumnGroup title="Quên chốt" className="!min-w-[130px]">
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="number_of_breaktime"
                key="number_of_breaktime"
              />
            </ColumnGroup>
            <ColumnGroup
              title="Tổng hợp nghỉ không lý do"
              className="!min-w-[265px] !text-center"
            >
              <Column
                className="!text-center"
                title="Số công"
                dataIndex="number_work_unexplain_absence_monthly"
                key="number_work_unexplain_absence_monthly"
              />
            </ColumnGroup>
            <ColumnGroup title="Tổng hợp nghỉ lý do" className="!min-w-[320px]">
              <Column
                className="!text-center"
                title="Tổng công"
                dataIndex="number_work_explain_absence_monthly"
                key="number_work_explain_absence_monthly"
              />
              <Column
                className="!text-center"
                title="Tổng giờ"
                dataIndex="number_hour_explain_absence_monthly"
                key="number_hour_explain_absence_monthly"
              />
            </ColumnGroup>
            <ColumnGroup title="Tổng hợp Công chính" className="!min-w-[334px]">
              <Column
                className="!text-center"
                title="Công ca"
                dataIndex="number_work_shift_monthly"
                key="number_work_shift_monthly"
              />
              <Column
                className="!text-center"
                title="Công lễ"
                dataIndex="number_of_holiday_monthly"
                key="number_of_holiday_monthly"
              />
              <Column
                className="!text-center"
                title="Công tác"
                dataIndex="work_of_mission_monthly"
                key="work_of_mission_monthly"
              />
            </ColumnGroup>
            <ColumnGroup title="Tổng hợp làm thêm" className="!min-w-[1150px]">
              <Column
                className="!text-center"
                title="Giờ nghỉ"
                dataIndex="extra_hour_off_monthly"
                key="extra_hour_off_monthly"
              />
              <Column
                className="!text-center"
                title="Nghỉ ngày"
                dataIndex="extra_hour_off_day_monthly"
                key="extra_hour_off_day_monthly"
              />
              <Column
                className="!text-center"
                title="Nghỉ đêm"
                dataIndex="extra_hour_off_night_monthly"
                key="extra_hour_off_night_monthly"
              />
              <Column
                className="!text-center"
                title="Giờ lễ"
                dataIndex="extra_hour_holiday_monthly"
                key="extra_hour_holiday_monthly"
              />
              <Column
                className="!text-center"
                title="Lễ ngày"
                dataIndex="extra_hour_holiday_day_monthly"
                key="extra_hour_holiday_day_monthly"
              />
              <Column
                className="!text-center"
                title="Lễ đêm"
                dataIndex="extra_hour_holiday_night_monthly"
                key="extra_hour_holiday_night_monthly"
              />
              <Column
                className="!text-center"
                title="Giờ ngày"
                dataIndex="extra_hour_monthly"
                key="extra_hour_monthly"
              />
              <Column
                className="!text-center"
                title="Ngày"
                dataIndex="extra_hour_day_monthly"
                key="extra_hour_day_monthly"
              />
              <Column
                className="!text-center"
                title="Đêm"
                dataIndex="extra_hour_night_monthly"
                key="extra_hour_night_monthly"
              />
              <Column
                className="!text-center"
                title="Tổng giờ"
                dataIndex="extra_hours_monthly"
                key="extra_hours_monthly"
              />
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="number_of_extra_hour"
                key="number_of_extra_hour"
              />
            </ColumnGroup>

            <ColumnGroup title="Tổng hợp tăng ca" className="!min-w-[1150px]">
              <Column
                className="!text-center"
                title="Giờ nghỉ"
                dataIndex="overtime_hour_off_monthly"
                key="overtime_hour_off_monthly"
              />
              <Column
                className="!text-center"
                title="Giờ lễ"
                dataIndex="overtime_hour_holiday_monthly"
                key="overtime_hour_holiday_monthly"
              />
              <Column
                className="!text-center"
                title="Giờ ngày"
                dataIndex="overtime_hours_monthly"
                key="overtime_hours_monthly"
              />
              <Column
                className="!text-center"
                title="Tổng giờ"
                dataIndex="overtime_hour_total"
                key="overtime_hour_total"
              />
              <Column
                className="!text-center"
                title="Công nghỉ"
                dataIndex="overtime_work_off_monthly"
                key="overtime_work_off_monthly"
              />
              <Column
                className="!text-center"
                title="Công lễ"
                dataIndex="overtime_work_holiday_monthly"
                key="overtime_work_holiday_monthly"
              />
              <Column
                className="!text-center"
                title="Công ngày"
                dataIndex="overtime_works_monthly"
                key="overtime_works_monthly"
              />
              <Column
                className="!text-center"
                title="Số công"
                dataIndex="overtime_works_total"
                key="overtime_works_total"
              />
              <Column
                className="!text-center"
                title="Công chuẩn"
                dataIndex="overtime_works_extract"
                key="overtime_works_extract"
              />
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="number_of_overtime"
                key="number_of_overtime"
              />
            </ColumnGroup>
            <ColumnGroup title="Tổng hợp qua ngày" className="!min-w-[585px]">
              <Column
                className="!text-center"
                title="Số giờ"
                dataIndex="throughout_hour_monthly"
                key="throughout_hour_monthly"
              />
              <Column
                className="!text-center"
                title="Số công"
                dataIndex="throughout_work_monthly"
                key="throughout_work_monthly"
              />
              <Column
                className="!text-center"
                title="Công thực tế"
                dataIndex="throughout_work_extract_monthly"
                key="throughout_work_extract_monthly"
              />
              <Column
                className="!text-center"
                title="Giờ thực tế"
                dataIndex="throughout_hour_extract_monthly"
                key="throughout_hour_extract_monthly"
              />
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="throughout_number"
                key="throughout_number"
              />
            </ColumnGroup>
            <ColumnGroup
              title="Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)"
              className="!min-w-[585px]"
            >
              <Column
                className="!text-center"
                title="Số công"
                dataIndex="hc_work_monthly"
                key="hc_work_monthly"
              />
              <Column
                className="!text-center"
                title="Số giờ"
                dataIndex="hc_hour_monthly"
                key="hc_hour_monthly"
              />
              <Column
                className="!text-center"
                title="Công thực tế"
                dataIndex="hc_work_extract_monthly"
                key="hc_work_extract_monthly"
              />
              <Column
                className="!text-center"
                title="Giờ thực tế"
                dataIndex="hc_hour_extract_monthly"
                key="hc_hour_extract_monthly"
              />
              <Column
                className="!text-center"
                title="Số lần"
                dataIndex="hc_number"
                key="hc_number"
              />
            </ColumnGroup>
            <ColumnGroup
              title="Tổng hợp làm việc ngày lễ"
              className="!min-w-[260px]"
            >
              <Column
                className="!text-center"
                title="Số công"
                dataIndex="number_work_holiday_monthly"
                key="number_work_holiday_monthly"
              />
              <Column
                className="!text-center"
                title="Số giờ"
                dataIndex="number_hour_holiday_monthly"
                key="number_hour_holiday_monthly"
              />
            </ColumnGroup>
            <ColumnGroup
              title="Tổng hợp ngày chấm công"
              className="!min-w-[260px] !text-center"
            >
              <Column
                className="!text-center"
                title="Số ngày"
                dataIndex="number_of_day_work"
                key="number_of_day_work"
              />
            </ColumnGroup>
            <ColumnGroup
              title="Tổng hợp công chuẩn"
              className="!min-w-[220px] !text-center"
            >
              <Column
                className="!text-center"
                title="Công chuẩn"
                dataIndex="number_work_shift_monthly"
                key="number_work_shift_monthly"
              />
            </ColumnGroup>
          </TableCustom>
        </div>
      </div>
    </>
  );
}

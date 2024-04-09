import { DownOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { Button, Checkbox, DatePicker, Modal, Select, Tree } from "antd";
import { monthAll } from "../ReportKPI/data";
import dayjs from "dayjs";
import { AxiosService } from "../../services/server";
import { getDaysAndWeekdays } from "../../util";
import useDebounce from "../../hooks/useDebount";
import DetailModal from "./modal/detail";
const { Column, ColumnGroup } = TableCustom;

export default function Worksheet() {
  const [dataReort, setDataReport] = useState<any[]>([]);
  const [year, setYear] = useState(dayjs().startOf("year"));
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 20;
  const [total, setTotal] = useState<number>(0);
  const [employee, setEmployee] = useState("");
  const [listEmployee, setListEmployee] = useState<any[]>([]);
  const [keySEmployee, setKeySEmployee] = useState("");
  let keySearchEmployee = useDebounce(keySEmployee, 500);
  const [listCompany, setListCompany] = useState<any[]>([]);
  const [company, setCompany] = useState("");
  const [keySCompany, setKeySCompany] = useState("");
  let keySearchCompany = useDebounce(keySCompany, 500);
  const [listDepartment, setListDepartment] = useState<any[]>([]);
  const [department, setDepartment] = useState("");
  const [keySDepartment, setKeySDepartment] = useState("");
  let keySearchDepartment = useDebounce(keySDepartment, 500);
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showColumns, setShowColumns] = useState<any>({
    employee: true,
    employee_name: true,
    job_title: true,
    department: true,
    // cong_tong: true,
    number_of_hours_monthly: true,
    work_hours_monthly: true,
    //Tổng hợp đi muộn
    late_arrival_time_monthly: true,
    number_of_late_arrival: true,
    late_arrival_work_monthly: true,
    //Tổng hợp về sớm
    early_arrival_time_monthly: true,
    number_of_early_arrival: true,
    early_arrival_work_monthly: true,
    //Tổng hợp vắng mặt
    number_hour_absent_monthly: true,
    number_absent: true,
    number_work_absent_monthly: true,
    number_of_breaktime: true,
    //Tổng hợp nghỉ không lý do
    number_work_unexplain_absence_monthly: true,
    //Tổng hợp nghỉ lý do
    number_work_explain_absence_monthly: true,
    number_hour_explain_absence_monthly: true,
    //Tổng hợp Công chính
    number_work_shift_monthly: true,
    number_of_holiday_monthly: true,
    work_of_mission_monthly: true,
    //Tổng hợp làm thêm
    extra_hour_off_monthly: true,
    extra_hour_off_day_monthly: true,
    extra_hour_off_night_monthly: true,
    extra_hour_holiday_monthly: true,
    extra_hour_holiday_day_monthly: true,
    extra_hour_holiday_night_monthly: true,
    extra_hour_monthly: true,
    extra_hour_day_monthly: true,
    extra_hour_night_monthly: true,
    extra_hours_monthly: true,
    number_of_extra_hour: true,
    //Tổng hợp tăng ca
    overtime_hour_off_monthly: true,
    overtime_hour_holiday_monthly: true,
    overtime_hours_monthly: true,
    overtime_hour_total: true,
    overtime_work_off_monthly: true,
    overtime_work_holiday_monthly: true,
    overtime_works_monthly: true,
    overtime_works_total: true,
    overtime_works_extract: true,
    number_of_overtime: true,
    //Tổng hợp qua ngày
    throughout_hour_monthly: true,
    throughout_work_monthly: true,
    throughout_work_extract_monthly: true,
    throughout_hour_extract_monthly: true,
    throughout_number: true,
    //Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)
    hc_work_monthly: true,
    hc_hour_monthly: true,
    hc_work_extract_monthly: true,
    hc_hour_extract_monthly: true,
    hc_number: true,
    //Tổng hợp làm việc ngày lễ
    number_work_holiday_monthly: true,
    number_hour_holiday_monthly: true,
    //Tổng hợp ngày chấm công
    number_of_day_work: true,
  });

  const treeData = [
    {
      title: "Mã nhân viên",
      key: "employee",
    },
    {
      title: "Nhân viên",
      key: "employee_name",
    },
    {
      title: "Chức danh",
      key: "job_title",
    },
    {
      title: "Phòng ban",
      key: "department",
    },
    {
      title: "Công tổng",
      key: "cong_tong",
      children: [
        { title: "Số giờ", key: "number_of_hours_monthly" },
        { title: "Số công", key: "work_hours_monthly" },
      ],
    },
    {
      title: "Tổng hợp đi muộn",
      key: "tong_hop_di_muon",
      children: [
        { title: "Số phút", key: "late_arrival_time_monthly" },
        { title: "Số lần", key: "number_of_late_arrival" },
        { title: "Công muộn", key: "late_arrival_work_monthly" },
      ],
    },
    {
      title: "Tổng hợp về sớm",
      key: "tong_hop_ve_som",
      children: [
        { title: "Số phút", key: "early_arrival_time_monthly" },
        { title: "Số lần", key: "number_of_early_arrival" },
        { title: "Công muộn", key: "early_arrival_work_monthly" },
      ],
    },
    {
      title: "Tổng hợp vắng mặt",
      key: "tong_hop_vang_mat",
      children: [
        { title: "Số phút", key: "number_hour_absent_monthly" },
        { title: "Số lần", key: "number_absent" },
        { title: "Công sớm", key: "number_work_absent_monthly" },
        { title: "Quên chốt", key: "number_of_breaktime" },
      ],
    },
    {
      title: "Tổng hợp nghỉ không lý do",
      key: "tong_hop_nghi_khong_ly_do",
      children: [
        { title: "Số công", key: "number_work_unexplain_absence_monthly" },
      ],
    },
    {
      title: "Tổng hợp nghỉ lý do",
      key: "tong_hop_nghi_ly_do",
      children: [
        {
          title: "Tổng công (P-Công,KL-Công,...)",
          key: "number_work_explain_absence_monthly",
        },
        {
          title: "Tổng giờ (P-Giờ, KL-Giờ,...)",
          key: "number_hour_explain_absence_monthly",
        },
      ],
    },
    {
      title: "Tổng hợp Công chính",
      key: "tong_hop_nghi_cong_chinh",
      children: [
        {
          title: "Công ca (Tổng hợp Công chuẩn-Công chuẩn)",
          key: "number_work_shift_monthly",
        },
        { title: "Công lễ", key: "number_of_holiday_monthly" },
        { title: "Công tác", key: "work_of_mission_monthly" },
      ],
    },
    {
      title: "Tổng hợp làm thêm",
      key: "tong_hop_lam_them",
      children: [
        { title: "Giờ nghỉ", key: "extra_hour_off_monthly" },
        { title: "Nghỉ ngày", key: "extra_hour_off_day_monthly" },
        { title: "Nghỉ đêm", key: "extra_hour_off_night_monthly" },
        { title: "Giờ lễ", key: "extra_hour_holiday_monthly" },
        { title: "Lễ ngày", key: "extra_hour_holiday_day_monthly" },
        { title: "Lễ đêm", key: "extra_hour_holiday_night_monthly" },
        { title: "Giờ ngày", key: "extra_hour_monthly" },
        { title: "Ngày", key: "extra_hour_day_monthly" },
        { title: "Đêm", key: "extra_hour_night_monthly" },
        { title: "Tổng giờ	", key: "extra_hours_monthly" },
        { title: "Số lần	", key: "number_of_extra_hour" },
      ],
    },
    {
      title: "Tổng hợp tăng ca",
      key: "tong_hop_tang_ca",
      children: [
        { title: "Giờ nghỉ", key: "overtime_hour_off_monthly" },
        { title: "Giờ lễ", key: "overtime_hour_holiday_monthly" },
        { title: "Giờ ngày", key: "overtime_hours_monthly" },
        { title: "Tổng giờ", key: "overtime_hour_total" },
        { title: "Công nghỉ", key: "overtime_work_off_monthly" },
        { title: "Công lễ", key: "overtime_work_holiday_monthly" },
        { title: "Công ngày", key: "overtime_works_monthly" },
        { title: "Số công", key: "overtime_works_total" },
        { title: "Công chuẩn", key: "overtime_works_extract" },
        { title: "Số lần", key: "number_of_overtime" },
      ],
    },
    {
      title: "Tổng hợp qua ngày",
      key: "tong_hop_qua_ngay",
      children: [
        { title: "Số giờ", key: "throughout_hour_monthly" },
        { title: "Số công", key: "throughout_work_monthly" },
        { title: "Công thực tế", key: "throughout_work_extract_monthly" },
        { title: "Giờ thực tế", key: "throughout_hour_extract_monthly" },
        { title: "Số lần", key: "throughout_number" },
      ],
    },
    {
      title: "Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)",
      key: "tong_hop_HC,CS",
      children: [
        { title: "Số công", key: "hc_work_monthly" },
        { title: "Số giờ", key: "hc_hour_monthly" },
        { title: "Công thực tế", key: "hc_work_extract_monthly" },
        { title: "Giờ thực tế", key: "hc_hour_extract_monthly" },
        { title: "Số lần", key: "hc_number" },
      ],
    },
    {
      title: "Tổng hợp làm việc ngày lễ",
      key: "tong_hop_lam_viec_ngay_le",
      children: [
        { title: "Số công", key: "number_work_holiday_monthly" },
        { title: "Số giờ", key: "number_hour_holiday_monthly" },
      ],
    },
    {
      title: "Tổng hợp ngày chấm công",
      key: "tong_hop_ngay_cham_cong",
      children: [{ title: "Số ngày", key: "number_of_day_work" }],
    },
  ];

  const handleShowColumnModal = () => {
    setIsModalVisible(true);
  };

  const handleColumnModalOk = () => {
    setIsModalVisible(false);
  };

  const handleColumnModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleTreeSelect = (selectedKeys: any) => {
    const selectedColumns: any = {};

    // Reset all columns to false
    Object.keys(showColumns).forEach((columnName: any) => {
      selectedColumns[columnName] = false;
    });

    // Set selected columns to true based on selected keys
    selectedKeys.forEach((key: any) => {
      selectedColumns[key] = true;
    });

    setShowColumns(selectedColumns);
  };

  const closeModal = () => {
    setModal({
      open: false,
      id: null,
    });
  };

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
          value: dtEmployee.value,
          label: dtEmployee.description,
          des: dtEmployee.description,
        }))
      );
    })();
  }, [keySearchEmployee]);

  useEffect(() => {
    (async () => {
      let rsCompany: any = await AxiosService.get(
        "/api/method/frappe.desk.search.search_link",
        {
          params: {
            txt: keySearchCompany,
            doctype: "Company",
            ignore_user_permissions: 0,
            query: "",
          },
        }
      );

      let { message: results } = rsCompany;

      setListCompany(
        results.map((dtCompany: any) => ({
          value: dtCompany.value,
          label: dtCompany.value,
        }))
      );
    })();
  }, [keySearchCompany]);

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
      let columnDayWeek = getDaysAndWeekdays(month, year["$y"]);
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
      setClDate(getDaysAndWeekdays(month, year["$y"]));
      setTotal(results.totals);
    })();
  }, [month, year, page, employee, department]);
  console.log("show", showColumns);

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
        <div className="flex justify-start items-center px-4">
          <FormItemCustom
            className="w-[200px] border-none mr-2"
            label={"Tháng"}
          ></FormItemCustom>
          <FormItemCustom
            className="w-[200px] border-none mr-2"
            label={"Năm"}
          ></FormItemCustom>
          <FormItemCustom
            className="w-[200px] border-none mr-2"
            label={"Công ty"}
          ></FormItemCustom>
          <FormItemCustom
            className="w-[200px] border-none mr-2"
            label={"Phòng ban"}
          ></FormItemCustom>
          <FormItemCustom
            className="w-[200px] border-none mr-2"
            label={"Nhân viên"}
          ></FormItemCustom>
        </div>
        <div className="px-4 flex justify-start items-center">
          <FormItemCustom className="w-[200px] border-none mr-2">
            <Select
              className="!bg-[#F4F6F8] options:bg-[#F4F6F8]"
              defaultValue={month.toString()}
              options={monthAll}
              onChange={(value) => {
                setMonth(Number.parseInt(value));
              }}
              showSearch
            />
          </FormItemCustom>

          <FormItemCustom className="w-[200px] border-none mr-2">
            <DatePicker
              className="!bg-[#F4F6F8] !h-8"
              onChange={(value: any) => {
                setYear(value);
              }}
              picker="year"
              defaultValue={dayjs().startOf("year")}
            />
          </FormItemCustom>

          <FormItemCustom className="w-[200px] border-none mr-2">
            <Select
              className="!bg-[#F4F6F8] options:bg-[#F4F6F8]"
              options={listCompany}
              onSelect={(value) => {
                setCompany(value);
              }}
              onSearch={(value: string) => {
                setKeySCompany(value);
              }}
              onClear={() => setCompany("")}
              filterOption={false}
              allowClear
              showSearch
            />
          </FormItemCustom>

          <FormItemCustom className="w-[200px] border-none mr-2">
            <Select
              className="!bg-[#F4F6F8] options:bg-[#F4F6F8]"
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
              showSearch
            />
          </FormItemCustom>

          <FormItemCustom className="w-[200px] border-none mr-2">
            <Select
              className="!bg-[#F4F6F8] options:bg-[#F4F6F8]"
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
              showSearch
              optionRender={(option) => {
                return (
                  <>
                    <div className="text-sm">
                      <p
                        role="img"
                        aria-label={option.data.label}
                        className="my-1"
                      >
                        {option.data.value}
                      </p>
                      <span className="text-xs !font-semibold">
                        {option.data.des}
                      </span>
                    </div>
                  </>
                );
              }}
            />
          </FormItemCustom>

          <div>
            <Button type="primary" onClick={handleShowColumnModal}>
              Cấu hình
            </Button>
            <Modal
              title="Cấu hình cột"
              visible={isModalVisible}
              onOk={handleColumnModalOk}
              onCancel={handleColumnModalCancel}
              okText="Lưu"
              cancelText="Hủy"

            >
              <Tree
                className="pt-3"
                checkable
                treeData={treeData}
                defaultExpandAll
                onSelect={handleTreeSelect}
              />
            </Modal>
          </div>
        </div>

        <div className="pt-5">
          <TableCustom
            dataSource={dataReort?.data?.map((report: any) => ({
              key: report.name,
              ...report,
            }))}
            bordered
            pagination={{
              defaultPageSize: PAGE_SIZE,
              total,
              onChange(page) {
                setPage(page);
              },
            }}
            scroll={{ x: true }}
          >
            <ColumnGroup title="Thông tin nhân viên" className="!min-w-[670px]">
              <Column
                className="!text-center"
                title="STT"
                dataIndex="stt"
                key="stt"
                fixed
                render={(_: any, record: any, index: number) => index + 1}
              />
              {showColumns.employee && (
                <Column
                  className="!text-center"
                  title="Mã nhân viên"
                  dataIndex="employee"
                  key="employee"
                  fixed
                />
              )}

              <Column
                className="!text-center"
                title="Nhân viên"
                dataIndex="employee_name"
                key="employee_name"
                fixed
              />
              <Column
                className="!text-center"
                title="Chức danh"
                dataIndex="job_title"
                key="job_title"
                fixed
              />
              <Column
                className="!text-center"
                title="Phòng ban"
                dataIndex="department"
                key="department"
                fixed
              />
            </ColumnGroup>

            <ColumnGroup title="Cộng tổng" className="!min-w-[205px]">
              {showColumns.number_of_hours_monthly && (
                <Column
                  className="!text-center"
                  title="Số giờ"
                  dataIndex="number_of_hours_monthly"
                  key="number_of_hours_monthly"
                />
              )}
              <Column
                className="!text-center"
                title="Số công"
                dataIndex="work_hours_monthly"
                key="work_hours_monthly"
              />
            </ColumnGroup>

            {/* cái này để map */}
            {clDate.length > 0 &&
              clDate.map((date) => (
                <ColumnGroup
                  key={date.dayOfWeek}
                  title={date.dayOfWeek}
                  className="!min-w-[100px] !text-center"
                >
                  <Column
                    className="!text-center !p-0"
                    title={date.date}
                    dataIndex={date.date}
                    key={date.date}
                    render={(value: any, record: any) => {
                      if (
                        value?.dayOfWeek === "Thứ 7" ||
                        value?.dayOfWeek === "Chủ nhật"
                      ) {
                        return (
                          <div className="bg-gray-300 !h-14 !text-center flex justify-center items-center">
                            OFF
                          </div>
                        );
                      }
                      if (value.work_hours !== 0 && !value.work_hours) {
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
                                {value?.work_hours}
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
                                {value?.work_hours}
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
                                {value?.work_hours}
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
                              {value?.work_hours}
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
                              {value?.work_hours}
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
                              {value?.work_hours}
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
                              {value?.work_hours}
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
                              className="!h-14 flex justify-center items-center"
                            >
                              {value?.work_hours || " "}{" "}
                            </div>
                          );
                      }
                    }}
                  />
                </ColumnGroup>
              ))}

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

          {/* modal */}
          <Modal
            className="top-6"
            width={1064}
            title={
              <>
                {modal.id?.employee_name} - {modal.id?.day}, ngày{" "}
                {modal.id?.att_day
                  ?.split("-")
                  ?.reverse()
                  ?.toString()
                  ?.replaceAll(",", "-")}
              </>
            }
            open={modal.open}
            onCancel={closeModal}
            footer={null}
          >
            <DetailModal />
          </Modal>
        </div>
      </div>
    </>
  );
}

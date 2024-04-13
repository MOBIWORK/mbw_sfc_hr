import {  VerticalAlignBottomOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { Button, DatePicker, Modal, Select, Tree } from "antd";
import { monthAll } from "../ReportKPI/data";
import dayjs from "dayjs";
import { AxiosService } from "../../services/server";
import { getDaysAndWeekdays, treeArray } from "../../util";
import useDebounce from "../../hooks/useDebount";
import DetailModal from "./modal/detail";
import TreeColumn from "./modal/tree-column";
import { defaultColumn, fixedLeft, treeAtt, treeEmployee } from "./data";
import { column, renderColumn } from "./component/renderColumn";

export default function Worksheet() {
  console.log(treeArray({data: [... treeAtt,... treeEmployee],keyValue: "key",parentField:"parent_key"}));
  // console.log(tree1.map(tb => tb.key));
  
  const [dataReort, setDataReport] = useState<{data: any[]}>({data:[]});
  const [year, setYear] = useState<any>(dayjs().startOf("year"));
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
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(defaultColumn);
  const [columns, setColumns] = useState<column[]>(treeArray({data: [...treeEmployee,...treeAtt].filter(cl => {
    return checkedKeys.includes(cl.key)
  }),keyValue: "key",parentField:"parent_key"}));
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


  const handleShowColumnModal = () => {
    setIsModalVisible(true);
  };


  const handleColumnModalCancel = () => {
    setIsModalVisible(false);
  };

  //xử lý thêm cột
  const handleChangeColumn = () => {
    console.log("clDate",clDate);
    
    setColumns([
      ...treeArray({
        data: treeEmployee.filter(cl => {
              return checkedKeys.includes(cl.key)
            }),
        keyValue: "key",
        parentField:"parent_key"}),
      ...clDate.map((date_column):column => ({
        parent_key: null,
        key:`${date_column.date}`,
        title: `${date_column.date}`,
        type_column: "date",
        children: [{
          parent_key: `${date_column.date}`,
          key:`${date_column.date}`,
          title: `${date_column.dayOfWeek}`,
          type_column: "date",
          children: []
        }]      
      })),
      
      ...treeArray({
        data: treeAtt.filter(cl => {
              return checkedKeys.includes(cl.key)
            }),
        keyValue: "key",
        parentField:"parent_key"})
  
  ]
    
    
    )
    setIsModalVisible(false);

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
      setTotal(results.totals);
    })();
  }, [month, year, page, employee, department]);


  useEffect(() => {
    handleChangeColumn()
  },[clDate])

  console.log({columns});
  
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
            
          </div>
        </div>

        <div className="pt-5">
          <TableCustom
            dataSource={dataReort?.data?.map((report: any,index:number) => ({
              key: report.name,
              stt:index+1,
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
            {/* new cl */}
            {columns.map(dataCl => {        
              return renderColumn({data_column:dataCl,fix_left_column:fixedLeft,fix_right_column:[],cb:setModal})
            })}
            {/* end new cl */}
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
      <Modal
              title="Cấu hình cột"
              visible={isModalVisible}
              onOk={handleChangeColumn}
              onCancel={handleColumnModalCancel}
              okText="Lưu"
              cancelText="Hủy"

            >
              <TreeColumn  select={checkedKeys} handleSelect={setCheckedKeys}/>
            </Modal>
    </>
  );
}

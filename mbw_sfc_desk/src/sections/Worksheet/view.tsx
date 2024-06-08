import { Button, Col, DatePicker, Dropdown, Form, Row, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { monthAll } from "./modal/data";

import { DropDownCustom, FormItemCustom, HeaderPage } from "../../components";
import { ContentPage } from "../../components/content-page";
import useDebounce from "../../hooks/useDebount";
import { getDaysAndWeekdays } from "../../util";
import { AxiosService } from "../../services/server";
import { EllipsisOutlined } from "@ant-design/icons";
import Tab2 from "./tab/tab2";
import Tab1 from "./tab/tab1";
import Tab3 from "./tab/tab3";
import Tab4 from "./tab/tab4";
import { TabsCustom } from "../../components/tabs/tabs";
import Tab5 from "./tab/tab5";

const { TabPane } = TabsCustom;

export default function Worksheet() {
  const [total, setTotal] = useState<number>(0);
  const [year, setYear] = useState<any>(dayjs().startOf("year"));
  const [month, setMonth] = useState(dayjs().month() + 1);
  // dayjs().month() + 1
  const [listDepartment, setListDepartment] = useState<any[]>([]);
  const [department, setDepartment] = useState("");
  const [keySDepartment, setKeySDepartment] = useState("");
  let keySearchDepartment = useDebounce(keySDepartment, 500);
  const [employee, setEmployee] = useState("");
  const PAGE_SIZE = 20;
  const [page, setPage] = useState<number>(1);
  const [listEmployee, setListEmployee] = useState<any[]>([]);
  const [keySEmployee, setKeySEmployee] = useState("");
  let keySearchEmployee = useDebounce(keySEmployee, 500);
  const containerRef = useRef(null);
  const [dataReort, setDataReport] = useState<{ data: any[] }>({ data: [] });
  const [clDate, setClDate] = useState<{ date: number; dayOfWeek: string }[]>(
    getDaysAndWeekdays(month, year)
  );

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
              <Tab1
                data={dataReort}
                page={page}
                total={total}
                setPage={setPage}
                clDate={clDate}
              />
            </div>
          </TabPane>

          <TabPane className="bg-white pb-3" tab="Bảng ca" key="3">
            <Tab3
              data={dataReort}
              page={page}
              total={total}
              setPage={setPage}
              clDate={clDate}
            />
          </TabPane>

          <TabPane className="bg-white pb-3" tab="Bảng giờ" key="4">
            <Tab4
              data={dataReort}
              page={page}
              total={total}
              setPage={setPage}
              clDate={clDate}
            />
          </TabPane>

          <TabPane className="bg-white pb-3" tab="Tổng công" key="5">
            <Tab5
              data={dataReort}
              page={page}
              total={total}
              setPage={setPage}
            />
          </TabPane>

          <TabPane className="bg-white pb-3" tab="Tổng giờ" key="2">
            <Tab2
              data={dataReort}
              page={page}
              total={total}
              setPage={setPage}
            />
          </TabPane>
        </TabsCustom>
      </ContentPage>
    </>
  );
}

import {
  EllipsisOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
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
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { monthAll } from "../Worksheet/modal/data";
import { DatePickerProps } from "antd/lib";
import {
  DropDownCustom,
  FormItemCustom,
  HeaderPage,
  TableCustom,
} from "../../components";
import useDebounce from "../../hooks/useDebount";
import { AxiosService } from "../../services/server";
import { ContentPage } from "../../components/content-page";
import { data } from "./data";

const currentMonth = dayjs().month() + 1; // Lấy tháng hiện tại (đánh số từ 0)
const month = currentMonth.toString();
const year = dayjs().format("YYYY");

const { Column, ColumnGroup } = TableCustom;

export default function Salary() {
  const [fyear, setFYear] = useState("");
  const [fmonth, setFmonth] = useState(month);
  const [total, setTotal] = useState<number>(0);
  const [listDepartment, setListDepartment] = useState<any[]>([]);
  const [department, setDepartment] = useState("");
  const [keySDepartment, setKeySDepartment] = useState("");
  let keySearchDepartment = useDebounce(keySDepartment, 500);
  const [employee, setEmployee] = useState("");
  const [listEmployee, setListEmployee] = useState<any[]>([]);
  const [keySEmployee, setKeySEmployee] = useState("");
  const PAGE_SIZE = 10;
  const [page, setPage] = useState<number>(1);
  let keySearchEmployee = useDebounce(keySEmployee, 500);

  const onChange: DatePickerProps["onChange"] = (date) => {
    setFYear(date?.["$y"].toString());
  };

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

      console.log("rsEmployee", results);

      setListEmployee(
        results.map((dtEmployee: any) => ({
          value: dtEmployee.description.trim(),
          label: dtEmployee.description.trim(),
        }))
      );
    })();
  }, [keySearchEmployee]);

  
  return (
    <>
      <HeaderPage
        title="Bảng lương"
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
        <div className="bg-white border-[#EDEDED] border-x-[0.1px] border-[0.2px] border-solid justify-between items-end w-full">
          <Row className="p-4" gutter={[8, 8]}>
            <Col className="pb-2" span={24}>
              <Form
                layout="vertical"
                className="flex flex-wrap justify-start items-center"
              >
                <FormItemCustom className="border-none mr-2 w-[200px]">
                  <Select
                    className="!bg-[#F4F6F8] options:bg-[#F4F6F8] !h-7 rounded-lg mt-[-2px]"
                    defaultValue={month}
                    options={monthAll}
                    onChange={(value: string) => {
                      setFmonth(value);
                    }}
                    showSearch
                  />
                </FormItemCustom>
                <FormItemCustom className="border-none mr-2 w-[200px]">
                  <DatePicker
                    className="!bg-[#F4F6F8] !h-7 rounded-lg mt-[-2px]"
                    onChange={onChange}
                    placeholder="Tất cả "
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
          <div>
            <TableCustom
              dataSource={data}
              bordered
              scroll={{ x: true }}
            >
              <Column
                title="STT"
                dataIndex="stt"
                key="stt"
                className="!text-center"
                render={(_: any, record: any, index: number) => index + 1}
              />
              <Column title="Mẫ BP cơ cấu" dataIndex="mabp" key="mabp" />
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
              <Column title="CTC" dataIndex="ctc" key="ctc" />
              <Column title="Chức danh" dataIndex="depa" key="depa" />
              <Column title="Phòng ban" dataIndex="pb" key="pb" />
              <Column
                className="cl-c !text-right"
                title="Nhóm(1:QL 2:NV 3:SV)"
                dataIndex="f1"
                key="f1"
              />
              <Column
                className="cl-c !text-right"
                title="Lương cơ bản(BHXH)"
                dataIndex="f2"
                key="f2"
              />
              <ColumnGroup title="Mức lương">
                <Column
                  className="!text-right"
                  title="Ca thẳng"
                  dataIndex="f3"
                  key="f3"
                />
                <Column
                  className="!text-right"
                  title="Ca gãy"
                  dataIndex="f4"
                  key="f4"
                />
                <Column
                  className="!text-right"
                  title="Theo giờ"
                  dataIndex="f5"
                  key="f5"
                />
              </ColumnGroup>
              <Column
                className="cl-c !text-right"
                title="Tổng phụ cấp"
                dataIndex="f6"
                key="f6"
              />
              <ColumnGroup title="Phụ cấp">
                <Column
                  className="!text-right"
                  title="Điện thoại"
                  dataIndex="f7"
                  key="f7"
                />
                <Column
                  className="!text-right"
                  title="Xăng xe/gửi xe"
                  dataIndex="f8"
                  key="f8"
                />
                <Column
                  className="!text-right"
                  title="Chức vụ/đặc thù cv"
                  dataIndex="f9"
                  key="f9"
                />
                <Column
                  className="!text-right"
                  title="Trách nhiệm"
                  dataIndex="f10"
                  key="f10"
                />
                <Column
                  className="!text-right"
                  title="Xa nhà"
                  dataIndex="f11"
                  key="f11"
                />
                <Column
                  className="cl-c !text-right"
                  title="Kiêm nhiệm/công tác phí/khác"
                  dataIndex="f12"
                  key="f12"
                />
                <Column
                  className="!text-right"
                  title="0"
                  dataIndex="f13"
                  key="f13"
                />
              </ColumnGroup>
              <Column
                className="cl-c !text-center"
                title="Số người phụ thuộc"
                dataIndex="f14"
                key="f14"
              />
              <Column title="MB" dataIndex="f15" key="f15" />
              <Column className="!text-center" title="Tỉ lệ đạt KPI" dataIndex="f16" key="f16" />
              <Column title="Khu vực" dataIndex="f17" key="f17" />
              <Column title="Nghỉ việc" dataIndex="f18" key="f18" />
              <Column title="Ngày nghỉ" dataIndex="f19" key="f19" />
              <Column title="BBBG" dataIndex="f20" key="f20" />
              <Column title="Lý do tiền mặt" dataIndex="f21" key="f21" />
              <Column className="!text-center" title="Ngày nhận việc" dataIndex="f22" key="f22" />
              <Column className="!text-center" title="Ngày hết hạn thử việc" dataIndex="f23" key="f23" />
              <ColumnGroup title="Chi tiết ngày công">
                <Column
                  className="!text-center"
                  title="Tổng ngày công"
                  dataIndex="f24"
                  key="f24"
                />
                <ColumnGroup title="Ngày công - theo tháng">
                  <Column
                    className="!text-right"
                    title="Nghỉ PN"
                    dataIndex="f25"
                    key="f25"
                  />
                  <Column
                    className="!text-right"
                    title="Lễ, CĐ"
                    dataIndex="f26"
                    key="f26"
                  />
                  <Column
                    className="!text-right"
                    title="Ca thẳng"
                    dataIndex="f27"
                    key="f27"
                  />
                </ColumnGroup>
                <ColumnGroup title="Công - theo giờ">
                  <Column
                    className="!text-right"
                    title="Nghỉ PN"
                    dataIndex="f28"
                    key="f28"
                  />
                  <Column
                    className="!text-right"
                    title="Lễ, CĐ"
                    dataIndex="f29"
                    key="f29"
                  />
                  <Column
                    className="!text-right"
                    title="Partime"
                    dataIndex="f30"
                    key="f30"
                  />
                  <Column
                    className="!text-right"
                    title="Đào tạo"
                    dataIndex="f31"
                    key="f31"
                  />
                  <Column
                    className="!text-right"
                    title="Ca gãy"
                    dataIndex="f32"
                    key="f32"
                  />
                </ColumnGroup>
                <ColumnGroup title="Bù công">
                  <Column
                    className="!text-right"
                    title="Ngỳ nghỉ bù"
                    dataIndex="f33"
                    key="f33"
                  />
                  <Column
                    className="!text-right"
                    title="Giờ nghỉ bù"
                    dataIndex="f34"
                    key="f34"
                  />
                </ColumnGroup>
                <ColumnGroup title="Ngày lễ">
                  <Column
                    className="!text-center"
                    title="Công ca tháng"
                    dataIndex="f35"
                    key="f35"
                  />
                  <Column
                    className="!text-right"
                    title="Công ca gãy"
                    dataIndex="f36"
                    key="f36"
                  />
                  <Column
                    className="!text-right"
                    title="Giờ ca tháng"
                    dataIndex="f37"
                    key="f37"
                  />
                  <Column
                    className="!text-right"
                    title="Giờ ca gãy"
                    dataIndex="f38"
                    key="f38"
                  />
                </ColumnGroup>
              </ColumnGroup>
              <ColumnGroup title="Thêm giờ">
                <Column
                  className="!text-center"
                  title="Hệ số 1"
                  dataIndex="f39"
                  key="f39"
                />
                <Column
                  className="!text-center"
                  title="Hệ số 1.5"
                  dataIndex="f40"
                  key="f40"
                />
                <Column
                  className="!text-center"
                  title="Hệ số 2"
                  dataIndex="f41"
                  key="f41"
                />
              </ColumnGroup>
              <Column
                className="cl-c !text-right"
                title="Lương ngày công làm việc"
                dataIndex="f42"
                key="f42"
              />
              <Column
                className="cl-c !text-right"
                title="Tiền lương ngày lễ / ngoài giờ"
                dataIndex="f43"
                key="f43"
              />
              <Column
                className="!text-right"
                title="Lương KPIs NH"
                dataIndex="f44"
                key="f44"
              />
              <Column
                className="!text-right"
                title="Làm đêm"
                dataIndex="f45"
                key="f45"
              />
              <ColumnGroup title="Các khoản phải thu của người lao động">
                <Column
                  className="!text-right"
                  title="BHXH, BHYT, BHTN"
                  dataIndex="f46"
                  key="f46"
                />
                <Column
                  className="!text-right"
                  title="Kinh phí công đoàn"
                  dataIndex="f47"
                  key="f47"
                />
                <Column
                  className="!text-right"
                  title="Truy thu thẻ BHYT"
                  dataIndex="f48"
                  key="f48"
                />
                <Column
                  className="!text-right"
                  title="Lợn đất"
                  dataIndex="f49"
                  key="f49"
                />
                <Column
                  className="!text-right"
                  title="Đồng phục"
                  dataIndex="f50"
                  key="f50"
                />
                <ColumnGroup title="Thuế TNCN">
                  <Column
                    className="!text-right"
                    title="NPT"
                    dataIndex="f51"
                    key="f51"
                  />
                  <Column
                    className="!text-right"
                    title="Ân ca"
                    dataIndex="f52"
                    key="f52"
                  />
                  <Column
                    className="!text-right"
                    title="Thu nhập tính thuế"
                    dataIndex="f53"
                    key="f53"
                  />
                  <Column title="Thuế TNCN" dataIndex="f54" key="f54" />
                </ColumnGroup>
                <Column className="cl-c !text-right" title="Còn được lĩnh" dataIndex="f55" key="f55" />
              </ColumnGroup>
              <ColumnGroup title="Công ty trả BHXH, BHYT, BHTN cho người lao động">
                <ColumnGroup title="BHXH">
                  <Column title="17.5%" dataIndex="f56" key="f56" />
                </ColumnGroup>
                <ColumnGroup title="BHYT">
                  <Column title="3%" dataIndex="f57" key="f57" />
                </ColumnGroup>
                <ColumnGroup title="BHTN">
                  <Column title="1%" dataIndex="f58" key="f58" />
                </ColumnGroup>
                <Column
                  className="cl-c !text-right"
                  title="Tổng BH phải trả cho người lao động"
                  dataIndex="f59"
                  key="f59"
                />
              </ColumnGroup>
              <Column
                className="cl-c !text-right"
                title="Tổng BHXH, BHYT, BHTN phải nộp(32%)"
                dataIndex="f60"
                key="f60"
              />
            </TableCustom>
          </div>
        </div>
      </ContentPage>
    </>
  );
}

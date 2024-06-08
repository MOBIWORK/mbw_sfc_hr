import {
  EllipsisOutlined,
} from "@ant-design/icons";
import {
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
import { useResize } from "../../hooks";

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
  const size = useResize();
  const [scrollYTable, setScrollYTable] = useState<number>(size?.h * 0.68);
  const [employeeSalary,setEmployeeSalary] = useState<any[]>([])
  const onChange: DatePickerProps["onChange"] = (date:any) => {
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

  useEffect(() => {
    setScrollYTable(size.h * 0.6);
  }, [size]);


  useEffect(() => {
    (async () => {
      try {
          const rsSalary = await AxiosService.get("/api/method/mbw_sfc_integrations.api.reports.salary_report.salary_report",{
            params: {
              month:fmonth,
              year: fyear,
              department,
              employee,
              page_size: PAGE_SIZE,
              page_number:page
            }
          })
          setEmployeeSalary(rsSalary?.result?.data || [])
          setTotal(rsSalary?.result?.total || 0)
      } catch (error) {
        console.log(error);
        
        setEmployeeSalary([])
      }

    })()
  },[fyear,fmonth,department,employee,page,PAGE_SIZE])
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
                    defaultValue={"2"}
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
          <div className="w-full max-h-[72vh]">
            {/* table  */}
            <TableCustom
              dataSource={employeeSalary}
              bordered
              scroll={{
                x: true,
              }}
              pagination={{
                current:page,
                pageSize: PAGE_SIZE,
                total,
                onChange:(page)=> setPage(page)
              }}
            >
              <Column
                title="STT"
                dataIndex="stt"
                key="stt"
                className="!text-center"
                render={(_: any, record: any, index: number) => index + 1}
              />
              <Column title="Mã NV" dataIndex="employee" key="employee" />
              <Column
                title="Nhân viên"
                dataIndex="employee_name"
                key="employee_name"
                className="!text-left "
                // render={(_: any, record: any) => (
                //   <Row className="items-center flex-nowrap">
                //     <Avatar style={{ backgroundColor: "#f56a00" }} size={32}>
                //       {!record?.user_image &&
                //         record?.employee_name
                //           .split(" ")
                //           .reduce(
                //             (prev: string, now: string) =>
                //               `${prev[0] || ""}${now[0]}`,
                //             ""
                //           )}
                //     </Avatar>
                //     <p className="text-base font-medium  ml-[5px] text-left">
                //       <p className="truncate">{record.employee_name}</p>
                //       <p className="text-xs text-[#637381] font-normal">
                //         {record.employee}
                //       </p>
                //     </p>
                //   </Row>
                // )}
              />
              <Column title="CTC" dataIndex="CTC" key="ctc" />
              <Column
                title="Chức danh"
                dataIndex="designation"
                key="designation"
              />
              <Column title="Phòng ban" dataIndex="deparment" key="deparment" />
              <Column
                className="cl-c !text-right"
                title="Nhóm(1:QL 2:NV 3:SV)"
                dataIndex="grade"
                key="grade"
                render={(value: string) => {
                  switch (value) {
                    case "Quản lý":
                      return <>1</>;
                      break;
                    case "Nhân viên":
                      return <>2</>;
                      break;
                    default:
                      return 3;
                      break;
                  }
                }}
              />
              <Column
                className="cl-c !text-right"
                title="Lương cơ bản(BHXH)"
                dataIndex="LCB"
                key="LCB"
                render={(value: number) => value ?  Intl.NumberFormat().format(value): "-"}
              />
              <ColumnGroup title="Mức lương">
                <Column
                  className="!text-right"
                  title="Ca thẳng"
                  dataIndex="MLCT"
                  key="MLCT"
                  render={(value) =>value ? (
                    <div className="!text-right">
                      {Intl.NumberFormat().format(value)}
                    </div>
                  ):"-"}
                />
                <Column
                  className="!text-right"
                  title="Ca gãy"
                  dataIndex="MLCG"
                  key="MLCG"
                  render={(value) =>value ? (
                    <div className="!text-right">
                      {Intl.NumberFormat().format(value)}
                    </div>
                  ):"-"}
                />
              </ColumnGroup>
              {/* chi tiết ngày công  */}
              <ColumnGroup title="Chi tiết ngày công">
                <Column
                  className="!text-center !p-3"
                  title="Tổng ngày công"
                  dataIndex="TNC"
                  key="TNC"
                  render={(value) => <div className="!text-right">{value}</div>}
                />
                <ColumnGroup title="Ngày công - theo tháng">
                  <Column title="Nghỉ PN" dataIndex={"PN"} key="PN" />
                  <Column title="Lễ, CĐ" dataIndex={"NL"} key="NL" />
                  <Column title="Ca thẳng" dataIndex={"NCCT"} key="NCCT" />
                  <Column title="Đào tạo" dataIndex={"NCDT"} key="NCDT" />
                  <Column title="Ca gãy" dataIndex={"NCCG"} key="NCCG" />
                </ColumnGroup>
                <ColumnGroup title="Giờ công - theo tháng">
                  <Column title="Parttime" dataIndex={"GCCT"} key="GCCT" />
                  <Column title="Đào tạo" dataIndex={"GCDT"} key="GCDT" />
                  <Column title="Ca gãy" dataIndex={"GCCG"} key="GCCG" />
                </ColumnGroup>
                <ColumnGroup title="Bù công">
                  <Column title="Ngày nghỉ bù" dataIndex={"CB"} key="CB" />
                  <Column title="Giờ nghỉ bù" dataIndex={"GNB"} key="GNB" />
                </ColumnGroup>
                <ColumnGroup title="Ngày lễ">
                  <Column title="Công ca thẳng" dataIndex={"NCCTL"} key="NCCTL" />
                  <Column title="Công ca gãy" dataIndex={"NCCGL"} key="NCCGL" />
                  <Column title="Giờ ca thẳng" dataIndex={"GCCTL"} key="GCCTL" />
                  <Column title="Giờ ca gãy" dataIndex={"GCCTL"} key="GCCTL" />
                </ColumnGroup>
              </ColumnGroup>
              {/* end chi tiết ngày công */}
              <Column title="Lương ngày công làm việc" dataIndex={"LNC"} key="LNC"/>     
              <Column title="Tiền lương ngày lễ / ngoài giờ" dataIndex={"LNG"} key="LNG"/>     
              <Column title="Lương KPIs NH" dataIndex={"LKPI"} key="LKPI"/>
              {/* phụ cấp  */}
              <ColumnGroup title="Phụ cấp">
                <Column
                  className="!text-right"
                  title="Điện thoại"
                  dataIndex="PCDT"
                  key="PCDT"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
                <Column
                  className="!text-right"
                  title="Xăng xe"
                  dataIndex="PCXX"
                  key="PCXX"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
                <Column
                  className="!text-right"
                  title="Gửi xe"
                  dataIndex="PCGX"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  key="PCGX"
                />
                <Column
                  className="!text-right"
                  title="Chức vụ/đặc thù cv"
                  dataIndex="PCDT"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  key="PCDT"
                />
                <Column
                  className="!text-right"
                  title="Trách nhiệm"
                  dataIndex="PCTN"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  key="PCTN"
                />
                <Column
                  className="!text-right"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  title="Ăn ca"
                  dataIndex="PCAC"
                  key="PCAC"
                />
                <Column
                  className="cl-c !text-right !min-w-[150px]"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  title="Kiêm nhiệm"
                  dataIndex="PCKN"
                  key="PCKN"
                />
                <Column
                  className="!text-right"
                  title="PC giao hàng/PC than"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  dataIndex="PCGH"
                  key="PCGH"
                />
                <Column 
                className="!text-right"
                title="Chuyên cần lễ"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                dataIndex={"PCCC"}
                key="PCCC"
                />
              </ColumnGroup>
              {/* end phụ cấp  */}
              <Column
                className="cl-c !text-center"
                title="Truy thu, truy lĩnh lương"
                dataIndex="TLL"
                key="TLL"
                render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
              />
              <Column
                className="cl-c !text-right"
                title="Phụ cấp đào tạo, Audit khác"
                dataIndex="PCDT"
                key="PCDT"
                render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
              />
              <Column
                className="!text-center"
                title="Phải trả đồng phục"
                dataIndex="PTDP"
                key="PTDP"
                render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
              />
              <Column title="Hỗ trợ luân chuyển thu ngân" dataIndex="LCTN" key="LCTN"    render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>}/:"-">
              <Column title="Tổng thu nhập" dataIndex="gross_pay" key="gross_pay"    render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>}/:"-">

              {/* thu người lao động  */}
              <ColumnGroup title="Các khoản phải thu của người lao động">
                <Column
                  className="!text-right"
                  title="BHXH, BHYT, BHTN"
                  dataIndex="BHXH"
                  key="BHXH"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
                <Column
                  className="!text-right"
                  title="Kinh phí công đoàn"
                  dataIndex="KPCD"
                  key="KPCD"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
                <Column
                  className="!text-right"
                  title="Truy thu thẻ BHYT"
                  dataIndex="BHYT"
                  key="BHYT"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
                <Column
                  className="!text-right"
                  title="Lợn đất"
                  dataIndex="LD"
                  key="LD"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
                <Column
                  className="!text-right !p-3"
                  title="Đồng phục"
                  dataIndex="DP"
                  key="DP"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
                <Column
                    className="!text-right p-3"
                    title="Thu nhập tính thuế"
                    dataIndex="TNTT"
                    key="TNTT"
                    render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  />
                  <Column
                    className="!text-right"
                    title="Thuế TNCN"
                    dataIndex="TNCN"
                    key="TNCN"
                    render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  />
                  <Column
                    className="!text-right"
                    title="Các khoản trừ lương khác"
                    dataIndex="KHAC"
                    key="KHAC"
                    render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                  />
              </ColumnGroup>

              {/* end thu người lao động  */}
                <Column
                  className="!p-2"
                  title="Còn được lĩnh"
                  dataIndex="net_pay"
                  key="net_pay"
                  render={(value) => value ?<div className="!text-right">{Intl.NumberFormat().format(value)}</div>:"-"}
                />
              
              
            </TableCustom>
            {/* end table  */}
          </div>
        </div>
      </ContentPage>
    </>
  );
}

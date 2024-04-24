import { TableCustom } from "../../../components";

export interface column {
  parent_key: string | null;
  key: string;
  title: string;
  children: column[] | [];
  type_column?: string;
}
interface renderProps {
  data_column: column;
  fix_left_column: string[];
  fix_right_column: string[];
  cb?: React.Dispatch<React.SetStateAction<any>>;
}

const { Column, ColumnGroup } = TableCustom;
export function renderColumn({
  data_column,
  fix_left_column = [],
  fix_right_column = [],
  cb,
}: renderProps) {
  console.log("hello", cb);

  if (data_column.children?.length > 0) {
    return (
      <ColumnGroup
        className="!text-center !min-w-[90px] !h-8 !p-2 whitespace-nowrap"
        title={data_column.title}
        {...(fix_left_column.includes(data_column.key) && { fixed: "left" })}
        {...(fix_right_column.includes(data_column.key) && { fixed: "right" })}
      >
        {data_column.children?.map((dt) =>
          renderColumn({
            data_column: dt,
            fix_left_column,
            fix_right_column,
            cb,
          })
        )}
      </ColumnGroup>
    );
  }
  if (data_column.type_column == "date") {
    return (
      <Column
        {...(fix_left_column.includes(data_column.key) && { fixed: "left" })}
        {...(fix_right_column.includes(data_column.key) && { fixed: "right" })}
        className="!text-center !min-w-[70px] !h-8 !p-0"
        title={data_column.title}
        dataIndex={data_column.key}
        key={data_column.key}
        render={(value, record) => renderDateColumn(value, record, cb)}
      />
    );
  } else if (data_column.key == "stt") {
    return (
      <Column
        {...(fix_left_column.includes(data_column.key) && { fixed: "left" })}
        {...(fix_right_column.includes(data_column.key) && { fixed: "right" })}
        className="!text-center !min-w-[60px] !h-8 !p-0"
        title={data_column.title}
        dataIndex={data_column.key}
        key={data_column.key}
      />
    );
  } else {
    return (
      <Column
        {...(fix_left_column.includes(data_column.key) && { fixed: "left" })}
        {...(fix_right_column.includes(data_column.key) && { fixed: "right" })}
        className="!text-center !min-w-[100px] !min-h-8 !h-8 !p-2 whitespace-nowrap"
        title={data_column.title}
        dataIndex={data_column.key}
        key={data_column.key}
      />
    );
  }
}

function renderDateColumn(
  value: any,
  record: any,
  cb?: React.Dispatch<React.SetStateAction<any>>
) {
  console.log(cb, "cb date");

  if (value?.dayOfWeek === "Thứ 7" || value?.dayOfWeek === "Chủ nhật") {
    return (
      <div className="bg-gray-300 !h-10 !text-center flex justify-center items-center ">
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
              cb?.({
                open: true,
                id: {
                  employee: record.employee,
                  att_day: value.att_day,
                },
              });
            }}
            className="text-red-700 !h-10 flex justify-center items-center"
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
              cb?.({
                open: true,
                id: {
                  employee: record.employee,
                  att_day: value.att_day,
                },
              });
            }}
            className="border-solid border-[red] !h-10 flex justify-center items-center"
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
              cb?.({
                open: true,
                id: {
                  employee: record.employee,
                  att_day: value.att_day,
                },
              });
            }}
            className="text-yellow-500 !h-10 flex justify-center items-center"
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
              cb?.({
                open: true,
                id: {
                  employee: record.employee,
                  att_day: value.att_day,
                },
              });
            }}
            className="text-green-500 !h-10 flex justify-center items-center"
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
            cb?.({
              open: true,
              id: {
                employee: record.employee,
                att_day: value.att_day,
                employee_name: record.employee_name,
                day: value.dayOfWeek,
              },
            });
          }}
          className="text-red-700 !h-10 flex justify-center items-center"
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
            cb?.({
              open: true,
              id: {
                employee: record.employee,
                att_day: value.att_day,
                employee_name: record.employee_name,
                day: value.dayOfWeek,
              },
            });
          }}
          className="border-solid border-[red] !h-10 flex justify-center items-center"
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
            cb?.({
              open: true,
              id: {
                employee: record.employee,
                att_day: value.att_day,
                employee_name: record.employee_name,
                day: value.dayOfWeek,
              },
            });
          }}
          className="text-yellow-500 !h-10 flex justify-center items-center"
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
            cb?.({
              open: true,
              id: {
                employee: record.employee,
                att_day: value.att_day,
                employee_name: record.employee_name,
                day: value.dayOfWeek,
              },
            });
          }}
          className="text-green-500 !h-10 flex justify-center items-center"
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
            cb?.({
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
            cb?.({
              open: true,
              id: {
                employee: record.employee,
                att_day: value.att_day,
                employee_name: record.employee_name,
                day: value.dayOfWeek,
              },
            });
          }}
          className="!h-10 flex justify-center items-center"
        >
          {value?.work_hours || " "}{" "}
        </div>
      );
  }
}

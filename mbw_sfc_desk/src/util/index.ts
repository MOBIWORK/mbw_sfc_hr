import "dayjs/locale/vi";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

export const getAttrInArray = (array: any[], fields: any[], options = {}) => {
  let newArray: any[] = [];
  array.forEach((data) => {
    let obj = {};
    for (let key in data) {
      if (fields.includes(key)) {
        obj[key] = data[key];
      }
    }
    console.log("obj", obj);

    if (options.isNull) {
      newArray.push(obj);
    } else {
      let checkNull = Object.keys(obj).find((key) => !obj[key]);
      if (!checkNull) newArray.push(obj);
    }
  });
  return newArray;
};

interface treeArrayProps {
  data: any[];
  parentField?: string;
  parentValue?: null | any;
  keyValue: string;
}
export const treeArray = ({
  data = [],
  parentField = "",
  parentValue = null,
  keyValue = "",
}: treeArrayProps): any[] => {
  if (data.length == 0) return data;
  let arr = data.filter((element) => element[parentField] == parentValue);
  return arr.map((element: any[]) => {
    return {
      ...element,
      children: treeArray({
        data: data.filter((element) => element[parentField] !== parentValue),
        parentField,
        parentValue: element[keyValue as any] as string,
        keyValue,
      }),
    };
  });
};


/**
 
[
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'my leaf',
          },
          {
            value: 'leaf2',
            title: 'your leaf',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'sss',
            title: <b style={{ color: '#08c' }}>sss</b>,
          },
        ],
      },
    ],
  },
];
 */

interface feProps {data : any, fielNameChild: string,fielNameUpdate: string,valueUpdate:boolean,fiel_compare: string,values_compare : string[]}
export const forEachTreeCb =({data, fielNameChild="",fielNameUpdate="",valueUpdate=false,fiel_compare="",values_compare = []}:feProps) => {

  if(data[fielNameChild].length > 0) {
    data[fielNameChild] = data[fielNameChild].map((dt:any) => forEachTreeCb({
      data: dt,
      fielNameChild
      ,fielNameUpdate
      ,valueUpdate
      ,fiel_compare
      ,values_compare
    }))
  }
  if(values_compare.includes(data[fiel_compare])) {
    data[fielNameUpdate] = valueUpdate
  }

  return data
}




dayjs.locale("vi");
export const arrayDays = (startTime, endTime) => {
  const dateObjects = [];
  let currentDate = dayjs(startTime);

  while (currentDate.isBefore(endTime) || currentDate.isSame(endTime, "day")) {
    dateObjects.push({
      date: currentDate.format("DD/MM/YYYY"),
      dayOfWeek: currentDate.format("dddd"),
    });
    currentDate = currentDate.add(1, "day");
  }
  console.log("dateObjects", dateObjects);

  return dateObjects;
};

export const tmpToTimeZone = (day: string) => {
  // Output: 202
  return dayjs
    .unix(Number.parseFloat(day) / 1000)
    .format("YYYY-MM-DDTHH:mm:ss");
};

export const TodayLimit = (day: any) => {
  const today = new Date(day).setHours(0, 0, 0).toString();
  const nextday = new Date(day).setHours(24, 0, 0).toString();
  console.log({ today, nextday });

  return { today, nextday };
};

function renderColumnDays(month: any, year: any) {
  let dayMonth = getDaysAndWeekdays(month, year);
  let daymonth = dayMonth.map((days) => days.date);
  let daymonth2 = dayMonth.map((days) => days.dayOfWeek);
  let daymonthTable = daymonth.reduce(
    (prev, now) => `${prev} <td>${now}</td>`,
    ""
  );
  let daymonthTable2 = daymonth2.reduce(
    (prev, now) => `${prev}<td>${now}</td>`,
    ""
  );
  return { daymonthTable, daymonthTable2, daymonth, daymonth2 };
}

export const getDaysAndWeekdays = (month: any, year: any) => {
  if (!month || !year) return [];
  const daysInMonth = new Date(year, month, 0).getDate(); // Lấy số ngày của tháng
  const daysArray = [];
  const dayweek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // Lấy thứ của ngày, 0 là Chủ nhật, 1 là Thứ 2, ..., 6 là Thứ 7
    // Thêm vào mảng đối tượng đại diện cho ngày và thứ
    daysArray.push({
      date: day,
      dayOfWeek: dayweek[dayOfWeek], // Chuyển Chủ nhật từ 0 sang 7
    });
  }

  return daysArray;
}


export function renderColorTd(work, syntax,day) {
	console.log({work, syntax,day});
	if(day == "Thứ 7" || day == "Chủ nhật") {
		return `<td class="box-gray">OFF</td>`
	}
	if(work !== 0 && !work) {
		switch(syntax){
			case "HE":
				return `<td class="text-red">${syntax}</td>`
				break;
			case "FID" :
				return `<td class="box-red">${syntax}</td>`
				break;
			case "ON" :
				return `<td class="text-yellow">${syntax}</td>`
				break;	
			case "EA" :
				return `<td class="text-green">v</td>`
				break;
			default: 
				return `<td >${syntax}</td>`
		}
	}
	switch(syntax){
		case "HE":
			return `<td class="text-red">${work}</td>`
			break;
		case "FID" :
			return `<td class="box-red">${work}</td>`
			break;
		case "ON" :
			return `<td class="text-yellow">${work}</td>`
			break;	
		case "EA" :
			return `<td class="text-green">v</td>`
			break;
		case "+" :
		case "P" :
		case "KL" :
		case "VM" :
		case "OT" :
		case "CT" :
		case "CD" :
		case "DC" :
		case "GT" :
			return `<td >${work}<sup>${syntax}</sup>)</td>`
			break;		
		default: 
			return `<td>${work || " "}</td>`
	}
}
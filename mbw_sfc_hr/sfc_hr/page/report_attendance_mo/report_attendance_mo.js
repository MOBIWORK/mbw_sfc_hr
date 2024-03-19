
frappe.pages['report-attendance-mo'].on_page_load = function(wrapper) {
	const report_attendance = new SFC_Attendance(wrapper)
	$(wrapper).bind("show", () => {
		report_attendance.show()
	})
}


class SFC_Attendance {
	constructor(wrapper) {
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Report Attendance Monthly SFC',
			single_column: true
		});
		this.page.main.addClass("frappe-card");
		this.page.body.append(`<div class="table-area"></div>`);
		this.$content = $(this.page.body).find(".table-area");
		this.filters()
	}

	//show page
	show() {
		
		this.loadData()
	}

	//load data
	async loadData() {
		console.log(this.getPageFromURL());
		let month = this.fieldMonth.get_value();
		let year = this.fieldYear.get_value();
		let company = this.fieldCompany.get_value();
		let employee = this.fieldIdNvHr.get_value()
		let params = {month,year,company}

		if(employee) {
			params = {...params,employee,page: this.getPageFromURL() || 1}
		}
		let rs = await frappe.call({
			method: "mbw_sfc_integrations.sfc_integrations.attendance.get_attendance",
			args: params
		})
		console.log(rs);
		// console.log("frappe",frappe);
		// this.$content.html(
		// 	frappe.render_template("report_attendance_mo",{
		// 		list_data: {
		// 			data: [],
		// 			paging: ["1","2","3","4"]

		// 		},
		// 		// paging: `<div>1</div>`
		// 	})
		//   );
		let data = []
		let pagging = []
		if(rs.result) {
			data = rs.result.data
			let totalPage = Math.ceil(Number.parseFloat(rs.result.total/rs.result.page_size))
			for(let i=1;i<=totalPage;i++) {
				pagging.push(i)
			}
		}
		this.$content.html(this.renderTable(data,pagging))	  
	}

	//add filter
	filters() {
		this.btnSync = this.page.set_primary_action(__("Search"), () => {
			let month = this.fieldMonth.get_value();
			let year = this.fieldYear.get_value();
	
			if (!month || !year) {
			frappe.msgprint({
				title: __("Cảnh báo"),
				indicator: "yellow",
				message: __("Vui lòng chọn đầy đủ thông tin."),
			});
			return false;
			}
	
			
			this.loadData();
		});
	
		this.btnFresh = this.page.set_secondary_action(__("Refresh"), () => {
			this.refreshFilters();
		});

		this.fieldMonth = this.page.add_field({
			label: __("Month"),
			fieldtype: "Select",
			fieldname: "month",
			options: [
				{ "value": 1, "label": __("January") },
				{ "value": 2, "label": __("February") },
				{ "value": 3, "label": __("March") },
				{ "value": 4, "label": __("April") },
				{ "value": 5, "label": __("May") },
				{ "value": 6, "label": __("June") },
				{ "value": 7, "label": __("July") },
				{ "value": 8, "label": __("August") },
				{ "value": 9, "label": __("September") },
				{ "value": 10, "label": __("October") },
				{ "value": 11, "label": __("November") },
				{ "value": 12, "label": __("December") },
			],
			"default": frappe.datetime.str_to_obj(frappe.datetime.get_today()).getMonth() + 1,
			change: () => {
				this.loadData()
			},
		});
	
		this.fieldYear = this.page.add_field({
			label: __("Year"),
			fieldtype: "Int",
			fieldname: "year",
			"default": frappe.datetime.str_to_obj(frappe.datetime.get_today()).getFullYear(),
			change: () => {
			},
		});	

		this.fieldCompany = this.page.add_field({
			label: __("Company"),
			fieldtype: "Link",
			fieldname: "company",
			options:"Company",
			"default": frappe.defaults.get_user_default("Company"),
			change: () => {
			},
		});	


		this.fieldDepartment = this.page.add_field({
			label: __("Department"),
			fieldtype: "Link",
			fieldname: "department",
			options: "Department",
			change: () => {
			},
		});	

		this.fieldIdNvHr = this.page.add_field({
			label: __("Employee"),
			fieldtype: "Link",
			fieldname: "ds_nv",
			options: "Employee",
			change: async () => {
				this.loadData()
			},
		  });
	}

	//refresh filter
	refreshFilters() {
		this.fieldIdNvHr.set_value("")
		this.fieldDepartment.set_value("")
		this.fieldCompany.set_value(frappe.defaults.get_user_default("Company"))
		this.fieldYear.set_value(frappe.datetime.str_to_obj(frappe.datetime.get_today()).getFullYear())
		this.fieldMonth.set_value(frappe.datetime.str_to_obj(frappe.datetime.get_today()).getMonth() + 1)
		this.loadData()
	}

	//handle page
	// + add page to path
	addPageToURL( value) {
		var url = new URL(window.location.href);
		url.searchParams.set("page", value);
		console.log("page",value);
		window.history.pushState({}, '', url);
	}

	// + get page number from path
	getPageFromURL() {
		var url = new URL(window.location.href);
		return url.searchParams.get("page");
	}

	renderTable(data=[],pagging=[]) {
	
		let {daymonthTable,daymonthTable2,daymonth,daymonth2} = this.renderColumnDays()
		console.log({daymonthTable,daymonthTable2,daymonth,daymonth2});
		if(data.length) {
			return `<div class="wrap-table"><div class="table-section">
			<table class="table table-background-jobs">
			<thead>
			<tr>
			 <td colspan="5">Thông tin nhân viên</td>
			 <td colspan="2">Công tổng</td>
			 ${daymonthTable2}
			 <td colspan="3">Tổng hợp đi muộn</td>
			 <td colspan="3">Tổng hợp về sớm</td>
			 <td colspan="3">Tổng hợp vắng mặt</td>
			 <td >Quên chốt</td>
			 <td >Tổng hợp nghỉ không lý do</td>
			 <td colspan="2">Tổng hợp nghỉ lý do</td>
			 <td colspan="3">Tổng hợp Công chính</td>
			 <td colspan="11">Tổng hợp làm thêm</td>
			 <td colspan="10">Tổng hợp tăng ca</td>
			 <td colspan="5">Tổng hợp qua ngày</td>
			 <td colspan="5">Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)</td>
			 <td colspan="2">Tổng hợp làm việc ngày lễ</td>
			 <td >Tổng hợp ngày chấm công</td>
			 <td >Tổng hợp Công chuẩn </td>
 
			</tr>
			<tr>
			 <td>STT</td>
			 <td>Mã NV</td>
			 <td>Nhân viên </td>
			 <td>Chức danh</td>
			 <td>Phòng ban </td>
			 <td>Số giờ </td>
			 <td>Số công </td>
			 ${daymonthTable}
			 <td>Số phút </td>
			 <td>Số lần</td>
			 <td>Công muộn</td>
			 <td> Số phút </td>
			 <td> Số lần  </td>
			 <td>Công sớm  </td>
			 <td>Số phút  </td>
			 <td> Số lần  </td>
			 <td> Số công </td>
			 <td> Số lần</td>
			 <td> Số công </td>
			 <td> Tổng công </td>
			 <td> Tổng giờ   </td>
			 <td> Công ca </td>
			 <td> Công lễ </td>
			 <td> Công tác </td>
			 <td> Giờ nghỉ </td>
			 <td> Nghỉ ngày  </td>
			 <td> Nghỉ đêm </td>
			 <td> Giờ lễ </td>
			 <td> Lễ ngày </td>
			 <td> Lễ đêm </td>
			 <td> Giờ ngày   </td>
			 <td> Ngày </td>
			 <td> Đêm </td>
			 <td> Tổng giờ </td>
			 <td> Số lần  </td>
			 <td> Giờ nghỉ </td>
			 <td> Giờ lễ  </td>
			 <td> Giờ ngày </td>
			 <td> Tổng giờ </td>
			 <td> Công nghỉ </td>
			 <td> Công lễ </td>
			 <td> Công ngày </td>
			 <td>  Số công </td>
			 <td> Công chuẩn  </td>
			 <td>  Số lần </td>
			 <td> Số giờ  </td>
			 <td> Số công </td>
			 <td>Công thực tế</td>
			 <td> Giờ thực tế </td>
			 <td> Số lần  </td>
			 <td> Số công </td>
			 <td> Số giờ </td>
			 <td> Công thực tế </td>
			 <td> Giờ thực tế </td>
			 <td> Số lần  </td>
			 <td> Số công </td>
			 <td> Số giờ  </td>
			 <td> Số ngày </td>
			 <td> Công chuẩn </td>
			</tr>
		 </thead>
				<tbody class="body-table">
					
					${
						data.map((employee ,index)=>{
							let dayWork = this.renderColumnDaysData(employee.attendance_daily,daymonth, daymonth2)
							return  `<tr>
							<td>${index+1}</td>
							<td>${employee?.employee || ""}</td>
							<td>${employee?.employee_name || ""}</td>
							<td>${employee?.job_title || ""}</td>
							<td>${employee?.department || ""}</td>
							
							<td>${employee?.number_of_hours_monthly }</td>
							<td>${employee?.work_hours_monthly }</td>
							${dayWork}
							<td>${employee?.late_arrival_time_monthly }</td>
							<td>${employee?.number_of_late_arrival }</td>
							<td>${employee?.late_arrival_work_monthly }</td>
							<td>${employee?.early_arrival_time_monthly  } </td>
							<td>${employee?.number_of_early_arrival } </td>
							<td>${employee?.early_arrival_work_monthly }</td>
							<td>${employee?.number_hour_absent_monthly }</td>
							<td>${employee?.number_absent } </td>
							<td>${employee?.number_work_absent_monthly} </td>
							<td>${employee?.number_of_breaktime }</td>
							<td>${employee?.number_work_unexplain_absence_monthly }</td>
							<td>${employee?.work_hours_monthly } </td>
							<td>${employee?.number_of_hours_monthly }</td>
							<td>${employee?.number_work_shift_monthly } </td>
							<td>${employee?.number_of_holiday_monthly } </td>
							<td>${employee?.work_of_mission_monthly } </td>
							<td>${employee?.extra_hour_off_monthly } </td>
							<td>${employee?.extra_hour_off_day_monthly } </td>
							<td>${employee?.extra_hour_off_night_monthly } </td>
							<td>${employee?.extra_hour_holiday_monthly } </td>
							<td>${employee?.extra_hour_holiday_day_monthly } </td>
							<td>${employee?.extra_hour_holiday_night_monthly } </td>
							<td>${employee?.extra_hour_off_monthly } </td>
							<td>${employee?.extra_hour_day_monthly } </td>
							<td>${employee?.extra_hour_night_monthly }</td>
							<td>${employee?.extra_hour_monthly } </td>
							<td>${employee?.number_of_extra_hour } </td>
							<td>${employee?.overtime_hour_off_monthly } </td>
							<td>${employee?.overtime_hour_holiday_monthly } </td>
							<td>${employee?.overtime_hours_monthly } </td>
							<td>${employee?.overtime_hour_total } </td>
							<td>${employee?.overtime_work_off_monthly } </td>
							<td>${employee?.overtime_work_holiday_monthly} </td>
							<td>${employee?.overtime_works_monthly } </td>
							<td>${employee?.overtime_works_total }  </td>
							<td>${employee?.overtime_works_extract } </td>
							<td>${employee?.number_of_overtime } </td>
							<td>${employee?.throughout_hour_monthly } </td>
							<td>${employee?.throughout_work_monthly } </td>
							<td>${employee?.throughout_work_extract_monthly }</td>
							<td>${employee?.throughout_hour_extract_monthly } </td>
							<td>${employee?.throughout_number }</td>
							<td>${employee?.hc_work_monthly } </td>
							<td>${employee?.hc_hour_monthly }</td>
							<td>${employee?.hc_work_extract_monthly } </td>
							<td>${employee?.hc_hour_extract_monthly } </td>
							<td>${employee?.hc_number } </td>
							<td>${employee?.number_work_holiday_monthly  } </td>
							<td>${employee?.number_hour_holiday_monthly  } </td>
							<td>${employee?.number_of_day_work }</td>
							<td>${employee?.number_work_shift_monthly } </td>
						   </tr> `
						})
					}		
				</tbody>
			  
			</table>  
			</div>
			</div>
			
		`
		}
		return `
			<div class="no-background-jobs">
			<img src="/assets/frappe/images/ui-states/list-empty-state.svg" alt="Empty State" />
			<p class="text-muted">${__("Nothing to show")}</p>
			</div>
		`
	}


	renderColumnDays() {
		
		let month = this.fieldMonth.get_value();
		let year = this.fieldYear.get_value();
		let dayMonth=  getDaysAndWeekdays(month,year)
		let daymonth = dayMonth.map(days => days.date)
		let daymonth2 = dayMonth.map(days => days.dayOfWeek)
		let daymonthTable = daymonth.reduce((prev,now) => `${prev} <td>${now}</td>`,'')
		let daymonthTable2 = daymonth2.reduce((prev,now) => `${prev}<td>${now}</td>`,'')
		return {daymonthTable,daymonthTable2,daymonth,daymonth2}
	}


	renderColumnDaysData(data_date,daymonthTable,daymonthTable2) {
		let objectDateWork= {}
		for(let value of data_date) {
			let date =  Number.parseInt(value.att_day?.split("-")[2]);
			objectDateWork[date] = value
		}
		let dayWork = []
		for(let value of daymonthTable) {
			console.log(value,objectDateWork[value]);
			dayWork.push(renderColorTd(objectDateWork[value] ? objectDateWork[value]["work_hours"] : "",objectDateWork[value] ? objectDateWork[value]["sign"] : "x",daymonthTable2[value-1]))
		}
		dayWork = dayWork.reduce((prev,now) => `${prev} ${now}`,'')
		console.log({dayWork});
		return dayWork
	}
}

function getDaysAndWeekdays(month, year) {
	if(!month || !year) return []
    const daysInMonth = new Date(year, month, 0).getDate(); // Lấy số ngày của tháng
    const daysArray = [];
	const dayweek = ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"]
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay(); // Lấy thứ của ngày, 0 là Chủ nhật, 1 là Thứ 2, ..., 6 là Thứ 7
        // Thêm vào mảng đối tượng đại diện cho ngày và thứ
        daysArray.push({
            date: day,
            dayOfWeek: dayweek[dayOfWeek] // Chuyển Chủ nhật từ 0 sang 7
        });
    }

    return daysArray;
}

function renderColorTd(work, syntax,day) {
	console.log({work, syntax,day});
	if(day == "Thứ 7" || day == "Chủ nhật") {
		return `<td class="box-gray">OFF</td>`
	}
	if(!work) {
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

// phân trang
{/* <ul class="pagging">
			${pagging.map((page)=> `<li  onclick="log(${page})"
				>${page}</li>`).reduce((prev,now) => `${prev}${now}`,'')}
			<ul> 
			<script>
			var log = function(value) {
				var url = new URL(window.location.href);
				url.searchParams.set("page", value);
				console.log("page",value);
				window.history.pushState({}, '', url);
				window.location.reload();
			}
			</script> */}

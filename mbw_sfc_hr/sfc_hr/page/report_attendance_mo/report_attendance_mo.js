
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
			// "default": frappe.datetime.str_to_obj(frappe.datetime.get_today()).getMonth() + 1,
			change: () => {
				this.loadData()
			},
		});
	
		this.fieldYear = this.page.add_field({
			label: __("Year"),
			fieldtype: "Int",
			fieldname: "year",
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


		this.fieldCompany = this.page.add_field({
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
		if(data.length) {
			return `<div class="wrap-table"><div class="table-section">
			<table class="table table-background-jobs">
			<thead>
			<tr>
			 <td colspan="6">Thông tin nhân viên</td>
			 <td colspan="2">Công tổng</td>
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
			 <td>Mã đăng nhập</td>
			 <td>Nhân viên </td>
			 <td>Chức danh</td>
			 <td>Phòng ban </td>
			 <td>Số giờ </td>
			 <td>Số công </td>
			 <td>Số phút </td>
			 <td>Số lần</td>
			 <td>Công muộn</td>
			 <td> Số phút </td>
			 <td> Số lần  </td>
			 <td>Công sớm  </td>
			 <td>Số phút  </td>
			 <td> Số lần  </td>
			 <td> Số công </td>
			 <td>  --Quên chốt</td>
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
						data.map((employee ,index)=> `<tr>
						<td>${index+1}</td>
						<td>${employee.employee}Mã NV</td>
						<td>${employee.employee_id}Mã đăng nhập</td>
						<td>${employee.employee_name}Nhân viên </td>
						<td>${employee.job_title}Chức danh</td>
						<td>${employee.department}Phòng ban </td>
						<td>${employee.number_of_hours_monthly}Số giờ - Công tổng</td>
						<td>${employee.work_hours_monthly}Số công -Công tổng</td>
						<td>${employee.late_arrival_time_monthly}Số phút  --Tổng hợp đi muộn</td>
						<td>${employee.number_of_late_arrival}Số lần --Tổng hợp đi muộn</td>
						<td>${employee.late_arrival_work_monthly}Công muộn --Tổng hợp đi muộn</td>
						<td>${employee.early_arrival_time_monthly} Số phút --Tổng hợp về sớm</td>
						<td>${employee.number_of_early_arrival} Số lần  --Tổng hợp về sớm</td>
						<td>${employee.early_arrival_work_monthly}Công sớm  --Tổng hợp về sớm</td>
						<td>${employee.number_hour_absent_monthly}Số phút  --Tổng hợp vắng mặt</td>
						<td>${employee.number_absent} Số lần  --Tổng hợp vắng mặt</td>
						<td>${employee.number_work_absent_monthly} Số công --Tổng hợp vắng mặt</td>
						<td>${employee.number_of_breaktime}  --Quên chốt</td>
						<td>${employee.number_work_unexplain_absence} Số công --Tổng hợp nghỉ không lý do</td>
						<td>${employee.fieldName} Tổng công --Tổng hợp nghỉ lý do</td>
						<td>${employee.number_of_holiday_monthly} Tổng giờ   --Tổng hợp nghỉ lý do</td>
						<td>${employee.fieldName} Công ca --Tổng hợp Công chính</td>
						<td>${employee.fieldName} Công lễ --Tổng hợp Công chính</td>
						<td>${employee.fieldName} Công tác --Tổng hợp Công chính</td>
						<td>${employee.extra_hour_off} Giờ nghỉ --Tổng hợp làm thêm</td>
						<td>${employee.fieldName} Nghỉ ngày  --Tổng hợp làm thêm</td>
						<td>${employee.fieldName} Nghỉ đêm --Tổng hợp làm thêm</td>
						<td>${employee.extra_hour_holiday} Giờ lễ --Tổng hợp làm thêm</td>
						<td>${employee.extra_hour_holiday_day} Lễ ngày --Tổng hợp làm thêm</td>
						<td>${employee.extra_hour_holiday_night} Lễ đêm --Tổng hợp làm thêm</td>
						<td>${employee.fieldName} Giờ ngày   --Tổng hợp làm thêm</td>
						<td>${employee.extra_hour_day} Ngày --Tổng hợp làm thêm</td>
						<td>${employee.extra_hour_night} Đêm --Tổng hợp làm thêm</td>
						<td>${employee.extra_hour} Tổng giờ --Tổng hợp làm thêm</td>
						<td>${employee.fieldName} Số lần  --Tổng hợp làm thêm</td>
						<td>${employee.overtime_hour_off} Giờ nghỉ --Tổng hợp tăng ca</td>
						<td>${employee.overtime_hour_holiday} Giờ lễ  --Tổng hợp tăng ca</td>
						<td>${employee.fieldName} Giờ ngày --Tổng hợp tăng ca</td>
						<td>${employee.fieldName} Tổng giờ --Tổng hợp tăng ca</td>
						<td>${employee.fieldName} Công nghỉ --Tổng hợp tăng ca</td>
						<td>${employee.fieldName} Công lễ --Tổng hợp tăng ca</td>
						<td>${employee.fieldName} Công ngày --Tổng hợp tăng ca</td>
						<td>${employee.fieldName}  Số công --Tổng hợp tăng ca</td>
						<td>${employee.fieldName} Công chuẩn  --Tổng hợp tăng ca</td>
						<td>${employee.fieldName}  Số lần --Tổng hợp tăng ca</td>
						<td>${employee.fieldName} Số giờ  --Tổng hợp qua ngày</td>
						<td>${employee.fieldName} Số công --Tổng hợp qua ngày</td>
						<td>${employee.fieldName}Công thực tế--Tổng hợp qua ngày</td>
						<td>${employee.fieldName} Giờ thực tế --Tổng hợp qua ngày</td>
						<td>${employee.fieldName} Số lần  --Tổng hợp qua ngày</td>
						<td>${employee.fieldName} Số công --Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)</td>
						<td>${employee.fieldName} Số giờ --Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)</td>
						<td>${employee.fieldName} Công thực tế --Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)</td>
						<td>${employee.fieldName} Giờ thực tế --Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)</td>
						<td>${employee.fieldName} Số lần  --Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)</td>
						<td>${employee.number_work_holiday} Số công --Tổng hợp làm việc ngày lễ</td>
						<td>${employee.number_hour_holiday} Số giờ  --Tổng hợp làm việc ngày lễ</td>
						<td>${employee.fieldName} Số ngày --Tổng hợp ngày chấm công</td>
						<td>${employee.fieldName} Công chuẩn  --Tổng hợp Công chuẩn </td>
					   </tr> `)
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

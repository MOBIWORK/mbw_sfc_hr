
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
		// frappe.call({
		// 	method: "frappe.desk.query_report.run",
		// 	args: {
		// 		report_name: "Report Attendance Monthly SFC",
		// 		filters: params,
		// 		ignore_prepared_report: false,
		// 		are_default_filters: false,
		// 		_: 1702882757634,
		// 	},
		// 	arguments:{},
		// 	callback: (res) => {
		// 		console.log("res",res);
		// 	}
		// })
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
		console.log(this.$content);
		this.$content.html(this.renderTable(["1"],["1","2","3","4"]))	  
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
						<td class="sticky-col"></td>
						<td colspan="3"  class="sticky-col"></td>
						<td  class="sticky-col">Công tổng</td>
						<td  class="sticky-col">Tổng</td>
						<td></td>
						<td></td>
						<td>T5</td>
						<td colspan="3">Đi muộn</td>
						<td colspan="3">Về sớm</td>
						<td colspan="3">Vắng mặt</td>
						<td>Quên chốt</td>
						<td>Nghỉ không lý do</td>
						<td colspan="12">Nghỉ</td>
						<td colspan="3">Công chính</td>
						<td colspan="11">Làm thêm</td>
						<td colspan="10">Tăng ca</td>
						<td colspan="5">CS</td>
						<td colspan="5">HC</td>
						<td colspan="5">CC</td>
						<td colspan="5">TS</td>
						<td colspan="2">Làm việc ngày lễ</td>
						<td colspan="3">Công hợp đồng</td>
						<td >Ngày chấm công</td>
						<td >Công chuẩn</td>
		
					</tr>
					<tr>
						<td  class="sticky-col"></td>
						<td  class="sticky-col">Mã nhân viên</td>
						<td  class="sticky-col">Mã đang nhập</td>
						<td  class="sticky-col">Nhân viên</td>
						<td  class="sticky-col">Số giờ</td>
						<td  class="sticky-col">Số công</td>
		
						<td>Chức danh</td>
						<td>Phòng ban</td>
						<td>1</td>
						<td>Số phút</td>
						<td>Số lần </td>
						<td>Công muộn</td>
						<td>Số phút</td>
						<td>Số lần </td>
						<td>Công sớm</td>
						<td>Số phút</td>
						<td>Số lần </td>
						<td>Số công</td>
						<td>Số lần</td>
						<td>Số công</td>
						<td>KL-Công</td>
						<td>KL-Giờ</td>
						<td>KH-Công</td>
						<td>KH-Giờ</td>
						<td>TL3-Công</td>
						<td>TL3-Giờ</td>
						<td>TL1-Công</td>
						<td>TL1-Giờ</td>
						<td>TS-Công</td>
						<td>TS-Giờ</td>
						<td>P-Công</td>
						<td>P-Giờ</td>
						<td>Công ca</td>
						<td>Công lễ</td>
						<td>Công tác</td>
						<td>Giờ nghỉ</td>
						<td>Nghỉ ngày</td>
						<td>Nghỉ đêm</td>
						<td>Giờ lễ</td>
						<td>Lễ ngày</td>
						<td>Lễ đêm</td>
						<td>Giờ ngày</td>
						<td>Ngày</td>
						<td>Đêm </td>
						<td>Tổng giờ </td>
						<td>Số lần</td>
						<td>Giờ nghỉ</td>
						<td>Giờ lễ</td>
						<td>Giờ ngày</td>
						<td>Tổng giờ</td>
						<td>Công nghỉ</td>
						<td>Công lễ</td>
						<td>Công ngày</td>
						<td>Số công</td>
						<td>Công chuẩn </td>
						<td>Số lần</td>
						<td>Số giờ</td>
						<td>Số Công</td>
						<td>Công thực tế</td>
						<td>Giờ thực tế</td>
						<td>Số lần </td>
						<td>Số giờ</td>
						<td>Số Công</td>
						<td>Công thực tế</td>
						<td>Giờ thực tế</td>
						<td>Số lần </td>
						<td>Số giờ</td>
						<td>Số Công</td>
						<td>Công thực tế</td>
						<td>Giờ thực tế</td>
						<td>Số lần </td>
						<td>Số giờ</td>
						<td>Số Công</td>
						<td>Công thực tế</td>
						<td>Giờ thực tế</td>
						<td>Số lần </td>
						<td>Số công</td>
						<td>Số giờ</td>
						<td>Ngày chính thức</td>
						<td>Thử việc</td>
						<td>Chính thức</td>
						<td>Số ngày</td>
						<td>Công chuẩn</td>
		
					</tr>
				</thead>
				<tbody class="body-table">
					
					${
						data.map(employee => `<tr>
					<td>1</td>
					<td>Mã nhân viên</td>
					<td>Mã đang nhập</td>
					<td>Nhân viên</td>
					<td>Số giờ</td>
					<td>Số công</td>
		
					<td>Chức danh</td>
					<td>Phòng ban</td>
					<td>1</td>
					<td>Số phút</td>
					<td>Số lần </td>
					<td>Công muộn</td>
					<td>Số phút</td>
					<td>Số lần </td>
					<td>Công sớm</td>
					<td>Số phút</td>
					<td>Số lần </td>
					<td>Số công</td>
					<td>Số lần</td>
					<td>Số công</td>
					<td>KL-Công</td>
					<td>KL-Giờ</td>
					<td>KH-Công</td>
					<td>KH-Giờ</td>
					<td>TL3-Công</td>
					<td>TL3-Giờ</td>
					<td>TL1-Công</td>
					<td>TL1-Giờ</td>
					<td>TS-Công</td>
					<td>TS-Giờ</td>
					<td>P-Công</td>
					<td>P-Giờ</td>
					<td>Công ca</td>
					<td>Công lễ</td>
					<td>Công tác</td>
					<td>Giờ nghỉ</td>
					<td>Nghỉ ngày</td>
					<td>Nghỉ đêm</td>
					<td>Giờ lễ</td>
					<td>Lễ ngày</td>
					<td>Lễ đêm</td>
					<td>Giờ ngày</td>
					<td>Ngày</td>
					<td>Đêm </td>
					<td>Tổng giờ </td>
					<td>Số lần</td>
					<td>Giờ nghỉ</td>
					<td>Giờ lễ</td>
					<td>Giờ ngày</td>
					<td>Tổng giờ</td>
					<td>Công nghỉ</td>
					<td>Công lễ</td>
					<td>Công ngày</td>
					<td>Số công</td>
					<td>Công chuẩn </td>
					<td>Số lần</td>
					<td>Số giờ</td>
					<td>Số Công</td>
					<td>Công thực tế</td>
					<td>Giờ thực tế</td>
					<td>Số lần </td>
					<td>Số giờ</td>
					<td>Số Công</td>
					<td>Công thực tế</td>
					<td>Giờ thực tế</td>
					<td>Số lần </td>
					<td>Số giờ</td>
					<td>Số Công</td>
					<td>Công thực tế</td>
					<td>Giờ thực tế</td>
					<td>Số lần </td>
					<td>Số giờ</td>
					<td>Số Công</td>
					<td>Công thực tế</td>
					<td>Giờ thực tế</td>
					<td>Số lần </td>
					<td>Số công</td>
					<td>Số giờ</td>
					<td>Ngày chính thức</td>
					<td>Thử việc</td>
					<td>Chính thức</td>
					<td>Số ngày</td>
					<td>Công chuẩn</td>

						</tr>`)
					}		
				</tbody>
			  
			</table>  
			</div>
			</div>
			<ul class="pagging">
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
			</script>
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

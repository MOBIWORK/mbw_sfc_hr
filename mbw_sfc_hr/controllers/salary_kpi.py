import frappe

def kpi_monthly_for_salary(doc, method):
    month = doc.thang
    year = doc.nam

    salary_table_existing = frappe.db.get_value("Salary Table", {
                                        "employee": doc.nhan_vien_ban_hang,
                                        "month": month,
                                        "year": year
                                        }, "name")
    if salary_table_existing:
        salary_table = frappe.get_doc("Salary Table", salary_table_existing)
        salary_table.revenue = doc.doanh_thu_thang
        salary_table.sales = doc.doanh_so_thang
        salary_table.visit = doc.so_kh_vt_luot
        salary_table.save(ignore_permissions=True)

    else:
        salary_table = frappe.get_doc({
            'doctype': 'Salary Table',
            'month': month,
            'year': year,
            'employee': doc.nhan_vien_ban_hang,
            'revenue': doc.doanh_thu_thang,
            'sales': doc.doanh_so_thang,
            'visit': doc.so_kh_vt_luot
        }).insert(ignore_permissions=True)





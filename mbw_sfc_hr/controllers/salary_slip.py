import frappe
from datetime import datetime

def salary_slip_update(doc, method):
    employee = doc.employee
    start_date = datetime.strptime(doc.start_date, "%Y-%m-%d")
    month = start_date.month
    year = start_date.year
    salary_components = frappe.get_all("Salary Component", filters={"doctype_data": 1}, fields=["name", "custom_doctype", "field_name", "type"])
    for i in salary_components:
        value = frappe.get_value(i.custom_doctype , {'employee': employee, 'month': month, 'year': year}, i.field_name)
        if i.type == "Earning":
            doc.append('earnings', {
                "salary_component": i.name,
                "amount": value
            })
        else:
            doc.append('deductions', {
                "salary_component": i.name,
                "amount": value
            })
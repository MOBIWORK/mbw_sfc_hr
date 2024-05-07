import frappe
from datetime import datetime

def salary_slip_update(doc, method):
    employee = doc.employee
    start_date = datetime.strptime(doc.start_date, "%Y-%m-%d")
    month = start_date.month
    year = start_date.year

    salary_structure = frappe.get_doc("Salary Structure", doc.salary_structure).as_dict()
    earnings = salary_structure.earnings
    deductions = salary_structure.deductions

    if earnings:
        for i in earnings:
            salary_components = frappe.get_value("Salary Component", {"name": i.salary_component, "doctype_data": 1, "type": "Earning"}, ["custom_doctype", "field_name"], as_dict=True)
            if salary_components:
                value = frappe.get_value(salary_components.custom_doctype , {'employee': employee, 'month': month, 'year': year}, salary_components.field_name)
                for k in doc.earnings:
                    if k.salary_component == salary_components:
                        k.amount = value
    
    if deductions:
        for a in deductions:
            salary_components = frappe.get_value("Salary Component", {"name": a.salary_component, "doctype_data": 1, "type": "Deduction"}, ["custom_doctype", "field_name"], as_dict=True)
            if salary_components:
                value = frappe.get_value(salary_components.custom_doctype , {'employee': employee, 'month': month, 'year': year}, salary_components.field_name)
                for j in doc.deductions:
                    if j.salary_component == salary_components:
                        j.amount = value
import frappe
from datetime import datetime

def salary_slip_update(doc, method):
    employee = doc.employee
    start_date = datetime.strptime(doc.start_date, "%Y-%m-%d")
    month = start_date.month
    year = start_date.year

    # Kiểm tra và tự động gán Salary Structure nếu chưa có
    if employee and not doc.salary_structure:
        salary_structure_ass = frappe.get_list("Salary Structure Assignment", 
                                               filters={"employee": employee, "from_date": ["<=", doc.start_date]},
                                               order_by="from_date desc", limit=1)
        if salary_structure_ass:
            salary_structure_ass = frappe.get_doc("Salary Structure Assignment", salary_structure_ass[0].name)
            doc.salary_structure = salary_structure_ass.salary_structure

    # Nếu đã có Salary Structure, tiến hành lấy earnings và deductions
    if doc.salary_structure:
        salary_structure = frappe.get_doc("Salary Structure", doc.salary_structure).as_dict()
        
        if salary_structure.get("earnings"):
            earnings = salary_structure["earnings"]
            for i in earnings:
                salary_component = frappe.get_value("Salary Component", {"name": i.salary_component, "doctype_data": 1, "type": "Earning"}, ["custom_doctype", "field_name"], as_dict=True)
                if salary_component:
                    value = frappe.get_value(salary_component.custom_doctype, {'nhan_vien_ban_hang': employee, 'thang': month, 'nam': year}, salary_component.field_name)
                    if value is not None:
                        for k in doc.earnings:
                            if k.salary_component == i.salary_component:
                                k.amount = value

        if salary_structure.get("deductions"):
            deductions = salary_structure["deductions"]
            for a in deductions:
                salary_component = frappe.get_value("Salary Component", {"name": a.salary_component, "doctype_data": 1, "type": "Deduction"}, ["custom_doctype", "field_name"], as_dict=True)
                if salary_component:
                    value = frappe.get_value(salary_component.custom_doctype, {'nhan_vien_ban_hang': employee, 'thang': month, 'nam': year}, salary_component.field_name)
                    if value is not None:
                        for j in doc.deductions:
                            if j.salary_component == a.salary_component:
                                j.amount = value

        doc.save()

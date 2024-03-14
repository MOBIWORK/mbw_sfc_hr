# Copyright (c) 2024, MBW and contributors
# For license information, please see license.txt
#Tạm hoãn


import frappe
from frappe import _
from frappe.query_builder.functions import Count, Extract, Sum
from frappe.utils import cint, cstr, getdate
from datetime import datetime, date, timedelta
Filters = frappe._dict
from typing import Dict, List, Optional, Tuple

def execute(filters: Optional[Filters] = None) -> Tuple:
	filters = frappe._dict(filters or {})

	if not (filters.month and filters.year):
		frappe.throw(_("Please select month and year."))
	
	attendance_synthetic = get_attendance_synthetic(filters)
	columns, data = [], []
	return columns, data


def getColumn(filters) -> Dict: 
	columns =[]
	columns.extend(
            [
                {"label": _("Employee Code"), "fieldname": "employee_id", "fieldtype": "Data", "width": 110},
                {
                    "label": _("Employee Name"),
                    "fieldname": "employee_name",
                    "fieldtype": "Data",
                    "width": 110,
                },
                {
                    "label": _("Total Work Hours (hours)"),
                    "fieldname": "number_of_hours_monthly",
                    "fieldtype": "Float",
                    "width": 140,
                },
                {
                    "label": _("Total Work"),
                    "fieldname": "work_hours_monthly",
                    "fieldtype": "Float",
                    "width": 140,
                },
                {
                    "label": _("Time Late Entries to work"),
                    "fieldname": "time_late_entries_work",
                    "fieldtype": "Float",
                    "width": 140,
                },
                {
                    "label": _("Total Early Exits "),
                    "fieldname": "total_early_exits",
                    "fieldtype": "Float",
                    "width": 140,
                },
                {
                    "label": _("Time Early Exits (minute)"),
                    "fieldname": "time_early_exits",
                    "fieldtype": "Float",
                    "width": 140,
                },
                {
                    "label": _("Time Early Exits to work"),
                    "fieldname": "time_early_exits_work",
                    "fieldtype": "Float",
                    "width": 140,
                },
                {"label": _("Total Leaves "), "fieldname": "total_leaves", "fieldtype": "Float", "width": 110},
                {"label": _("Total Leaves to work"), "fieldname": "total_leaves_work", "fieldtype": "Float", "width": 110},

                {"label": _("Total Absent"), "fieldname": "total_absent", "fieldtype": "Float", "width": 110},
                {"label": _("Total Absent to work"), "fieldname": "total_absent_to_work", "fieldtype": "Float", "width": 110},
                
                {"label": _("Shift OT"), "fieldname": "shift_ot", "fieldtype": "Float", "width": 110},
                {"label": _("Shift OT time(Hour)"), "fieldname": "shift_ot_time", "fieldtype": "Float", "width": 110},

                {"label": _("OT time (Hour)"), "fieldname": "total_ot", "fieldtype": "Float", "width": 110},
            ]
        )

	return  columns

def get_attendance_synthetic(filters: Filters) -> Dict:
	""" Return 
		[
			{
				"employee" : "employee1",
				"employee_id" : "employee_id1",
				"employee_name": "employee_name1",

			}
		]
	"""
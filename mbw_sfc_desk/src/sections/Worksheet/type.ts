export interface DataWorksheet {
    key: React.Key;
    name: string;
    stt?: number;
    employee: string; //mã nhân viên
    employee_name: string; //nhân viên
    job_title: string; //Chức danh
    department: string; //Phòng ban
    //Công tổng
    number_of_hours_monthly: number; //Số giờ
    work_hours_monthly: number; //Số công
    //Tổng hợp đi muộn
    late_arrival_time_monthly: number; //Số phút
    number_of_late_arrival: number; //Số lần
    late_arrival_work_monthly: number; //Công muộn
    //Tổng hợp về sớm
    early_arrival_time_monthly: number; //Số phút
    number_of_early_arrival: number; //Số lần
    early_arrival_work_monthly: number; //Công sớm
    //Tổng hợp vắng mặt
    number_hour_absent_monthly: number; //Số phút
    number_absent: number; //Số lần
    number_work_absent_monthly: number; //Công công
    number_of_breaktime: number; //Quên chốt
    //Tổng hợp nghỉ không lý do
    number_work_unexplain_absence_monthly: number; //Số công
    //Tổng hợp nghỉ lý do
    number_work_explain_absence_monthly: number; //Tổng công (P-Công,KL-Công,...)
    number_hour_explain_absence_monthly: number; //Tổng giờ (P-Giờ, KL-Giờ,...)
    //Tổng hợp Công chính
    number_work_shift_monthly: number; //Công ca (Tổng hợp Công chuẩn-Công chuẩn)
    number_of_holiday_monthly: number; //Công lễ
    work_of_mission_monthly: number; //Công tác
    //Tổng hợp làm thêm
    extra_hour_off_monthly: number; // Giờ nghỉ
    extra_hour_off_day_monthly: number; // Nghỉ ngày
    extra_hour_off_night_monthly: number; // Nghỉ đêm
    extra_hour_holiday_monthly: number; //Giờ lễ
    extra_hour_holiday_day_monthly: number; // lễ ngày
    extra_hour_holiday_night_monthly: number; // lễ đêm
    extra_hour_monthly: number; // giờ ngày
    extra_hour_day_monthly: number; //ngày
    extra_hour_night_monthly: number; // đêm
    extra_hours_monthly: number;
    number_of_extra_hour: number; //Số lần
    //Tổng hợp tăng ca
    overtime_hour_off_monthly: number; //Giờ nghỉ
    overtime_hour_holiday_monthly: number; //Giờ lễ
    overtime_hours_monthly: number; //Giờ ngày
    overtime_hour_total: number; //Tổng giờ
    overtime_work_off_monthly: number; //Công nghỉ
    overtime_work_holiday_monthly: number; //Công lễ
    overtime_works_monthly: number; //Công ngày
    overtime_works_total: number; //Số công
    overtime_works_extract: number; //Công chuẩn
    number_of_overtime: number; //Số lần
    //Tổng hợp qua ngày
    throughout_hour_monthly: number; // Số giờ
    throughout_work_monthly: number; // Số công
    throughout_work_extract_monthly: number; // Công thực tế
    throughout_hour_extract_monthly: number; // Giờ thực tế
    throughout_number: number; // Số lần
    //Tổng hợp HC, CS,...(Dữ liệu chấm công theo từng ca làm việc)
    hc_work_monthly: number; //Số công
    hc_hour_monthly: number; //Số giờ
    hc_work_extract_monthly: number; //Công thực tế
    hc_hour_extract_monthly: number; //Giờ thực tế
    hc_number: number; //Số lần
    //Tổng hợp làm việc ngày lễ
    number_work_holiday_monthly: number; //Số công
    number_hour_holiday_monthly: number; //Số giờ
    //Tổng hợp ngày chấm công
    number_of_day_work: number; //Số ngày
  }
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
    TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert,
    SelectChangeEvent
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ClassCreationRequest, CourseFilterData, LecturerFilterData, RoomFilterData } from '../model/class_model';
import { getCourseFilterList, getLecturerFilterList, getRoomFilterList, createClass } from '../services/class_service';


interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const initialFormData: ClassCreationRequest = {
    courseId: '',
    className: '',
    lecturerId: '',
    roomId: '',
    schedule: '',
    startTime: '18:00',
    minutesPerSession: 120,
    startDate: dayjs().format('YYYY-MM-DD'),
    note: ''
};

const CreateClassDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(initialFormData);
    // State cho dữ liệu dropdowns
    const [courses, setCourses] = useState<CourseFilterData[]>([]);
    const [lecturers, setLecturers] = useState<LecturerFilterData[]>([]);
    const [rooms, setRooms] = useState<RoomFilterData[]>([]);
    // State xử lý
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            const fetchDropdownData = async () => {
                setLoadingDropdowns(true);
                try {
                    const [courseRes, lecturerRes, roomRes] = await Promise.all([
                        getCourseFilterList(),
                        getLecturerFilterList(),
                        getRoomFilterList()
                    ]);
                    setCourses(courseRes);
                    setLecturers(lecturerRes);
                    setRooms(roomRes);
                } catch (err) {
                    setError("Không thể tải dữ liệu cần thiết (Khóa học, Giảng viên, Phòng).");
                } finally {
                    setLoadingDropdowns(false);
                }
            };
            fetchDropdownData();
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string | number>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name!]: value }));
    };

    const handleDateChange = (date: Dayjs | null) => {
        setFormData(prev => ({ ...prev, startDate: date ? date.format('YYYY-MM-DD') : '' }));
    };

    const handleTimeChange = (time: Dayjs | null) => {
        setFormData(prev => ({ ...prev, startTime: time ? time.format('HH:mm') : '' }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            if (!formData.courseId || !formData.className || !formData.lecturerId || !formData.roomId) {
                throw new Error("Vui lòng điền đầy đủ các trường bắt buộc.");
            }
            
            const requestData: ClassCreationRequest = {
                ...formData,
                courseId: Number(formData.courseId),
                lecturerId: Number(formData.lecturerId),
                roomId: Number(formData.roomId),
                minutesPerSession: Number(formData.minutesPerSession),
                startTime: dayjs(formData.startTime, 'HH:mm').format('HH:mm:ss'),
            };

            await createClass(requestData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || err.response?.data?.message || "Tạo lớp thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Tạo lớp học mới</DialogTitle>
                <DialogContent>
                    {loadingDropdowns ? (
                        <CircularProgress sx={{ display: 'block', margin: 'auto', my: 4 }} />
                    ) : (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{xs: 12, sm: 8}}>
                                <TextField
                                    required fullWidth
                                    name="className"
                                    label="Tên lớp học"
                                    value={formData.className}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{xs: 12, sm: 4}}>
                                <FormControl fullWidth required>
                                    <InputLabel>Khóa học</InputLabel>
                                    <Select name="courseId" value={formData.courseId} label="Khóa học" onChange={handleChange}>
                                        {courses.map(c => <MenuItem key={c.courseId} value={c.courseId}>{c.courseName}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid size={{xs: 12, sm: 4}}>
                                <DatePicker
                                    label="Ngày bắt đầu"
                                    value={dayjs(formData.startDate)}
                                    onChange={handleDateChange}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid size={{xs: 12, sm: 4}}>
                                <TimePicker
                                    label="Giờ bắt đầu"
                                    value={dayjs(formData.startTime, 'HH:mm')}
                                    onChange={handleTimeChange}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid size={{xs: 12, sm: 4}}>
                                <TextField
                                    required fullWidth
                                    name="minutesPerSession"
                                    label="Số phút/buổi"
                                    type="number"
                                    value={formData.minutesPerSession}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <TextField
                                    required fullWidth
                                    name="schedule"
                                    label="Lịch học (VD: T2-T4-T6)"
                                    value={formData.schedule}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth required>
                                    <InputLabel>Giảng viên</InputLabel>
                                    <Select name="lecturerId" value={formData.lecturerId} label="Giảng viên" onChange={handleChange}>
                                        {lecturers.map(l => <MenuItem key={l.lecturerId} value={l.lecturerId}>{l.lecturerName}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth required>
                                    <InputLabel>Phòng học</InputLabel>
                                    <Select name="roomId" value={formData.roomId} label="Phòng học" onChange={handleChange}>
                                        {rooms.map(r => <MenuItem key={r.roomId} value={r.roomId}>{r.roomName}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <TextField
                                    name="note"
                                    label="Ghi chú"
                                    fullWidth multiline rows={2}
                                    value={formData.note}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {error && <Grid size={{xs: 12}}><Alert severity="error">{error}</Alert></Grid>}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ pb: 2, pr: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} /> : "Tạo lớp"}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default CreateClassDialog;
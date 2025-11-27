import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Stack,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    IconButton,
    Breadcrumbs,
    Link,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    TextField,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    ArrowBack,
    Save,
    CheckCircle,
    Cancel,
    Person,
} from "@mui/icons-material";
import {
    getTeacherClassDetailMock,
    getSessionsByClassIdMock,
    getAttendanceBySessionIdMock,
    saveAttendanceMock,
} from "../../services/class_service";

const TeacherAttendance: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const [classDetail, setClassDetail] = useState<any>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | number>("");
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (classId) {
                try {
                    setLoading(true);
                    const detail = await getTeacherClassDetailMock(classId);
                    setClassDetail(detail);
                    const sessionList = await getSessionsByClassIdMock(classId);
                    setSessions(sessionList);

                    // Select the first pending session or the first session by default
                    if (sessionList.length > 0) {
                        const pendingSession = sessionList.find((s: any) => s.status === "Pending");
                        setSelectedSession(pendingSession ? pendingSession.sessionId : sessionList[0].sessionId);
                    }
                } catch (error) {
                    console.error("Error fetching class data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [classId]);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (selectedSession) {
                try {
                    // In a real app, this would fetch existing attendance or initialize list
                    const data = await getAttendanceBySessionIdMock(selectedSession);
                    setAttendanceData(data);
                } catch (error) {
                    console.error("Error fetching attendance:", error);
                }
            }
        };

        fetchAttendance();
    }, [selectedSession]);

    const handleAttendanceChange = (studentId: number, isAbsent: boolean) => {
        setAttendanceData((prev) =>
            prev.map((item) =>
                item.studentId === studentId ? { ...item, isAbsent: isAbsent } : item
            )
        );
    };

    const handleNoteChange = (studentId: number, note: string) => {
        setAttendanceData((prev) =>
            prev.map((item) =>
                item.studentId === studentId ? { ...item, note: note } : item
            )
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveAttendanceMock(selectedSession, attendanceData);
            setNotification({
                open: true,
                message: "Lưu điểm danh thành công!",
                severity: "success",
            });
        } catch (error) {
            console.error("Error saving attendance:", error);
            setNotification({
                open: true,
                message: "Lưu điểm danh thất bại. Vui lòng thử lại.",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    if (loading || !classDetail) {
        return <Box sx={{ p: 3 }}>Đang tải...</Box>;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/teacher/classes");
                    }}
                >
                    Lớp học phụ trách
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/teacher/classes/${classId}`);
                    }}
                >
                    {classDetail.className}
                </Link>
                <Typography color="text.primary">Điểm danh</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Điểm danh lớp học
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {classDetail.className} - {classDetail.courseName}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(`/teacher/classes/${classId}`)}>
                        Quay lại
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Đang lưu..." : "Lưu điểm danh"}
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={3}>
                {/* Session Selection */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Chọn buổi học
                            </Typography>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="session-select-label">Buổi học</InputLabel>
                                <Select
                                    labelId="session-select-label"
                                    id="session-select"
                                    value={selectedSession}
                                    label="Buổi học"
                                    onChange={(e) => setSelectedSession(e.target.value)}
                                >
                                    {sessions.map((session) => (
                                        <MenuItem key={session.sessionId} value={session.sessionId}>
                                            Buổi {session.sessionId} - {session.date} ({session.status === 'Completed' ? 'Đã học' : 'Chưa học'})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedSession && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Thông tin buổi học:
                                    </Typography>
                                    {(() => {
                                        const session = sessions.find(s => s.sessionId === selectedSession);
                                        return session ? (
                                            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                                                <Typography variant="body2"><strong>Ngày:</strong> {session.date}</Typography>
                                                <Typography variant="body2"><strong>Nội dung:</strong> {session.note}</Typography>
                                                <Typography variant="body2">
                                                    <strong>Trạng thái:</strong>
                                                    <span style={{ color: session.status === 'Completed' ? 'green' : 'orange', marginLeft: 4 }}>
                                                        {session.status === 'Completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                                                    </span>
                                                </Typography>
                                            </Box>
                                        ) : null;
                                    })()}
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Thống kê nhanh
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2">Sĩ số:</Typography>
                                    <Typography variant="body2" fontWeight="bold">{attendanceData.length}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="success.main">Có mặt:</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                        {attendanceData.filter(a => !a.isAbsent).length}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="error.main">Vắng:</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="error.main">
                                        {attendanceData.filter(a => a.isAbsent).length}
                                    </Typography>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Attendance List */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Danh sách học viên
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: "none", mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Học viên</TableCell>
                                            <TableCell align="center">Trạng thái</TableCell>
                                            <TableCell>Ghi chú</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendanceData.map((item) => (
                                            <TableRow key={item.studentId} hover>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: "primary.main" }}>
                                                            <Person />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2">{item.fullName}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {item.studentId}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <Button
                                                            variant={!item.isAbsent ? "contained" : "outlined"}
                                                            color="success"
                                                            size="small"
                                                            onClick={() => handleAttendanceChange(item.studentId, false)}
                                                            startIcon={!item.isAbsent ? <CheckCircle /> : undefined}
                                                        >
                                                            Có mặt
                                                        </Button>
                                                        <Button
                                                            variant={item.isAbsent ? "contained" : "outlined"}
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleAttendanceChange(item.studentId, true)}
                                                            startIcon={item.isAbsent ? <Cancel /> : undefined}
                                                        >
                                                            Vắng
                                                        </Button>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        placeholder="Ghi chú..."
                                                        value={item.note || ""}
                                                        onChange={(e) => handleNoteChange(item.studentId, e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {attendanceData.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    <Typography color="text.secondary">Vui lòng chọn buổi học để xem danh sách</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TeacherAttendance;

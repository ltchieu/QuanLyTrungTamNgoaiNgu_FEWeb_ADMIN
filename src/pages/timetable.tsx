// src/pages/admin/SessionListPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Typography,
  CircularProgress,
  Chip,
  SelectChangeEvent,
  Container,
  Grid,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Lop {
  malop: number;
  tenlop: string;
}

interface Phong {
  maphong: number;
  tenphong: string;
}

interface BuoiHocView {
  mabuoihoc: number;
  malop: number;
  tenlop: string;
  ngayhoc: string;
  tenGiangVien: string;
  maphong: number;
  tenPhong: string;
  trangthai: boolean;
}

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
const mockLopList: Lop[] = [
  { malop: 1, tenlop: "Lớp IELTS 7.0 (T2-T4-T6)" },
  { malop: 2, tenlop: "Lớp Giao tiếp (T3-T5)" },
];

const mockPhongList: Phong[] = [
  { maphong: 101, tenphong: "Phòng A101" },
  { maphong: 102, tenphong: "Phòng B202" },
];

const mockBuoiHocList: BuoiHocView[] = [
  {
    mabuoihoc: 1,
    malop: 1,
    tenlop: "Lớp IELTS 7.0 (T2-T4-T6)",
    ngayhoc: "2025-11-03T18:00:00",
    tenGiangVien: "Nguyễn Văn A",
    maphong: 101,
    tenPhong: "Phòng A101",
    trangthai: true,
  },
  {
    mabuoihoc: 2,
    malop: 2,
    tenlop: "Lớp Giao tiếp (T3-T5)",
    ngayhoc: "2025-11-04T19:00:00",
    tenGiangVien: "Trần Thị B",
    maphong: 102,
    tenPhong: "Phòng B202",
    trangthai: true,
  },
  {
    mabuoihoc: 3,
    malop: 1,
    tenlop: "Lớp IELTS 7.0 (T2-T4-T6)",
    ngayhoc: "2025-11-05T18:00:00",
    tenGiangVien: "Nguyễn Văn A",
    maphong: 101,
    tenPhong: "Phòng A101",
    trangthai: false,
  },
  {
    mabuoihoc: 4,
    malop: 1,
    tenlop: "Lớp IELTS 7.0 (T2-T4-T6)",
    ngayhoc: "2025-11-07T18:00:00",
    tenGiangVien: "Nguyễn Văn A",
    maphong: 101,
    tenPhong: "Phòng A101",
    trangthai: true,
  },
];

const Timetable: React.FC = () => {
  // State cho dữ liệu
  const [allBuoiHoc, setAllBuoiHoc] = useState<BuoiHocView[]>([]);
  const [lopList, setLopList] = useState<Lop[]>([]);
  const [phongList, setPhongList] = useState<Phong[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc
  const [selectedLop, setSelectedLop] = useState<string>("all");
  const [selectedPhong, setSelectedPhong] = useState<string>("all");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // api.getLopList().then(res => setLopList(res.data));
    // api.getPhongList().then(res => setPhongList(res.data));
    setLopList(mockLopList);
    setPhongList(mockPhongList);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (dateError) {
      setLoading(false);
      return;
    }

    // const params = {
    //     page: page,
    //     size: rowsPerPage,
    //     malop: selectedLop === 'all' ? undefined : Number(selectedLop),
    //     maphong: selectedPhong === 'all' ? undefined : Number(selectedPhong),
    //     ngayhoc: selectedDate ? selectedDate.format('YYYY-MM-DD') : undefined
    // };
    // api.getBuoiHocList(params).then(res => {
    //     setAllBuoiHoc(res.data.content);
    //     setTotalRows(res.data.totalElements); // Cần state cho totalRows
    // }).finally(() => setLoading(false));

    console.log("Fetching data with filters:", { selectedLop, selectedPhong, startDate, endDate });
    setTimeout(() => {
      const filteredData = mockBuoiHocList
        .filter(
          (buoi) => selectedLop === "all" || buoi.malop === Number(selectedLop)
        )
        .filter(
          (buoi) =>
            selectedPhong === "all" || buoi.maphong === Number(selectedPhong)
        )
        .filter((buoi) => {
          const ngayHoc = dayjs(buoi.ngayhoc);
          const isAfterStart =
            !startDate || ngayHoc.isSameOrAfter(startDate, "day");
          const isBeforeEnd =
            !endDate || ngayHoc.isSameOrBefore(endDate, "day");
          return isAfterStart && isBeforeEnd;
        });

      setAllBuoiHoc(filteredData);
      setLoading(false);
    }, 500);
  }, [selectedLop, selectedPhong, startDate, endDate, page, rowsPerPage]);

  // Handlers
  const handleLopChange = (event: SelectChangeEvent<string>) => {
    setSelectedLop(event.target.value);
    setPage(0);
  };

  const handlePhongChange = (event: SelectChangeEvent<string>) => {
    setSelectedPhong(event.target.value);
    setPage(0);
  };

  const handleStartDateChange = (newDate: Dayjs | null) => {
    setStartDate(newDate);
    setPage(0);
    // Validation
    if (endDate && newDate && newDate.isAfter(endDate, "day")) {
      setDateError("Ngày bắt đầu không thể sau ngày kết thúc.");
    } else {
      setDateError(null);
    }
  };

  const handleEndDateChange = (newDate: Dayjs | null) => {
    setEndDate(newDate);
    setPage(0);
    // Validation
    if (startDate && newDate && newDate.isBefore(startDate, "day")) {
      setDateError("Ngày kết thúc không thể trước ngày bắt đầu.");
    } else {
      setDateError(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Quản lý Buổi học
          </Typography>

          {/* Toolbar: Bộ lọc */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Lọc theo lớp</InputLabel>
                <Select
                  value={selectedLop}
                  onChange={handleLopChange}
                  label="Lọc theo lớp"
                >
                  <MenuItem value="all">
                    <em>Tất cả lớp học</em>
                  </MenuItem>
                  {lopList.map((lop) => (
                    <MenuItem key={lop.malop} value={lop.malop}>
                      {lop.tenlop}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Lọc theo phòng</InputLabel>
                <Select
                  value={selectedPhong}
                  onChange={handlePhongChange}
                  label="Lọc theo phòng"
                >
                  <MenuItem value="all">
                    <em>Tất cả phòng học</em>
                  </MenuItem>
                  {phongList.map((phong) => (
                    <MenuItem key={phong.maphong} value={phong.maphong}>
                      {phong.tenphong}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} container>
              <Grid size={{ xs: 6}}>
                <DatePicker
                  label="Từ ngày"
                  value={startDate}
                  onChange={handleStartDateChange}
                  maxDate={endDate || undefined} 
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!dateError, 
                      helperText: " ", 
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DatePicker
                  label="Đến ngày"
                  value={endDate}
                  onChange={handleEndDateChange}
                  minDate={startDate || undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!dateError, 
                      helperText: dateError || " ",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Bảng dữ liệu */}
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": { fontWeight: "bold", backgroundColor: "#f9fafb" },
                  }}
                >
                  <TableCell>Ngày học</TableCell>
                  <TableCell>Giờ học (Lịch)</TableCell>
                  <TableCell>Lớp</TableCell>
                  <TableCell>Giảng viên</TableCell>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress sx={{ my: 4 }} />
                    </TableCell>
                  </TableRow>
                ) : allBuoiHoc.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>Không tìm thấy buổi học nào.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  allBuoiHoc
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((buoi) => (
                      <TableRow hover key={buoi.mabuoihoc}>
                        <TableCell>
                          {dayjs(buoi.ngayhoc).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          {dayjs(buoi.ngayhoc).format("HH:mm")}
                        </TableCell>
                        <TableCell>{buoi.tenlop}</TableCell>
                        <TableCell>{buoi.tenGiangVien}</TableCell>
                        <TableCell>{buoi.tenPhong}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              buoi.trangthai
                                ? dayjs(buoi.ngayhoc).isAfter(dayjs())
                                  ? "Sắp diễn ra"
                                  : "Đã diễn ra"
                                : "Đã hủy"
                            }
                            color={
                              buoi.trangthai
                                ? dayjs(buoi.ngayhoc).isAfter(dayjs())
                                  ? "primary"
                                  : "success"
                                : "error"
                            }
                            size="small"
                            icon={
                              !buoi.trangthai ? <EventBusyIcon /> : undefined
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            // onClick={() => handleEdit(buoi.mabuoihoc)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            // onClick={() => handleDelete(buoi.mabuoihoc)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Phân trang */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allBuoiHoc.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default Timetable;

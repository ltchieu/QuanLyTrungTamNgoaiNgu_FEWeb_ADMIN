import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CreateClassDialog from "../component/create_class";
import {
  ClassView,
  CourseFilterData,
  LecturerFilterData,
  RoomFilterData,
} from "../model/class_model";
import {
  getAllClasses,
  getCourseFilterList,
  getLecturerFilterList,
  getRoomFilterList,
} from "../services/class_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";

const ClassListPage: React.FC = () => {
  // State cho dữ liệu
  const [lopHocList, setLopHocList] = useState<ClassView[]>([]);
  const [khoaHocList, setKhoaHocList] = useState<CourseFilterData[]>([]);
  const [giangVienList, setGiangVienList] = useState<LecturerFilterData[]>([]);
  const [phongHocList, setPhongHocList] = useState<RoomFilterData[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedLecturer, setSelectedLecturer] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");

  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  // State cho Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const lopRes = await getAllClasses(page, rowsPerPage);

      setLopHocList(lopRes.data.data.classes);
      setTotalRows(lopRes.data.data.totalItems);
    } catch (err) {
      console.error("Lỗi khi fetch danh sách lớp:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, selectedCourse, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [khoaHocRes, giangVienRes, phongHocRes] = await Promise.all([
          getCourseFilterList(),
          getLecturerFilterList(),
          getRoomFilterList(),
        ]);
        setKhoaHocList(khoaHocRes);
        setGiangVienList(giangVienRes);
        setPhongHocList(phongHocRes);
      } catch (err) {
        console.error("Lỗi khi fetch các thông tin để lọc:", err);
      }
    };
    fetchFilterData();
  }, []);

  // --- Handlers ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    switch (name) {
      case "giangVien":
        setSelectedLecturer(value);
        break;
      case "phongHoc":
        setSelectedRoom(value);
        break;
      case "khoaHoc":
        setSelectedCourse(value);
        break;
      default:
        break;
    }

    setPage(0);
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

  const handleCreateSuccess = () => {
    fetchData();
  };

  const getStatusChipColor = (
    status: number
  ): "success" | "warning" | "default" => {
    if (status === 1) return "success";

    if (status === 0) return "warning";

    return "default";
  };

  const displayStatus = (status: string) => {
    if(status == "1")
      return "Đang diễn ra"
    else
      return "Đã đóng"
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" fontWeight="bold">
        Danh sách Lớp học
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ backgroundColor: "#635bff", borderRadius: 3 }}
            >
              Tạo lớp học mới
            </Button>
          </Stack>
        </Stack>

        {/* Toolbar: Tìm kiếm và Lọc */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm Giảng viên, Lịch, Phòng..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: "100%", maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 250 }} variant="outlined">
            <InputLabel>Lọc theo giảng viên</InputLabel>

            <Select
              name="giangVien"
              value={selectedLecturer}
              onChange={handleFilterChange}
              label="Lọc theo giảng viên"
            >
              <MenuItem value="all">
                <em>Tất cả giảng viên</em>
              </MenuItem>

              {giangVienList.map((gv) => (
                <MenuItem key={gv.lecturerId} value={gv.lecturerId}>
                  {gv.lecturerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 250 }} variant="outlined">
            <InputLabel>Lọc theo phòng học</InputLabel>

            <Select
              name="phongHoc"
              value={selectedRoom}
              onChange={handleFilterChange}
              label="Lọc theo phòng học"
            >
              <MenuItem value="all">
                <em>Tất cả phòng học</em>
              </MenuItem>

              {phongHocList.map((p) => (
                <MenuItem key={p.roomId} value={p.roomId}>
                  {p.roomName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 250 }} variant="outlined">
            <InputLabel>Lọc theo khóa học</InputLabel>

            <Select
              name="khoaHoc"
              value={selectedCourse}
              onChange={handleFilterChange}
              label="Lọc theo khóa học"
            >
              <MenuItem value="all">
                <em>Tất cả khóa học</em>
              </MenuItem>

              {khoaHocList.map((khoaHoc) => (
                <MenuItem key={khoaHoc.courseId} value={khoaHoc.courseId}>
                  {khoaHoc.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Bảng dữ liệu */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  "& th": { fontWeight: "bold", backgroundColor: "#f9fafb" },
                }}
              >
                <TableCell>Tên lớp</TableCell>
                <TableCell>Phòng học</TableCell>
                <TableCell>Lịch học</TableCell>
                <TableCell>Giảng viên</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress sx={{ my: 4 }} />
                  </TableCell>
                </TableRow>
              ) : lopHocList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>Không tìm thấy lớp học nào.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                lopHocList.map((lop: ClassView) => (
                  <TableRow hover key={lop.classId}>
                    <TableCell>{lop.className}</TableCell>
                    <TableCell>{lop.roomName}</TableCell>
                    <TableCell>{lop.schedulePattern}</TableCell>
                    <TableCell>{lop.instructorName}</TableCell>
                    <TableCell>
                      <Chip
                        label={displayStatus(lop.status)}
                        color={getStatusChipColor(Number(lop.status))}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        // onClick={() => handleEdit(lop.malop)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"

                        // onClick={() => handleDelete(lop.malop)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
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
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateClassDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Container>
  );
};

export default ClassListPage;

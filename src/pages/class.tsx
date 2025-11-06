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
import { ClassView, CourseFilterData } from "../model/class_model";
import { getAllClasses, getCourseFilterList } from "../services/class_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const ClassListPage: React.FC = () => {
  // State cho dữ liệu
  const [lopHocList, setLopHocList] = useState<ClassView[]>([]);
  const [khoaHocList, setKhoaHocList] = useState<CourseFilterData[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  // State cho phân trang (backend)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  // State cho Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const navigate = useNavigate();

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
        const khoaHocRes = await getCourseFilterList();
        console.log(khoaHocRes)
        setKhoaHocList(khoaHocRes);
      } catch (err) {
        console.error("Lỗi khi fetch danh sách khóa học:", err);
      }
    };
    fetchFilterData();
  }, []);

  // --- Handlers ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCourseFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCourse(event.target.value);
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
    status: string
  ): "success" | "warning" | "default" => {
    if (status === "Đang mở") return "success";

    if (status === "Sắp mở") return "warning";

    return "default";
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" fontWeight="bold">
            Danh sách Lớp học
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => navigate("/addCourse")}>
              Tạo khóa học mới
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
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
            <InputLabel>Lọc theo khóa học</InputLabel>

            <Select
              value={selectedCourse}
              onChange={handleCourseFilterChange}
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
                  <TableRow hover key={lop.malop}>
                    <TableCell>{lop.tenlop}</TableCell>
                    <TableCell>{lop.tenPhong}</TableCell>
                    <TableCell>{lop.lichHoc}</TableCell>
                    <TableCell>{lop.tenGiangVien}</TableCell>
                    <TableCell>
                      <Chip
                        label={lop.trangThai}
                        color={getStatusChipColor(lop.trangThai)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {/* ... (IconButtons giữ nguyên) ... */}
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

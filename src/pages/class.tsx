import React, { useState, useEffect, useCallback, useReducer } from "react";
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
  Tooltip,
  Alert,
  Snackbar,
  TableSortLabel,
  Grid,
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
  changeClassStatus,
  filterClasses,
  getCourseFilterList,
  getLecturerFilterList,
  getRoomFilterList,
} from "../services/class_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faFilter,
  faLock,
  faLockOpen,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import SuggestionDialog from "../component/suggestion_dialog";
import {
  getComparator,
  headCells,
  Order,
  stableSort,
  visuallyHidden,
} from "../util/class_util";
import useDebounce from "../hook/useDebounce";

interface FilterState {
  lecturer: number | null;
  room: number | null;
  course: number | null;
  searchTerm: string | null;
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | {
      type: "SET_FILTER";
      payload: {
        lecturer: number | null;
        room: number | null;
        course: number | null;
      };
    }
  | { type: "RESET" };

const filterReducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        lecturer: null,
        room: null,
        course: null,
        searchTerm: action.payload,
      };
    case "SET_FILTER":
      return { ...action.payload, searchTerm: null };
    case "RESET":
      return { lecturer: null, room: null, course: null, searchTerm: null };
    default:
      return state;
  }
};

const ClassListPage: React.FC = () => {
  // State cho dữ liệu
  const [lopHocList, setLopHocList] = useState<ClassView[]>([]);
  const [khoaHocList, setKhoaHocList] = useState<CourseFilterData[]>([]);
  const [giangVienList, setGiangVienList] = useState<LecturerFilterData[]>([]);
  const [phongHocList, setPhongHocList] = useState<RoomFilterData[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLecturer, setSelectedLecturer] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterQuery, dispatch] = useReducer(filterReducer, {
    lecturer: null,
    room: null,
    course: null,
    searchTerm: null,
  });

  // State cho phân trang
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // State cho Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  //State cho dữ liệu thay đổi trạng thái
  const [suggestionData, setSuggestionData] = useState(null);
  const [openSuggestionDialog, setOpenSuggestionDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // State sắp xếp
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof ClassView>("className");

  useEffect(() => {
    if (debouncedSearchTerm !== filterQuery.searchTerm) {
      if (debouncedSearchTerm.trim() !== "") {
        dispatch({ type: "SET_SEARCH", payload: debouncedSearchTerm });
        setPage(0);

        setSelectedLecturer("");
        setSelectedRoom("");
        setSelectedCourse("");
      } else if (
        filterQuery.searchTerm !== null &&
        debouncedSearchTerm === ""
      ) {
        dispatch({ type: "RESET" });
      }
    }
  }, [debouncedSearchTerm]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await filterClasses(
        filterQuery.lecturer,
        filterQuery.room,
        filterQuery.course,
        filterQuery.searchTerm
      );

      if (res) {
        setLopHocList(res.classes);
        setTotalRows(res.totalItems);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách lớp:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterQuery]);

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

  const handleChangeClassStatus = async (classId: number) => {
    try {
      const res = await changeClassStatus(classId);

      if (res.data) {
        setSuggestionData(res.data);
        setOpenSuggestionDialog(true);
      } else {
        setSuccessMsg(res.message || "Đổi trạng thái thành công!");
        setOpenSnackbar(true);
        fetchData();
      }
    } catch (error: any) {
      console.log("Có lỗi xảy ra: ", error);
    }
  };

  const handleSelectAlternative = (alternative: any) => {
    console.log("Người dùng chọn phương án:", alternative);
    setOpenSuggestionDialog(false);
  };

  // --- Hàm xử lý khi bấm nút Lọc ---
  const handleFilterSubmit = () => {
    setSearchTerm("");

    dispatch({
      type: "SET_FILTER",
      payload: {
        lecturer:
          selectedLecturer && selectedLecturer !== "all"
            ? Number(selectedLecturer)
            : null,
        room:
          selectedRoom && selectedRoom !== "all" ? Number(selectedRoom) : null,
        course:
          selectedCourse && selectedCourse !== "all"
            ? Number(selectedCourse)
            : null,
      },
    });
    setPage(0);
  };

  // --- Hàm xử lý nút Xóa bộ lọc ---
  const handleClearFilter = () => {
    // Reset UI
    setSelectedLecturer("");
    setSelectedRoom("");
    setSelectedCourse("");
    setSearchTerm("");
    dispatch({ type: 'RESET' });
    setPage(0);
  };

  const getStatusChipColor = (
    status: number
  ): "success" | "warning" | "default" => {
    if (status === 1) return "success";

    if (status === 0) return "warning";

    return "default";
  };

  const displayStatus = (status: string) => {
    if (status == "1") return "Đang diễn ra";
    else return "Đã đóng";
  };

  // handle Sắp xếp
  const handleRequestSort = (property: keyof ClassView) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof ClassView) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(property);
    };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Grid container sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 9 }} textAlign="left" sx={{ pl: 2 }}>
          <Typography variant="h3" fontWeight="bold">
            Danh sách Lớp học
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ backgroundColor: "#635bff", borderRadius: 3 }}
          >
            Tạo lớp học mới
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, borderRadius: 4 }}>
        {/* Toolbar: Tìm kiếm và Lọc */}
        <Box
          sx={{
            display: "flex",
            mb: 2,
            gap: 4,
            flexWrap: "wrap",
            flexDirection: "column",
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

          <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 3 }}>
            <FormControl sx={{ minWidth: 350 }} variant="outlined">
              <InputLabel>Lọc theo giảng viên</InputLabel>

              <Select
                name="giangVien"
                value={selectedLecturer}
                onChange={handleFilterChange}
                label="Lọc theo giảng viên"
              >
                <MenuItem value="">
                  <em>Tất cả giảng viên</em>
                </MenuItem>

                {giangVienList.map((gv) => (
                  <MenuItem key={gv.lecturerId} value={gv.lecturerId}>
                    {gv.lecturerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 350 }} variant="outlined">
              <InputLabel>Lọc theo phòng học</InputLabel>

              <Select
                name="phongHoc"
                value={selectedRoom}
                onChange={handleFilterChange}
                label="Lọc theo phòng học"
              >
                <MenuItem value="">
                  <em>Tất cả phòng học</em>
                </MenuItem>

                {phongHocList.map((p) => (
                  <MenuItem key={p.roomId} value={p.roomId}>
                    {p.roomName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 350 }} variant="outlined">
              <InputLabel>Lọc theo khóa học</InputLabel>

              <Select
                name="khoaHoc"
                value={selectedCourse}
                onChange={handleFilterChange}
                label="Lọc theo khóa học"
              >
                <MenuItem value="">
                  <em>Tất cả khóa học</em>
                </MenuItem>

                {khoaHocList.map((khoaHoc) => (
                  <MenuItem key={khoaHoc.courseId} value={khoaHoc.courseId}>
                    {khoaHoc.courseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faFilter} size="1x" />}
                onClick={handleFilterSubmit}
                fullWidth
                sx={{
                  py: 1,
                  px: 3,
                }}
              >
                Lọc
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleClearFilter}
                fullWidth
                sx={{
                  minWidth: "120px",
                  py: 1,
                  px: 3,
                }}
              >
                Xóa lọc
              </Button>
            </Box>
          </Box>
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
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.id === "actions" ? "center" : "left"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.disableSorting ? (
                      headCell.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={createSortHandler(
                          headCell.id as keyof ClassView
                        )}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
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
                stableSort(lopHocList, getComparator(order, orderBy)).map(
                  (lop) => (
                    <TableRow hover key={lop.classId}>
                      <TableCell>{lop.className}</TableCell>
                      <TableCell>{lop.roomName}</TableCell>
                      <TableCell>{lop.schedulePattern}</TableCell>
                      <TableCell>
                        {lop.startTime} - {lop.endTime}
                      </TableCell>
                      <TableCell>{lop.instructorName}</TableCell>
                      <TableCell>
                        <Chip
                          label={displayStatus(lop.status)}
                          color={getStatusChipColor(Number(lop.status))}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa lớp học">
                          <IconButton
                            size="small"
                            color="primary"
                            // onClick={() => handleEdit(lop.malop)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Xóa lớp học">
                          <IconButton
                            size="small"
                            color="error"

                            // onClick={() => handleDelete(lop.malop)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Đổi trạng thái của lớp học">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => handleChangeClassStatus(lop.classId)}
                          >
                            {lop.status ? (
                              <FontAwesomeIcon icon={faLock} />
                            ) : (
                              <FontAwesomeIcon icon={faLockOpen} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Phân trang */}
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
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

      <SuggestionDialog
        open={openSuggestionDialog}
        onClose={() => setOpenSuggestionDialog(false)}
        data={suggestionData}
        onSelectAlternative={handleSelectAlternative}
      />

      {/* --- SNACKBAR HIỂN THỊ THÀNH CÔNG --- */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiện góc trên phải
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClassListPage;

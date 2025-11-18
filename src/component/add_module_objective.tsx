// src/pages/admin/course/Step2_Curriculum.tsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  InputAdornment,
  Alert,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { NewCourseState } from "../pages/add_course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { SkillResponse } from "../model/course_model";
import { getAllSkills } from "../services/course_service";

interface Props {
  data: NewCourseState;
  setData: React.Dispatch<React.SetStateAction<NewCourseState>>;
}

interface EditingModule {
  index: number;
  tenmodule: string;
  duration: number;
}

interface ModuleInputState {
  [key: number]: {
    tenmodule: string;
    duration: string;
  };
}

const Step2Curriculum: React.FC<Props> = ({ data, setData }) => {
  const [newObjective, setNewObjective] = useState("");
  const [allSkills, setAllSkills] = useState<SkillResponse[]>([]);
  const [moduleInputs, setModuleInputs] = useState<ModuleInputState>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<EditingModule | null>(
    null
  );

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getAllSkills();
        if (res.data) {
          setAllSkills(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải kỹ năng:", error);
      }
    };
    fetchSkills();
  }, []);

  const handleAddObjective = (event: React.FormEvent) => {
    event.preventDefault();
    if (newObjective.trim() !== "") {
      setData((prev) => ({
        ...prev,
        muctieu: [...prev.muctieu, { tenmuctieu: newObjective }],
      }));
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    setData((prev) => ({
      ...prev,
      muctieu: prev.muctieu.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (
    skillId: number,
    field: "tenmodule" | "duration",
    value: string
  ) => {
    setModuleInputs((prev) => ({
      ...prev,
      [skillId]: {
        ...prev[skillId],
        [field]: value,
      },
    }));
  };

  const handleAddModule = (skillId: number) => {
    const input = moduleInputs[skillId];

    if (!input || !input.tenmodule.trim()) {
      alert("Vui lòng nhập tên module");
      return;
    }

    const durationVal = parseFloat(input.duration);
    if (!input.duration || isNaN(durationVal) || durationVal <= 0) {
      alert("Vui lòng nhập thời lượng hợp lệ (>0)");
      return;
    }

    const newModuleData = {
      tenmodule: input.tenmodule,
      duration: durationVal,
      skillId: skillId,
      noidung: [],
      tailieu: [],
    };

    setData((prev) => ({
      ...prev,
      modules: [...prev.modules, newModuleData],
    }));

    // Reset input của skill đó
    setModuleInputs((prev) => ({
      ...prev,
      [skillId]: { tenmodule: "", duration: "" },
    }));
  };

  const handleRemoveModule = (globalIndex: number) => {
    // globalIndex là index trong mảng data.modules gốc
    setData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== globalIndex),
    }));
  };

  // --- Handlers cho Edit Module ---
  const handleOpenEditDialog = (
    module: { tenmodule: string; duration?: number },
    index: number // index trong mảng gốc
  ) => {
    setEditingModule({
      index,
      tenmodule: module.tenmodule,
      duration: module.duration || 0,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingModule(null);
  };

  const handleSaveChanges = () => {
    if (!editingModule || editingModule.tenmodule.trim() === "") {
      alert("Tên module không được rỗng.");
      return;
    }
    if (editingModule.duration <= 0) {
      alert("Thời lượng phải lớn hơn 0.");
      return;
    }

    setData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === editingModule.index
          ? {
              ...module,
              tenmodule: editingModule.tenmodule,
              duration: editingModule.duration,
            }
          : module
      ),
    }));
    handleCloseEditDialog();
  };

  // Lọc ra các kỹ năng đã được chọn ở Step 1
  const selectedSkills = allSkills.filter((s) => data.skillIds.includes(s.id));

    // --- TÍNH TOÁN THỜI LƯỢNG ---
  if(data.sogiohoc == 0) {
    return (
      <Alert severity="error">Tổng số giờ học phải lớn hơn 0</Alert>
    )
  }
  const totalCreatedHours = data.modules.reduce(
    (sum, mod) => sum + (mod.duration || 0),
    0
  );
  const targetHours = data.sogiohoc || 0;
  const remainingHours = targetHours - totalCreatedHours;
  const isDurationValid = totalCreatedHours == targetHours;
  const isOverDuration = totalCreatedHours > targetHours;

  return (
    <Grid container spacing={4}>
      {/* Phần mục tiêu */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Mục tiêu khóa học
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", gap: 1, mb: 2 }}
          onSubmit={handleAddObjective}
        >
          <TextField
            label="Tên mục tiêu"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="outlined">
            Thêm
          </Button>
        </Box>
        <List>
          {data.muctieu.length === 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              Chưa có mục tiêu nào.
            </Typography>
          )}
          {data.muctieu.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveObjective(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={item.tenmuctieu} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Divider orientation="horizontal" />
      </Grid>

      {/* Phần Module */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Chương trình học (Modules)
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "#e3f2fd",
            border: "1px dashed #1976d2",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Kiểm soát thời lượng khóa học
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min((totalCreatedHours / targetHours) * 100, 100)}
                color={
                  isOverDuration
                    ? "error"
                    : isDurationValid
                    ? "success"
                    : "primary"
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {totalCreatedHours != 0 ? `${Math.round((totalCreatedHours / targetHours) * 100)}%` : "0%"}
              </Typography>
            </Box>
          </Box>

          <Alert
            severity={
              isDurationValid ? "success" : isOverDuration ? "error" : "warning"
            }
            icon={
              <FontAwesomeIcon
                icon={isDurationValid ? faCheckCircle : faExclamationCircle}
              />
            }
            sx={{ alignItems: "center" }}
          >
            <Typography variant="body2" fontWeight="bold">
              Đã tạo: {totalCreatedHours}h / Tổng: {targetHours}h
            </Typography>
            {!isDurationValid && (
              <Typography variant="caption" display="block">
                {isOverDuration
                  ? `Bạn đang vượt quá ${
                      totalCreatedHours - targetHours
                    } giờ so với quy định.`
                  : `Bạn cần thêm ${remainingHours} giờ nữa để hoàn thành chương trình.`}
              </Typography>
            )}
          </Alert>
        </Paper>

        {selectedSkills.length === 0 ? (
          <Typography color="error">
            Vui lòng chọn Kỹ năng ở Bước 1 để thêm Module.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {selectedSkills.map((skill) => {
              const skillModules = data.modules
                .map((m, idx) => ({ ...m, originalIndex: idx }))
                .filter((m) => m.skillId === skill.id);

              const currentInput = moduleInputs[skill.id] || {
                tenmodule: "",
                duration: "",
              };

              return (
                <Paper
                  key={skill.id}
                  elevation={2}
                  sx={{ p: 2, borderRadius: 2, borderTop: "4px solid #1976d2" }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Chip label={skill.skillName} color="primary" />
                  </Typography>

                  {/* List Modules của Skill này */}
                  <List>
                    {skillModules.map((mod) => (
                      <ListItem
                        key={mod.originalIndex}
                        sx={{
                          bgcolor: "background.paper",
                          mb: 1,
                          border: "1px solid #eee",
                          borderRadius: 1,
                        }}
                        secondaryAction={
                          <>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpenEditDialog(mod, mod.originalIndex)
                              }
                            >
                              <FontAwesomeIcon icon={faPen} size="xs" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleRemoveModule(mod.originalIndex)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        }
                      >
                        <ListItemText
                          primary={mod.tenmodule}
                          secondary={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "0.8rem",
                              }}
                            >
                              <FontAwesomeIcon icon={faClock} /> {mod.duration}{" "}
                              giờ
                            </span>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  {/* Form thêm Module cho Skill này */}
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <TextField
                      label="Tên Module mới"
                      size="small"
                      value={currentInput.tenmodule}
                      onChange={(e) =>
                        handleInputChange(skill.id, "tenmodule", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Giờ"
                      size="small"
                      type="number"
                      value={currentInput.duration}
                      onChange={(e) =>
                        handleInputChange(skill.id, "duration", e.target.value)
                      }
                      sx={{ width: "100px" }}
                      InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAddModule(skill.id)}
                      sx={{ height: "40px" }}
                    >
                      Thêm
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Grid>

      {/* === Dialog Chỉnh sửa Module === */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa Module</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Tên Module"
              fullWidth
              value={editingModule?.tenmodule || ""}
              onChange={(e) =>
                setEditingModule((prev) =>
                  prev ? { ...prev, tenmodule: e.target.value } : null
                )
              }
            />
            <TextField
              label="Thời lượng (giờ)"
              type="number"
              fullWidth
              value={editingModule?.duration || ""}
              onChange={(e) =>
                setEditingModule((prev) =>
                  prev
                    ? { ...prev, duration: parseFloat(e.target.value) }
                    : null
                )
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">giờ</InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Step2Curriculum;

// src/pages/admin/course/Step2_Curriculum.tsx
import React, { useMemo, useState } from "react";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { NewCourseState } from "../pages/add_course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface Props {
  data: NewCourseState;
  setData: React.Dispatch<React.SetStateAction<NewCourseState>>;
}

interface EditingModule {
  index: number;
  tenmodule: string;
  thoiluong: number;
}

const Step2Curriculum: React.FC<Props> = ({ data, setData }) => {
  const [newObjective, setNewObjective] = useState("");
  const [newModule, setNewModule] = useState({ tenmodule: "", thoiluong: 0 });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<EditingModule | null>(
    null
  );

  const handleAddObjective = () => {
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

  const handleAddModule = () => {
    if (newModule.tenmodule.trim() !== "" && newModule.thoiluong > 0) {
      setData((prev) => ({
        ...prev,
        modules: [...prev.modules, { ...newModule, noidung: [], tailieu: [] }],
      }));
      setNewModule({ tenmodule: "", thoiluong: 0 });
    } else if (newModule.thoiluong <= 0) {
      alert("Thời lượng module phải lớn hơn 0.");
    }
  };

  const handleRemoveModule = (index: number) => {
    setData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  // --- Handlers cho Edit Module ---
  const handleOpenEditDialog = (
    module: { tenmodule: string; thoiluong: number },
    index: number
  ) => {
    setEditingModule({
      index,
      tenmodule: module.tenmodule,
      thoiluong: module.thoiluong,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingModule(null); // Reset khi đóng
  };

  const handleEditModuleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!editingModule) return;
    const { name, value } = event.target;
    setEditingModule((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "thoiluong" ? Number(value) || 0 : value, // Chuyển thời lượng sang số
          }
        : null
    );
  };

  const handleSaveChanges = () => {
    if (
      !editingModule ||
      editingModule.tenmodule.trim() === "" ||
      editingModule.thoiluong <= 0
    ) {
      alert("Tên module không được rỗng và thời lượng phải lớn hơn 0.");
      return;
    }

    setData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === editingModule.index
          ? {
              ...module,
              tenmodule: editingModule.tenmodule,
              thoiluong: editingModule.thoiluong,
            } // Cập nhật module đúng index
          : module
      ),
    }));
    handleCloseEditDialog();
  };


  return (
    <Grid container spacing={4}>
      {/* Phần mục tiêu */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Mục tiêu khóa học
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            label="Tên mục tiêu"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleAddObjective}>
            Thêm
          </Button>
        </Box>
        <List>
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

      <Divider orientation="vertical" flexItem />

      {/* Phần Module */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          Chương trình học (Modules)
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            label="Tên Module"
            value={newModule.tenmodule}
            onChange={(e) =>
              setNewModule({ ...newModule, tenmodule: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Thời lượng (giờ)"
            type="number"
            value={newModule.thoiluong}
            onChange={(e) =>
              setNewModule({ ...newModule, thoiluong: Number(e.target.value) })
            }
            sx={{ width: 150 }}
          />
          <Button variant="outlined" onClick={handleAddModule}>
            Thêm
          </Button>
        </Box>
        <List>
          {data.modules.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    size="small"
                    sx={{ mr: 0.5 }}
                    onClick={() => handleOpenEditDialog(item, index)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </IconButton>

                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveModule(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={item.tenmodule}
                secondary={`${item.thoiluong} giờ`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Chỉnh sửa Module</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="tenmodule"
                        label="Tên Module"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editingModule?.tenmodule || ''}
                        onChange={handleEditModuleChange}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        name="thoiluong"
                        label="Thời lượng (giờ)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={editingModule?.thoiluong || ''}
                        onChange={handleEditModuleChange}
                        InputProps={{ inputProps: { min: 1 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 2, pr: 2 }}>
                    <Button onClick={handleCloseEditDialog}>Hủy</Button>
                    <Button onClick={handleSaveChanges} variant="contained">Lưu thay đổi</Button>
                </DialogActions>
            </Dialog>
    </Grid>
  );
};

export default Step2Curriculum;

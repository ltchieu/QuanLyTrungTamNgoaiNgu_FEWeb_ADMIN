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
}

const Step2Curriculum: React.FC<Props> = ({ data, setData }) => {
  const [newObjective, setNewObjective] = useState("");
  const [newModule, setNewModule] = useState({ tenmodule: "" });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<EditingModule | null>(
    null
  );

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

  const handleAddModule = (event: React.FormEvent) => {
    event.preventDefault();
    if (newModule.tenmodule.trim() !== "") {
      setData((prev) => ({
        ...prev,
        modules: [
          ...prev.modules,
          { ...newModule, noidung: [], tailieu: [] },
        ],
      }));
      setNewModule({ tenmodule: "" });
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
    module: { tenmodule: string; },
    index: number
  ) => {
    setEditingModule({
      index,
      tenmodule: module.tenmodule
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingModule(null);
  };

  const handleEditModuleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!editingModule) return;
    setEditingModule((prev) =>
      prev
        ? {
            ...prev,
            tenmodule: event.target.value,
          }
        : null
    );
  };

const handleSaveChanges = () => {
    if (!editingModule || editingModule.tenmodule.trim() === "") {
      alert("Tên module không được rỗng.");
      return;
    }

    setData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === editingModule.index
          ? {
              ...module,
              tenmodule: editingModule.tenmodule,
            }
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
        <Box component="form" onSubmit={handleAddModule} sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            label="Tên Module"
            value={newModule.tenmodule}
            onChange={(e) =>
              setNewModule({ ...newModule, tenmodule: e.target.value })
            }
            fullWidth
          />        
          <Button type="submit" variant="outlined">
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
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="xs"
        fullWidth
      >
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
            value={editingModule?.tenmodule || ""}
            onChange={handleEditModuleChange}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
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

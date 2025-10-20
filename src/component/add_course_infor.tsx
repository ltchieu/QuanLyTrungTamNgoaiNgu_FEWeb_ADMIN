// src/pages/admin/course/Step1_CourseInfo.tsx
import React from "react";
import { TextField, Grid, MenuItem, Typography, Input } from "@mui/material";
import { NewCourseState } from "../pages/add_course";
import InputFileUpload from "./button_upload_file";

interface Props {
  data: NewCourseState;
  setData: React.Dispatch<React.SetStateAction<NewCourseState>>;
}

const Step1CourseInfo: React.FC<Props> = ({ data, setData }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "video") {
      const embedLink = handleLinkYoutube(value);
      if (embedLink != null) {
        setData((prev) => ({
          ...prev,
          [name]: embedLink || value,
        }));
      }
      else {
        alert("Lỗi khi chuyển đổi link youtube")
      }
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLinkYoutube = (link: string) => {
    const regex = /(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    if (match) {
      return "https://www.youtube.com/embed/" + match[1];
    } else {
      return null;
    }
  };

  const handleImageUploadSuccess = (fileUrl: string) => {
    setData((prev) => ({
      ...prev,
      image: fileUrl,
    }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Thông tin chung
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            name="tenkhoahoc"
            label="Tên khóa học"
            fullWidth
            value={data.tenkhoahoc}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            name="hocphi"
            label="Học phí (VNĐ)"
            type="number"
            fullWidth
            value={data.hocphi}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            name="sobuoihoc"
            label="Số buổi học"
            type="number"
            fullWidth
            value={data.sobuoihoc}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="sogiohoc"
            label="Số giờ học"
            type="number"
            fullWidth
            value={data.sogiohoc}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            name="trangthai"
            label="Trạng thái"
            fullWidth
            value={data.trangthai}
            onChange={handleChange}
          >
            <MenuItem value="Bản nháp">Bản nháp</MenuItem>
            <MenuItem value="Công khai">Công khai</MenuItem>
            <MenuItem value="Sắp ra mắt">Sắp ra mắt</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="description"
            label="Mô tả khóa học"
            fullWidth
            multiline
            rows={3}
            value={data.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="entryLevel"
            label="Yêu cầu đầu vào"
            fullWidth
            value={data.entryLevel}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="targetLevel"
            label="Mục tiêu đầu ra"
            fullWidth
            value={data.targetLevel}
            onChange={handleChange}
            aria-readonly
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="video"
            label="Link Video giới thiệu"
            placeholder="Dán link youtube của bạn vào đây"
            fullWidth
            value={data.video}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 10 }}>
          <TextField
            name="image"
            label="Link ảnh bìa (URL)"
            fullWidth
            value={data.image}
            onChange={handleChange}
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <InputFileUpload onUploadSuccess={handleImageUploadSuccess}/>
        </Grid>
      </Grid>
    </>
  );
};

export default Step1CourseInfo;

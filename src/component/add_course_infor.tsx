import React, { useState } from "react";
import {
  TextField,
  Grid,
  MenuItem,
  Typography,
  Input,
  Box,
} from "@mui/material";
import { NewCourseState } from "../pages/add_course";
import InputFileUpload from "./button_upload_file";
import { getImageUrl } from "../services/course_service";

interface Props {
  data: NewCourseState;
  setData: React.Dispatch<React.SetStateAction<NewCourseState>>;
}

const Step1CourseInfo: React.FC<Props> = ({ data, setData }) => {
  const [isSuccess, setIsSuccess] = useState<Boolean>(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "video") {
      const embedLink = handleLinkYoutube(value);

      if (embedLink != null) {
        setData((prev) => ({
          ...prev,
          [name]: embedLink || value,
        }));
        setVideoError(null);
      } else {
        setData((prev) => ({
          ...prev,
          [name]: "",
        }));
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
    setIsSuccess(true);
    const url = getImageUrl(fileUrl);
    setImgUrl(url);
  };

  const handleVideoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const link = event.target.value;
    if (link && !handleLinkYoutube(link)) {
      setVideoError("Link YouTube không hợp lệ. Vui lòng kiểm tra lại.");
    } else {
      setVideoError(null);
    }
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
        <Grid size={{ xs: 12, sm: 12 }}>
          <TextField
            onFocus={() => {}}
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
            required
            name="sogiohoc"
            label="Số giờ học"
            type="number"
            fullWidth
            value={data.sogiohoc}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
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
            required
            name="entryLevel"
            label="Yêu cầu đầu vào"
            fullWidth
            value={data.entryLevel}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            name="targetLevel"
            label="Mục tiêu đầu ra"
            fullWidth
            value={data.targetLevel}
            onChange={handleChange}
            aria-readonly
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <TextField
            required
            name="video"
            label="Link Video giới thiệu"
            placeholder="Dán link youtube của bạn vào đây"
            fullWidth
            value={data.video}
            onChange={handleChange}
            onBlur={handleVideoBlur}
            error={!!videoError}
            helperText={videoError}
          />
        </Grid>
        <Grid container size={{ xs: 12, md: 12 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <InputFileUpload onUploadSuccess={handleImageUploadSuccess} />
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            {imgUrl && <Box component="img" src={imgUrl} width="80%" />}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }} display={isSuccess ? "block" : "none"}>
          <Typography variant="h6" fontWeight="bold" color="green">
            Upload ảnh bìa thành công
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Step1CourseInfo;

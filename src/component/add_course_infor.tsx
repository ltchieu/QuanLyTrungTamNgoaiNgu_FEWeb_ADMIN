import React, { useEffect, useState } from "react";
import { TextField, Grid, Typography, Box, MenuItem } from "@mui/material";
import { NewCourseState } from "../pages/add_course";
import InputFileUpload from "./button_upload_file";
import { getImageUrl } from "../services/course_service";
import { CourseCategoryResponse } from "../model/course_category_model";
import { getAllCategories } from "../services/course_category_service";

interface Props {
  data: NewCourseState;
  setData: React.Dispatch<React.SetStateAction<NewCourseState>>;
}

const Step1CourseInfo: React.FC<Props> = ({ data, setData }) => {
  const [videoError, setVideoError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CourseCategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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

  const handleVideoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const link = event.target.value;
    if (link && !handleLinkYoutube(link)) {
      setVideoError("Link YouTube không hợp lệ. Vui lòng kiểm tra lại.");
    } else {
      setVideoError(null);
    }
  };

  const getErrorProps = (fieldName: keyof NewCourseState) => {
    let value = data[fieldName];
    if (typeof value === "string" && value.trim() === "") {
      return { error: true, helperText: "Không được để trống" };
    }
    if (typeof value === "number" && value <= 0) {
      return { error: true, helperText: "Phải là số dương" };
    }
    return { error: false, helperText: " " };
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          select
          required
          name="courseCategoryId"
          label="Danh mục khóa học"
          value={data.courseCategoryId}
          fullWidth
          onChange={handleChange}
          disabled={loadingCategories}
          helperText={loadingCategories ? "Đang tải danh mục..." : null}
        >
          <MenuItem value="">
            <em>Chọn danh mục</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          required
          name="tenkhoahoc"
          label="Tên khóa học"
          fullWidth
          value={data.tenkhoahoc}
          onChange={handleChange}
          {...getErrorProps("tenkhoahoc")}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          name="hocphi"
          label="Học phí (VNĐ)"
          type="number"
          fullWidth
          value={data.hocphi || ""}
          onChange={handleChange}
          {...getErrorProps("hocphi")}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          name="sogiohoc"
          label="Tổng số giờ học"
          type="number"
          fullWidth
          value={data.sogiohoc || ""}
          onChange={handleChange}
          {...getErrorProps("sogiohoc")}
          helperText={
            getErrorProps("sogiohoc").error
              ? getErrorProps("sogiohoc").helperText
              : "Tổng thời lượng modules phải khớp số này"
          }
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
          {...getErrorProps("description")}
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
          {...getErrorProps("entryLevel")}
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
          {...getErrorProps("targetLevel")}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          required
          name="video"
          label="Link Video giới thiệu"
          placeholder="Dán link youtube của bạn vào đây"
          fullWidth
          value={data.video}
          onChange={handleChange}
          onBlur={handleVideoBlur}
          error={!!videoError || getErrorProps("video").error}
          helperText={videoError || getErrorProps("video").helperText}
        />
      </Grid>
      {/* Bỏ phần upload ảnh từ đây vì đã chuyển sang cột phải */}
    </Grid>
  );
};

export default Step1CourseInfo;

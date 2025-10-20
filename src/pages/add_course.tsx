// src/pages/admin/course/CreateCoursePage.tsx
import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";

import Step1CourseInfo from "../component/add_course_infor";
import Step2Curriculum from "../component/add_module_objective";
import Step3Content from "../component/add_course_content";
import { useNavigate } from "react-router-dom";
import { createNewCourse } from "../services/course_service";

export interface NewCourseState {
  // Bảng khoahoc
  tenkhoahoc: string;
  sogiohoc: number;
  hocphi: number;
  sobuoihoc: number;
  video: string;
  trangthai: string;
  description: string;
  entryLevel: string;
  targetLevel: string;
  image: string;

  // Bảng muctieukh
  muctieu: { tenmuctieu: string }[];

  // Bảng module và các bảng con
  modules: {
    tenmodule: string;
    thoiluong: number;
    noidung: { tennoidung: string }[];
    tailieu: {
      tenfile: string;
      link: string;
      mota: string;
      hinh: File | null;
    }[];
  }[];
}

const steps = [
  "Thông tin cơ bản",
  "Mục tiêu & Chương trình",
  "Nội dung chi tiết",
];

const CreateCoursePage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state loading
  const navigate = useNavigate(); // Khởi tạo hook
  const [courseData, setCourseData] = useState<NewCourseState>({
    tenkhoahoc: "",
    sogiohoc: 0,
    hocphi: 0,
    sobuoihoc: 0,
    video: "",
    trangthai: "Bản nháp",
    description: "",
    entryLevel: "",
    targetLevel: "",
    image: "",
    muctieu: [],
    modules: [],
  });

  const handleNext = async () => {
    // Logic validate có thể thêm ở đây
    // ...

    // Nếu là bước cuối cùng (nhấn "Hoàn tất")
    if (activeStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        await createNewCourse(courseData).then(() => {
          alert("Tạo khóa học thành công!");
          setActiveStep((prev) => prev + 1);

          //Chuyển về trang danh sách khóa học sau 2 giây
          setTimeout(() => {
            navigate("/courses");
          }, 2000);
        });
      } catch (error) {
        console.error("Lỗi khi tạo khóa học:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Nếu không phải bước cuối, chỉ cần đi tiếp
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step1CourseInfo data={courseData} setData={setCourseData} />;
      case 1:
        return <Step2Curriculum data={courseData} setData={setCourseData} />;
      case 2:
        return <Step3Content data={courseData} setData={setCourseData} />;
      default:
        return <Typography>Đã hoàn thành!</Typography>;
    }
  };

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tạo Khóa Học Mới
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h5">Đã tạo khóa học thành công!</Typography>
          <Typography>Bạn sẽ được chuyển về trang danh sách...</Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      ) : (
        renderStepContent(activeStep)
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Quay lại
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isSubmitting} // Vô hiệu hóa nút khi đang gửi
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : activeStep === steps.length - 1 ? (
            "Hoàn tất"
          ) : (
            "Tiếp theo"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default CreateCoursePage;

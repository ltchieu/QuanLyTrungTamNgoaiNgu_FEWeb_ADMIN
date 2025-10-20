import { axiosClient } from "../api/axios_client";
import { CourseCreateRequest } from "../model/course_model";
import { NewCourseState } from "../pages/add_course";

export function getAllCourse(page: number, size: number) {
  return axiosClient.get("/courses", {
    params: {
      page: page,
      size: size
    }
  });
}

//Tạo khóa học
export function createNewCourse(courseData: NewCourseState) {
  //Map dữ liệu từ frontend (NewCourseState) sang backend (CourseCreateRequest)
  const requestData: CourseCreateRequest = {
    courseName: courseData.tenkhoahoc,
    tuitionFee: courseData.hocphi,
    video: courseData.video,
    description: courseData.description,
    entryLevel: courseData.entryLevel,  
    targetLevel: courseData.targetLevel,
    image: courseData.image,          

    // Map danh sách mục tiêu
    objectives: courseData.muctieu.map(obj => ({
      objectiveName: obj.tenmuctieu
    })),

    // Map danh sách module
    modules: courseData.modules.map(mod => ({
      moduleName: mod.tenmodule,
      duration: mod.thoiluong
    }))
  };
  return axiosClient.post("/courses", requestData);
}

//Upload ảnh
export function uploadCourseImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post("/files/upload", formData);
}
import { axiosClient, axiosMultipart } from "../api/axios_client";
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
  // Map dữ liệu từ frontend (NewCourseState) sang backend (CourseCreateRequest)
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

    modules: courseData.modules.map(mod => ({
      moduleName: mod.tenmodule,
      duration: mod.thoiluong,

      // Map tài liệu
      documents: mod.tailieu.map(doc => ({
        fileName: doc.tenfile,
        link: doc.link,
        description: doc.mota,
        image: typeof doc.hinh === 'string' ? doc.hinh : '',
      })),

      // Map nội dung bài học
      contents: mod.noidung.map(content => ({
        contentName: content.tennoidung
      }))
    }))
  };
  return axiosClient.post("/courses", requestData);
}

//Upload ảnh
export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return axiosMultipart.post("/files", formData);
}

//Lấy đường dẫn ảnh
export function getImageUrl(fileName: string): string{
  return `${axiosClient.defaults.baseURL}/files/${fileName}`;
}
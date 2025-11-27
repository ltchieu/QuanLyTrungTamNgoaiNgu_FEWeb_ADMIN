import { axiosClient } from "../api/axios_client";
import { ApiResponse } from "../model/api_respone";
import {
  ClassCreationRequest,
  ClassDetailResponse,
  CourseFilterData,
  LecturerFilterData,
  RoomFilterData,
} from "../model/class_model";

export function getAllClasses(page: number, size: number) {
  const params = {
    page,
    size,
  };
  return axiosClient.get("/courseclasses", { params });
}

//Lấy ra tên khóa học để hiển thị lên combobox
export async function getCourseFilterList(): Promise<CourseFilterData[]> {
  try {
    const response = await axiosClient.get<ApiResponse<CourseFilterData[]>>(
      "/courses/activecourses-name"
    );

    if (response.data && response.data.code === 1000 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "Lấy khóa học thất bại");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Lấy khóa học API error:", message);
    throw new Error(message);
  }
}

export async function getLecturerFilterList(): Promise<LecturerFilterData[]> {
  try {
    const response = await axiosClient.get<ApiResponse<LecturerFilterData[]>>(
      "/lecturers/lecturer-name"
    );

    if (response.data && response.data.code === 1000 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "Lấy phòng học thất bại");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Lấy phòng học API error:", message);
    throw new Error(message);
  }
}

export async function getRoomFilterList(): Promise<RoomFilterData[]> {
  try {
    const response = await axiosClient.get<ApiResponse<RoomFilterData[]>>(
      "/rooms/room-name"
    );

    if (response.data && response.data.code === 1000 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "Lấy phòng học thất bại");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Lấy phòng học API error:", message);
    throw new Error(message);
  }
}

export function createClass(request: ClassCreationRequest) {
  return axiosClient.post<ApiResponse<any>>("/courseclasses", request);
}

export async function changeClassStatus(classId: number) {
  try {
    const response = await axiosClient.post(`/courseclasses/${classId}`);

    if (response.data && response.data.code === 1000) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Thay đổi trạng thái thất bại");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Thay đổi trạng thái thất bại:", message);
    throw new Error(message);
  }
}

export const filterClasses = async (
  lecturerId: number | null,
  roomId: number | null,
  courseId: number | null,
  searchTerm: string | null,
  page: number,
  size: number
) => {
  try {
    const response = await axiosClient.get(`courseclasses/filter`, {
      params: {
        lecturerId: lecturerId || null,
        roomId: roomId || null,
        courseId: courseId || null,
        className: searchTerm || null,
        page: page,
        size: size
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lọc lớp học:", error);
    throw error;
  }
};

export const getClassDetail = async (id: number | string) => {
  try {
    const response = await axiosClient.get(`courseclasses/${id}`);

    return response.data.data as ClassDetailResponse;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết lớp học ${id}:`, error);
    throw error;
  }
};

export const updateClass = async (classId: number | string, request: ClassCreationRequest) => {
  try {
    const response = await axiosClient.put(`courseclasses/${classId}`, request);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật lớp học ${classId}:`, error);
    throw error;
  }
};

export const getTeacherClassesMock = async (teacherId: number) => {
  // Mock data for teacher's classes
  // In a real app, this would call an API endpoint like /courseclasses/teacher/{teacherId}

  return [
    {
      classId: 1,
      className: "IELTS Foundation - K12",
      courseName: "IELTS Foundation",
      roomName: "P.301",
      schedulePattern: "2-4-6 (17:30 - 19:30)",
      startDate: "2023-11-01",
      endDate: "2024-01-31",
      totalStudents: 24,
      status: "DangHoc", // DangHoc, SapMo, DaKetThuc
      progress: 20, // Percentage
      totalSessions: 36,
      completedSessions: 7
    },
    {
      classId: 2,
      className: "Giao tiếp nâng cao - K05",
      courseName: "Tiếng Anh Giao Tiếp",
      roomName: "P.202",
      schedulePattern: "3-5 (19:30 - 21:30)",
      startDate: "2023-10-15",
      endDate: "2024-01-15",
      totalStudents: 18,
      status: "DangHoc",
      progress: 50,
      totalSessions: 24,
      completedSessions: 12
    },
    {
      classId: 3,
      className: "TOEIC 500+ - K08",
      courseName: "Luyện thi TOEIC",
      roomName: "P.101",
      schedulePattern: "7-CN (08:00 - 10:00)",
      startDate: "2023-12-01",
      endDate: "2024-03-01",
      totalStudents: 30,
      status: "SapMo",
      progress: 0,
      totalSessions: 24,
      completedSessions: 0
    },
    {
      classId: 4,
      className: "Tiếng Anh Trẻ Em - K02",
      courseName: "Tiếng Anh Trẻ Em",
      roomName: "P.405",
      schedulePattern: "7-CN (15:00 - 17:00)",
      startDate: "2023-08-01",
      endDate: "2023-11-01",
      totalStudents: 15,
      status: "DaKetThuc",
      progress: 100,
      totalSessions: 24,
      completedSessions: 24
    }
  ];
};

export const getTeacherClassDetailMock = async (classId: number | string) => {
  // Mock data for class detail
  return {
    classId: classId,
    className: "IELTS Foundation - K12",
    courseName: "IELTS Foundation",
    roomName: "P.301",
    schedulePattern: "2-4-6 (17:30 - 19:30)",
    startDate: "2023-11-01",
    endDate: "2024-01-31",
    totalStudents: 24,
    status: "DangHoc",
    progress: 20,
    totalSessions: 36,
    completedSessions: 7,
    lecturerName: "Nguyễn Văn A",
    description: "Lớp học dành cho người mới bắt đầu làm quen với IELTS."
  };
};

export const getClassStudentsMock = async (classId: number | string) => {
  // Mock data for students in class
  return [
    {
      studentId: 1,
      fullName: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0901234567",
      dob: "2000-01-01",
      gender: "Nu",
      attendance: 90, // Percentage
      midtermScore: 7.5,
      finalScore: null,
      status: "DangHoc"
    },
    {
      studentId: 2,
      fullName: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0909876543",
      dob: "1999-05-15",
      gender: "Nam",
      attendance: 85,
      midtermScore: 6.0,
      finalScore: null,
      status: "DangHoc"
    },
    {
      studentId: 3,
      fullName: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0912345678",
      dob: "2001-12-20",
      gender: "Nu",
      attendance: 100,
      midtermScore: 8.5,
      finalScore: null,
      status: "DangHoc"
    },
    {
      studentId: 4,
      fullName: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0987654321",
      dob: "2000-08-10",
      gender: "Nam",
      attendance: 60,
      midtermScore: 4.0,
      finalScore: null,
      status: "CanhBao" // CanhBao, NghiHoc
    }
  ];
};

export const getSessionsByClassIdMock = async (classId: number | string) => {
  // Mock data for sessions in a class
  // Based on buoihoc table: mabuoihoc, ngayhoc, trangthai, ghichu, malop
  return [
    {
      sessionId: 1,
      date: "2023-11-01",
      status: "Completed",
      note: "Introduction",
      classId: classId
    },
    {
      sessionId: 2,
      date: "2023-11-03",
      status: "Completed",
      note: "Unit 1: Family",
      classId: classId
    },
    {
      sessionId: 3,
      date: "2023-11-06",
      status: "Pending", // NotCompleted in DB, mapping to UI status
      note: "Unit 2: Work",
      classId: classId
    },
    {
      sessionId: 4,
      date: "2023-11-08",
      status: "Pending",
      note: "Unit 3: Travel",
      classId: classId
    }
  ];
};

export const getAttendanceBySessionIdMock = async (sessionId: number | string) => {
  // Mock data for attendance in a session
  // Based on diemdanh table: madiemdanh, mahocvien, mabuoihoc, vang (0=Present, 1=Absent), ghichu
  // Returning a list of students with their attendance status for the given session

  // Simulating fetching students first then mapping attendance
  const students = await getClassStudentsMock(1); // Assuming classId 1 for mock

  return students.map((student, index) => ({
    attendanceId: index + 1,
    studentId: student.studentId,
    fullName: student.fullName,
    sessionId: sessionId,
    isAbsent: index === 1, // Mocking 2nd student as absent (vang=1)
    note: index === 1 ? "Vắng có phép" : "Có mặt"
  }));
};

export const saveAttendanceMock = async (sessionId: number | string, attendanceList: any[]) => {
  // Mock saving attendance
  console.log(`Saving attendance for session ${sessionId}:`, attendanceList);
  return {
    code: 1000,
    message: "Lưu điểm danh thành công",
    data: attendanceList
  };
};
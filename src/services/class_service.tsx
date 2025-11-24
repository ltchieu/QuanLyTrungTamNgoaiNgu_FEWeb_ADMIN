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
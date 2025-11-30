import { axiosClient } from "../api/axios_client";
import { ApiResponse } from "../model/api_respone";
import { CourseCategoryResponse } from "../model/course_category_model";

let mockCategories: CourseCategoryResponse[] = [
  { id: 1, name: "Tiếng Anh Giao Tiếp" },
  { id: 2, name: "Luyện Thi TOEIC" },
  { id: 3, name: "Luyện Thi IELTS" },
  { id: 4, name: "Tiếng Anh Trẻ Em" },
];

export function getAllCategories() {
  // return axiosClient.get("/categories");
  return new Promise<{ data: CourseCategoryResponse[] }>((resolve) => {
    setTimeout(() => {
      resolve({ data: [...mockCategories] });
    }, 500);
  });
}

export function createCategory(data: { name: string }) {
  // return axiosClient.post("/categories", data);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = mockCategories.length > 0 ? Math.max(...mockCategories.map(c => c.id)) + 1 : 1;
      const newCategory = { id: newId, ...data };
      mockCategories.push(newCategory);
      resolve({ data: newCategory });
    }, 500);
  });
}

export function updateCategory(id: number, data: { name: string }) {
  // return axiosClient.put(`/categories/${id}`, data);
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCategories = mockCategories.map(c => c.id === id ? { ...c, ...data } : c);
      resolve({ data: { id, ...data } });
    }, 500);
  });
}

export function deleteCategory(id: number) {
  // return axiosClient.delete(`/categories/${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCategories = mockCategories.filter(c => c.id !== id);
      resolve({ data: true });
    }, 500);
  });
}
import { axiosClient } from "../api/axios_client";
import { ApiResponse } from "../model/api_respone";
import { CourseCategoryResponse } from "../model/course_category_model";

export function getAllCategories() {
  return axiosClient.get("/categories");
}
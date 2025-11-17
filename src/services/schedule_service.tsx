import { ScheduleCheckRequest, ScheduleSuggestionResponse } from "../model/schedule_suggestion_model";
import { axiosClient } from "../api/axios_client";

export const checkAndSuggestSchedule = async (
  request: ScheduleCheckRequest
): Promise<ScheduleSuggestionResponse> => {
  try {
    const response = await axiosClient.post(`/schedules/check-and-suggest`, request);
    return response.data.data; 
  } catch (error) {
    console.error("Error checking schedule:", error);
    throw error;
  }
};
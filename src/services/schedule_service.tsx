import { ScheduleCheckRequest, ScheduleSuggestionResponse } from "../model/schedule_model";
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


export const getWeeklySchedule = async (
  lecturerId: number | null,
  roomId: number | null,
  courseId: number | null,
  date: string
) => {
  try {
    const response = await axiosClient.get(`/courseclasses/schedule-by-week`, {
      params: {
        lecturerId,
        roomId,
        courseId,
        date,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch tuần:", error);
    throw error;
  }
};

export const getTeacherScheduleMock = async (
  teacherId: number,
  date: string
) => {
  // Calculate the week start (Monday) and week end (Sunday) based on the input date
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay();

  // Calculate Monday of the week
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(inputDate);
  monday.setDate(inputDate.getDate() + mondayOffset);

  // Calculate Sunday of the week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Format dates as YYYY-MM-DD
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const weekStart = formatDate(monday);
  const weekEnd = formatDate(sunday);

  // Generate all 7 days
  const dayNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const days = dayNames.map((dayName, index) => {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + index);
    const currentDateStr = formatDate(currentDay);

    // Mock schedule data - you can customize this based on the day
    let periods = [];

    // Add some sessions on Monday, Wednesday, Friday (2-4-6 pattern)
    if (dayName === "MONDAY" || dayName === "WEDNESDAY" || dayName === "FRIDAY") {
      periods = [
        {
          period: "Sáng",
          sessions: [
            {
              sessionId: index * 10 + 1,
              className: "IELTS Foundation - K12",
              courseName: "IELTS Foundation",
              roomName: "P.301",
              instructorName: "Nguyễn Văn A",
              status: false,
              note: "",
              schedulePattern: "2-4-6",
              sessionDate: currentDateStr,
            },
          ],
        },
        {
          period: "Chiều",
          sessions: [],
        },
        {
          period: "Tối",
          sessions: [],
        },
      ];
    } else if (dayName === "TUESDAY" || dayName === "THURSDAY") {
      // Add afternoon sessions on Tuesday and Thursday
      periods = [
        {
          period: "Sáng",
          sessions: [],
        },
        {
          period: "Chiều",
          sessions: [
            {
              sessionId: index * 10 + 2,
              className: "Giao tiếp nâng cao - K05",
              courseName: "Tiếng Anh Giao Tiếp",
              roomName: "P.202",
              instructorName: "Nguyễn Văn A",
              status: false,
              note: "",
              schedulePattern: "3-5",
              sessionDate: currentDateStr,
            },
          ],
        },
        {
          period: "Tối",
          sessions: [],
        },
      ];
    } else {
      // Weekend - empty periods
      periods = [
        {
          period: "Sáng",
          sessions: [],
        },
        {
          period: "Chiều",
          sessions: [],
        },
        {
          period: "Tối",
          sessions: [],
        },
      ];
    }

    return {
      date: currentDateStr,
      dayName,
      periods,
    };
  });

  return {
    weekStart,
    weekEnd,
    days,
  };
};
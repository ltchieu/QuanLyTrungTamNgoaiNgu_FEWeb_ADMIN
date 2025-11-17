export interface ClassView {
  classId: number;
  className: string;
  roomName: string;
  schedulePattern: string;
  instructorName: string;
  startTime: string;
  endTime: number | string;
  status: string;
}

export interface CourseFilterData {
  courseId: number;
  courseName: string;
}

export interface LecturerFilterData {
    lecturerId: number;
    lecturerName: string;
}
export interface RoomFilterData {
    roomId: number;
    roomName: string;
}

export interface ClassCreationRequest {
  courseId: number | string;
  className: string;
  lecturerId: number | string;
  roomId: number | string;
  schedule: string;
  startTime: string;
  minutesPerSession: number | string;
  startDate: string;
  note?: string;
}
export interface ClassView {
  classId: number;
  className: string;
  roomName: string;
  schedulePattern: string;
  instructorName: string;
  startTime: string;
  endTime: string;
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

export interface SessionDetail {
  sessionId: number;
  date: string;
  note: string;
  status: boolean;
}

export interface ClassDetailResponse {
  classId: number;
  className: string;
  courseName: string;
  schedulePattern: string;
  startTime: string;       
  endTime: string;
  minutePerSession: number; 
  startDate: string;
  endDate: string;      
  roomName: string;
  instructorName: string;
  totalSessions: number;
  sessions: SessionDetail[];
}
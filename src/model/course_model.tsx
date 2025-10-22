export interface Objective {
  id: number;
  objectiveName: string;
}

//Tài liệu của module
export interface Document {
  documentId: number;
  fileName: string;
  link: string;
  description: string;
  image: string;
}

//Nội dung trong module
export interface ModuleContent {
  id: number;
  contentName: string;
}

//Mỗi module trong khóa học
export interface Module {
  moduleId: number;
  moduleName: string;
  duration: number;
  contents: ModuleContent[];
  documents: Document[];
}

//Toàn bộ khóa học
export interface CourseModel {
  courseId: number;
  courseName: string;
  studyHours: number;
  tuitionFee: number;
  numberOfSessions: number;
  video: string;
  isActive: boolean;
  createdDate: string;
  objectives: Objective[];
  modules: Module[];
}

export interface CourseCreateRequest {
  courseName: string;
  tuitionFee: number;
  video: string;
  description: string;
  entryLevel: string;
  targetLevel: string;
  image: string;
  objectives: { objectiveName: string }[];
  modules: {
    moduleName: string;
    duration: number;
    documents: {
      fileName: string;
      link: string;
      description: string;
    }[];
  contents: {
      contentName: string;
    }[]; 
}[]
}
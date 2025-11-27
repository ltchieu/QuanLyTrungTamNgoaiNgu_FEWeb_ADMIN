export interface LoaiBangCap {
  maLoai: number;
  ten: string;
}

export interface BangCap {
  ma: number;
  maGiangVien: number;
  maLoai: number;
  trinhDo: string; // Specific level or classification
  loaiBangCap?: LoaiBangCap; // For display purposes
}

export interface GiangVien {
  magv: number;
  hoten: string;
  ngaysinh: string;
  gioitinh: boolean; // true: Nam, false: Nữ
  sdt: string;
  email: string;
  diachi: string;
  anhdaidien: string;
  bangCaps: BangCap[]; // List of degrees
  mota?: string;
}

export interface TeacherFilter {
  keyword?: string;
}

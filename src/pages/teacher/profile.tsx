import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Avatar,
    Stack,
    IconButton,
    Divider,
    Snackbar,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Edit,
    Save,
    PhotoCamera,
    School,
    Add,
    Delete,
} from "@mui/icons-material";
import { useAuth } from "../../hook/useAuth";
import { getTeacherProfileMock, updateTeacherProfileMock, getDegreeTypesMock, addTeacherDegreeMock, deleteTeacherDegreeMock } from "../../services/teacher_service";
import { GiangVien, LoaiBangCap, BangCap } from "../../model/teacher_model";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const TeacherProfile: React.FC = () => {
    const { userId } = useAuth();
    const [profile, setProfile] = useState<GiangVien | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    // Degree management
    const [openDegreeDialog, setOpenDegreeDialog] = useState(false);
    const [degreeTypes, setDegreeTypes] = useState<LoaiBangCap[]>([]);
    const [newDegreeType, setNewDegreeType] = useState<number | "">("");
    const [newDegreeLevel, setNewDegreeLevel] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [types] = await Promise.all([
                    getDegreeTypesMock(),
                ]);
                setDegreeTypes(types);

                if (userId) {
                    const data = await getTeacherProfileMock(userId);
                    setProfile(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (profile) {
            setProfile({ ...profile, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (profile) {
            try {
                setSaving(true);
                await updateTeacherProfileMock(profile);
                setNotification({
                    open: true,
                    message: "Cập nhật thông tin thành công!",
                    severity: "success",
                });
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating profile:", error);
                setNotification({
                    open: true,
                    message: "Cập nhật thất bại. Vui lòng thử lại.",
                    severity: "error",
                });
            } finally {
                setSaving(false);
            }
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && profile) {
            // In a real app, upload file to server and get URL
            // Here we just use a local object URL for preview
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfile({ ...profile, anhdaidien: imageUrl });
        }
    };

    const handleAddDegree = async () => {
        if (profile && newDegreeType && newDegreeLevel.trim()) {
            try {
                const degreeToAdd: any = {
                    maGiangVien: profile.magv,
                    maLoai: Number(newDegreeType),
                    trinhDo: newDegreeLevel.trim(),
                };
                const addedDegree = await addTeacherDegreeMock(degreeToAdd);

                // Update local profile state
                const updatedBangCaps = [...(profile.bangCaps || []), addedDegree];
                setProfile({ ...profile, bangCaps: updatedBangCaps });

                setNewDegreeType("");
                setNewDegreeLevel("");
                setOpenDegreeDialog(false);
                setNotification({ open: true, message: "Thêm bằng cấp thành công", severity: "success" });
            } catch (error) {
                console.error("Failed to add degree", error);
                setNotification({ open: true, message: "Thêm bằng cấp thất bại", severity: "error" });
            }
        }
    };

    const handleRemoveDegree = async (degreeId: number) => {
        if (profile) {
            try {
                await deleteTeacherDegreeMock(degreeId);
                // Update local profile state
                const updatedBangCaps = (profile.bangCaps || []).filter(d => d.ma !== degreeId);
                setProfile({ ...profile, bangCaps: updatedBangCaps });
                setNotification({ open: true, message: "Xóa bằng cấp thành công", severity: "success" });
            } catch (error) {
                console.error("Failed to delete degree", error);
                setNotification({ open: true, message: "Xóa bằng cấp thất bại", severity: "error" });
            }
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    if (loading || !profile) {
        return <Box sx={{ p: 3 }}>Đang tải thông tin...</Box>;
    }

    const degrees = profile.bangCaps || [];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Hồ sơ giảng viên
                </Typography>
                <Button
                    variant="contained"
                    startIcon={isEditing ? <Save /> : <Edit />}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={saving}
                >
                    {isEditing ? (saving ? "Đang lưu..." : "Lưu thay đổi") : "Chỉnh sửa"}
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Left Column: Avatar & Basic Info */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                        <CardContent>
                            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                                <Avatar
                                    src={profile.anhdaidien}
                                    sx={{ width: 120, height: 120, mb: 2, mx: "auto", border: "4px solid white", boxShadow: 2 }}
                                />
                                {isEditing && (
                                    <IconButton
                                        color="primary"
                                        aria-label="upload picture"
                                        component="label"
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: "background.paper",
                                            boxShadow: 1,
                                            "&:hover": { bgcolor: "grey.200" },
                                        }}
                                    >
                                        <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                                        <PhotoCamera />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="h5" fontWeight="bold">
                                {profile.hoten}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {profile.email}
                            </Typography>
                            <Chip label="Giảng viên" color="primary" size="small" sx={{ mt: 1 }} />
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Bằng cấp & Chứng chỉ
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {degrees.map((degree) => (
                                    <Chip
                                        key={degree.ma}
                                        icon={<School />}
                                        label={`${degree.loaiBangCap?.ten} - ${degree.trinhDo}`}
                                        onDelete={isEditing ? () => handleRemoveDegree(degree.ma) : undefined}
                                        color="secondary"
                                        variant="outlined"
                                    />
                                ))}
                                {isEditing && (
                                    <Chip
                                        icon={<Add />}
                                        label="Thêm bằng cấp"
                                        onClick={() => setOpenDegreeDialog(true)}
                                        color="primary"
                                        variant="outlined"
                                        clickable
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column: Detailed Info */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Thông tin chi tiết
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Họ và tên"
                                        name="hoten"
                                        value={profile.hoten}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? "outlined" : "filled"}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Ngày sinh"
                                        name="ngaysinh"
                                        type="date"
                                        value={profile.ngaysinh}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? "outlined" : "filled"}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        name="sdt"
                                        value={profile.sdt}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? "outlined" : "filled"}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleInputChange}
                                        disabled={true} // Email usually not editable directly
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Địa chỉ"
                                        name="diachi"
                                        value={profile.diachi}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? "outlined" : "filled"}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Mô tả / Giới thiệu"
                                        name="mota"
                                        value={profile.mota || ""}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        multiline
                                        rows={4}
                                        variant={isEditing ? "outlined" : "filled"}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Degree Dialog */}
            <Dialog open={openDegreeDialog} onClose={() => setOpenDegreeDialog(false)}>
                <DialogTitle>Thêm bằng cấp / chứng chỉ</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="degree-type-label">Loại bằng cấp</InputLabel>
                        <Select
                            labelId="degree-type-label"
                            value={newDegreeType}
                            label="Loại bằng cấp"
                            onChange={(e) => setNewDegreeType(Number(e.target.value))}
                        >
                            {degreeTypes.map((type) => (
                                <MenuItem key={type.maLoai} value={type.maLoai}>
                                    {type.ten}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Trình độ / Xếp loại"
                        fullWidth
                        variant="outlined"
                        value={newDegreeLevel}
                        onChange={(e) => setNewDegreeLevel(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDegreeDialog(false)}>Hủy</Button>
                    <Button onClick={handleAddDegree} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TeacherProfile;

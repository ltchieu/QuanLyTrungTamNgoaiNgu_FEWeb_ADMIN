import React from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Typography,
    LinearProgress,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    ClassOccupancyData,
    ClassScheduleData,
    AttendanceRateData,
} from "../../services/dashboard_service";

interface Props {
    occupancy: ClassOccupancyData[];
    schedule: ClassScheduleData[];
    attendance: AttendanceRateData[];
}

export const TrainingStats: React.FC<Props> = ({
    occupancy,
    schedule,
    attendance,
}) => {
    return (
        <Grid container spacing={3}>
            {/* Class Occupancy */}
            <Grid size={{ md: 4, xs: 12 }}>
                <Card sx={{ height: "100%", borderRadius: 4, boxShadow: 3 }}>
                    <CardHeader title="Tỉ lệ lấp đầy lớp học" />
                    <CardContent>
                        <List dense>
                            {occupancy.map((item) => (
                                <ListItem key={item.classId} disablePadding sx={{ mb: 2, display: 'block' }}>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {item.className}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.enrolled}/{item.capacity} ({item.occupancyRate}%)
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.occupancyRate}
                                        color={
                                            item.occupancyRate < 50
                                                ? "error"
                                                : item.occupancyRate > 90
                                                    ? "warning"
                                                    : "success"
                                        }
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Class Schedule */}
            <Grid size={{ md: 4, xs: 12 }}>
                <Card sx={{ height: "100%", borderRadius: 4, boxShadow: 3 }}>
                    <CardHeader title="Phân bổ khung giờ" />
                    <CardContent>
                        <List>
                            {schedule.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemText primary={item.timeFrame} secondary={`${item.count} lớp`} />
                                    </ListItem>
                                    {index < schedule.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Attendance Rate */}
            <Grid size={{ md: 4, xs: 12 }}>
                <Card sx={{ height: "100%", borderRadius: 4, boxShadow: 3 }}>
                    <CardHeader title="Tỉ lệ chuyên cần" />
                    <CardContent>
                        <List dense>
                            {attendance.map((item) => (
                                <ListItem key={item.classId} disablePadding sx={{ mb: 2, display: 'block' }}>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {item.className}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.attendanceRate}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.attendanceRate}
                                        color={item.attendanceRate < 80 ? "error" : "success"}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

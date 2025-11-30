import { axiosClient } from "../api/axios_client";
import { RoomResponse } from "../model/room_model";

let mockRooms: RoomResponse[] = [
    { id: 1, name: "Phòng 101", capacity: 30 },
    { id: 2, name: "Phòng 102", capacity: 30 },
    { id: 3, name: "Phòng 201", capacity: 40 },
    { id: 4, name: "Phòng Lab 1", capacity: 25 },
    { id: 5, name: "Hội trường A", capacity: 100 },
];

export function getAllRooms() {
    // return axiosClient.get("/rooms");
    return new Promise<{ data: RoomResponse[] }>((resolve) => {
        setTimeout(() => {
            resolve({ data: [...mockRooms] });
        }, 500);
    });
}

export function createRoom(data: { name: string; capacity: number }) {
    // return axiosClient.post("/rooms", data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newId = mockRooms.length > 0 ? Math.max(...mockRooms.map(r => r.id)) + 1 : 1;
            const newRoom = { id: newId, ...data };
            mockRooms.push(newRoom);
            resolve({ data: newRoom });
        }, 500);
    });
}

export function updateRoom(id: number, data: { name: string; capacity: number }) {
    // return axiosClient.put(`/rooms/${id}`, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            mockRooms = mockRooms.map(r => r.id === id ? { ...r, ...data } : r);
            resolve({ data: { id, ...data } });
        }, 500);
    });
}

export function deleteRoom(id: number) {
    // return axiosClient.delete(`/rooms/${id}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            mockRooms = mockRooms.filter(r => r.id !== id);
            resolve({ data: true });
        }, 500);
    });
}

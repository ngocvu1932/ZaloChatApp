import { io } from 'socket.io-client';
import { BACKEND_URL } from '@env';

export const socket = customSocket(io, BACKEND_URL);

async function customSocket(io, url) {
    try {
        let socket = null;
        const result = await new Promise(async (resolve, reject) => {
            if (url) {
                try {
                    socket = await io(url, { autoConnect: true, reconnection: true });
                    resolve(socket);
                } catch (error) {
                    console.error('Lỗi kết nối máy chủ socket:', error);
                    reject(error); // Báo lỗi cho Promise
                }
            } else {
                resolve(io());
            }
        });
        return result;
    } catch (error) {
        console.error('Lỗi tổng thể khi tạo socket:', error);
    }
}

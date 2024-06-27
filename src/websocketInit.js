import socketIOClient from 'socket.io-client';

var dirStructureSocket;
var activityLogSocket

export default function connectSocket(baseURL, userId){

    // directory structure socket
    let dirSocketURL = baseURL + '/dir-structure-socket';
    dirStructureSocket =  socketIOClient(dirSocketURL)

    dirStructureSocket.emit('register', userId);

    // activity log socket
    let activityLogURL = baseURL + '/activity-log-socket';
    activityLogSocket = socketIOClient(activityLogURL)

    activityLogSocket.emit('register', userId);

    return {
        dirStructureSocket,
        activityLogSocket,
        disconnect: () => {
            dirStructureSocket.disconnect();
            activityLogSocket.disconnect();
        }
    }
}

export const getDirSocket = () => dirStructureSocket;
export const getActSocket = () => activityLogSocket;
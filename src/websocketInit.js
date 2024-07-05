import socketIOClient from 'socket.io-client';

var dirStructureSocket;
var activityLogSocket;
var inviteSocket;
var consoleLogSocket;
var chatSocket
var activeCollabSocket;
var runningStatusSocket;
var waitingModalSocket;

export default function connectSocket(baseURL, userId){

    // chat Socket 
    let chatSocketURL = baseURL + '/chat-socket';
    chatSocket = socketIOClient(chatSocketURL)
    chatSocket.emit('register', userId);

    // directory structure socket
    let dirSocketURL = baseURL + '/dir-structure-socket';
    dirStructureSocket =  socketIOClient(dirSocketURL)

    dirStructureSocket.emit('register', userId);

    // activity log socket
    let activityLogURL = baseURL + '/activity-log-socket';
    activityLogSocket = socketIOClient(activityLogURL)

    activityLogSocket.emit('register', userId);

    // invite socket
    let inviteSocketURL = baseURL + '/invite-socket';
    inviteSocket = socketIOClient(inviteSocketURL)

    inviteSocket.emit('register', userId);

    // console logs
    let consoleLogURL = baseURL + '/console-log-socket';
    consoleLogSocket = socketIOClient(consoleLogURL);

    consoleLogSocket.emit('register', userId);

    // active collab track
    let activeCollabURL = baseURL + '/active-collab-socket';
    activeCollabSocket = socketIOClient(activeCollabURL);

    activeCollabSocket.emit('register', userId);

    // running status 
    let runningStatusURL = baseURL + '/running-status-socket';
    runningStatusSocket = socketIOClient(runningStatusURL);
    runningStatusSocket.emit('register', userId);

    //waiting Modal Socket
    let waitingModalURL = baseURL + '/waiting-modal-socket';
    waitingModalSocket = socketIOClient(waitingModalURL);
    waitingModalSocket.emit('register', userId);

    return {
        dirStructureSocket,
        activityLogSocket,
        inviteSocket,
        consoleLogSocket,
        chatSocket,
        activeCollabSocket,
        runningStatusSocket,
        waitingModalSocket,
        disconnect: () => {
            dirStructureSocket.disconnect();
            activityLogSocket.disconnect();
            inviteSocket.disconnect();
            consoleLogSocket.disconnect();
            chatSocket.disconnect();
            activeCollabSocket.disconnect();
            runningStatusSocket.disconnect();
            waitingModalSocket.disconnect();
        }
    }
}

export const getDirSocket = () => dirStructureSocket;
export const getActSocket = () => activityLogSocket;
export const getInviteSocket = () => inviteSocket;
export const getConsoleSocket = () => consoleLogSocket;
export const getChatSocket = () => chatSocket;
export const getActiveCollabSocket = () => activeCollabSocket;
export const getRunningStatusSocket = () => runningStatusSocket;
export const getWaitingModalSocket = () => waitingModalSocket;
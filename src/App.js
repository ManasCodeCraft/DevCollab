import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./components/Home/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./components/Auth/authForm";
import UserPage from "./components/UserPage/userPage";
import ProjectPage from "./components/ProjectPage/projectPage";
import { useEffect, useState } from "react";
import { UserAuthenication } from "./redux/api/authAPI";
import { getAllProjects } from "./redux/api/projectAPI";
import { useDispatch, useSelector } from "react-redux";
import { getInvitations } from "./redux/api/invitationAPI";
import {
  ConfirmationModal,
  MessageModal,
  WaitingModal,
  message,
} from "./globalComponents/utilityModal";
import ScreenBlockLoading from "./globalComponents/screenBlockLoading";
import connectSocket from "./websocketInit";
import useDirSocketInit from "./customHooks/sockets/useDirSocketInit";
import useActivitySocketInit from "./customHooks/sockets/useActivitySocketInit";
import useInviteSocketInit from "./customHooks/sockets/useInviteSocketInit";
import useConsoleLogInit from "./customHooks/sockets/useConsoleLogInit";
import useChatInit from "./customHooks/sockets/useChatInit";
import useActiveCollabInit from "./customHooks/sockets/useActiveCollabInit";
import useRunningStatusInit from "./customHooks/sockets/useRunningStatusInit";
import useWaitingModalInit from "./customHooks/sockets/useWaitingModalInit";

function App() {
  const dispatch = useDispatch();
  const [fetchModified, setFetchModified] = useState(false);
  const dark = useSelector((state) => state.config.darkMode);
  const BASE_URL = useSelector((state) => state.config.baseURL);
  const EXEC_URL = useSelector((state) => state.config.executionServerURL);
  const user = useSelector((state) => state.auth.user);
  const [socket, setSocket] = useState({
    dirStructureSocket: null,
    activityLogSocket: null,
    inviteSocket: null,
    consoleLogSocket: null,
    chatSocket: null,
    activeCollabSocket: null,
    runningStatusSocket: null,
    waitingModalSocket: null,
  });

  useDirSocketInit(socket.dirStructureSocket);
  useActivitySocketInit(socket.activityLogSocket);
  useInviteSocketInit(socket.inviteSocket);
  useConsoleLogInit(socket.consoleLogSocket);
  useChatInit(socket.chatSocket);
  useActiveCollabInit(socket.activeCollabSocket);
  useRunningStatusInit(socket.runningStatusSocket);
  useWaitingModalInit(socket.waitingModalSocket);

  useEffect(() => {
    if (BASE_URL && EXEC_URL) {
      var originalFetch = window.fetch;
      window.fetch = function (url, options) {
        if (url.startsWith("/")) {
          url = BASE_URL + url;
        } else if (url.startsWith("exec/")) {
          url = EXEC_URL + url.slice(url.indexOf("/"));
        }
        return originalFetch(url, options);
      };
      setFetchModified(true);
    }
  }, [BASE_URL, EXEC_URL]);

  useEffect(() => {
    if (fetchModified) {
      const queryParams = new URLSearchParams(window.location.search);
      const error = queryParams.get("error");
      if (error) {
        message("Error", error, dispatch);
      }
    }
  }, [fetchModified]);

  useEffect(() => {
    if (fetchModified) {
      UserAuthenication(dispatch);
      getAllProjects(dispatch);
      getInvitations(dispatch);
    }
  }, [fetchModified]);

  useEffect(() => {
    if (user && BASE_URL) {
      const sockets = connectSocket(BASE_URL, user.userid);
      setSocket(sockets);
    }
  }, [user, BASE_URL]);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <BrowserRouter>
      <MessageModal />
      <ConfirmationModal />
      <WaitingModal />
      <ScreenBlockLoading />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/*" element={<AuthForm />} />
        <Route path="/user/*" element={<UserPage />} />
        <Route path="/project/*" element={<ProjectPage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;

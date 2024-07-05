import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { message } from "../../../globalComponents/utilityModal";
import { setRunningStatus } from "../../../redux/slices/projectSlice";
import { getRunningStatusSocket } from "../../../websocketInit";
import ButtonWithLoading from "./buttonWithLoading";
import NpmInstallModal from "./npmInstallModal";

export default function ControlsWindow() {
  const [disableBtnLoading, setDisableBtnLoading] = useState(false);
  const [enableBtnLoading, setEnableBtnLoading] = useState(false);
  const [reloadBtnLoading, setReloadBtnLoading] = useState(false);
  const [showModal, setShowModal] =  useState(false);
  const handleModalClose = () => {
      setShowModal(false);
  }

  const [buttonSize, setButtonSize] = useState("lg");
  const [flexDirection, setFlexDirection] = useState("flex-row");

  const dispatch = useDispatch();
  const runningStatusSocket = getRunningStatusSocket();
  const currentProject = useSelector((state) => state.project.currentProject);
  const userId = useSelector((state) => state.auth.user.userid);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setButtonSize("");
        setFlexDirection("flex-column");
      } else {
        setButtonSize("lg");
        setFlexDirection("flex-row");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!currentProject) {
    window.location.href = "/user/projects";
    return null;
  }

  const { runningStatus, projectId } = currentProject;
  const isRunning = runningStatus === "running";

  const stopExecution = () => {
    setDisableBtnLoading(true);
    fetch("/project/stop", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    })
      .then((response) => {
        setDisableBtnLoading(false);
        if (!response.ok) {
          response
            .json()
            .then((data) => {
              message(
                `Error ${response.status}`,
                data.message || "An error occurred in completing your request",
                dispatch
              );
            })
            .catch((err) => {
              console.error(err);
              message(
                `Error ${response.status}`,
                "An error occurred in completing your request",
                dispatch
              );
            });
        } else {
          dispatch(setRunningStatus({ projectId, status: "not running" }));
          runningStatusSocket.emit("update-status", {
            projectId,
            status: "not running",
            userId,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setDisableBtnLoading(false);
        message("Error", "Unexpected error occurred", dispatch);
      });
  };

  const startExecution = () => {
    setEnableBtnLoading(true);
    fetch("/project/run", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    })
      .then((response) => {
        setEnableBtnLoading(false);
        if (!response.ok) {
          response.json().then((data) => {
            message(
              `Error ${response.status}`,
              data.message || "An error occurred in completing your request",
              dispatch
            );
          });
        } else {
          dispatch(setRunningStatus({ projectId, status: "running" }));
          runningStatusSocket.emit("update-status", {
            projectId,
            status: "running",
            userId,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setEnableBtnLoading(false);
        message("Error", "Unexpected error occurred", dispatch);
      });
  };

  const reload = () => {
    setReloadBtnLoading(true);
    fetch("exec/run-nodejs/reload", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    })
      .then((response) => {
        setReloadBtnLoading(false);
        if (!response.ok) {
          response
            .json()
            .then((data) => {
              message(
                `Error ${response.status}`,
                data.message || "An error occurred in reloading your project.",
                dispatch
              );
            })
            .catch((error) => {
              message(
                `Error ${response.status}`,
                error.message || "An error occurred in reloading your project.",
                dispatch
              );
            });
        }
      })
      .catch((error) => {
        setReloadBtnLoading(false);
        console.log(error);
        message(
          "Error",
          error.message || "Unexpected error occurred",
          dispatch
        );
      });
  };

  return (
    <div className="controls-window">
      <div className={`d-flex ${flexDirection}`}>
        <Button onClick={()=> { setShowModal(true) }} size={buttonSize} >
           npm Install
        </Button>
        {isRunning ? (
          <ButtonWithLoading
            buttonSize={buttonSize}
            loading={disableBtnLoading}
            onClick={stopExecution}
          >
            <ion-icon name="stop-outline" /> Stop Execution
          </ButtonWithLoading>
        ) : (
          <ButtonWithLoading
            buttonSize={buttonSize}
            loading={enableBtnLoading}
            onClick={startExecution}
          >
            <ion-icon name="play-outline" /> Run Nodejs
          </ButtonWithLoading>
        )}

        <ButtonWithLoading
          buttonSize={buttonSize}
          loading={reloadBtnLoading}
          onClick={reload}
        >
          <ion-icon name="reload-outline"></ion-icon>
          <span className="mx-2">Reload</span>
        </ButtonWithLoading>
      </div>

      <NpmInstallModal show={showModal} handleClose={handleModalClose}/>
    </div>
  );
}

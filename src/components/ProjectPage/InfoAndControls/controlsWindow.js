import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { message } from "../../../globalComponents/utilityModal";
import {
  launchAutoCloseWaitingModal,
  setWaitingCompleted,
} from "../../../redux/slices/waitingModalSlice";
import {
  setProjectHostedAndRunning,
  setRunningDisable,
  setRunningEnable,
} from "../../../redux/slices/projectSlice";

export default function ControlsWindow() {
  const [disableBtnLoading, setDisableBtnLoading] = useState(false);
  const [enableBtnLoading, setEnableBtnLoading] = useState(false);
  const [reloadBtnLoading, setReloadBtnLoading] = useState(false);
  const [buttonSize, setButtonSize] = useState("lg");
  const [flexDirection, setFlexDirection] = useState("flex-row");

  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.project.currentProject);

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
    window.location.href = '/user/projects';
    return null;
  }

  const { isDeployed: host, isRunning, projectId } = currentProject;

  const hostProject = () => {
    dispatch(launchAutoCloseWaitingModal("We are setting things up for you.."));
    fetch("/host/hostProject", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    })
      .then((response) => {
        dispatch(setWaitingCompleted());
        if (!response.ok) {
          response.json().then((data) => {
            message(
              `Error ${response.status}`,
              data.message || "An error occurred in hosting your project.",
              dispatch
            );
          });
        } else {
          dispatch(setProjectHostedAndRunning(projectId));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(setWaitingCompleted());
        message("Error", "Unexpected error occurred", dispatch);
      });
  };

  const disableHosting = () => {
    setDisableBtnLoading(true);
    fetch("/host/disableHosting", {
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
          response.json().then((data) => {
            message(
              `Error ${response.status}`,
              data.message || "An error occurred in disabling hosting your project.",
              dispatch
            );
          }).catch((err)=>{
            console.error(err);
            message(
              `Error ${response.status}`,
              "An error occurred in disabling hosting your project.",
              dispatch
            );
          });
        } else {
          dispatch(setRunningDisable(projectId));
        }
      })
      .catch((error) => {
        console.log(error);
        setDisableBtnLoading(false);
        message("Error", "Unexpected error occurred", dispatch);
      });
  };

  const enableHosting = () => {
    setEnableBtnLoading(true);
    fetch("/host/enableHosting", {
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
              data.message || "An error occurred in enabling hosting your project.",
              dispatch
            );
          });
        } else {
          dispatch(setRunningEnable(projectId));
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
    fetch("/host/reload", {
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
          response.json().then((data) => {
            message(
              `Error ${response.status}`,
              data.message || "An error occurred in reloading your project.",
              dispatch
            );
          }).catch(error =>{
            message(
              `Error ${response.status}`,
              "An error occurred in reloading your project.",
              dispatch
            );
            console.log(error)
          });
        }
      })
      .catch((error) => {
        setReloadBtnLoading(false);
        console.log(error);
        message("Error", "Unexpected error occurred", dispatch);
      });
  };

  return (
    <div className="controls-window">
      {host ? (
        <div className={`d-flex ${flexDirection}`}>
          {isRunning ? (
            disableBtnLoading ? (
              <Button variant="primary" size={buttonSize} disabled>
                Working on it...
              </Button>
            ) : (
              <Button variant="danger" size={buttonSize} onClick={disableHosting}>
                Temporarily Disable
              </Button>
            )
          ) : enableBtnLoading ? (
            <Button variant="primary" size={buttonSize} disabled>
              Working on it...
            </Button>
          ) : (
            <Button variant="primary" size={buttonSize} onClick={enableHosting}>
              Re-Enable
            </Button>
          )}
          {reloadBtnLoading ? (
            <Button variant="primary" size={buttonSize} disabled>
              <span className="mx-2">Reload</span>
            </Button>
          ) : (
            <Button variant="primary" size={buttonSize} onClick={reload}>
              <ion-icon name="reload-outline"></ion-icon>
              <span className="mx-2">Reload</span>
            </Button>
          )}
        </div>
      ) : (
        <Button variant="primary" size={buttonSize} onClick={hostProject}>
          Deploy Your Project
        </Button>
      )}
    </div>
  );
}

import React from "react";
import { Container } from "react-bootstrap";
import "../../../styles/logs.css";
import { useSelector } from "react-redux";

export default function ProgramLogs() {
  const execFile = useSelector(state=>state.project.currentlyExecutingFile)
  const logs = execFile.logs;
  if (!logs) return null;
  return (
    <div className="program-logs-wrapper">
      <Container fluid className="program-logs-window">
        {logs.map((log) => {
          return (
            <p>
              <span
                className={
                  log.type === "console" ? "text-white" : "text-danger"
                }
              >
                {log.details}
              </span>
            </p>
          );
        })}
      </Container>
    </div>
  );
}

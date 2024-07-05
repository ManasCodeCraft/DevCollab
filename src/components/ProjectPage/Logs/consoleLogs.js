import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../styles/logs.css";

export default function ConsoleLogs() {
  const logs = useSelector((state) => state.project.currentProject.consoleLogs);
  if (!logs) {
    return null;
  }
  return (
    <div className="console-logs-wrapper">
      <Container fluid className="console-logs-window">
        {logs.map((log) => {
          return (
            <p key={log.id}>
              <span className={(log.type==='console')? 'text-success' : 'text-danger'}>{log.time}</span> {log.value}
            </p>
          );
        })}
      </Container>
    </div>
  );
}

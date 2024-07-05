import React, { useRef, useEffect, useState } from "react";
import BreadCrumbNav from "../ProjectsDir/breadCrumbNav";
import { useSelector } from "react-redux";
import Editor from "./editor";

const CodeEditor = () => {

  const file_to_open = useSelector(
    (state) => state.project.currentlyOpenedFile
  );

  const userId = useSelector(state=>state.auth.user.userid)

  if (!file_to_open) {
    window.location.href = "/user/projects";
    return null;
  }

  return (
    <>
      <BreadCrumbNav />
      <Editor file_to_open={file_to_open} currentUserId={userId} />
    </>
  );
};

export default CodeEditor;

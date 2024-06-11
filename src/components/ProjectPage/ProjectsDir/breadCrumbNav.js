import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { popUptoIndexDirStack, setCurrentlyOpenedFile } from "../../../redux/slices/projectSlice";

export default function BreadCrumbNav() {
  const dirstack = useSelector((state) => state.project.dirStack);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define the event handler to accept an ID parameter
  function navClick(index) {
    dispatch(popUptoIndexDirStack(index))
    dispatch(setCurrentlyOpenedFile(null))
    navigate('/project/structure')
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb fs-5 mx-2 my-4">
        {dirstack && dirstack.map((dir, index) => ( 
          <li
            className="breadcrumb-item"
            key={index}
            data-index={index} 
            onClick={() => navClick(index)}
          >
            <NavLink to="#">{dir.projectName || dir.name}</NavLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

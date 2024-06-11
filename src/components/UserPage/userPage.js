import React from "react";
import '../../styles/userProjects.css'
import Projects from "./Project/projects";
import { NavLink, Routes, Route } from 'react-router-dom'
import Invitations from "./Invitations/invitations";
import Navbar from "../../globalComponents/navbar";

export default function UserPage() {
  return (
    <>
      <Navbar/>
      <h1 className="my-2 p-3 my-2 fs-2 text-left border-bottom ">
        <NavLink to='/user/projects' className='mx-2'>Your Projects</NavLink>
        <NavLink to='/user/invitations' className='mx-2'>Invitations</NavLink>
      </h1>

      <Routes>
        <Route path="projects" element={<Projects/>} />
        <Route path="invitations" element={<Invitations/>} />
      </Routes>

    </>
  );
}

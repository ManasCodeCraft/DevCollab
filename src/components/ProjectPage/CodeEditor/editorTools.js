import React, {useState} from 'react'
import { Button, Container, Form } from "react-bootstrap";
import { message } from "../../../globalComponents/utilityModal";
import { removeLogFromCurrentlyExecutingFile, setCurrentlyExecutingFile, setFileContent, updateProgramStatus } from "../../../redux/slices/projectSlice";
import ButtonWithLoading from '../../../globalComponents/buttonWithLoading'
import { useDispatch , useSelector} from 'react-redux';
import useDirSocket from '../../../customHooks/sockets/useDirSocket';
import { useNavigate } from 'react-router';

export default function EditorTools({code, fileName, fileId}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socketOp = useDirSocket()
    const [savebtnDisabled, setsavebtnDisabled] = useState(false);
    const [runProgramLoading, setRunProgramLoading] = useState(false);
    const [stopProgramLoading, setStopProgramLoading] = useState(false);
    const currentProject = useSelector(state=>state.project.currentProject);
    const currentfile = useSelector(state=>state.project.currentlyOpenedFile);
    const currentlyExecutingFile = useSelector(state=>state.project.currentlyExecutingFile);
    const status = currentlyExecutingFile.status;
    const executionServerURL = useSelector(state=>state.config.executionServerURL);

    const saveContent = () => {
        setsavebtnDisabled(true);
        fetch("/file/save", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: fileId,
            content: code,
          }),
        })
          .then(async (response) => {
            setsavebtnDisabled(false);
            const data = await response.json();
            if (!response.ok) {
                message(
                  `Error ${response.status}`,
                  data.message || "Error saving file",
                  dispatch
                );
            } else {
              dispatch(setFileContent({id: fileId, content: data}));
              socketOp({data : {id: fileId, content: data}, type: 'update', target: 'file'})
            }
          })
          .catch((error) => {
            setsavebtnDisabled(false);
            console.log(error);
            message("Error", "Error saving file", dispatch);
          });
      };

      window.onkeydown = (event) => {
        if (event.ctrlKey && event.key === "s") {
          event.preventDefault(); 
          saveContent(code);
        }
      }

    const runProgram = async () => {
       if(fileName.split(".").pop() == "js"){
         dispatch(removeLogFromCurrentlyExecutingFile());
         setRunProgramLoading(true);
         const response = await fetch('exec/run-program/nodejs', {
           method: 'POST',
           credentials: 'include',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             fileId,
             projectId: currentProject.projectId,
           }),
         })

         setRunProgramLoading(false);

         if(!response.ok){
           response.json().then((data)=>{
            message("Error: ", data.message || `Failed to run ${fileName}`, dispatch);
           })

           return;
         }

         dispatch(updateProgramStatus('running'));
         dispatch(setCurrentlyExecutingFile())
       }
    }

    const stopProgram = async ()=>{
      if(fileName.split(".").pop() == "js"){
        setStopProgramLoading(true);
        const response = await fetch('exec/run-program/stop-nodejs', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: currentProject.projectId,
          }),
        })

        setStopProgramLoading(false);

        if(!response.ok){
          response.json().then((data)=>{
           message("Error: ", data.message || `Failed to stop ${fileName}`, dispatch);
          })
          return;
        }

        dispatch(updateProgramStatus('not running'));

      }
    }

    const htmlPreview = () => {
        if(fileName.split(".").pop() == "html"){
           const url = `${executionServerURL}/run-program/html-preview/${currentProject.projectId}/${currentfile.fileId}`
           window.open(url, '_blank');
        } 
    }

  return (
    <div className="editor-tools">
    <div className="left">
        <strong id="filename">{fileName}</strong>
    </div>
    <div className="right">
      {(fileName.split(".").pop() == 'js')?
        
          (status == 'running') ?
          <ButtonWithLoading className='float-right mx-2 my-1' loading={stopProgramLoading} onClick={stopProgram} onLoading={'wait..'}>
              <ion-icon name="stop-outline" /> Running
          </ButtonWithLoading>
          : 
          <ButtonWithLoading className='float-right mx-2 my-1' loading={runProgramLoading} onClick={runProgram} onLoading={'wait..'}>
              <ion-icon name="play-outline" /> Run
          </ButtonWithLoading>

        : null
      }

      {
        (fileName.split(".").pop() == "html")?
        <Button onClick={htmlPreview}>HTML Preview</Button> : null
      }

      <ButtonWithLoading loading={savebtnDisabled} onLoading='Saving' onClick={saveContent} className="float-right mx-3" >
          Save
      </ButtonWithLoading>
    </div>
  </div>
  )
}

import React, {useState} from 'react'
import { Button, Container, Form } from "react-bootstrap";
import { message } from "../../../globalComponents/utilityModal";
import { setFileContent } from "../../../redux/slices/projectSlice";
import { useDispatch } from 'react-redux';
import useDirSocket from '../../../customHooks/sockets/useDirSocket';

export default function EditorTools({code, fileName, fileId}) {
    const dispatch = useDispatch();
    const socketOp = useDirSocket()
    const [savebtnDisabled, setsavebtnDisabled] = useState(false);

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

  return (
    <div className="editor-tools">
    <div className="left">
        <strong id="filename">{fileName}</strong>
    </div>
    <div className="right">
    {savebtnDisabled ? (
      <Button variant="primary" className="float-right" disabled={true}>
        Saving ...
      </Button>
    ) : (
      <Button
        variant="primary"
        className="float-right"
        onClick={saveContent}
      >
        Save
      </Button>
    )}
    </div>
  </div>
  )
}

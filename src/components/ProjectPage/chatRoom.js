import React, {useState, useRef, useEffect} from 'react';
import '../../styles/chatRoom.css';
import { useDispatch, useSelector } from 'react-redux';
import { pushMessage } from '../../redux/slices/chatSlice';

export default function ChatRoom({sendMessage}) {
  const currentProject = useSelector(state=>state.project.currentProject);
  const projectId = currentProject.projectId;
  const chats = useSelector(state=>state.chat);
  const chatsFiltered = chats.filter(chat => chat.projectId == projectId);
  const chatdata = chatsFiltered.map((chat) => chat.message)
  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  function handleSubmit(e){
      e.preventDefault()
      const msg = inputRef.current.value;
      if(msg.length > 0){
          const data = sendMessage({projectId, message: msg});
          dispatch(pushMessage({projectId, message: data}));
          inputRef.current.value = '';
      }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatdata, chatContainerRef.current]);

  return (
    <>
    <div className='container-fluid chat-container my-3'>
      <div className="chat-box-container" ref={chatContainerRef}>
        {chatdata.map((msg, index) => (
          <div className="chat-box " key={index}>
            <div className={`chat-box-message my-1 ${msg.self ? 'float-left self' : 'float-right'}`}>
              <span className={`fw-bold ${msg.self ? 'text-success' : 'text-warning'} `}>{msg.name}</span>: {msg.text}
            </div>
          </div>
        ))}
      </div>

    </div>

    <form className="form-group d-flex chat-message-send" method='POST' onSubmit={handleSubmit}>
          <input type="text" className="form-control user-message" placeholder="Enter your message" ref={inputRef} />
          <button className="btn btn-success mx-2" type='submit'>Send</button>
    </form>

    </>
  );
}

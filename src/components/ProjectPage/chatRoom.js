import React, {useState, useRef, useEffect} from 'react';
import '../../styles/chatRoom.css';

export default function ChatRoom() {
  const chatdataSample = [
    { 'name': 'You',
      'text': 'Hello i am here',
      'time': '12:00 AM',
      'self': true
    },
    { 'name': 'Person',
      'text': 'I am here',
      'time': '12:00 AM',
      'self': false
    },
    {
        'name': 'Another Person',
        'text': 'I am here',
        'time': '12:00 AM',
       'self': false
    },
    {
        'name': 'You',
        'text': 'Are you sure you want to this project?',
        'time': '12:00 AM',
       'self': true
    },
    {
        'name': 'Person',
        'text': 'I am here to help you in this project',
        'time': '12:00 AM',
       'self': false
    },
    {
        'name': 'Another Person',
        'text': 'I am here to help you in this project',
        'time': '12:00 AM',
       'self': false
    }
  ]
  const chatContainerRef = useRef(null);
  const [chatdata, setChatData] = useState(chatdataSample)

  function handleSubmit(e){
      e.preventDefault()
      const msg = e.target.querySelector('.user-message').value;
      if(msg.length > 0){
          setChatData([...chatdata, {'name': 'You', 'text': msg, 'time': '12:00 AM', 'self': true}])
          e.target.querySelector('.user-message').value = ''
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
          <input type="text" className="form-control user-message" placeholder="Enter your message" />
          <button className="btn btn-success mx-2" type='submit'>Send</button>
    </form>

    </>
  );
}
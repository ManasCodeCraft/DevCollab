import React, {useState, useEffect} from 'react';
import { Modal, Button, Spinner, Container, ProgressBar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setMessageHide, setMessageParam } from '../redux/slices/messageModalSlice';
import { setConfirmHide, setConfirmParam } from '../redux/slices/confirmationSlice';
import { HideWaitingModal } from '../redux/slices/waitingModalSlice';
import '../styles/utilityModal.css'

export function message(title, text, dispatch){
     dispatch(setMessageParam({
        title: title,
        text: text,
        show: true,
     }))
}
export function MessageModal() {
    const dispatch = useDispatch()
    const title = useSelector(state=>state.message.title)
    const text = useSelector(state=>state.message.text)
    const show = useSelector(state=>state.message.show)

    const hideModal = ()=>{
         dispatch(setMessageHide())
    }

    return (
        <Modal
            show={show}
            centered // Center the modal 
        >  {
            <Modal.Header closeButton>
                <Modal.Title>{title || ''}</Modal.Title>
            </Modal.Header>
            }{
               (text && text.length>0)?
                <Modal.Body>
                    <p className='fs-5'>{text}</p>
                </Modal.Body>:null
            }
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Close 
                </Button>
            </Modal.Footer>
        </Modal> 
    );
}

// ConfirmationModal

export function confirmIt(title, text, acceptAction, rejectAction, acceptText, rejectText, acceptBtnColor, dispatch){
    dispatch(setConfirmParam({
        title: title,
        text: text,
        show: true,
        acceptAction: acceptAction,
        rejectAction: rejectAction,
        acceptText: acceptText,
        rejectText: rejectText,
        acceptBtnColor: acceptBtnColor,
    }))
}
export function ConfirmationModal() {
    const confirmParam = useSelector(state=>state.confirm)
    const dispatch = useDispatch()
    function hideModal(){
         dispatch(setConfirmHide())
    }
    return (
        <Modal
            show={confirmParam.show}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{confirmParam.title || 'Please Confirm the Action'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{confirmParam.text || ''}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (confirmParam.rejectAction) {
                            confirmParam.rejectAction();
                        }
                        hideModal()
                    }}
                >
                    {confirmParam.rejectText}
                </Button>
                <Button
                    variant={confirmParam.acceptBtnColor}
                    onClick={() => {
                        if (confirmParam.acceptAction) {
                            confirmParam.acceptAction();
                        }
                        hideModal()
                    }}
                >
                    {confirmParam.acceptText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


export function WaitingModal() {
    const dispatch = useDispatch()
    const params = useSelector(state=>state.wait)

    const hideModal = ()=>{
         dispatch(HideWaitingModal())
    }

    return (
        <Modal
            show={params.show}
            centered // Center the modal 
        > 
            <Modal.Body>
                {
                    (params.status=='waiting')?
                    <>
                    <Container fluid className='text-center'>
                        <ProgressBar now={100} striped animated variant="success"  className='mt-4' />
                    </Container>
                    <Container>
                        <p className='text-center mt-3'>{params.waiting_text}</p>
                    </Container>
                    </> : (params.autoClose)? null :
                    <>
                      <Container>
                          <GreenTic/>
                          <p className='text-center mt-3'>{params.after_text}</p>
                      </Container>
                    </> 
                }
            </Modal.Body>
            {(params.status!='waiting')?
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Close 
                </Button>
            </Modal.Footer>: null
            }
        </Modal>
    );
}

function GreenTic(){
    const [drawn, setDrawn] = useState('')
    useEffect(()=>{
         setTimeout(()=>{
            setDrawn('drawn');
         }, 500)
    }, [])
    return (
        <div className={`done ${drawn}`}>
        <svg
            version="1.1"
            id="tick"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 37 37"
            style={{enableBackground: 'new 0 0 37 37'}}
        >
            <path
            className="circ path"
            style={{
                fill: 'rgb(13, 108, 249)',
                stroke: '#0e4bcf',
                strokeWidth: '3',
                strokeLinejoin:' round',
                strokeMiterlimit: '10',
            }}
            d="
    M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
            />
            <polyline
            className="tick path"
            style={{
                fill: 'none',
                stroke: '#fff',
                strokeWidth: '3',
                strokeLinejoin: 'round',
                strokeMiterlimit:' 10',
            }}
            points="
    11.6,20 15.9,24.2 26.4,13.8 "
            />
        </svg>
        </div>
    )
}
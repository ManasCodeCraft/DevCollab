import React, { useRef, useState } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import '../../styles/addProfile.css';
import dataURItoBlob from 'data-uri-to-blob';
import { useDispatch, useSelector } from 'react-redux';
import { message, waitHere } from '../../globalComponents/utilityModal';
import { setModalAfterText, setWaitingCompleted, setWaitingModalParam } from '../../redux/slices/waitingModalSlice';
import { setProfilePic } from '../../redux/slices/authSlice';
import { Container, Form, Button, Image } from 'react-bootstrap';

export default function AddProfilePic() {
    const dispatch = useDispatch();
    const cropperRef = useRef(null);
    const [cropperDisplay, setCropperDisplay] = useState('d-none');
    const profilepic = useSelector(state => state.auth.user.profilePic);
    const inputFileRef = useRef(null);
    const ProfileViewerRef = useRef(null);
    const [CropperInstance, setCropperInstance] = useState(null);
    const baseURL = useSelector((state)=>state.config.baseURL);

    function handleChangeFile(e) {
        const profileimage = e.target.files[0];
        if (profileimage) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                cropperRef.current.src = ev.target.result;

                if (CropperInstance) {
                    CropperInstance.destroy();
                }

                setCropperInstance(new Cropper(cropperRef.current, {
                    aspectRatio: 1 / 1,
                    viewMode: 1,
                    autoCropArea: 1,
                    minCropBoxHeight: 150,
                    movable: true,
                    cropBoxResizable: true,
                }));

                setCropperDisplay('');
            };

            reader.readAsDataURL(profileimage);
        }
    }

    const handleSubmit = (e) => {
        ProfileViewerRef.current.src = CropperInstance.getCroppedCanvas().toDataURL();
        setCropperDisplay('d-none');

        dispatch(setWaitingModalParam({
            waiting_text: 'Updating Profile...',
            after_text: 'Profile Picture Updated Successfully',
            status: 'waiting',
            show: true,
        }));

        const croppedBlob = dataURItoBlob(CropperInstance.getCroppedCanvas().toDataURL());
        const formData = new FormData();
        formData.append('profile', croppedBlob);

        fetch(`${baseURL}/auth/change-profile-pic`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to change profile, server responded with status code ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            dispatch(setWaitingCompleted());
            dispatch(setProfilePic(data));
            console.log('Server response:', data);
        })
        .catch(error => {
            dispatch(setModalAfterText('An Error Occurred'));
            dispatch(setWaitingCompleted());
            console.error('Error:', error.message);
        });
    };

    return (
        <div>
            <Container className="addprofile-container animate__animted animate__zoomIn">
                <h1 className="text-center my-2">Add Profile Picture</h1>
                <Image src={profilepic} className="addprofile-viewer" alt="Profile Preview" ref={ProfileViewerRef} roundedCircle />
                <div className="addprofile-form">
                    <Form encType="multipart/form-data">
                        <Form.Control type="file" name="profile" id="profile" accept="image/*" className="d-none" ref={inputFileRef} onChange={handleChangeFile} />
                        <div className="addprofile-button-wrapper text-center my-2">
                            <Button variant="primary" size="lg" className="m-3" id="addprofile-btn" onClick={() => { inputFileRef.current.click(); }}>
                                Change Profile
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>

            <Container className={`image-cropper-container-wrapper ${cropperDisplay}`}>
                <Container className="image-cropper-container">
                    <div className="button-wrapper d-flex justify-content-between my-2">
                        <Button variant="primary" id='select-cropped-image-btn' onClick={handleSubmit}>Save</Button>
                        <Button variant="secondary" id="cropper-close-btn" onClick={() => { setCropperDisplay('d-none'); }}>Close</Button>
                    </div>
                    <Image src={profilepic} className="image-cropper-viewer" ref={cropperRef} alt="Cropper Image" fluid />
                </Container>
            </Container>
        </div>
    );
}

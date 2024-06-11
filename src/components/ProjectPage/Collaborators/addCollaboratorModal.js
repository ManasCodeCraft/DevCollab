import React, { useState, useRef } from 'react';
import InviteCollaboratorStructure from './inviteCollaboratorStructure';
import { useDispatch, useSelector } from 'react-redux';
import {motion} from 'framer-motion'
import { LoadingContainer, NothingToShowContainer } from '../../../globalComponents/utilityContainers';
import { message } from '../../../globalComponents/utilityModal';

export default function AddCollaboratorModal({ onClose, onModalClick }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch()
    const [text, setText] = useState('Search user-name in above search box')
    const searchBoxRef = useRef(null);

    const currentProject = useSelector(state => state.project.currentProject);
    if (!currentProject) {
        return null;
    }
    const collaborators = currentProject.collaborators;
    const collaboratorNames = collaborators.map(collaborator => collaborator.UserName);

    const fetchUsers = (username) => {
        if (username.length === 0) {
            setUsers([]);
            setText('Search user-name in above search box')
            return;
        }
        setLoading(true);
        fetch('http://localhost:7000/auth/search-username', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        }).then((response) => {
            setLoading(false);
            return response.json();
        }).then((data) => {
            if(data.length === 0){
                setText('No user found')
            }            
            setUsers(data);
        }).catch((error) => {
            setLoading(false)
            message('Error', 'Unexpected error occurred', dispatch)
        });
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchUsers(value);
    };

    return (
        <div className="modal-wrapper" onClick={onModalClick}>
            <motion.div initial={{transform: 'scale(0.8)'}} animate={{transform: 'scale(1)'}} transition={{duration: 0.2, ease: 'easeInOut'}} className="container add-collab-container ">
                <div className="searchcollab-container container-fluid p-2 my-2">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            <ion-icon name="search-outline"></ion-icon>
                        </span>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search for collaborators..."
                            aria-label="Username"
                            id="invite-collaborator-search"
                            ref={searchBoxRef}
                            aria-describedby="basic-addon1"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="container search-result-add-invite">
                    {
                        (users && users.length > 0)? (
                            users.map((user) => (
                                collaboratorNames.includes(user.UserName) ? null : (
                                    <InviteCollaboratorStructure key={user._id} user={user} />
                                )
                            ))
                        )
                        :
                        (
                        (loading)?
                        <LoadingContainer text="fetching user-details" /> :
                        <NothingToShowContainer text={text} />
                        )
                    }

                </div>
            </motion.div>
        </div>
    );
}

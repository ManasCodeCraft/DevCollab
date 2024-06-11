import React, { useState } from 'react';
import '../../../styles/collaborators.css';
import CollaboratorStructure from './collaboratorStructure';
import AddCollaboratorModal from './addCollaboratorModal';
import { useSelector } from 'react-redux';
import { NothingToShowContainer } from '../../../globalComponents/utilityContainers';

function AddCollaboratorButton({ onClick }) {
    return (
        <div className="collaborator-add-button m-5">
            <button className="btn btn-primary collab-add btn-lg" onClick={onClick}>
                Invite Collaborator
            </button>
        </div>
    );
}

export default function Collaborators() {
    const [isModalVisible, setModalVisible] = useState(false);

    const currentProject = useSelector(state => state.project.currentProject);
    if (!currentProject) {
        window.location.href = '/user/projects'
        return null;
    }

    const collaborators = currentProject.collaborators;

    if (!collaborators) {
        return null;
    }

    const handleModalClick = (event) => {
        if (event.target.classList.contains('modal-wrapper')) {
            setModalVisible(false);
        }
    };

    return (
        <>
            <div className='container collaborator-list-box'>
                <div className="collaborator-list">
                    {collaborators.length > 0 ? (
                        collaborators.map((collaborator) => (
                            <CollaboratorStructure key={collaborator.id} collaborator={collaborator} />
                        ))
                    ) : (
                        <NothingToShowContainer text="No Collaborators of this project" />
                    )}
                </div>
            </div>

            <AddCollaboratorButton onClick={() => setModalVisible(true)} />
            {isModalVisible && <AddCollaboratorModal onClose={() => setModalVisible(false)} onModalClick={handleModalClick} />}
        </>
    );
}

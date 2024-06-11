import React from "react";
import InvitationBody from "./invitationBody";
import {useSelector} from 'react-redux'
import { LoadingContainer, NothingToShowContainer } from "../../../globalComponents/utilityContainers";
export default function Invitations() {
  const invitations = useSelector(state=>state.invite.invitations)
  const loading = useSelector(state=>state.invite.loading)
  return (
    <>
      <div className="invitations-container container my-3">
        { (loading)? (
            <LoadingContainer text="Loading Invite Requests" />
          ) :
          (invitations.length>0)? invitations.map((inv)=>{
              return <InvitationBody key={inv._id} invitation={inv} />
          })
          : <NothingToShowContainer text="No Invitation Request" />
        }
      </div>
       
    </>
  );
}

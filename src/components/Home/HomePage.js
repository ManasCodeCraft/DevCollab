import React from 'react'
import TriggerLogin from './loginTrigger'
import Feature, {FeatureSmall} from './feature'
import Header from './header'
import CenteredLine from './centeredLine'
import { useSelector } from 'react-redux'
import Footer from '../../globalComponents/footer'
import "../../styles/headerStyles.css";
import Navbar from '../../globalComponents/navbar'

export default function HomePage() {
  const islogin = useSelector(state=>state.auth.isAuthenticated)
  if(islogin){
     window.location.href='/user/projects'
  }


  return (
    <>
       <Navbar/>
       <Header/>
       <div className="feature-wrapper">
          <Feature left={true} featureImg={'feature1.png'} text={<><span>Collaborate</span> with your team</>} />
           <CenteredLine/>
          <Feature left={false} featureImg={'feature2.png'} text={<>Manage and organize <span>projects</span> effortlessly </>} />
           <CenteredLine/>
          <Feature left={true} featureImg={'feature3.png'} text={<>Every collaborator's action reflects in <span>real time</span></>} />
           <CenteredLine/>
          <Feature left={true} featureImg={'feature4.png'} text={<>Share Your Ideas in Dedicated Project <span>Chatrooms</span> </>} />
           <CenteredLine/>
          <Feature left={true} featureImg={'feature5.png'} text={<>Run Your <span>NodeJs Express </span> Projects from Anywhere</>} />
           <CenteredLine/>
       </div>
       <TriggerLogin/>
       <Footer />
    </>
  )
}

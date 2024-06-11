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
          <Feature left={true} featureImg={'feature1.png'} text={<><span>Deploy</span> with one click</>} />
           <CenteredLine/>
          <Feature left={false} featureImg={'feature2.png'} text={<>Work with your <span>team</span></>} />
           <CenteredLine/>
          <Feature left={true} featureImg={'feature3.png'} text={<>Easy to <span>SetUp</span> and Organize</>} />
           <CenteredLine/>
       </div>
       <TriggerLogin/>
       <Footer />
    </>
  )
}

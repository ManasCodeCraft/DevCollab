import React from 'react'
import '../styles/screenBlockLoading.css';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function ScreenBlockLoading() {
    const show = useSelector(state=>state.loading.show);
    const text = useSelector(state=>state.loading.text);
    if(!show){
        return null;
    }
    const loadingVariants = {
        initial: {
            rotateY: 0
        },
        animate:{
            rotateY: 360,
            transition: {
                duration: 1,
                ease: 'easeInOut',
                repeat: Infinity
            }
        }
    }
  return (
    <div id='screen-block-loading'>
         <div className="loading-content">
            <motion.span 
            id="devcollab-spinner"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            >&lt;/&gt;
            </motion.span>
            <strong id='loading-text fs-5'>{text}</strong>
         </div>
    </div>
  )
}

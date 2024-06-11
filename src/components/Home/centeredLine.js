import React from 'react';
import {motion} from 'framer-motion'
import {useInView} from 'react-intersection-observer'

export default function CenteredLine(){
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
      });

    return (
        <>
            <div className="bright-centered-line-wrapper">
            <motion.div 
            ref={ref}
            initial={{height: '0%'}}
            animate={(inView)?{height: '100%'}:{height:'0%'}}
            transition={{duration: 0.5}}
            className="bright-centered-line">
            </motion.div>
            </div>
        </>
    )
}
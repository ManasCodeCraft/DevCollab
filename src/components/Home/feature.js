import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Feature({ text, featureImg }) {
  const boxShadowStyle = {
    boxShadow: "0 0 30px rgb(156, 189, 255)",
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <>
      <Container
        className={`feature-section`}
        ref={ref}
        style={(inView) ? boxShadowStyle : {}}
      >
        <motion.div
          className="feature-heading"
          initial={{ opacity: 0, x: 200 }}
          animate={(inView) ? { opacity: 1, x:0 } : { opacity: 0, x: 200 }}
          transition={{duration: 1, delay: 0.5 }}
        >
          <h1 className="fs-1 fw-bold">
            {/* <span>Syncronized</span> Collaboration */}
            {text}
          </h1>
        </motion.div>
        <motion.div
          className="feature-media-section rounded"
          initial={{opacity: 0}}
          animate={(inView) ? { opacity: 1 } : { opacity: 0 }}
          transition={{duration: 0.5 }}
        >
          <img src={`/features/${featureImg}`} alt="" srcset="" />
        </motion.div>
      </Container>
    </>
  );
}


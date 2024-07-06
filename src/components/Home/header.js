import React from "react";
import CanvasBg from "../../globalComponents/canvasBg";
import { Carousel, Container } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export default function Header() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="header-section">
      <CanvasBg />
      <div className="bannerwrapper">
        <Container className="bannerline">
          <motion.h1
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="display-4 fw-bold bannertext"
          >
            Collaborate, Manage and Build your <span>NodeJs Express</span> Projects
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <Carousel className="carousel slide" fade>
              <Carousel.Item>
                <p className="banner-subline text-secondary fs-3 fw-bold">
                  Collaborate with Your Team, Succeed Together
                </p>
              </Carousel.Item>
              <Carousel.Item>
                <p className="banner-subline text-secondary fs-3 fw-bold">
                  Manage and organize projects effortlessly
                </p>
              </Carousel.Item>
              <Carousel.Item>
                <p className="banner-subline text-secondary fs-3 fw-bold">
                  Every Collaborator's Action Reflects in Real Time
                </p>
              </Carousel.Item>
              <Carousel.Item>
                <p className="banner-subline text-secondary fs-3 fw-bold text-center">
                  Share Your Ideas in Dedicated Project Chatrooms
                </p>
              </Carousel.Item>
              <Carousel.Item>
                <p className="banner-subline text-secondary fs-3 fw-bold text-center">
                  Run Your NodeJs Express Projects from Anywhere
                </p>
              </Carousel.Item>
            </Carousel>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}

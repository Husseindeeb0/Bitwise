import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import LatestAnnouncementCard from "../../components/LatestAnnouncementCard";

const Home = () => {
  // Refs for sections that should animate on scroll
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);

  // Check when sections come into view
  const section1InView = useInView(section1Ref, {
    margin: "-100px 0px",
  });
  const section2InView = useInView(section2Ref, {
    margin: "-100px 0px",
  });
  const section3InView = useInView(section3Ref, {
    margin: "-100px 0px",
  });
  const section4InView = useInView(section4Ref, {
    margin: "-100px 0px",
  });
  const section5InView = useInView(section5Ref, {
    margin: "-100px 0px",
  });

  const achievements = [
    {
      id: 1,
      image: "image1.jpg",
      title: "Achievement Title 1",
      description: "Short description of achievement 1.",
      person: "Name1",
    },
    {
      id: 2,
      image: "image2.jpg",
      title: "Achievement Title 2",
      description: "Short description of achievement 2.",
      person: "Name2",
    },
    {
      id: 3,
      image: "image3.jpg",
      title: "Achievement Title 3",
      description: "Short description of achievement 3.",
      person: "Name3",
    },
    {
      id: 4,
      image: "image4.jpg",
      title: "Achievement Title 4",
      description: "Short description of achievement 4.",
      person: "Name4",
    },
  ];

  const founders = [
    {
      name: "Hussein Ommies",
      title: "Co-Founder",
      image: "hussein.jpg",
      description: "Passionate about cyber security and building communities.",
    },
    {
      name: "Joumana",
      title: "Co-Founder",
      image: "joumana.jpg",
      description: "Ensuring financial growth while supporting innovation.",
    },
    {
      name: "Hassan Tofayli",
      title: "Co-Founder",
      image: "hasssan.jpg",
      description: "Loves solving complex problems with elegant code.",
    },
  ];

  return (
    <div className="text-white min-h-screen pt-20">
      {/* Defining Bitwise Section */}
      <section
        ref={section1Ref}
        className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-16 backdrop-blur-lg bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/background.jpg)` }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={section1InView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative text-4xl md:text-6xl font-bold text-dark-purple overflow-hidden"
        >
          <span className="relative z-10">
            Start Your Programming Journey with
            <span className="text-navy-blue"> Bitwise!</span>
          </span>
        </motion.h1>

        {/* Add Latest Announcement Card */}
        <LatestAnnouncementCard />

        {/* Button to view all announcements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={section1InView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <Link to="/announcements">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-navy-blue text-white font-semibold rounded-lg shadow-lg flex items-center gap-2"
            >
              <span>View All Announcements</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <section className="bg-background1 py-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image container with animations */}
          <motion.div
            className="relative rounded-xl w-full lg:w-1/2 shadow-2xl shadow-sky-blue"
            initial={{ opacity: 0, scale: 0.8, z: -100 }}
            whileInView={{ opacity: 1, scale: 1, z: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="/background.jpg"
                alt="Bitwise Club Members"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-blue/60 to-transparent"></div>
            </div>
          </motion.div>

          {/* Content container with animations */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.8, z: -100 }}
            whileInView={{ opacity: 1, scale: 1, z: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-sky-blue/20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-navy-blue to-sky-blue bg-clip-text text-transparent">
                  Who we are
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-navy-blue leading-relaxed mb-6">
                  <span className="font-bold">Bitwise Club</span> was founded in{" "}
                  <span className="font-bold">2024</span> by Master 1 students
                  to fuel the growing interest in computer science. Established
                  with the support of the Student Council, we focus on enhancing{" "}
                  <span className="font-bold">
                    practical and theoretical skills
                  </span>{" "}
                  for students passionate about the computing world.
                </p>

                <p className="text-navy-blue leading-relaxed">
                  We cover multiple domains including{" "}
                  <span className="font-bold">
                    programming, cybersecurity, artificial intelligence, and
                    robotics
                  </span>{" "}
                  through <span className="font-bold">hands-on activities</span> and collaborative learning
                  experiences designed to build <span className="font-bold">real-world expertise.</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      {/* <section ref={section2Ref} className="py-16 px-6 bg-sky-blue">
        <h2 className="text-3xl font-bold text-center text-white">
          Our Achievements
        </h2>
        <div className="mt-10 max-w-6xl mx-auto space-y-6">
          <div className="flex gap-6 flex-wrap justify-center">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -50 }}
                animate={section2InView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="w-60 bg-navy-blue relative rounded-lg hover:scale-105 duration-200 shadow-md overflow-hidden"
              >
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {achievement.description}
                  </p>
                  <p className="text-sm text-yellow-400 mt-2">
                    By {achievement.person}
                  </p>
                </div>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-[shine_2s_linear_infinite]"></span>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section
        ref={section3Ref}
        className="py-16 px-6 text-center bg-background2"
      >
        <h2 className="text-4xl font-bold mb-10 text-dark-purple">
          What You’ll Get with Bitwise
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Event Announcements",
              desc: "Stay updated with our latest events and never miss out on exciting opportunities.",
              emoji: "📢",
            },

            {
              title: "Curated Learning Resources",
              desc: "Find the best tutorials and courses tailored to whatever field you choose to learn.",
              emoji: "📚",
            },
            {
              title: "Explore Career Paths",
              desc: "Get a clear breakdown of different programming fields—understand what each domain offers and whether it's the right fit for you.",
              emoji: "🎯",
            },
            {
              title: "AI Coding Assistant",
              desc: "Ask our AI bot anything about programming to make your coding journey smoother and easier.",
              emoji: "🤖",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={section3InView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="relative p-6 bg-navy-blue rounded-lg shadow-md"
            >
              <div className="text-5xl">{item.emoji}</div>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founders Section */}
      <section ref={section4Ref} className="bg-background1 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-dark-purple">
            Meet Our Leaders
          </h2>
          <p className="text-dark-purple max-w-2xl mx-auto mb-12">
            Our leadership team is dedicated to driving innovation and growth in
            the tech industry.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={section4InView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
                className="bg-navy-blue rounded-xl p-6 mx-5 shadow-lg shadow-sky-blue hover:shadow-2xl"
              >
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-dark-purple"
                />
                <h3 className="text-xl font-semibold">{founder.name}</h3>
                <p className="text-dark-purple">{founder.title}</p>
                <p className="text-gray-300 mt-2">{founder.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      {/* <section ref={section5Ref} className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-dark-purple">
          Start Learning Today!
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-500">
          Don’t waste time guessing what to learn next. Follow a proven roadmap
          and start coding with confidence today!
        </p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={section5InView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px #3f56a4",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-white text-navy-blue text-lg font-semibold rounded-lg shadow-lg hover:bg-dark-purple"
        >
          Start Your Learning Journey
        </motion.button>
      </section> */}
    </div>
  );
};

export default Home;

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import LatestAnnouncementCard from "../../components/LatestAnnouncementCard";
import {
  FaArrowRight,
  FaQuoteLeft,
  FaQuoteRight,
  FaUsers,
  FaCode,
  FaBriefcase,
  FaPhoneAlt,
} from "react-icons/fa";

const Home = () => {
  // SVG dots positions
  const xPositions = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const yPositions = [10, 20, 30, 40, 50];

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
      title: "Founder",
      image: "hussein.jpg",
      education: "Information System and Data Intelligence",
      description:
        "Passionate about cybersecurity, committed to protecting digital systems, and dedicated to building communities that promote awareness and collaboration in the field.",
      phone: "+961 76 764 155",
    },
    {
      name: "Joumana",
      title: "Co-Founder",
      image: "joumana.jpg",
      education: "Computer Science",
      description: "Passionate about coding and deeply interested in the ever-evolving world of the computer industry.",
      phone: "+49 176 74849586",
    },
    {
      name: "Hassan Tofayli",
      title: "Co-Founder",
      image: "hasssan.jpg",
      education: "Information System and Data Intelligence",
      description:
        "Focused on turning raw data into meaningful insights by analyzing patterns, developing strategies driven by decisions.",
      phone: "+961 81 675 164",
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
              <FaArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* About us Section */}
      <section
        ref={section2Ref}
        className="bg-background1 py-24 px-8 overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-around gap-12">
          {/* Image container with animations */}
          <motion.div
            className="relative rounded-xl w-full lg:w-1/3 shadow-2xl shadow-sky-blue mb-20 "
            initial={{ opacity: 0, scale: 0.8, z: -100 }}
            animate={section2InView ? { opacity: 1, z: 0, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="/members.jpg"
                alt="Bitwise Club Members"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-blue/40 to-transparent"></div>
            </div>

            {/* Curvy lines positioned relative to the image */}
            <svg
              className="md:w-60 w-48 absolute top-0 -right-14 md:-right-24 text-navy-blue rotate-45"
              viewBox="0 0 200 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M0 30 Q50 0 100 30 T200 30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={section2InView ? { pathLength: 1 } : {}}
                transition={{ duration: 2 }}
              />
            </svg>

            <svg
              className="md:w-60 w-48 absolute top-5 -right-10 md:-right-20 text-navy-blue rotate-45"
              viewBox="0 0 200 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M0 30 Q50 0 100 30 T200 30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={section2InView ? { pathLength: 1 } : {}}
                transition={{ duration: 2 }}
              />
            </svg>
          </motion.div>
          {/* Content container with animations */}
          <motion.div
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8, z: -100 }}
            animate={section2InView ? { opacity: 1, z: 0, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <svg
              className="absolute -top-16 md:-top-24 -right-28 md:-right-20 w-96 md:h-auto h-72 text-navy-blue/80 z-20"
              viewBox="0 0 110 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {yPositions.map((cy, rowIndex) =>
                xPositions.map((cx, colIndex) => (
                  <motion.circle
                    key={`${rowIndex}-${colIndex}`}
                    cx={cx}
                    cy={cy}
                    r="1"
                    fill="currentColor"
                    initial={{ opacity: 0 }}
                    animate={section2InView ? { opacity: 1 } : {}}
                    transition={{
                      delay: (rowIndex * xPositions.length + colIndex) * 0.1,
                      duration: 0.3,
                    }}
                  />
                ))
              )}
            </svg>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-sky-blue/20">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-navy-blue to-sky-blue bg-clip-text text-transparent">
                  Who we are
                </h2>
              </div>

              <div>
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
                  through <span className="font-bold">hands-on activities</span>{" "}
                  and collaborative learning experiences designed to build{" "}
                  <span className="font-bold">real-world expertise.</span>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="md:absolute bottom-3 left-16 w-96">
            {/* Decorative line */}
            <div className="absolute left-1 top-0 bottom-0 w-0.5 h-20 bg-gradient-to-b from-sky-blue to-navy-blue rounded-full opacity-70"></div>

            {/* Quote container */}
            <div className="ml-10 relative">
              {/* Quote icon */}
              <FaQuoteLeft className="text-2xl text-navy-blue absolute -left-4 top-0" />

              {/* Quote text */}
              <p className="text-dark-purple font-medium text-sm italic leading-relaxed pl-4 pr-3">
                The future belongs to those who believe in the beauty of their
                ideas and the courage to create them.
              </p>

              {/* Bottom quote icon */}
              <FaQuoteRight className="text-2xl text-navy-blue mt-1 ml-auto" />

              {/* Signature */}
              <div className="mt-2 mr-8 flex items-center justify-end">
                <div className="h-px w-12 bg-navy-blue mr-3"></div>
                <div
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                  className="text-navy-blue text-3xl"
                >
                  Bitwise
                </div>
              </div>
            </div>

            {/* Subtle decorative element */}
            <div className="absolute -bottom-1 right-4 w-20 h-0.5 bg-gradient-to-r from-transparent to-navy-blue rounded-full opacity-60"></div>
          </div>
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

      {/* Leaders Section */}
      <section ref={section4Ref} className="bg-background1 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-dark-purple">
            Meet Our Leaders
          </h2>
          <p className="text-dark-purple max-w-2xl mx-auto mb-12">
            Our leadership team is dedicated to driving innovation and growth in
            the tech industry.
          </p>

          {/* Layout for main founder - takes full width */}
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={section4InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative max-w-lg mx-auto"
            >
              {/* Card Background with gradient border */}
              <div className="relative bg-navy-blue backdrop-blur-sm rounded-2xl p-6 border border-transparent overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-blue/10 to-navy-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                {/* Animated border gradient effect */}
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r from-sky-blue to-navy-blue rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ zIndex: -1 }}
                />

                <div className="flex flex-col md:flex-row md:items-center md:text-left">
                  {/* Leader Initial in Large Circle */}
                  <div className="md:w-1/3">
                    <div className="relative mb-4 md:mb-0">
                      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-sky-blue to-navy-blue text-white shadow-lg shadow-dark-purple/20">
                        <span className="text-3xl font-bold">
                          {founders[0].name.charAt(0)}
                        </span>
                      </div>

                      {/* Icon based on role/title */}
                      <motion.div
                        className="absolute -bottom-2 -right-2 md:bottom-0 md:right-8 bg-white text-navy-blue p-2 rounded-full shadow-lg"
                        whileHover={{
                          rotate: 360,
                          transition: { duration: 0.5 },
                        }}
                      >
                        <FaBriefcase size={16} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 md:pl-6">
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-sky-blue transition-colors duration-300">
                      {founders[0].name}
                    </h3>
                    <div className="h-1 w-12 mx-auto md:mx-0 mb-2 bg-gradient-to-r from-sky-blue to-navy-blue rounded-full" />

                    {/* Title */}
                    <p className="text-dark-purple font-medium mb-2">
                      {founders[0].title}
                    </p>

                    {/* Position/Education Info */}
                    <div className="mb-3 py-1.5 px-3 bg-navy-blue/50 rounded-lg border border-sky-blue/20 inline-block">
                      <p className="text-sky-blue text-sm font-medium">
                        {founders[0].position}
                      </p>
                      <p className="text-white/70 text-xs">
                        {founders[0].education}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-white/80 leading-relaxed text-sm mb-3">
                      {founders[0].description}
                    </p>

                    {/* Connect button */}
                    <motion.a
                      href={`tel:${founders[0].phone}`}
                      className="inline-block cursor-pointer px-4 py-1.5 bg-sky-blue text-navy-blue hover:bg-white border border-sky-blue/50 rounded-lg text-sm font-medium transition-all duration-300"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaPhoneAlt size={12} />
                        <span>Connect</span>
                      </div>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Layout for co-founders - two cards in a row */}
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {founders.slice(1, 3).map((founder, index) => (
              <motion.div
                key={index + 1}
                initial={{ opacity: 0, y: 50 }}
                animate={section4InView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 * (index + 1), duration: 0.7 }}
                className="relative"
              >
                {/* Card Background with gradient border */}
                <div className="relative bg-navy-blue backdrop-blur-sm rounded-2xl p-5 border border-transparent overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-blue/10 to-navy-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  {/* Animated border gradient effect */}
                  <div
                    className="absolute -inset-0.5 bg-gradient-to-r from-sky-blue to-navy-blue rounded-2xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ zIndex: -1 }}
                  />

                  {/* Leader Initial in Smaller Circle */}
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-sky-blue to-navy-blue text-white shadow-lg shadow-dark-purple/20">
                      <span className="text-2xl font-bold">
                        {founder.name.charAt(0)}
                      </span>
                    </div>

                    {/* Icon based on role/title */}
                    <motion.div
                      className="absolute -bottom-1 -right-1 bg-white text-navy-blue p-1.5 rounded-full shadow-lg"
                      whileHover={{
                        rotate: 360,
                        transition: { duration: 0.5 },
                      }}
                    >
                      {founder.title.includes("Tech") ||
                      founder.title.includes("CTO") ? (
                        <FaCode size={14} />
                      ) : (
                        <FaUsers size={14} />
                      )}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-1 group-hover:text-sky-blue transition-colors duration-300">
                    {founder.name}
                  </h3>
                  <div className="h-1 w-10 mx-auto mb-2 bg-gradient-to-r from-sky-blue to-navy-blue rounded-full" />

                  {/* Title */}
                  <p className="text-dark-purple font-medium mb-2 text-sm">
                    {founder.title}
                  </p>

                  {/* Position/Education Info - More compact */}
                  <div className="mb-3 py-1 px-2 bg-navy-blue/50 rounded-lg border border-sky-blue/20 inline-block">
                    <p className="text-sky-blue text-xs font-medium">
                      {founder.position}
                    </p>
                    <p className="text-white/70 text-xs">{founder.education}</p>
                  </div>

                  {/* Description - Shorter height */}
                  <p className="text-white/80 leading-relaxed text-sm line-clamp-3">
                    {founder.description}
                  </p>

                  {/* Connect button - Smaller */}
                  <motion.a
                    href={`tel:${founder.phone}`}
                    className="inline-block mt-3 px-4 py-1.5 bg-sky-blue text-navy-blue hover:bg-white border border-sky-blue/50 rounded-lg text-sm font-medium transition-all duration-300"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <FaPhoneAlt size={10} />
                      <span>Connect</span>
                    </div>
                  </motion.a>
                </div>
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

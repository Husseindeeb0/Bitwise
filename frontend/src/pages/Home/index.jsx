import { useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "./style.css";
import background from "../../assets/background.jpg";
import { useMyContext } from "../../context";

const Home = () => {
  const { setIsAuthenticated, setAccessToken, isAuthenticated, accessToken } = useMyContext();
  // Refs for sections that should animate on scroll
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);

  // useEffect(() => {
  //   localStorage.removeItem("refreshToken");
  //   setIsAuthenticated(false);
  //   setAccessToken("");
  //   console.log("AccessToken:",accessToken);
  //   console.log("Authenticated:", isAuthenticated);

  // }, [])

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
    <div className="text-white min-h-screen">
      {/* Defining Bitwise Section */}
      <section
        ref={section1Ref}
        className="flex flex-col items-center justify-center h-screen text-center px-6 backdrop-blur-lg  bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={section1InView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative text-4xl md:text-6xl font-bold text-light-purple overflow-hidden"
        >
          <span className="relative z-10">
            Start Your Programming Journey with
            <span className="text-navy-blue"> Bitwise!</span>
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={section1InView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 text-lg md:text-xl max-w-2xl"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold">
            At Bitwise, we’re committed to helping you navigate the exciting
            world of computer science. Whether you’re just starting out or
            looking to specialize, our club provides the guidance, resources,
            and support you need to explore the diverse fields of computer
            science. From software development to data science, artificial
            intelligence, and beyond, we aim to light your path toward a
            fulfilling career in tech.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold">
            Join us today and take the first step toward mastering the tech
            skills of tomorrow!
          </p>
        </motion.div>
        <motion.button
          transition={{ duration: 0.5 }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-white hover:bg-light-purple text-gray-700 text-lg font-semibold rounded-lg shadow-lg"
        >
          Get Started
        </motion.button>
      </section>

      {/* Achievements Section */}
      <section ref={section2Ref} className="py-16 px-6 bg-dark-purple">
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
      </section>

      {/* Features Section */}
      <section ref={section3Ref} className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-light-purple">
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
      <section ref={section4Ref} className="bg-dark-purple text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Meet Our Founders</h2>
          <p className="text-white max-w-2xl mx-auto mb-12">
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
                className="bg-navy-blue rounded-xl p-6 mx-5 shadow-lg shadow-navy-blue hover:shadow-2xl"
              >
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-light-purple"
                />
                <h3 className="text-xl font-semibold">{founder.name}</h3>
                <p className="text-light-purple">{founder.title}</p>
                <p className="text-gray-300 mt-2">{founder.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section
        ref={section5Ref}
        className="py-16 px-6 text-center"
      >
        <h2 className="text-3xl font-bold text-light-purple">Start Learning Today!</h2>
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
          className="mt-6 px-6 py-3 bg-white text-navy-blue text-lg font-semibold rounded-lg shadow-lg hover:bg-light-purple"
        >
          Start Your Learning Journey
        </motion.button>
      </section>
    </div>
  );
};

export default Home;

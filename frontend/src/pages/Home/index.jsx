import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './style.css';
import LatestAnnouncementCard from '../../components/Announcements/LatestAnnouncementCard';
import {
  FaArrowRight,
  FaBullhorn,
  FaGraduationCap,
  FaTicketAlt,
  FaTrophy,
  FaStar,
  FaCalendarCheck,
} from 'react-icons/fa';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AchievementSlideshow from '../../components/Achievements/AchievementSlideshow';
import { getAchievements } from '../../features/achievements/achievementsThunks';

const Home = () => {
  const dispatch = useDispatch();
  const { achievementsData } = useSelector((state) => state.achievements);

  useEffect(() => {
    dispatch(getAchievements());
  }, [dispatch]);

  const achievements = useMemo(() => {
    return achievementsData.map((achievement) => {
      const achievementDate = new Date(achievement.time);
      const year = achievementDate.getFullYear();
      const month = achievementDate.getMonth() + 1;
      const day = achievementDate.getDate();
      return {
        id: achievement._id,
        image: achievement.imageUrl,
        title: achievement.title,
        description: achievement.description,
        instructors: achievement.instructors || [],
        date: `${year}-${month}-${day}`,
      };
    });
  }, [achievementsData]);

  const features = [
    {
      icon: <FaBullhorn />,
      title: 'Event Announcements',
      desc: 'Stay updated with our latest workshops, seminars, and conferences. Never miss an exciting opportunity to learn and grow.',
      gradient: 'from-sky-500 to-blue-600',
      delay: 0,
    },
    {
      icon: <FaGraduationCap />,
      title: 'Curated Learning Paths',
      desc: 'Access structured courses and resources tailored to your programming interests, from beginner to advanced levels.',
      gradient: 'from-violet-500 to-purple-600',
      delay: 0.1,
    },
    {
      icon: <FaTicketAlt />,
      title: 'Event Registration & Tickets',
      desc: 'Book your spot at events with our seamless registration system. Get your digital ticket with a unique QR code for check-in.',
      gradient: 'from-emerald-500 to-teal-600',
      delay: 0.2,
    },
    {
      icon: <FaTrophy />,
      title: 'Achievements & Recognition',
      desc: 'Browse our club milestones and achievements. Every workshop delivered and every competition won tells our story.',
      gradient: 'from-amber-500 to-orange-600',
      delay: 0.3,
    },
    {
      icon: <FaStar />,
      title: 'Points & Rewards',
      desc: 'Earn Bitwise Points for every event you attend. Track your score on your profile and climb the engagement leaderboard.',
      gradient: 'from-rose-500 to-pink-600',
      delay: 0.4,
    },
    {
      icon: <FaCalendarCheck />,
      title: 'Activity Tracking',
      desc: 'View your complete event history, booked events, and attendance records — all in one personalized profile dashboard.',
      gradient: 'from-cyan-500 to-blue-600',
      delay: 0.5,
    },
  ];

  return (
    <div className="text-white min-h-screen">
      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION                                    */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/background.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-purple/60 via-navy-blue/40 to-dark-purple/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#121624_90%)]" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-blue/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy-blue/20 rounded-full blur-[150px]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-12 text-center">
          {/* Micro-tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full mb-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-blue/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative w-2 h-2 rounded-full bg-sky-blue animate-pulse" />
            <span className="relative text-[12px] font-black uppercase tracking-[0.3em] text-sky-blue drop-shadow-[0_0_5px_rgba(96,178,225,0.5)]">
              Connect With The Future
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "'Exo 2', sans-serif" }}
            className="text-6xl md:text-8xl lg:text-9xl font-[900] text-white leading-[0.9] tracking-tighter mb-8"
          >
            Build. Learn.
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-sky-blue to-cyan-300 bg-clip-text text-transparent italic">
              Innovate.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto mb-14 font-medium leading-relaxed tracking-tight"
          >
            Bitwise Club is the place to grow your programming skills, get
            guidance on your coding journey, and build the future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link to="/announcements">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white text-dark-purple font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-2xl shadow-white/10 flex items-center gap-3 hover:shadow-white/20 transition-shadow"
              >
                Explore Events
                <FaArrowRight className="text-sky-blue" />
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl border border-white/20 flex items-center gap-3 hover:bg-white/20 transition-all"
              >
                About Bitwise
              </motion.button>
            </Link>
          </motion.div>

          {/* Latest Announcement */}
          <LatestAnnouncementCard />
        </div>

        {/* Bottom Edge Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background1 to-transparent" />
      </section>

      {/* ACHIEVEMENTS SLIDESHOW */}
      <AchievementSlideshow achievementsData={achievements} />

      {/* WHAT YOU GET — FEATURES SECTION */}
      <section className="relative py-28 px-6 bg-background2 overflow-hidden">
        {/* Decorative Blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-blue/5 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-navy-blue/10 px-4 py-2 rounded-full mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-navy-blue" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-navy-blue">
                Platform Features
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-dark-purple mb-8 tracking-tighter"
            >
              Everything You Need,
              <br />
              <span className="pr-4 bg-gradient-to-r from-navy-blue via-navy-blue to-sky-blue bg-clip-text text-transparent italic">
                All in One Place
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 max-w-xl mx-auto text-lg"
            >
              From event discovery to skill tracking — Bitwise provides the
              tools to accelerate your tech journey.
            </motion.p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-navy-blue/5 transition-all duration-500 hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white text-xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-black text-dark-purple mb-3 group-hover:text-navy-blue transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed text-[15px]">
                    {feature.desc}
                  </p>

                  {/* Corner Accent */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${feature.gradient} opacity-[0.03] rounded-bl-[3rem] rounded-tr-3xl group-hover:opacity-[0.08] transition-opacity duration-500`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

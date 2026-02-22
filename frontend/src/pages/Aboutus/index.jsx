import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaShieldAlt,
  FaRobot,
  FaMicrochip,
  FaPhoneAlt,
  FaArrowRight,
  FaQuoteLeft,
} from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const AboutUs = () => {
  // Domain pillars
  const domains = [
    {
      icon: <FaCode />,
      title: 'Programming',
      desc: 'Master modern programming languages and build real-world projects through hands-on workshops and coding challenges.',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Cybersecurity',
      desc: 'Learn ethical hacking, penetration testing, and digital security practices to protect systems and data.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <FaRobot />,
      title: 'Artificial Intelligence',
      desc: 'Explore machine learning, neural networks, and data analysis to shape the future of intelligent systems.',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: <FaMicrochip />,
      title: 'Robotics',
      desc: 'Integrate hardware and software to build autonomous machines, from microcontrollers to full robotic systems.',
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  // Team Members (expandable)
  const teamMembers = [
    {
      name: 'Rania Hashem',
      role: 'AI Lead',
      image: null,
      initial: 'RH',
    },
    {
      name:  'Mohammad Fakih',
      role: 'Research Lead',
      image: null,
      initial: 'MF',
    },
    {
      name:  'Nour Al Zahraa',
      role: 'Planning Lead',
      image: null,
      initial: 'NAZ',
    },
    {
      name:  'Rayan Ayash',
      role: '',
      image: null,
      initial: 'RA',
    },
    {
      name: 'Nour Al Hoda',
      role: 'Logistics Lead',
      image: null,
      initial: 'NAH',
    },
    {
      name: 'Saja Jaber',
      role: '',
      image: null,
      initial: 'SJ',
    },
    {
      name: 'Nisreen Hamze',
      role: '',
      image: null,
      initial: 'NH',
    },
    {
      name: 'Batool Kassem',
      role: '',
      image: null,
      initial: 'BK',
    }
    
  ];

  // Founders / Leaders
  const founders = [
    {
      name: 'Hussein Omeis',
      title: 'Founder',
      education: 'Information System and Data Intelligence',
      description:
        'Passionate about cybersecurity, committed to protecting digital systems, and dedicated to building communities that promote awareness and collaboration in the field.',
      phone: '+961 76 764 155',
      initial: 'HO',
    },
    {
      name: 'Hassan Tofayli',
      title: 'Co-Founder',
      education: 'Information System and Data Intelligence',
      description:
        'Focused on turning raw data into meaningful insights by analyzing patterns, developing strategies driven by decisions.',
      phone: '+961 81 675 164',
      initial: 'HT',
    },
  ];

  // Stats
  const stats = [
    { value: '2024', label: 'Founded' },
    { value: '600+', label: 'Members' },
    { value: '20+', label: 'Events' },
    { value: '4', label: 'Domains' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO BANNER */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/club_members.jpg"
            alt="Bitwise Club Members"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-purple/80 via-navy-blue/70 to-dark-purple/90" />
        </div>

        {/* Decorative geometric shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 border border-white/5 rounded-full" />
        <div className="absolute bottom-20 left-20 w-48 h-48 border border-white/5 rounded-3xl rotate-45" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/90">
              About Bitwise Club
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
          >
            Where Passion Meets
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-sky-blue to-cyan-300 bg-clip-text text-transparent">
              Technology
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Founded in 2024 by Master&apos;s students at the Lebanese
            University, Bitwise Club empowers the next generation of tech
            leaders through hands-on learning and community-driven growth.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* STATS BAR */}
      <section className="relative -mt-16 z-20 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl shadow-gray-200/70 border border-gray-100 p-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`text-center py-6 px-4 ${i < stats.length - 1 ? 'border-r border-gray-100' : ''}`}
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-navy-blue to-sky-blue bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-navy-blue/10">
                <img
                  src="/club_members.jpg"
                  alt="Bitwise Club Members"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-blue/40 to-transparent" />
              </div>

              {/* Floating quote card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-8 -right-4 md:right-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-xs"
              >
                <FaQuoteLeft className="text-sky-blue/30 text-2xl mb-3" />
                <p className="text-dark-purple text-sm font-medium italic leading-relaxed">
                  &ldquo;The future belongs to those who believe in the beauty
                  of their ideas and the courage to create them.&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-px w-8 bg-navy-blue/30" />
                  <span className="text-navy-blue font-black text-xs uppercase tracking-widest">
                    Bitwise
                  </span>
                </div>
              </motion.div>

              {/* Decorative dot */}
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-2xl bg-sky-blue/10 border border-sky-blue/20" />
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-navy-blue/5 px-4 py-2 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-navy-blue" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-navy-blue">
                  Our Story
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-dark-purple mb-8 leading-tight">
                Building Tomorrow&apos;s
                <br />
                <span className="bg-gradient-to-r from-navy-blue to-sky-blue bg-clip-text text-transparent">
                  Tech Community
                </span>
              </h2>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  <span className="font-bold text-dark-purple">
                    Bitwise Club
                  </span>{' '}
                  was founded in{' '}
                  <span className="font-bold text-dark-purple">2024</span> by
                  Master 1 students at the Lebanese University to fuel the
                  growing interest in computer science. Established with the
                  support of the Student Council, we focus on enhancing{' '}
                  <span className="font-bold text-dark-purple">
                    practical and theoretical skills
                  </span>{' '}
                  for students passionate about the computing world.
                </p>

                <p>
                  We cover multiple domains including{' '}
                  <span className="font-bold text-dark-purple">
                    programming, cybersecurity, artificial intelligence, and
                    robotics
                  </span>{' '}
                  through{' '}
                  <span className="font-bold text-dark-purple">
                    hands-on activities
                  </span>{' '}
                  and collaborative learning experiences designed to build{' '}
                  <span className="font-bold text-dark-purple">
                    real-world expertise.
                  </span>
                </p>
              </div>

              <div className="mt-10">
                <Link to="/announcements">
                  <motion.button
                    whileHover={{ scale: 1.03, x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-8 py-4 bg-navy-blue text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-lg shadow-navy-blue/20 hover:shadow-xl transition-shadow"
                  >
                    See Upcoming Events
                    <FaArrowRight />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DOMAINS WE COVER */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-navy-blue/10 px-4 py-2 rounded-full mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-navy-blue" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-navy-blue">
                What We Teach
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-dark-purple leading-tight"
            >
              Our Core{' '}
              <span className="bg-gradient-to-r from-navy-blue to-sky-blue bg-clip-text text-transparent">
                Domains
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domains.map((domain, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-navy-blue/5 hover:-translate-y-2 transition-all duration-500 h-full">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center text-white text-xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                  >
                    {domain.icon}
                  </div>
                  <h3 className="text-xl font-black text-dark-purple mb-3 group-hover:text-navy-blue transition-colors">
                    {domain.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{domain.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE TEAM */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-navy-blue/10 px-4 py-2 rounded-full mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-navy-blue" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-navy-blue">
                Our People
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-dark-purple mb-6 leading-tight"
            >
              Meet the{' '}
              <span className="bg-gradient-to-r from-navy-blue to-sky-blue bg-clip-text text-transparent">
                Bitwise Team
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 max-w-xl mx-auto text-lg"
            >
              The dedicated individuals working behind the scenes to make every
              event, course, and experience exceptional.
            </motion.p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-20">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group"
              >
                <div className="bg-gray-50 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl hover:shadow-navy-blue/5 border border-transparent hover:border-gray-100 hover:-translate-y-2 transition-all duration-500">
                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-navy-blue/10 to-sky-blue/10 border-2 border-white shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-black text-navy-blue">
                        {member.initial}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-dark-purple group-hover:text-navy-blue transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FOUNDERS — Special Design*/}
          <div className="relative">
            {/* Separator */}
            <div className="flex items-center justify-center gap-4 mb-16">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-navy-blue/20" />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-navy-blue to-sky-blue px-6 py-3 rounded-full"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
                  ★ Leadership ★
                </span>
              </motion.div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-navy-blue/20" />
            </div>

            {/* Founders Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {founders.map((founder, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group h-full"
                >
                  <div className="relative h-full rounded-[2rem] p-[2px] bg-gradient-to-br from-sky-blue/60 via-navy-blue to-dark-purple shadow-2xl shadow-navy-blue/20 group-hover:shadow-sky-blue/20 transition-shadow duration-700">
                    {/* Hover glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-blue/20 to-navy-blue/20 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Inner Card */}
                    <div className="relative h-full bg-gradient-to-br from-[#0f1b3d] to-[#0a1128] rounded-[1.9rem] overflow-hidden">
                      {/* Decorative background */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-blue/5 rounded-full blur-[100px]" />
                      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px]" />

                      {/* Accent stripe */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-blue via-sky-blue/40 to-transparent" />

                      <div className="relative p-10 flex flex-col h-full">
                        {/* Top Row: Avatar + Title */}
                        <div className="flex items-center gap-5 mb-6">
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-blue to-cyan-400 p-[2px] shadow-lg shadow-sky-blue/20 group-hover:shadow-sky-blue/40 transition-shadow duration-500">
                              <div className="w-full h-full rounded-[14px] bg-[#0f1b3d] flex items-center justify-center">
                                <span className="text-2xl font-black text-white">
                                  {founder.initial}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white group-hover:text-sky-blue transition-colors duration-300 leading-tight">
                              {founder.name}
                            </h3>
                            <div className="mt-1.5 inline-flex items-center gap-1.5 bg-sky-blue/10 border border-sky-blue/20 px-3 py-1 rounded-lg">
                              <div className="w-1.5 h-1.5 rounded-full bg-sky-blue animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-blue">
                                {founder.title}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Education */}
                        <div className="bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 rounded-xl mb-5">
                          <p className="text-white/40 text-xs font-semibold tracking-wide">
                            📎 {founder.education}
                          </p>
                        </div>

                        {/* Description — flex-grow ensures equal height */}
                        <p className="text-white/50 leading-relaxed text-sm flex-grow">
                          {founder.description}
                        </p>

                        {/* Bottom: Contact */}
                        <div className="mt-6 pt-5 border-t border-white/[0.06]">
                          <motion.a
                            href={`tel:${founder.phone}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-white/[0.04] border border-white/10 text-white rounded-xl hover:bg-sky-blue hover:text-navy-blue hover:border-sky-blue font-bold text-sm transition-all duration-300"
                          >
                            <FaPhoneAlt size={12} />
                            <span>Get in Touch</span>
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION*/}
      <section className="py-24 px-6 bg-gradient-to-br from-navy-blue via-navy-blue to-dark-purple relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-sky-blue/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
          >
            Ready to Join the
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Journey?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg mb-10 max-w-lg mx-auto"
          >
            Whether you&apos;re a beginner or an experienced developer,
            there&apos;s a place for you at Bitwise. Start your journey today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white text-dark-purple font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-2xl flex items-center gap-3"
              >
                Create Account
                <FaArrowRight className="text-sky-blue" />
              </motion.button>
            </Link>
            <Link to="/announcements">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white/10 text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl border border-white/20"
              >
                Browse Events
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

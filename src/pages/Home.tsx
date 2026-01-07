import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, Briefcase, Users, CheckCircle, 
  ArrowRight, Star, Shield, Clock
} from 'lucide-react';

export const Home = () => {
  const services = [
    {
      icon: GraduationCap,
      title: 'Exam Slot Booking',
      description: 'Get confirmed exam slots for top companies like TCS, Infosys, Wipro, Accenture & more.',
    },
    {
      icon: Briefcase,
      title: 'Interview Support',
      description: 'One-on-one interview preparation with experienced mentors.',
    },
    {
      icon: Users,
      title: 'Full Placement Support',
      description: 'Complete end-to-end placement assistance from registration to offer letter.',
    },
    {
      icon: Star,
      title: 'Communication & Mentorship',
      description: 'Improve your communication skills and get career guidance.',
    },
  ];

  const features = [
    { icon: Shield, text: 'Verified & Trusted' },
    { icon: Clock, text: '24/7 Support' },
    { icon: CheckCircle, text: '1000+ Students Placed' },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-[#00d9b8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#1affce]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00d9b8]/10 border border-[#00d9b8]/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00d9b8] animate-pulse" />
            <span className="text-[#00d9b8] text-sm font-medium">Your Career Partner</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
            Get Your Dream Job with
            <br />
            <span className="text-[#00d9b8]">PrimoJobs</span>
          </h1>

          <p className="text-[#b8c5d6] text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            We help freshers and students secure exam slots, prepare for interviews, 
            and land their dream jobs at top companies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold px-8 h-14 text-lg shadow-lg shadow-[#00d9b8]/30">
                Register Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-[#6b7a8f]">
                <feature.icon className="w-5 h-5 text-[#00d9b8]" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-[#b8c5d6] max-w-xl mx-auto">
            Choose the service that fits your needs and take the first step towards your career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:border-[#00d9b8]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00d9b8]/20 flex items-center justify-center mb-4 group-hover:bg-[#00d9b8]/30 transition-colors">
                <service.icon className="w-6 h-6 text-[#00d9b8]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-[#6b7a8f] text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/register">
            <Button size="lg" className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Register', desc: 'Fill the form with your details and select service' },
            { step: '2', title: 'Pay', desc: 'Complete payment via UPI and upload screenshot' },
            { step: '3', title: 'Get Support', desc: 'Our team verifies and contacts you within 24 hours' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#00d9b8] text-[#0a1628] font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-[#6b7a8f]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 sm:p-12 rounded-3xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-[#b8c5d6] mb-8 max-w-xl mx-auto">
            Join thousands of students who have successfully landed their dream jobs with PrimoJobs.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold px-8 h-14 text-lg">
              Register Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

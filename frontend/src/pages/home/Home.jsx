import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stethoscope, Shield, Users, Calendar, FileText, ArrowRight, Heart, Clock, Star } from 'lucide-react'

const Home = () => {
  const { user } = useSelector((state) => state.auth)

  const features = [
    {
      icon: Stethoscope,
      title: "Expert Medical Care",
      description: "Connect with board-certified healthcare professionals and specialists"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Book appointments 24/7 with real-time availability and instant confirmations"
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Secure, centralized access to your complete medical history and test results"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security protecting your sensitive health information"
    },
    {
      icon: Users,
      title: "Care Coordination",
      description: "Seamless communication between your healthcare providers and specialists"
    },
    {
      icon: Clock,
      title: "Virtual Consultations",
      description: "Telemedicine appointments from the comfort of your home"
    }
  ]

  const stats = [
    { number: "50K+", label: "Patients Served" },
    { number: "2K+", label: "Healthcare Providers" },
    { number: "98%", label: "Patient Satisfaction" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl medical-gradient flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                CareSync
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Your Health, 
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"> Simplified</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of healthcare with our integrated platform connecting patients, 
              doctors, and medical records in one secure ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              {user ? (
                <Button asChild size="lg" className="medical-gradient text-lg px-8 py-3">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="cta-gradient text-accent-foreground text-lg px-8 py-3">
                    <Link to="/register" className="flex items-center gap-2">
                      Get Started Free <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Healthcare Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for modern healthcare management in one secure, intuitive platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full premium-card group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Patients & Providers
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say about their CareSync experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">
                    "CareSync transformed how I manage my chronic condition. Having all my records in one place and being able to message my doctor directly has been life-changing."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold text-primary">SD</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Patient since 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">
                    "As a healthcare provider, CareSync has streamlined my practice. The automated scheduling and secure messaging save me hours each week."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold text-primary">DR</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Dr. Michael Chen</p>
                      <p className="text-sm text-muted-foreground">Cardiologist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of patients and healthcare providers who trust CareSync with their medical journey.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="cta-gradient text-accent-foreground text-lg px-8 py-3">
                  <Link to="/register" className="flex items-center gap-2">
                    Start Free Trial <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Link to="/login">Schedule a Demo</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
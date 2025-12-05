import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Stethoscope,
  Calendar,
  FileText,
  Shield,
  Activity,
  Video,
  CheckCircle2,
  ArrowRight,
  Award,
  Building2,
  Users,
  Clock,
  Heart,
  Brain,
  Pill,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Seamless Appointment Booking",
      description:
        "Book consultations with Apollo's world-class specialists across 70+ departments instantly",
    },
    {
      icon: Video,
      title: "Apollo Digital Consultations",
      description:
        "Connect with Apollo doctors through secure HD video consultations from anywhere",
    },
    {
      icon: FileText,
      title: "Integrated Health Records",
      description:
        "Access your complete Apollo medical history, lab reports, and prescriptions in one place",
    },
    {
      icon: Activity,
      title: "Continuous Health Monitoring",
      description:
        "Track vitals, receive AI-powered health insights backed by Apollo's clinical expertise",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "Your health data protected with ISO 27001 certified security infrastructure",
    },
    {
      icon: Award,
      title: "Apollo's Legacy of Excellence",
      description:
        "Trusted healthcare partner with 40+ years of clinical excellence and innovation",
    },
  ];

  const departments = [
    "Cardiology",
    "Oncology",
    "Neurology",
    "Orthopedics",
    "Gastroenterology",
    "Nephrology",
    "Pulmonology",
    "Endocrinology",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Psychiatry",
  ];

  const stats = [
    { icon: Users, number: "100M+", label: "Lives Touched" },
    { icon: Building2, number: "70+", label: "Hospitals Nationwide" },
    { icon: Stethoscope, number: "10,000+", label: "Expert Doctors" },
    { icon: Award, number: "40+", label: "Years of Trust" },
  ];

  const floatingHealthTexts = [
    {
      text: "24/7 Cardiac Care",
      icon: Heart,
      color: "text-white",
      bgColor: "bg-red-500/50",
      position: "top-6 -left-6",
      shadow: "shadow-lg shadow-red-500/20",
    },
    {
      text: "AI Diagnostics",
      icon: Brain,
      color: "text-white",
      bgColor: "bg-purple-600/60",
      position: "bottom-24 -right-8",
      shadow: "shadow-lg shadow-purple-600/20",
    },
    {
      text: "Smart Pharmacy",
      icon: Pill,
      color: "text-white",
      bgColor: "bg-blue-600/60",
      position: "bottom-6 -left-25",
      shadow: "shadow-lg shadow-blue-600/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Banner */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14  relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Powered by Apollo Hospitals
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Apollo's Digital
                  <span className="block text-primary mt-2 sm:mt-3">
                    Healthcare Platform
                  </span>
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Experience world-class healthcare digitally. Book appointments,
                consult specialists, access records, and manage your health with
                Apollo's trusted clinical excellence—now at your fingertips.
              </p>

              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-8 sm:px-10 py-3 h-auto"
                >
                  <Link to="/login">
                    Access Your Health Portal{" "}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Apollo Credentials */}
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    India's most trusted healthcare brand
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    JCI accredited, internationally recognized standards
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    24/7 emergency and consultation support
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Hero Banner with Floating Text */}
            <div className="relative">
              <div className="relative">
                <div className="aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-border shadow-xl sm:shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/djsytmwcw/image/upload/v1764904640/caresync/up0175ejq6yjsfrpinqw.jpg"
                    alt="Apollo Healthcare professionals team"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating Health Texts - Outside the image container */}
                {floatingHealthTexts.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute ${item.position} hidden sm:flex items-center gap-2 px-3 py-2 rounded-full ${item.bgColor} ${item.shadow} backdrop-blur-sm border border-white/30 animate-float z-20`}
                    style={{ 
                      animationDelay: `${index * 0.3}s`,
                      transform: `translateY(0)`
                    }}
                  >
                    <item.icon className={`w-3 h-3 ${item.color}`} />
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile floating texts below image */}
              <div className="flex flex-wrap justify-center gap-3 mt-4 sm:hidden">
                {floatingHealthTexts.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full ${item.bgColor} border border-white/30 shadow-md`}
                  >
                    <item.icon className={`w-3 h-3 text-white`} />
                    <span className="text-xs font-semibold text-white">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-border">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apollo Excellence Banner */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold">Apollo Hospitals Network</h3>
              <p className="text-primary-foreground/90 text-sm sm:text-base">
                Asia's foremost integrated healthcare services provider
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">5M+</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80">
                  Annual Patients
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">150+</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80">
                  Clinical Programs
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">#1</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80">
                  Healthcare Provider
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Apollo's Centers of Excellence
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Access specialized care across 70+ departments with India's finest
              medical professionals and cutting-edge technology
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {departments.map((dept) => (
              <div
                key={dept}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-card border border-border rounded-full hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-sm sm:text-base font-semibold text-foreground">
                  {dept}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Digital Healthcare, Apollo Standard
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Combining Apollo's 40+ years of clinical excellence with modern
              digital innovation for seamless healthcare experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border border-border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Your Health Journey, Simplified
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Three simple steps to access Apollo's world-class healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">{step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {step === 1 && "Register & Verify"}
                  {step === 2 && "Choose Your Specialist"}
                  {step === 3 && "Receive Excellence"}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {step === 1 && "Create your secure Apollo health account with verified credentials in minutes"}
                  {step === 2 && "Browse Apollo's expert doctors, view profiles, and book appointments instantly"}
                  {step === 3 && "Get world-class care through in-person visits or digital consultations"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-linear-to-br from-primary/5 to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Why India Trusts Apollo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border border-border text-center">
              <CardContent className="p-6 sm:p-8">
                <Award className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">
                  International Accreditation
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  JCI certified with global healthcare standards and protocols
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border text-center">
              <CardContent className="p-6 sm:p-8">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">
                  Advanced Technology
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Latest medical equipment and AI-powered diagnostic tools
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border text-center">
              <CardContent className="p-6 sm:p-8">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">
                  24/7 Support
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Round-the-clock emergency care and consultation access
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Begin Your Journey to Better Health
          </h2>
          <p className="text-base sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Join millions who trust Apollo Hospitals for their healthcare needs.
            Access world-class medical expertise through our digital platform.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 h-auto"
          >
            <Link to="/login">
              Access Apollo Portal <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
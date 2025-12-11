import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  FileText,
  MessageSquare,
  Database,
  Cpu,
  Code,
  Server,
  Cloud,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Health Chatbot",
      description:
        "Ask general medical questions and get instant AI-generated guidance based on public health information.",
    },
    {
      icon: FileText,
      title: "Enhanced Health Records",
      description:
        "Upload prescriptions and reports. The app extracts important values so your medical data is easier to understand.",
    },
  ];

  const capabilities = [
    {
      icon: MessageSquare,
      title: "Symptom Questions",
      description:
        "Chat with the AI assistant to understand potential causes and common recommendations.",
    },
    {
      icon: Database,
      title: "Report Extraction",
      description:
        "Automatically highlight values from lab reports including test name, value, and reference range.",
    },
  ];

  const techStack = [
    { name: "AI Model Integration", icon: Cpu },
    { name: "NLP for Chat", icon: MessageSquare },
    { name: "Digital Record Storage", icon: Database },
    { name: "React Frontend", icon: Code },
    { name: "Node Backend", icon: Server },
    { name: "MongoDB Database", icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section with AI Theme */}
      <section className="relative bg-background overflow-hidden py-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-purple-500/5 to-blue-500/5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-linear-to-r from-primary/20 to-purple-500/20 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    AI-Powered Healthcare Platform
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Next-Gen
                  <span className="block bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent mt-2 sm:mt-3">
                    AI Healthcare
                  </span>
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Understand your health with AI. Ask general medical questions
                and store your medical records in a simple digital format.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-linear-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground text-base sm:text-lg px-8 sm:px-10 py-3 h-auto"
                >
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - Hero Banner with Floating Text */}
            <div className="relative">
              <div className="relative">
                <div className="aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-border shadow-2xl">
                  <img
                    src="https://res.cloudinary.com/djsytmwcw/image/upload/v1764904640/caresync/up0175ejq6yjsfrpinqw.jpg"
                    alt="AI Healthcare Interface"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Floating AI Health Texts */}
                {[
                  {
                    text: "AI Chat Support",
                    icon: Bot,
                    color: "text-white",
                    bgColor: "bg-purple-600/70",
                    position: "top-6 -left-6",
                    shadow: "shadow-lg shadow-purple-500/30",
                  },
                  {
                    text: "Smart Records",
                    icon: Database,
                    color: "text-white",
                    bgColor: "bg-blue-600/70",
                    position: "bottom-24 -right-8",
                    shadow: "shadow-lg shadow-blue-500/30",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`absolute ${item.position} hidden sm:flex items-center gap-2 px-4 py-2 rounded-full ${item.bgColor} ${item.shadow} backdrop-blur-sm border border-white/20 animate-float z-20`}
                    style={{ animationDelay: `${index * 0.3}s` }}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            What You Can Do
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            The app currently focuses on two core features: AI chat guidance and enhanced medical records.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border border-border hover:border-primary/50 hover:shadow-xl transition-all"
              >
                <CardContent className="p-6 sm:p-8 text-center space-y-4">
                  <feature.icon className="w-12 h-12 mx-auto text-primary" />
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              AI Health Chatbot
            </h2>
            <p className="text-muted-foreground mb-6">
              Ask general medical questions. The AI provides simple guidance based on public health information.
            </p>

            <ul className="space-y-3 text-foreground">
              <li>• Ask symptom questions</li>
              <li>• Understand common causes</li>
              <li>• Get general recommendations</li>
              <li>• Learn when to seek a doctor</li>
            </ul>
          </div>

          <div>
            <img
              src="https://res.cloudinary.com/djsytmwcw/image/upload/v1765347021/roomezy/cjc87fqzslel66kubufb.png"
              alt="Chatbot UI"
              className="rounded-xl border border-border"
            />
          </div>
        </div>
      </section>

      {/* Health Records */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="https://res.cloudinary.com/djsytmwcw/image/upload/v1765346834/roomezy/erm6eup7vjjrd5mf9q2c.png"
              alt="Health Records UI"
              className="rounded-xl border border-border"
            />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Enhanced Health Records
            </h2>
            <p className="text-muted-foreground mb-6">
              Upload your medical reports. The app extracts key values so you can read them easily.
            </p>

            <ul className="space-y-3 text-foreground">
              <li>• Upload prescriptions</li>
              <li>• Upload lab reports</li>
              <li>• Extract important values</li>
              <li>• View reference ranges</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            How It Works
          </h2>

          <p className="text-muted-foreground max-w-3xl mx-auto mt-4">
            The system uses language models to read questions in natural language and extract values from medical PDFs.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {capabilities.map((c) => (
              <div key={c.title} className="p-6 border border-border rounded-xl text-center">
                <c.icon className="w-8 h-8 mx-auto text-primary mb-3" />
                <h3 className="font-bold text-lg">{c.title}</h3>
                <p className="text-muted-foreground text-sm">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Technology</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mt-4">
            Built using modern web technologies and AI integration.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {techStack.map((tech) => (
              <div key={tech.name} className="flex items-center gap-3 p-4 border border-border rounded-xl">
                <tech.icon className="w-5 h-5 text-primary" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-linear-to-r from-primary to-purple-600 text-primary-foreground text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Try the App Today
        </h2>
        <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
          Explore AI assistance for basic health questions and store your medical files in one place.
        </p>

        <Button
          asChild
          size="lg"
          variant="secondary"
          className="text-lg px-10 py-4"
        >
          <Link to="/login">
            Get Started
          </Link>
        </Button>
      </section>

    </div>
  );
};

export default Home;

"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ArrowRight, BookOpen, Layers, Signature } from "lucide-react";

export default function WelcomePage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0, scale: 0.98 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        mass: 1,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-grid-pattern relative selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col relative z-10">

        {/* Hero Section */}
        <section className="pt-12 pb-12 lg:pt-12 lg:pb-12 border-b-[2px] border-foreground relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col max-w-4xl"
          >
            <motion.div variants={itemVariants} className="mb-8 flex items-center gap-4">
              <span className="block h-[2px] w-12 bg-primary"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Intelligent Architecture</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl font-heading font-black leading-[1.05] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem] mb-8"
            >
              Master the <br className="hidden md:block" />
              <span className="italic font-light text-primary">Science</span> of Grants.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-12 text-lg sm:text-xl md:text-2xl text-secondary max-w-2xl leading-relaxed font-sans"
            >
              A precision instrument for generating, analyzing, and discovering funding opportunities using definitive AI models. Formulated for institutions that demand excellence.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-start">
              <Button size="lg" className="rounded-none h-16 px-10 text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-colors shadow-[8px_8px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[8px] active:translate-y-[8px]">
                Initialize System
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <div className="flex items-center gap-4 h-16 px-6 border-[2px] border-foreground">
                <span className="text-3xl font-heading font-black">8X</span>
                <span className="text-xs font-bold uppercase tracking-widest leading-tight text-secondary">Faster<br />Drafting</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative geometric accent */}
          <div className="hidden lg:block absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-primary/10 stroke-current opacity-50">
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" fill="none" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" fill="none" strokeWidth="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" strokeWidth="0.5" />
              <line x1="50" y1="10" x2="50" y2="90" strokeWidth="0.5" />
            </svg>
          </div>
        </section>

        {/* Modular Features Section */}
        <section id="features" className="py-24">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-heading font-black leading-tight mb-6">Structural Modules</h2>
                <p className="text-secondary mb-8">
                  The Grant Toolkit is divided into three core subsystems. Each is designed to enforce rigorous logic and optimize rhetoric for reviewing bodies.
                </p>
              </div>
              <div className="hidden lg:block w-24 h-24 border-[2px] border-foreground rounded-full flex items-center justify-center p-2">
                <div className="w-full h-full border-[1px] border-primary rounded-full relative animate-[spin_10s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-foreground rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
              {[
                {
                  id: "01",
                  title: "Prose Synthesis",
                  description: "Generate highly structured, meticulously formatted grant narratives. Our AI engine aligns to the exact specifications of institutional RFPs.",
                  icon: Signature,
                },
                {
                  id: "02",
                  title: "Opportunity Discovery",
                  description: "Query comprehensive databases with deep semantic precision to uncover relevant foundations, government agencies, and private trusts.",
                  icon: BookOpen,
                },
                {
                  id: "03",
                  title: "Critical Review",
                  description: "Submit existing drafts for rigorous computational critique. Identify structural weaknesses, verify compliance, and sharpen rhetorical impact.",
                  icon: Layers,
                },
              ].map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`border-[2px] border-foreground p-8 bg-background relative group ${index === 2 ? 'md:col-span-2' : ''}`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-heading font-black text-6xl group-hover:scale-110 transition-transform duration-500 group-hover:text-primary">
                    {module.id}
                  </div>
                  <module.icon className="h-8 w-8 text-primary mb-8" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-4 relative z-10">{module.title}</h3>
                  <p className="text-secondary leading-relaxed relative z-10 font-sans">
                    {module.description}
                  </p>

                  {/* Decorative corner square */}
                  <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 bg-primary transition-all duration-300 group-hover:w-full group-hover:h-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t-[2px] border-foreground bg-secondary text-secondary-foreground z-10 relative">
        <div className="container mx-auto max-w-5xl px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-primary" />
            <span className="font-heading font-bold text-lg uppercase tracking-widest text-background">Grant Toolkit</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary-foreground/70 hover:text-primary transition-colors">Manifesto</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary-foreground/70 hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary-foreground/70 hover:text-primary transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

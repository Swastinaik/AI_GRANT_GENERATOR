"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mic, 
  Play, 
  Download, 
  Wand2, 
  Headphones, 
  MoreHorizontal,
  Pause
} from "lucide-react";
import Link from "next/link";

// Helper component for the animated audio bars
const AudioBar = ({ delay }: { delay: number }) => (
  <motion.div
    animate={{ 
      height: ["20%", "60%", "30%", "100%", "40%"] 
    }}
    transition={{ 
      duration: 1.2, 
      repeat: Infinity, 
      repeatType: "mirror",
      delay: delay,
      ease: "easeInOut"
    }}
    className="w-1.5 bg-primary rounded-full"
  />
);

const Hero = () => {
  return (
    <section className="relative pt-10 pb-32 md:pb-48 overflow-hidden bg-background">
      
      {/* Ambient Background Gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE: Copy & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground w-fit bg-secondary/50">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Text-to-Audio Engine
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Turn any Prompt into <br />
              <span className="text-primary">Vibrant Conversations.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-[520px] leading-relaxed">
              Skip the studio. Just type a topic or paste a URL. Our AI generates the script, directs the chemistry, and produces a human-like podcast in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 duration-200">
                <Wand2 className="w-4 h-4" />
                <Link href={'/podcast-agent'}>Generate Episode</Link>
                
              </button>
              <button className="h-12 px-8 rounded-xl border border-input bg-background hover:bg-secondary/80 font-medium text-md transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-foreground" />
                <Link href={'/podcast-agent'}>Listen to Samples</Link>
              </button>
            </div>

            {/* Micro Interaction / Stats */}
            <div className="flex items-center gap-6 pt-6 border-t border-border/50 mt-2">
               <div>
                  <p className="text-2xl font-bold text-foreground">10k+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Episodes Created</p>
               </div>
               <div className="w-px h-8 bg-border" />
               <div>
                  <p className="text-2xl font-bold text-foreground">4.9/5</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Voice Realism</p>
               </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: The Player Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* The "Prompt" Card (Background Layer) */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [-2, 0, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-4 w-64 bg-background border border-border p-4 rounded-2xl shadow-sm z-0 opacity-60 scale-90 origin-bottom-right"
            >
               <div className="h-2 w-1/3 bg-muted rounded mb-3" />
               <div className="space-y-2">
                 <div className="h-2 w-full bg-muted/50 rounded" />
                 <div className="h-2 w-full bg-muted/50 rounded" />
                 <div className="h-2 w-2/3 bg-muted/50 rounded" />
               </div>
            </motion.div>

            {/* The Main Player Card */}
            <div className="relative z-10 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
               
               {/* Player Header */}
               <div className="p-6 pb-0 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                     {/* Album Art */}
                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                        <Mic className="text-white w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="font-bold text-lg leading-none mb-1">The Future of AI</h3>
                        <p className="text-sm text-muted-foreground">Hosted by Agent & Sofia</p>
                     </div>
                  </div>
                  <MoreHorizontal className="text-muted-foreground cursor-pointer" />
               </div>

               {/* Waveform Visualizer */}
               <div className="px-6 py-8 flex items-center justify-center gap-1 h-32">
                  {[...Array(20)].map((_, i) => (
                    <AudioBar key={i} delay={i * 0.1} />
                  ))}
               </div>

               {/* Time & Controls */}
               <div className="px-6 pb-6 space-y-4">
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: "0%" }}
                       animate={{ width: "45%" }}
                       transition={{ duration: 10, ease: "linear" }}
                       className="h-full bg-foreground" 
                     />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground font-medium font-mono">
                     <span>04:12</span>
                     <span>12:30</span>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between mt-2">
                     <button className="text-sm font-medium text-muted-foreground hover:text-foreground">1x Speed</button>
                     
                     <div className="flex items-center gap-6">
                        <button className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                           <Pause className="w-5 h-5 fill-current" />
                        </button>
                     </div>
                     
                     <button className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                        <Download className="w-3 h-3" />
                        MP3
                     </button>
                  </div>
               </div>

               {/* Transcript Overlay (Bottom Peek) */}
               <div className="bg-secondary/50 border-t border-border p-4">
                  <p className="text-xs font-mono text-muted-foreground mb-1">Transcript Generating...</p>
                  <p className="text-sm text-foreground/80 font-medium">
                     "Welcome back everyone. Today we are discussing how large language models are changing the way we..."
                  </p>
               </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 bg-background border border-border p-3 rounded-xl shadow-lg flex items-center gap-3 z-20 animate-bounce delay-700">
               <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                  <Headphones size={16} />
               </div>
               <div className="text-xs">
                  <span className="block font-bold">Stereo Audio</span>
                  <span className="text-muted-foreground">320kbps Quality</span>
               </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
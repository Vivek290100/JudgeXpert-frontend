import { Button } from "@/components/ui/button";
import { showStoredToast } from "@/utils/toast/Toast";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function HeroSection() {
  useEffect(() => {
    showStoredToast();
  }, []);
  return (
    // <section className="min-h-[100vh] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-background to-muted relative overflow-hidden">
    <section className="min-h-[100vh] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-forground to-muted relative overflow-hidden">
      {/* Background Glow */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 blur-3xl" /> */}
      
      {/* Content */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        className="text-4xl md:text-6xl font-bold mb-4 text-forground drop-shadow-lg bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent"
      >
        Become an Expert,<br />One Code at a Time
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-lg text-muted-foreground mb-2"
      >
        From Basics to Advanced: Your Coding Journey Starts Here
      </motion.p>
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }} 
        className="text-lg text-muted-foreground mb-10"
      >
        Sharpen Your Skills Through Real Problems
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button size="lg" className="bg-primary text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all">
          Begin Challenge
        </Button>
      </motion.div>
    </section>
  );
}
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/utils/Animations";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <motion.section
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="py-8 sm:py-12 md:py-16 px-2 sm:px-4 md:px-6 text-center bg-background"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Every Solution Counts</h2>
      <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
        Register for an upcoming contest "Battle Victories"
      </p>
      <p className="text-muted-foreground mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base">
        Where Dedication Meets Success
      </p>
      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm md:text-base">
        Contact Us
      </Button>
    </motion.section>
  );
}
import { Button } from "@/components/ui/button";
import { showStoredToast } from "@/utils/Toast";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "../../utils/animations";
import { useEffect } from "react";
import { RootState, useAppSelector } from "@/redux/Store";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    showStoredToast();
  }, []);

  const handleButtonClick = () => {
    if (user) {
      navigate("user/problems");
    } else {
      navigate("/login");
    }
  };

  return (
    <motion.section
      initial="initial"
      animate="animate"
      className="min-h-[80vh] sm:min-h-screen flex flex-col items-center justify-center text-center p-2 sm:p-4 md:p-6 bg-background from-foreground to-muted relative overflow-hidden"
    >
      <motion.h1
        variants={fadeInUp}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent"
      >
        Become an Expert,<br />One Code at a Time
      </motion.h1>
      <motion.p
        variants={fadeInUp}
        className="text-xs sm:text-sm md:text-lg text-muted-foreground mb-2"
      >
        From Basics to Advanced: Your Coding Journey Starts Here
      </motion.p>
      <motion.p
        variants={fadeInUp}
        className="text-xs sm:text-sm md:text-lg text-muted-foreground mb-4 sm:mb-6 md:mb-10"
      >
        Sharpen Your Skills Through Real Problems
      </motion.p>
      <motion.div variants={scaleIn}>
          <Button onClick={handleButtonClick}
          size="sm"
          className="bg-primary text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all text-xs sm:text-sm md:text-base"
          >
          Begin Challenge
        </Button>
          
      </motion.div>
    </motion.section>
  );
}
import { Code2, Github, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/Animations";

export function Footer() {
  return (
    <motion.footer
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="border-t bg-background py-6 sm:py-8"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-2 sm:px-4 md:px-6">
        {/* Left Section: Logo and Socials */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center md:items-start space-y-3 sm:space-y-4 mb-6 md:mb-0"
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-primary">JudgeXpert</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            Code at the speed of no-code.
          </p>
          <div className="flex items-center gap-3 sm:gap-4 mt-2">
            <a href="#" aria-label="GitHub">
              <Github className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </a>
            <a href="#" aria-label="Discord">
              <img
                src="/discord-icon.svg"
                alt="Discord"
                className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </a>
          </div>
        </motion.div>

        {/* Right Section: Links */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 text-xs sm:text-sm text-muted-foreground"
        >
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Community</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:support@judgexpert.com" className="hover:text-foreground transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;
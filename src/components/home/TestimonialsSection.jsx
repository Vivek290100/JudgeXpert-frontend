import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./animations";

const testimonials = [
  {
    name: "Jaiden Lee",
    userName: "@buildjaiden",
    text: "Masters of Logic, Kings of Code Where Brilliance Meets Glory",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
  },
  // Add other testimonials here...
];

export default function TestimonialsSection() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="py-8 sm:py-12 md:py-16 px-2 sm:px-4 md:px-6 bg-gradient-to-b from-foreground to-muted"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          What People Are Saying
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-center text-gray-400 mt-2 text-xs sm:text-sm md:text-base">
          Thousands of developers and teams love coding.
        </motion.p>

        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-foreground p-3 sm:p-4 md:p-6 rounded-lg border-2"
            >
              <p className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">{testimonial.text}</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">{testimonial.userName}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
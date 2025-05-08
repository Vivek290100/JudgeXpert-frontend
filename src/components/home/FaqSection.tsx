import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/utils/Animations";

export default function FAQSection() {
  const faqs = [
    { question: "What is JudgeXpert?", answer: "A platform for developers to improve their coding skills through real-world challenges." },
    { question: "Who is this platform for?", answer: "Developers of all skill levels looking to enhance their programming abilities." },
    { question: "How do I participate in contests?", answer: "Sign up for an account and join our scheduled coding competitions." },
    { question: "What programming languages are supported?", answer: "We support multiple languages including JavaScript, C++, and more." },
    { question: "Can I track my progress?", answer: "Yes, you can track your ranking and performance through our leaderboard system." },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="py-8 sm:py-12 md:py-16 px-2 sm:px-4 md:px-6 bg-background text-foreground"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          FAQ
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-center text-muted-foreground mt-2 text-xs sm:text-sm md:text-base">
          Got other questions? Reach out.
        </motion.p>

        <div className="mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-card p-3 sm:p-4 rounded-lg cursor-pointer border-2"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base md:text-lg font-medium">{faq.question}</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-muted rounded-full">
                  {openIndex === index ? <ChevronDown size={14}  /> : <Plus size={14} />}
                </div>
              </div>
              {openIndex === index && (
                <p className="mt-2 text-[10px] sm:text-xs md:text-sm text-muted-foreground">{faq.answer}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
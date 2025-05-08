import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BarChart2, Trophy, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, cardHover } from "../../utils/Animations.ts";
import { RootState, useAppSelector } from "@/redux/Store";
import { useNavigate } from "react-router-dom";

const SECTION_BG = "bg-background";

function FeaturesSection() {

  const features = [
    {
      icon: <Code className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-chart-1" />,
      title: "Code & Compete",
      description: "Solve real-world coding problems and compete in live contests to sharpen your skills.",
    },
    {
      icon: <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-chart-2" />,
      title: "Performance Insights",
      description: "Analyze your solutions with runtime and memory stats to optimize your code.",
    },
    {
      icon: <Trophy className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-chart-3" />,
      title: "Global Leaderboards",
      description: "Rank up against coders worldwide and earn badges for your achievements.",
    },
    {
      icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-chart-4" />,
      title: "Practice Problems",
      description: "Master algorithms and data structures with a vast library of challenges.",
    },
  ];

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`py-12 px-2 sm:px-4 md:px-6 ${SECTION_BG}`}
    >
      <div className="container max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
            Elevate Your Coding Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Compete in contests, track your progress, and master coding with our all-in-one platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp} {...cardHover}>
              <Card className="h-full border border-border/50 shadow-sm hover:shadow-md transition-all bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {feature.icon}
                    <CardTitle className="text-base sm:text-lg md:text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs sm:text-sm md:text-base text-foreground/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function CategoriesSection() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    if (user) {
      navigate("user/problems");
    } else {
      navigate("/login");
    }
  };
  const categories = [
    { name: "Algorithms", count: 150, color: "bg-chart-1/10 border-chart-1/30 text-chart-1" },
    { name: "Data Structures", count: 120, color: "bg-chart-2/10 border-chart-2/30 text-chart-2" },
    { name: "Dynamic Programming", count: 80, color: "bg-chart-3/10 border-chart-3/30 text-chart-3" },
    { name: "Graph Theory", count: 60, color: "bg-chart-4/10 border-chart-4/30 text-chart-4" },
    { name: "Math & Logic", count: 70, color: "bg-chart-5/10 border-chart-5/30 text-chart-5" },
    { name: "System Design", count: 50, color: "bg-chart-1/10 border-chart-1/30 text-chart-1" },
  ];

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`py-12 px-2 sm:px-4 md:px-6 ${SECTION_BG}`}
    >
      <div className="container max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
            Explore Coding Challenges
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Tackle problems across key domains to prepare for contests and interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              {...cardHover}
              className={`${category.color} p-3 sm:p-4 md:p-6 rounded-lg border cursor-pointer transition-all`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">{category.name}</h3>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-background/80">
                  {category.count} Problems
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="mt-6 sm:mt-10 md:mt-12 text-center">
          <Button onClick={handleButtonClick} variant="outline" className="bg-background hover:bg-background/90 border-border/60 text-xs sm:text-sm md:text-base">
            Browse All Problems
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function CommunitySection() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    if (user) {
      navigate("user/problems");
    } else {
      navigate("/login");
    }
  };
  const testimonials = [
    {
      text: "The contests here pushed me to optimize my code and climb the leaderboard—now I’m acing interviews!",
      author: "Alex Chen",
      role: "Software Engineer",
    },
    {
      text: "The problem sets and performance analytics helped me identify my weak spots and improve fast.",
      author: "Sarah Johnson",
      role: "Competitive Coder",
    },
    {
      text: "Joining live contests feels like a real coding battle—perfect for building confidence and skills.",
      author: "Miguel Rodriguez",
      role: "CS Student",
    },
  ];

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`py-12 px-2 sm:px-4 md:px-6 ${SECTION_BG} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-background from-chart-1/5 to-transparent opacity-50 pointer-events-none" />
      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-chart-5 to-chart-1 bg-clip-text text-transparent">
            Thrive in Our Coding Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Join thousands of coders, compete in contests, and rise through the ranks together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full border border-border/50 bg-card/90 backdrop-blur-sm">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="mb-3 sm:mb-4 text-chart-1 text-xs sm:text-sm">{"★".repeat(5)}</div>
                  <p className="mb-4 sm:mb-6 text-foreground/90 italic text-xs sm:text-sm md:text-base">
                    “{testimonial.text}”
                  </p>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{testimonial.author}</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="bg-card rounded-xl p-4 sm:p-6 md:p-8 border border-border/50 shadow-lg">
          <div className="flex flex-col items-center md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Ready to dominate the leaderboard?</h3>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Start solving problems and competing with coders worldwide today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button onClick={handleButtonClick} className="bg-primary text-primary-foreground shadow-md hover:shadow-primary/20 text-xs sm:text-sm md:text-base">
                Join Now
              </Button>
              <Button variant="outline" className="border-primary/30 hover:border-primary/50 text-xs sm:text-sm md:text-base">
                View Contests
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function Features() {
  return (
    <div className="min-h-screen">
      <FeaturesSection />
      <CategoriesSection />
      <CommunitySection />
    </div>
  );
}
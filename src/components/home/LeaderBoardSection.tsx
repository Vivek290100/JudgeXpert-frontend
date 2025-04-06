import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/Animations";

export default function LeaderboardSection() {
  const leaderboardData = [
    {
      name: "Vivek",
      points: 1234,
      avatar: "https://img.icons8.com/?size=100&id=13271&format=png&color=FFD700", // Gold Medal
    },
    {
      name: "Varun",
      points: 234,
      avatar: "https://img.icons8.com/?size=100&id=13271&format=png&color=C0C0C0", // Silver Medal
    },
    {
      name: "Aswin",
      points: 34,
      avatar: "https://img.icons8.com/?size=100&id=13271&format=png&color=CD7F32", // Bronze Medal
    },
    {
      name: "Fazal",
      points: 4,
      avatar: "https://img.icons8.com/?size=100&id=13271&format=png&color=0000FF", // Blue Medal
    },
    {
      name: "Meghna",
      points: 1,
      avatar: "https://img.icons8.com/?size=100&id=13271&format=png&color=800080", // Purple Medal
    },
  ];

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="py-12 sm:py-16 px-4 sm:px-6 bg-background text-foreground"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12">
          Track Your Growth, Celebrate Progress
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          <Card className="p-6 sm:p-8 bg-card text-card-foreground rounded-xl flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center">
              <ol className="space-y-6 sm:space-y-8 text-center">
                <li className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold">Where Code Warriors Rise, Champions Emerge</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Prove Your Worth on the Global Stage</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Every Challenge Conquered, Every Victory Earned</p>
                </li>
              </ol>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-center leading-tight">
              Climb the Ranks of Excellence <br /> Write Your Code, Make History
            </h3>
          </Card>

          <Card className="p-6 sm:p-8 bg-card text-card-foreground rounded-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold">Top Ranks</h3>
              <Button variant="secondary" className="bg-muted hover:bg-muted/80 text-xs sm:text-sm">
                View All
              </Button>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center justify-between p-3 bg-muted/10 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img src={user.avatar} alt="medal" className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="font-medium text-base sm:text-lg">{user.name}</span>
                  </div>
                  <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                    {user.points}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}
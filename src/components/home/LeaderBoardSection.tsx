import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LeaderboardSection() {
  const leaderboardData = [
    { name: "Vivek", points: 1234, avatar: "/gold-medal.png" },
    { name: "Varun", points: 234, avatar: "/silver-medal.png" },
    { name: "Aswin", points: 34, avatar: "/bronze-medal.png" },
    { name: "Fazal", points: 4, avatar: "/blue-medal.png" },
    { name: "Meghna", points: 1, avatar: "/purple-medal.png" },
  ];

  return (
    <section className="py-16 px-6 bg-background text-foreground">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-12">Track Your Growth, Celebrate Progress</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Motivational Text */}
          <Card className="p-8 bg-card text-card-foreground  rounded-xl flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center">
              <ol className="space-y-8 text-center">
                <li className="space-y-2">
                  <h3 className="text-xl font-bold">Where Code Warriors Rise, Champions Emerge</h3>
                  <p className="text-sm text-muted-foreground">Prove Your Worth on the Global Stage</p>
                  <p className="text-sm text-muted-foreground">Every Challenge Conquered, Every Victory Earned</p>
                </li>
              </ol>
            </div>
            <h3 className="text-2xl font-bold text-center leading-tight">
              Climb the Ranks of Excellence <br /> Write Your Code, Make History
            </h3>
          </Card>

          {/* Right: Leaderboard */}
          <Card className="p-8 bg-card text-card-foreground  rounded-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Top Ranks</h3>
              <Button variant="secondary" className="bg-muted hover:bg-muted/80">View All</Button>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {leaderboardData.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} alt="medal" className="w-8 h-8" />
                    <span className="font-medium text-lg">{user.name}</span>
                  </div>
                  <span className="text-2x2 font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">{user.points}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

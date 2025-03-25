import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/animations";

const data = [
  { name: "Runtime", value: 102 },
  { name: "Memory", value: 50.16 },
];

export default function CodeEditorSection() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="py-8 px-2 sm:px-4 md:px-6 lg:px-8 bg-background text-foreground flex flex-col items-center"
    >
      <motion.div variants={fadeInUp} className="w-full max-w-6xl text-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Every Problem Solved is a Step Forward</h2>
        <p className="text-muted-foreground mt-2 text-xs sm:text-sm md:text-base lg:text-lg">Challenge Yourself Today</p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        <Card className="p-3 sm:p-4 bg-card border rounded-xl flex flex-col h-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-3">
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mb-2 sm:mb-0">
              <Code className="w-3 h-3 sm:w-4 sm:h-4" /> Code Editor
            </div>
            <Button size="sm" variant="outline" className="text-xs sm:text-sm">
              Submit
            </Button>
          </div>
          <div className="bg-muted rounded-md overflow-hidden border border-border flex-1">
            <div className="bg-gray-800 text-gray-300 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-xs font-mono flex justify-between">
              <span>index.js</span>
              <span>🔴 🟡 🟢</span>
            </div>
            <ScrollArea className="h-48 sm:h-64 md:h-72 lg:h-80 bg-gray-800 text-gray-100 p-2 sm:p-3 text-[10px] sm:text-xs md:text-sm font-mono">
              <pre className="overflow-x-auto">
                <code>{`
function reverse(arr){
    let reversedArray = []
    for(let i=arr.length-1;i>=0;i--){
        let num = arr[i]
        let reverseNum = 0
        while(num>0){
            let remainder= num%10
            reverseNum = reverseNum*10+remainder
            num = Math.floor(num/10)
        }   
        reversedArray.push(reverseNum)
    }
    return reversedArray
}
console.log(reverse([123, 345, 876, 456]));`}</code>
              </pre>
            </ScrollArea>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-card border rounded-xl flex flex-col h-full">
          <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">📜 Submission Results</div>
          <div className="bg-secondary p-2 sm:p-3 rounded-md mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between text-[10px] sm:text-xs md:text-sm">
            <span className="text-green-400 mb-1 sm:mb-0">✅ Accepted</span>
            <span className="text-muted-foreground">Jan 05, 2025 12:39</span>
          </div>
          <div className="bg-muted p-2 sm:p-4 rounded-md text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 flex flex-col sm:flex-row justify-around gap-2">
            <p className="text-muted-foreground">⏱ Runtime: 102ms (Beats 34.83%)</p>
            <p className="text-muted-foreground">📦 Memory: 50.16MB (Beats 56.49%)</p>
          </div>
          <div className="h-36 sm:h-40 md:h-44 lg:h-52 bg-muted rounded-lg flex items-center justify-center flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={10} />
                <Tooltip wrapperStyle={{ fontSize: "10px" }} contentStyle={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
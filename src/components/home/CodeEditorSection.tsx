import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Runtime", value: 102 },
  { name: "Memory", value: 50.16 }
];

export default function CodeEditorSection() {
  return (
    <section className="py-12 px-4 bg-background text-foreground flex flex-col items-center">
      <div className="w-full max-w-6xl text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold">Every Problem Solved is a Step Forward</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">Challenge Yourself Today</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-card border rounded-xl  h-full flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Code className="w-4 h-4" /> Code Editor
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              Submit
            </Button>
          </div>
          <div className="bg-muted rounded-md overflow-hidden border border-border flex-1">
            <div className="bg-gray-800 text-gray-300 px-4 py-2 text-xs font-mono flex justify-between">
              <span>index.js</span>
              <span>🔴 🟡 🟢</span>
            </div>
            <ScrollArea className="h-72 md:h-80 bg-gray-800 text-gray-100 p-3 text-sm font-mono">
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

        <Card className="p-4 bg-card border rounded-xl  h-full flex flex-col">
          <div className="text-sm text-muted-foreground mb-3">📜 Submission Results</div>
          <div className="bg-secondary p-3 rounded-md mb-4 flex justify-between">
            <span className="text-green-400 text-sm">✅ Accepted</span>
            <span className="text-muted-foreground text-xs">Jan 05, 2025 12:39</span>
          </div>
          <div className="bg-muted p-4 rounded-md text-sm mb-4 flex justify-around">
            <p className="text-muted-foreground text-[10.5px]">⏱ Runtime: 102ms (Beats 34.83%)</p>
            <p className=" text-muted-foreground text-[10.5px]">📦 Memory: 50.16MB (Beats 56.49%)</p>
          </div>
          <div className="h-44 md:h-52 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip wrapperStyle={{ fontSize: "12px" }} contentStyle={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}

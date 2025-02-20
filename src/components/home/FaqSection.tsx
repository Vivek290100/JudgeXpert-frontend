import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    { question: "What is [JudgeXpert]?", answer: "A platform for developers to improve their coding skills through real-world challenges." },
    { question: "Who is this platform for?", answer: "Developers of all skill levels looking to enhance their programming abilities." },
    { question: "How do I participate in contests?", answer: "Sign up for an account and join our scheduled coding competitions." },
    { question: "What programming languages are supported?", answer: "We support multiple languages including JavaScript, Python, C++, and more." },
    { question: "Can I track my progress?", answer: "Yes, you can track your ranking and performance through our leaderboard system." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-6 bg-background text-foreground">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center">FAQ</h2>
        <p className="text-center text-muted-foreground mt-2">Got other questions? Reach out.</p>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card p-4 rounded-lg cursor-pointer border-2 flex flex-col"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{faq.question}</span>
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded-full">
                  {openIndex === index ? <ChevronDown size={18} /> : <Plus size={18} />}
                </div>
              </div>
              {openIndex === index && (
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

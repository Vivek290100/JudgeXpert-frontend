
// src/components/ContactSection.tsx
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section className="py-16 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Every Solution Counts</h2>
      <p className="text-muted-foreground mb-6">
        Register for an upcoming contest "Battle Victories"
      </p>
      <p className="text-muted-foreground mb-8">
        Where Dedication Meets Success
      </p>
      <Button size="lg" className="bg-primary text-primary-foreground">
        Contact Us
      </Button>
    </section>
  );
}
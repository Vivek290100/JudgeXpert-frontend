const testimonials = [
    {
      name: "Jaiden Lee",
      userName: "@buildjaiden",
      text: "Masters of Logic, Kings of Code Where Brilliance Meets Glory",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "shadcn",
      userName: "@shadcn",
      text: "Where Skills Shine Bright Among the Stars of Code",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "Ninjanordbo",
      userName: "@ninjanordbo",
      text: "Beyond Problems, Beyond Solutions Leading the Future of Code",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "James Q Quick",
      userName: "@jamesqquick",
      text: "This looks really freaking cool!!",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "soumyadotdev",
      userName: "@geekysrm",
      text: "Code with Purpose, Rise with Pride Join the Elite League",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "Kabir Asani",
      userName: "@KabirAsani",
      text: "Excellence Has a Leaderboard Make Your Mark Today",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "Wayne",
      userName: "@wayne_dev",
      text: "Be Part of Something Bigger",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "Mike Knapp",
      userName: "@mikeee",
      text: "Every Problem Solved is a Step Forward",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
    {
      name: "Paul Bratoslavsky",
      userName: "@codingthirty",
      text: "This is my new favorite way of building logical thinking",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=32&h=32",
    },
  ];
  
  export default function TestimonialsSection() {
    return (
      <section className="py-16 px-6 bg-forground-to-b from-forground">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center">What people are saying</h2>
          <p className="text-center text-gray-400 mt-2">
            Thousands of developers and teams love coding.
          </p>
  
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-forground p-6 rounded-lg border-2">
                <p className="mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.userName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
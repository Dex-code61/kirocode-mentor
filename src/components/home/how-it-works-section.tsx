const steps = [
  {
    number: 1,
    title: "Initial Assessment",
    description: "Our AI analyzes your level and learning style to create a personalized learning path"
  },
  {
    number: 2,
    title: "Adaptive Learning",
    description: "Code, receive instant feedback, and progress at your pace with content that adapts to you"
  },
  {
    number: 3,
    title: "Mastery & Certification",
    description: "Validate your skills on real projects and earn industry-recognized certifications"
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple 3-step process to transform your learning
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
       {/* Gradient Background */}
       <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/50 -z-10" />
       
       <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
             Ready to supercharge your workflow?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
             Join 10,000+ professionals using Docs4All to write grants, optimize resumes, and create content faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-xl hover:bg-primary/90 hover:scale-105 transition-all">
                Get Started for Free
             </button>
             <button className="h-14 px-8 rounded-full border border-input bg-background font-medium text-lg hover:bg-secondary transition-colors">
                Book a Demo
             </button>
          </div>
       </div>
    </section>
  );
};

export default CTA
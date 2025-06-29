
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Check, Link, Search, User, Users } from 'lucide-react';

const features = [
  {
    icon: <Award className="h-10 w-10 text-credverse-purple" />,
    title: "Verifiable Credentials",
    description: "Skills and achievements verified by trusted institutions, stored securely on the blockchain."
  },
  {
    icon: <Link className="h-10 w-10 text-credverse-teal" />,
    title: "Blockchain Powered",
    description: "Tamper-proof credentials using blockchain technology, ensuring trust and transparency."
  },
  {
    icon: <User className="h-10 w-10 text-credverse-purple" />,
    title: "Self-Sovereign Identity",
    description: "You own your data and control who can access your credentials and how they're used."
  },
  {
    icon: <Check className="h-10 w-10 text-credverse-teal" />,
    title: "Instant Verification",
    description: "Employers can instantly verify skills and credentials without contacting institutions."
  },
  {
    icon: <Search className="h-10 w-10 text-credverse-purple" />,
    title: "Skill Discovery",
    description: "Find talent with verified skills or discover learning opportunities based on market demand."
  },
  {
    icon: <Users className="h-10 w-10 text-credverse-teal" />,
    title: "Global Recognition",
    description: "Skills and credentials that are recognized across borders, industries, and institutions."
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Decentralized Skill Verification
          </h2>
          <p className="text-muted-foreground">
            CredVerse leverages blockchain technology to create a trusted ecosystem for skill verification,
            enabling individuals to showcase verified credentials and institutions to issue tamper-proof certifications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
              <CardHeader>
                <div className="rounded-full bg-secondary w-16 h-16 flex items-center justify-center mb-2">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/80">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

"use client";

import { Heart, Shield, Trophy, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMotionValue, animate, useInView } from "framer-motion";
import PageWrapper from "@/components/utils/pageWrapper";

const AnimatedNumber = ({ value, duration = 2, inView }) => {
  const motionValue = useMotionValue(0);
  const nodeRef = useRef();

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, { duration });
      return controls.stop;
    }
  }, [value, duration, motionValue, inView]);

  useEffect(() => {
    return motionValue.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = Math.floor(latest);
      }
    });
  }, [motionValue]);

  return <span ref={nodeRef}>0</span>;
};

const AboutPage = () => {
  const team = [
    {
      name: "Hamza Ishaq",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Passionate automotive entrepreneur with 15+ years in Pakistan's car industry. Leading the digital transformation of car buying across major Pakistani cities.",
    },
    {
      name: "Ahmed Hassan Khan",
      role: "Sales Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Expert in Pakistani automotive market with deep knowledge of local preferences, financing options, and customer needs across all price segments.",
    },
    {
      name: "Fatima Yousuf",
      role: "Customer Success Manager",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Dedicated to ensuring exceptional customer experiences throughout the car buying journey. Fluent in Urdu, English, and Punjabi to serve diverse Pakistani customers.",
    },
    {
      name: "Muhammad Bilal Mirza",
      role: "Operations Manager",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b812c8d5?w=300&h=300&fit=crop&crop=face",
      bio: "Oversees vehicle verification, documentation, and quality assurance. Ensures every car meets our stringent standards before listing on the platform.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Driven by Passion",
      description:
        "We’re not just selling cars we’re sharing a lifestyle. Our passion reflects in every detail.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Our customers are at the heart of everything we do. We listen, we care, we deliver.",
    },
    {
      icon: Trophy,
      title: "Commitment to Quality",
      description:
        "We deal in only trusted, verified vehicles no compromises on quality, ever.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description:
        "Honesty is our policy. No hidden charges, no games just clean deals, always.",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <PageWrapper className="bg-white flex flex-col">
      <section className="bg-background py-12 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="text-red-600">Our Showroom</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Pakistan's premier online automotive marketplace, connecting car buyers and sellers across Karachi, Lahore, Islamabad, and beyond. Your trusted partner for finding the perfect vehicle.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center" ref={ref}>
                <div className="text-3xl font-bold text-red-600 mb-2" ref={ref}>
                  <AnimatedNumber value={10} inView={isInView} />+
                </div>
                <div className="text-muted-foreground">Years in Karachi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  <AnimatedNumber value={300} inView={isInView} />+
                </div>
                <div className="text-muted-foreground">Cars Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  <AnimatedNumber value={10} inView={isInView} />k+
                </div>
                <div className="text-muted-foreground">Satisfied Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    2018 - Foundation
                  </h3>
                  <p className="text-muted-foreground">
                    Founded with a vision to digitize Pakistan's automotive market, starting with partnerships in Karachi's automotive hub.
                  </p>
                </div>
                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    2020 - Nationwide Expansion
                  </h3>
                  <p className="text-muted-foreground">
                    Expanded operations to Lahore, Islamabad, and Faisalabad. Introduced AI-powered car search and comprehensive financing solutions.
                  </p>
                </div>
                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    2022 - Digital Innovation
                  </h3>
                  <p className="text-muted-foreground">
                    Launched Pakistan's first image-based car search using AI, partnered with major banks for instant financing approvals.
                  </p>
                </div>
                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Today
                  </h3>
                  <p className="text-muted-foreground">
                    Pakistan's leading automotive marketplace with 500+ verified dealers, serving customers nationwide from Alto to luxury cars.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop"
                alt="Our Journey"
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real people. Real car lovers. Committed to helping you find your
              next ride.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-red-600 font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              What Drives Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These are the values we live by at our showroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <value.icon className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default AboutPage;

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Target, Rocket } from 'lucide-react';
import { useListTeamMembers } from '@workspace/api-client-react';

export default function About() {
  const { data: team = [] } = useListTeamMembers();

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-grid opacity-30 z-0"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Building the <span className="text-gradient">Future</span></h1>
          <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">
            FireboxTechStudios is a collective of engineers, designers, and strategists dedicated to pushing the boundaries of what's possible with technology.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-10 rounded-3xl"
            >
              <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">Our Mission</h2>
              <p className="text-foreground/70 text-lg leading-relaxed">
                To empower businesses globally by delivering robust, scalable, and innovative software solutions that drive growth and operational excellence. We don't just write code; we solve complex business problems.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel-glow p-10 rounded-3xl"
            >
              <div className="w-14 h-14 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <Rocket size={28} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">Our Vision</h2>
              <p className="text-foreground/70 text-lg leading-relaxed">
                To be the world's most trusted technology partner, known for pioneering AI integrations, bulletproof cybersecurity, and seamless digital experiences that shape tomorrow's digital landscape.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Core <span className="text-primary">Values</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Excellence', desc: 'We settle for nothing less than world-class quality in every line of code.' },
              { title: 'Innovation', desc: 'We embrace emerging technologies like AI and blockchain to stay ahead.' },
              { title: 'Integrity', desc: 'Transparent communication, secure systems, and honest partnerships.' },
              { title: 'Agility', desc: 'We adapt quickly to changing market demands and client needs.' }
            ].map((value, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted/40 flex items-center justify-center text-white mb-6">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Meet the <span className="text-secondary">Team</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">The brilliant minds behind our successful deliveries.</p>
          </div>

          {team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.id} className="group">
                  <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 bg-muted/40 border border-border">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <Users size={64} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-1">{member.name}</h3>
                  <p className="text-primary font-mono text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Our team section is being updated.</div>
          )}
        </div>
      </section>
    </div>
  );
}

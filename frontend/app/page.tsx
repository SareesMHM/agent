import Link from 'next/link';

export default function Landing() {
  return (
    <main className="min-h-screen bg-base text-slate antialiased overflow-x-hidden selection:bg-terracotta selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-soft bg-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage flex items-center justify-center shadow-sm text-white font-serif font-bold text-lg">A</div>
            <span className="font-serif font-bold text-xl tracking-tight text-plum">AgentForge</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-slate font-medium">
            <Link href="#features" className="hover:text-terracotta transition-colors">Platform</Link>
            <Link href="#pricing" className="hover:text-terracotta transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate hover:text-terracotta hidden sm:block transition-colors">Log in</Link>
            <Link href="/register" className="text-sm font-medium bg-slate text-white px-6 py-2.5 rounded-full hover:bg-plum transition-colors shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center px-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-soft bg-panel shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wide text-slate uppercase">Curation Engine Live</span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-[1.1] mb-6 text-plum">
                Spaces that feel <span className="italic text-sage">alive.</span><br />
                Teams that <span className="italic text-terracotta">deliver.</span>
              </h1>
              
              <p className="text-lg text-slate/80 max-w-lg mb-10 leading-relaxed">
                AgentForge AI transforms your project vision into a curated virtual company of specialized AI agents. Beautifully organized, ready to execute.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="bg-terracotta hover:bg-[#c9684a] text-white px-8 py-4 rounded-full font-medium transition-all shadow-soft hover:shadow-float">
                  Start your project
                </Link>
                <Link href="/login" className="border border-soft bg-panel hover:bg-soft/50 text-slate px-8 py-4 rounded-full font-medium transition-all shadow-sm">
                  Explore features
                </Link>
              </div>
            </div>

            {/* Right side UI Mockup */}
            <div className="relative hidden lg:flex justify-center items-center h-[600px]">
              <div className="absolute w-64 h-80 bg-sage/20 rounded-[2rem] transform rotate-6 translate-x-12 translate-y-8 blur-sm"></div>
              <div className="absolute w-64 h-80 bg-terracotta/20 rounded-[2rem] transform -rotate-3 -translate-x-12 -translate-y-8 blur-sm"></div>
              
              <div className="w-full max-w-md bg-panel border border-soft rounded-[2rem] shadow-float p-4 relative z-10">
                <div className="w-full h-48 bg-[#e8e4db] rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center group cursor-pointer">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Workspace" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                     <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                       <svg className="w-4 h-4 text-plum" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                     </div>
                   </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-plum">Coastal Analysis Pipeline</h3>
                    <p className="text-sm text-slate/60 mt-1">AI Project Manager • Active</p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-sage border-2 border-panel flex items-center justify-center text-xs text-white">A</div>
                    <div className="w-8 h-8 rounded-full bg-terracotta border-2 border-panel flex items-center justify-center text-xs text-white">B</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#e6ece5] rounded-xl p-3 flex flex-col justify-between h-20">
                    <span className="text-xs font-semibold text-sage uppercase tracking-wider">Design</span>
                    <span className="text-sm font-medium text-plum flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sage"></span> 3 Agents
                    </span>
                  </div>
                  <div className="bg-[#f6e8e3] rounded-xl p-3 flex flex-col justify-between h-20">
                    <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">Development</span>
                    <span className="text-sm font-medium text-plum flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span> Building
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION (Stacker Cards) */}
        <section id="features" className="relative bg-white py-24 px-6 border-t border-soft">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4 text-plum">A curated approach to building.</h2>
              <p className="text-slate/70 text-lg">Every element is perfectly placed. Human in control, AI doing the heavy lifting.</p>
            </div>

            <div className="relative space-y-8 pb-32 max-w-4xl mx-auto">
              
              {/* Card 1 */}
              <div className="sticky top-32 bg-base border border-soft rounded-[2rem] p-8 md:p-10 shadow-soft flex flex-col md:flex-row gap-8 items-center group hover:shadow-float transition-all duration-500">
                <div className="w-24 h-24 rounded-2xl bg-sage/10 flex items-center justify-center shrink-0 border border-sage/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-sage/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <svg className="w-12 h-12 text-sage relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sage font-semibold text-sm mb-2 tracking-wide uppercase">Phase 01</div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-plum">Describe your vision</h3>
                  <p className="text-slate/70 leading-relaxed">
                    Write it in plain language; our AI extracts requirements, technologies, phases and deliverables.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="sticky top-36 bg-base border border-soft rounded-[2rem] p-8 md:p-10 shadow-soft flex flex-col md:flex-row gap-8 items-center group hover:shadow-float transition-all duration-500">
                <div className="w-24 h-24 rounded-2xl bg-terracotta/10 flex items-center justify-center shrink-0 border border-terracotta/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-terracotta/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <svg className="w-12 h-12 text-terracotta relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-terracotta font-semibold text-sm mb-2 tracking-wide uppercase">Phase 02</div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-plum">Curate your AI team</h3>
                  <p className="text-slate/70 leading-relaxed">
                    Departments and professional roles are created for you. Review, edit and approve.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="sticky top-40 bg-base border border-soft rounded-[2rem] p-8 md:p-10 shadow-soft flex flex-col md:flex-row gap-8 items-center group hover:shadow-float transition-all duration-500">
                <div className="w-24 h-24 rounded-2xl bg-plum/10 flex items-center justify-center shrink-0 border border-plum/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-plum/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <svg className="w-12 h-12 text-plum relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-plum font-semibold text-sm mb-2 tracking-wide uppercase">Phase 03</div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-plum">Autonomous execution</h3>
                  <p className="text-slate/70 leading-relaxed">
                    Roadmap, task breakdown, dependencies and assignment — handled automatically.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="sticky top-44 bg-slate text-base rounded-[2rem] p-8 md:p-10 shadow-float flex flex-col md:flex-row gap-8 items-center group">
                <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <svg className="w-12 h-12 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-base/70 font-semibold text-sm mb-2 tracking-wide uppercase">Phase 04</div>
                  <h3 className="text-2xl font-serif font-semibold mb-3">Human in control</h3>
                  <p className="text-base/80 leading-relaxed">
                    Approval checkpoints, tool permissions, audit logs and tenant isolation.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="bg-base py-24 px-6 border-t border-soft">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4 text-plum">Simple, elegant pricing.</h2>
              <p className="text-slate/70 text-lg">Start free, scale as you grow. Every plan includes core AI team capabilities.</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              
              {/* Free */}
              <div className="bg-panel border border-soft rounded-[1.5rem] p-6 flex flex-col hover:shadow-soft transition-shadow">
                <h3 className="text-lg font-semibold mb-1 text-plum">Free</h3>
                <p className="text-slate/60 text-xs mb-6">Individuals</p>
                <div className="mb-6">
                  <span className="text-3xl font-serif font-bold text-plum">$0</span>
                  <span className="text-slate/50 text-sm">/mo</span>
                </div>
                <ul className="space-y-3 text-sm text-slate/80 mb-8 flex-1">
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> 1 Project</li>
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> 3 AI Agents</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl border border-soft text-sm font-medium hover:bg-soft/50 transition-colors text-slate">Get Started</button>
              </div>

              {/* Starter */}
              <div className="bg-panel border border-soft rounded-[1.5rem] p-6 flex flex-col hover:shadow-soft transition-shadow">
                <h3 className="text-lg font-semibold mb-1 text-plum">Starter</h3>
                <p className="text-slate/60 text-xs mb-6">Freelancers</p>
                <div className="mb-6">
                  <span className="text-3xl font-serif font-bold text-plum">$29</span>
                  <span className="text-slate/50 text-sm">/mo</span>
                </div>
                <ul className="space-y-3 text-sm text-slate/80 mb-8 flex-1">
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> 5 Projects</li>
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> 10 AI Agents</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl border border-soft text-sm font-medium hover:bg-soft/50 transition-colors text-slate">Start Trial</button>
              </div>

              {/* Professional */}
              <div className="bg-terracotta rounded-[1.5rem] p-6 flex flex-col relative shadow-float transform md:-translate-y-2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-plum text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Popular</div>
                <h3 className="text-lg font-semibold mb-1 text-white">Professional</h3>
                <p className="text-white/70 text-xs mb-6">Developers</p>
                <div className="mb-6">
                  <span className="text-4xl font-serif font-bold text-white">$99</span>
                  <span className="text-white/60 text-sm">/mo</span>
                </div>
                <ul className="space-y-3 text-sm text-white/90 mb-8 flex-1">
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-white mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Unlimited Projects</li>
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-white mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Unlimited Agents</li>
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-white mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Advanced Roles</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl bg-white text-terracotta text-sm font-bold shadow-sm hover:bg-base transition-colors">Go Pro</button>
              </div>

              {/* Business */}
              <div className="bg-panel border border-soft rounded-[1.5rem] p-6 flex flex-col hover:shadow-soft transition-shadow">
                <h3 className="text-lg font-semibold mb-1 text-plum">Business</h3>
                <p className="text-slate/60 text-xs mb-6">Small teams</p>
                <div className="mb-6">
                  <span className="text-3xl font-serif font-bold text-plum">$299</span>
                  <span className="text-slate/50 text-sm">/mo</span>
                </div>
                <ul className="space-y-3 text-sm text-slate/80 mb-8 flex-1">
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Everything in Pro</li>
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Tenant Isolation</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl border border-soft text-sm font-medium hover:bg-soft/50 transition-colors text-slate">Contact Sales</button>
              </div>
              
              {/* Enterprise */}
              <div className="bg-panel border border-soft rounded-[1.5rem] p-6 flex flex-col hover:shadow-soft transition-shadow">
                <h3 className="text-lg font-semibold mb-1 text-plum">Enterprise</h3>
                <p className="text-slate/60 text-xs mb-6">Organizations</p>
                <div className="mb-6">
                  <span className="text-3xl font-serif font-bold text-plum">Custom</span>
                </div>
                <ul className="space-y-3 text-sm text-slate/80 mb-8 flex-1">
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Unlimited scale</li>
                  <li className="flex items-start gap-2"><svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> SLA & Support</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl border border-soft text-sm font-medium hover:bg-soft/50 transition-colors text-slate">Contact Us</button>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-panel border-t border-soft py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center font-serif font-bold text-white shadow-sm">A</div>
              <span className="font-serif font-bold text-lg text-plum">AgentForge</span>
            </div>
            <div className="flex gap-8 text-sm text-slate/60 font-medium">
              <Link href="#" className="hover:text-terracotta transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-terracotta transition-colors">Terms</Link>
              <Link href="#" className="hover:text-terracotta transition-colors">Security</Link>
            </div>
            <p className="text-slate/40 text-sm">© 2025 AgentForge AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
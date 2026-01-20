"use client";

import Link from "next/link";
import {
  ArrowRight,
  QrCode,
  Wallet,
  BadgeCheck,
  ShoppingBag,
  Coffee,
  Store,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--brand-dark)]">
      {/* Soft gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 right-[-120px] h-[520px] w-[520px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.28),transparent_60%)]" />
        <div className="absolute -top-20 left-[-160px] h-[520px] w-[520px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(circle_at_center,rgba(91,63,255,0.22),transparent_60%)]" />
        <div className="absolute bottom-[-220px] right-[10%] h-[560px] w-[560px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_60%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-6xl px-6 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[var(--brand-dark)]" />
            <span className="font-semibold tracking-tight">Artemis Pay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-black/60">
            <a href="#how" className="hover:text-black">
              How it works
            </a>
            <a href="#usecases" className="hover:text-black">
              Use cases
            </a>
            <a href="#faq" className="hover:text-black">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              className="text-sm text-black/60 hover:text-black px-2 py-2"
              href="/merchant/onboarding"
            >
              Log in
            </Link>

            {/* ✅ buffer + brand color */}
            <Link href="/merchant/onboarding" className="pr-1">
              <Button
                className="rounded-full px-5 py-2.5 shadow-sm"
                style={{ backgroundColor: "var(--brand-primary)", color: "white" }}
              >
                Sign up <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6 md:px-8">
        <section className="pt-16 md:pt-20 pb-10 md:pb-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]" />
                Accept stablecoin payments globally
              </div>

              <h1 className="mt-5 text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
                Simple checkout.
                <br />
                Instant settlement.
              </h1>

              <p className="mt-4 text-lg text-black/60 max-w-xl">
                Create a QR or link. Customers pay with their wallet. You get paid directly to yours.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/merchant/onboarding">
                  <Button
                    className="h-12 w-full sm:w-auto rounded-full px-6 font-semibold shadow-sm"
                    style={{ backgroundColor: "var(--brand-accent)", color: "white" }}
                  >
                    Start accepting payments
                  </Button>
                </Link>

                {/* <Link href="/m/demo" className="w-full sm:w-auto">
                  <Button
                    className="h-12 w-full sm:w-auto rounded-full px-6 bg-white border border-black/10 text-[var(--brand-dark)] hover:bg-[var(--brand-soft)]"
                  >
                    View live demo
                  </Button>
                </Link> */}
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-black/60">
                <span className="rounded-full border border-black/10 bg-white px-3 py-1">No SDK</span>
                <span className="rounded-full border border-black/10 bg-white px-3 py-1">Non-custodial</span>
                <span className="rounded-full border border-black/10 bg-white px-3 py-1">Mobile-first</span>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 blur-2xl opacity-50 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.28),transparent_60%)]" />
              <div className="rounded-3xl border border-black/5 bg-white/70 backdrop-blur p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Live checkout</div>
                  <div className="text-xs text-black/50">Demo</div>
                </div>

                <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5">
                  <div className="text-xs text-black/50">Amount</div>
                  <div className="mt-1 text-3xl font-semibold tracking-tight">12.50</div>
                  <div className="mt-1 text-xs text-black/50">Stablecoin</div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-sm text-black/70">
                      <QrCode className="h-4 w-4 text-[var(--brand-secondary)]" />
                      QR ready
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-black/70">
                      <BadgeCheck className="h-4 w-4 text-[var(--brand-success)]" />
                      Settle
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-black/5 bg-white p-4">
                    <div className="text-xs text-black/50">Create</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                      <QrCode className="h-4 w-4 text-[var(--brand-secondary)]" />
                      QR / Link
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-white p-4">
                    <div className="text-xs text-black/50">Collect</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                      <Wallet className="h-4 w-4 text-[var(--brand-secondary)]" />
                      Wallet pay
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-white p-4">
                    <div className="text-xs text-black/50">Settle</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                      <BadgeCheck className="h-4 w-4 text-[var(--brand-success)]" />
                      Instant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-10 md:py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Start accepting payments globally , powered by stablecoin
              </h2>
              <p className="mt-2 text-black/60 max-w-2xl">
                Get started in minutes. No integrations, no custody, no complexity.
              </p>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <FeatureCard
              title="Create"
              icon={<QrCode className="h-4 w-4 text-[var(--brand-secondary)]" />}
              desc="Generate a QR or payment link."
            />
            <FeatureCard
              title="Collect"
              icon={<Wallet className="h-4 w-4 text-[var(--brand-secondary)]" />}
              desc="Customers pay with their wallet."
            />
            <FeatureCard
              title="Settle"
              icon={<BadgeCheck className="h-4 w-4 text-[var(--brand-success)]" />}
              desc="Funds land in your wallet instantly."
            />
          </div>
        </section>

        {/* Use cases */}
        <section id="usecases" className="py-10 md:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Built for commerce</h2>
          <p className="mt-2 text-black/60">Online, in-person, or anywhere in between.</p>

          <div className="mt-6 grid md:grid-cols-4 gap-4">
            <UseCaseCard
              title="Online stores"
              icon={<ShoppingBag className="h-4 w-4 text-[var(--brand-primary)]" />}
              desc="Share a checkout link."
            />
            <UseCaseCard
              title="Cafes"
              icon={<Coffee className="h-4 w-4 text-[var(--brand-primary)]" />}
              desc="Display a store QR."
            />
            <UseCaseCard
              title="Pop-ups"
              icon={<Store className="h-4 w-4 text-[var(--brand-primary)]" />}
              desc="Mobile-first checkout."
            />
            <UseCaseCard
              title="Freelancers"
              icon={<Briefcase className="h-4 w-4 text-[var(--brand-primary)]" />}
              desc="Get paid globally in minutes."
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-10 md:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <FAQ
              q="Do I need to integrate an SDK?"
              a="No. Create a QR or link and start collecting payments."
            />
            <FAQ
              q="Do you custody funds?"
              a="No. Funds settle directly to the wallet you connect."
            />
            <FAQ
              q="Can customers use their existing wallet?"
              a="Yes. They scan and pay with their preferred wallet."
            />
            <FAQ
              q="Can I test it first?"
              a="Yes. Click “View live demo” to open a sample Store QR flow."
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-16 md:pb-20">
          <div className="rounded-3xl border border-black/5 bg-[var(--brand-soft)] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-sm text-black/60">Ready to go live?</div>
              <div className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
                Start accepting stablecoin payments today.
              </div>
            </div>
            <Link href="/merchant/onboarding">
              <Button
                className="h-12 rounded-full px-6 font-semibold shadow-sm"
                style={{ backgroundColor: "var(--brand-primary)", color: "white" }}
              >
                Sign up <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 pb-6 text-sm text-black/50">
            © {new Date().getFullYear()} Artemis Pay. All rights reserved.
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <div className="mt-2 text-sm text-black/60">{desc}</div>
    </div>
  );
}

function UseCaseCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex items-center gap-2 font-semibold">
        {icon}
        {title}
      </div>
      <div className="mt-2 text-sm text-black/60">{desc}</div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="font-semibold">{q}</div>
      <div className="mt-2 text-sm text-black/60">{a}</div>
    </div>
  );
}
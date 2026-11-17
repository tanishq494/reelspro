import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  LayoutTemplate,
  Play,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-generated short videos",
    description:
      "Turn a simple idea into an engaging short video with AI-powered scripts, visuals, voiceovers, and captions.",
  },
  {
    icon: WandSparkles,
    title: "User-friendly interface",
    description:
      "Create polished content in a few simple steps, without needing editing experience or complicated software.",
  },
  {
    icon: LayoutTemplate,
    title: "Customizable templates",
    description:
      "Choose a visual style that fits your story and make every video feel uniquely yours.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="rounded-lg bg-violet-600 p-2">
              <Clapperboard className="h-5 w-5" aria-hidden="true" />
            </span>
            AI Reels Pro
          </Link>
          <nav className="flex items-center gap-3" aria-label="Account navigation">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-100"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Create more. Edit less.
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">
            Bring your ideas to life with{" "}
            <span className="text-violet-400">AI Reels Pro</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Create captivating short videos from your ideas in minutes. AI
            Reels Pro helps you generate scripts, visuals, narration, and
            captions so you can share stories that stand out.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500"
            >
              Get started free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-slate-200 transition hover:border-violet-400 hover:text-white"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Log in
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-violet-950/40">
          <Image
            src="/home.png"
            alt="AI Reels Pro video creation workspace"
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Everything you need
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From idea to reel, effortlessly
            </h2>
            <p className="mt-4 text-slate-400">
              Spend less time on production and more time connecting with your
              audience.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-6"
              >
                <div className="mb-5 inline-flex rounded-xl bg-violet-500/15 p-3 text-violet-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} AI Reels Pro. All rights reserved.</p>
        <div className="flex gap-5">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            YouTube
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            X / Twitter
          </a>
        </div>
      </footer>
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

const pic = (s, w = 600, h = 400) =>
  `https://picsum.photos/seed/${s}/${w}/${h}`;
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const COURSES = [
  [
    "Crisis management and problem-solving strategies",
    "Management",
    "4.88",
    "210",
    6,
    "8k",
    0,
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/6710c8cf232065a7046261dc_Course%20Image-7-p-800.webp",
  ],
  [
    "Advanced photoshop techniques for designers",
    "Design",
    "5.00",
    "1.2K",
    8,
    "25k",
    0,
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/6710bcf4976ba1d072d8b476_Course%20Image-4-2-p-800.webp",
  ],
  [
    "Operations management and process improvement",
    "Finance",
    "5.00",
    "812",
    12,
    "23k",
    0,
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66eb9e25c4d132b7abc4dcb2_Course%20Small%20Image-8-p-800.webp",
  ],

  [
    "Database integration with MongoDB",
    "Development",
    "4.49",
    "756",
    10,
    "7k",
    59,
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66eb9e1184c0c12d2244968d_Course%20Small%20Image-9-p-800.webp",
  ],
  [
    "Risk management and business continuity",
    "Management",
    "4.88",
    "210",
    3,
    "8k",
    49,
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66eb9e363f6e47ec5245cf09_Course%20Small%20Image-7-p-800.webp",
  ],
  [
    "Full-stack development with the MERN stack",
    "Development",
    "5.00",
    "985",
    12,
    "22k",
    72,
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66eb9e61096e930736b651e4_Course%20Small%20Image-5-p-800.webp",
  ],
].map(([title, cat, rating, reviews, lessons, enrolled, price, image]) => ({
  title,
  cat,
  rating,
  reviews,
  lessons,
  enrolled,
  price,
  image,
  slug: slug(title),
}));

const cl = (c) => [c.title, `/course/${c.slug}`];
const NAV = [
  {
    label: "Home",
    cols: [
      {
        links: [
          ["Home One", "/home-one"],
          ["Home Two", "/home-two"],
          ["Home Three", "/home-three"],
        ],
      },
    ],
  },
  {
    label: "Courses",
    cols: [
      { title: "Free", links: COURSES.filter((c) => !c.price).map(cl) },
      { title: "Paid", links: COURSES.filter((c) => c.price).map(cl) },
    ],
  },
  {
    label: "Pages",
    cols: [
      {
        links: [
          ["About One", "/about-one"],
          ["About Two", "/about-two"],
          ["Course One", "/course-one"],
          ["Course Two", "/course-two"],
          ["Course Three", "/course-three"],
          ["FAQ", "/faq"],
          ["Pricing One", "/pricing-one"],
          ["Pricing Two", "/pricing-two"],
          ["Pricing Three", "/pricing-three"],
          ["Career", "/career"],
          ["Events", "/events"],
          ["Team", "/team"],
        ],
      },
    ],
  },
  {
    label: "Blog",
    cols: [
      {
        links: [
          ["Blog One", "/blog-one"],
          ["Blog Two", "/blog-two"],
          ["Blog Three", "/blog-three"],
        ],
      },
    ],
  },
  {
    label: "Contact",
    cols: [
      {
        links: [
          ["Contact One", "/contact-one"],
          ["Contact Two", "/contact-two"],
          ["Contact Three", "/contact-three"],
        ],
      },
    ],
  },
];

/* ---------- hooks / helpers ---------- */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          o.disconnect();
        }
      },
      { threshold },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({
  children,
  delay = 0,
  className = "",
  from = "translate-y-8",
}) {
  const [ref, seen] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${seen ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${from}`} ${className}`}
    >
      {children}
    </div>
  );
}

function Counter({ to, suffix = "", duration = 2000 }) {
  const [ref, seen] = useInView(0);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf;
    let start = null;
    const step = (now) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return (
    <span ref={ref} className="inline-block tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

const Star = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" className="fill-sun">
    <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15.1 4.7 18l1.1-6L1.4 7.8l6-.8z" />
  </svg>
);
const Arrow = ({ className = "" }) => (
  <span
    className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45 ${className}`}
  >
    →
  </span>
);
const Btn = ({ to, children, dark }) => (
  <Link
    to={to}
    className={`group inline-flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-semibold transition hover:shadow-lg ${dark ? "bg-white text-ink" : "bg-ink text-white"}`}
  >
    {children}
    <Arrow />
  </Link>
);
const Eyebrow = ({ children }) => (
  <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand">
    {children}
  </span>
);

/* ---------- navbar ---------- */
const Chev = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 20 20"
    className="transition-transform group-hover:rotate-180"
  >
    <path
      d="M4 7l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-300 ${scrolled || open ? "bg-chalk/95 shadow-lg backdrop-blur" : ""}`}
    >
      <div
        className={`mx-auto flex max-w-[1800px] items-center justify-between px-6 transition-all ${scrolled ? "h-16" : "h-20"}`}
      >
        <Link to="/home-one">
          <img
            src="https://cdn.prod.website-files.com/668cb7adec02e140422345de/66c6fb8bf82fe9cef5f78d65_Elearna.svg"
            alt="Logo"
            className=" w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.filter((m) => m.label !== "Contact" || true).map((m) => (
            <div key={m.label} className="group relative">
              <button className="flex items-center gap-2 py-5 text-base font-medium transition hover:text-sun">
                {m.label}
                <Chev />
              </button>
              <div className="invisible absolute left-1/2 top-full -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div
                  className={`flex gap-8 rounded-2xl bg-white p-5 text-ink shadow-2xl ${m.cols.length > 1 ? "w-[560px]" : "w-56"}`}
                >
                  {m.cols.map((c, i) => (
                    <div key={i} className="flex-1">
                      {c.title && (
                        <p className="mb-2 text-sm font-bold text-brand">
                          {c.title}
                        </p>
                      )}
                      {c.links.map(([l, to]) => (
                        <Link
                          key={to}
                          to={to}
                          className="block rounded-lg px-3 py-1.5 text-sm transition hover:translate-x-1 hover:bg-soft hover:text-brand"
                        >
                          {l}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <button
            className="relative transition hover:text-sun"
            aria-label="Cart"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M5 8h14l-1 12H6L5 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sun text-xs font-semibold text-chalk">
              0
            </span>
          </button>
          <div className="flex items-center text-base font-medium">
            <Link to="/login" className="pr-4 transition hover:text-sun">
              Login
            </Link>
            <i className="h-5 w-px bg-white/40" />
            <Link to="/sign-up" className="pl-4 transition hover:text-sun">
              Register
            </Link>
          </div>
        </div>

        <button
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <i
            className={`h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <i
            className={`h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`}
          />
          <i
            className={`h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        className={`overflow-y-auto px-6 transition-all duration-500 lg:hidden ${open ? "max-h-[80vh] pb-6" : "max-h-0"}`}
      >
        {NAV.map((m) => (
          <div key={m.label} className="border-b border-white/10">
            <button
              className="flex w-full justify-between py-3 text-lg font-medium"
              onClick={() => setSub(sub === m.label ? null : m.label)}
            >
              {m.label}
              <span
                className={`transition ${sub === m.label ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {sub === m.label && (
              <div className="animate-pop pb-3 pl-3">
                {m.cols
                  .flatMap((c) => c.links)
                  .map(([l, to]) => (
                    <Link
                      key={to}
                      to={to}
                      className="block py-1.5 text-sm text-white/70"
                    >
                      {l}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex gap-6 pt-4 text-lg">
          <Link to="/login">Login</Link>
          <Link to="/sign-up">Register</Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- home sections ---------- */
function Hero() {
  const logos = ["Northwind", "Lumen", "Orbit", "Vertex", "Helio", "Atlas"];
  return (
    <section className="relative overflow-hidden bg-chalk text-white">
      {/* faint chalk doodles */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-10 h-72 w-72 opacity-[.07]"
      >
        <div className="absolute inset-0 rounded-[50%] border-2 border-white [transform:rotate(30deg)_scaleY(.35)]" />
        <div className="absolute inset-0 rounded-[50%] border-2 border-white [transform:rotate(-30deg)_scaleY(.35)]" />
        <div className="absolute inset-0 rounded-[50%] border-2 border-white [transform:rotate(90deg)_scaleY(.35)]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:26px_26px]"
      />

      <div className="relative mx-auto grid min-h-[130vh] max-w-[1500px] items-end gap-6 pt-20 lg:grid-cols-[1.05fr_1fr]">
        {/* left: photo composition */}
        <Reveal
          from="-translate-x-10"
          className="relative mx-auto min-h-[100vh] w-full max-w-[520px] self-end sm:h-[440px] lg:h-[62vh] lg:max-h-[500px]"
        >
          <div className="absolute bottom-0 left-[28%] h-[62%] w-[52%] rounded-t-[200px] bg-deep" />
          <div className="absolute bottom-0 left-[4%] h-[52%] w-[50%] rounded-tr-[100%] bg-gradient-to-t from-sun/90 to-sun/40" />
          <img
            src="https://cdn.prod.website-files.com/668cb7adec02e140422345de/66c6fb8ca55c188e59cf91d8_Banner%20Girl-p-1080.webp"
            alt="Smiling student"
            className="absolute bottom-0 left-[12%] h-[100%] w-[90%] rounded-t-[3rem] object-cover object-top [mask-image:linear-gradient(#000_80%,transparent)]"
          />
          <div className="absolute left-[4%] top-[34%] h-10 w-10 rounded-full border-[9px] border-brand animate-float" />
          <div className="absolute left-[10%] top-[50%] h-3.5 w-3.5 rounded-full bg-sun animate-float [animation-delay:1s]" />
          <div className="absolute right-[2%] top-[76%] h-6 w-6 rounded-full bg-sun animate-float [animation-delay:2s]" />
          <div className="absolute bottom-6 left-0 flex animate-float items-center gap-3 rounded-xl bg-soft px-4 py-3 text-chalk shadow-xl">
            <svg
              width="44"
              height="44"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6h40v28H24l-8 10v-10H6z" />
              <path d="M14 16h24M14 23h16" />
              <path
                d="M42 30l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"
                fill="#eef6f1"
              />
            </svg>
            <div>
              <p className="text-2xl font-medium leading-none">125+</p>
              <p className="mt-1 text-base">Achievement awards</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-[36%] rounded-t-[2.5rem] bg-deep px-7 pb-4 pt-5 text-center">
            <p className="text-sm text-white/50">Trusted By</p>
            <p className="mt-1 text-lg font-medium">15000+ enrolled students</p>
            <div className="mt-3 flex justify-center -space-x-3">
              {[1, 2, 3, 4].map((n) => (
                <img
                  key={n}
                  src={pic("av" + n, 60, 60)}
                  alt=""
                  className="h-7 w-7 rounded-full border-2 border-deep object-cover"
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* right: copy */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <Reveal>
            <p className="text-base font-medium uppercase tracking-wide">
              Online learning
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-4 text-2xl font-semibold leading-[1.1] sm:text-5xl xl:text-6xl">
              More then <span className="text-sun">25000+</span> education
              courses online
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/90">
              Lorem ipsum dolor sit amet consectetur. Gravida enim risus
              sollicitudin mauris tincidunt commodo ornare.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Link
              to="/contact-one"
              className="mt-8 inline-block rounded-md border border-white/10 bg-deep px-10 py-3.5 text-base font-medium transition duration-300 hover:-translate-y-1 hover:bg-sun hover:text-chalk hover:shadow-xl"
            >
              Get Started
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-slate-200 bg-#eff6f8 py-14">
        <p className="mb-8 text-center text-base text-slate-500">
          Learn from 350+ leading universities and companies with us
        </p>
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-20 whitespace-nowrap">
            {[...logos, ...logos, ...logos, ...logos].map((l, i) => (
              <span key={i} className="text-3xl font-semibold text-slate-400">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const cats = [
    ["🎨", "Creative web design", 8],
    ["💰", "Finance accounting", 10],
    ["💻", "IT and software", 5],
    ["📣", "Digital marketing", 4],
    ["🌐", "Web development", 8],
    ["✍️", "Content writing", 3],
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <Eyebrow>Top Categories</Eyebrow>
        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          Discover leading categories to elevate your journey
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map(([i, t, n], k) => (
          <Reveal key={t} delay={k * 80}>
            <Link
              to="/course-one"
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-soft text-2xl transition group-hover:rotate-12 group-hover:bg-sun">
                {i}
              </span>
              <div>
                <p className="font-bold">{t}</p>
                <p className="text-sm text-slate-500">{n} Courses</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-14 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-ink p-8 text-white md:grid-cols-2 md:p-12">
        <div>
          <p className="text-2xl font-bold sm:text-3xl">
            Quick access to the popular courses
          </p>
          <div className="mt-6">
            <Btn to="/course-one" dark>
              View Courses
            </Btn>
          </div>
        </div>
        <div className="relative">
          <video
            autoPlay
            loop
            playsInline
            src="https://cdn.prod.website-files.com/668cb7adec02e140422345de%2F66c86567624ca9dec83f55cc_Home%20One%20Video-transcode.mp4"
            alt=""
            className="aspect-[16/10] w-full rounded-2xl object-cover"
          />
          <div className="absolute -bottom-4 left-4 flex animate-float items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-ink">
            <b className="text-sm">Develop your skills online!</b>
            <Link
              to="https://cdn.prod.website-files.com/668cb7adec02e140422345de%2F66c86567624ca9dec83f55cc_Home%20One%20Video-transcode.mp4"
              className="rounded-full bg-sun px-4 py-2 text-xs font-bold"
            >
              Apply now
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function CourseCard({ c, i }) {
  return (
    <Reveal delay={(i % 3) * 100}>
      <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl">
        <Link to={`/course/${c.slug}`} className="block overflow-hidden">
          {/* <img
            src={pic(c.slug, 520, 320)}
            alt={c.title}
            className="aspect-[13/8] w-full object-cover transition duration-500 group-hover:scale-110"
          /> */}

          <img
            src={c.image || pic(c.slug, 520, 320)}
            alt={c.title}
            className="..."
          />
        </Link>

        <div className="p-5">
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">
            {c.cat}
          </span>
          <h3 className="mt-3 min-h-[3.5rem] text-lg font-bold leading-snug">
            {c.title}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <Star />
            <b>{c.rating}</b>
            <span className="text-slate-500">({c.reviews})</span>
          </div>
          <div className="mt-3 flex gap-5 text-sm text-slate-500">
            <span>📚 {c.lessons} Lessons</span>
            <span>👤 {c.enrolled} Enrolled</span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <Link
              to={`/course/${c.slug}`}
              className="text-sm font-bold transition hover:text-brand"
            >
              Course Details
            </Link>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${c.price ? "bg-sun" : "bg-brand text-white"}`}
            >
              {c.price ? `$${c.price}` : "Free"}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TopCourses() {
  const tabs = [
    "All courses",
    "Design",
    "Development",
    "Management",
    "Finance",
  ];
  const [tab, setTab] = useState(tabs[0]);
  const list = tab === tabs[0] ? COURSES : COURSES.filter((c) => c.cat === tab);
  return (
    <section className="bg-soft py-20">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="text-center">
          <Eyebrow>Online learning</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Top online courses
          </h2>
        </Reveal>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === t ? "bg-ink text-white" : "bg-white hover:bg-sun"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div
          key={tab}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((c, i) => (
            <CourseCard key={c.slug} c={c} i={i} />
          ))}
        </div>
        <p className="mt-12 text-center text-slate-600">
          We assist you in finding the ideal tutor at no cost.{" "}
          <Link to="/course-one" className="font-bold text-brand underline">
            Browse all available courses
          </Link>
        </p>
      </div>
    </section>
  );
}

function Offer() {
  const items = [
    "Skill-based instruction",
    "Analytics and insights",
    "Global certification",
    "Customizable courses",
  ];
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2">
      <Reveal from="-translate-x-10" className="relative">
        <img
          src="https://cdn.prod.website-files.com/668cb7adec02e140422345de/66c6fb8b45a3029806674bb6_Woman%20Image%20Holding%20Copy-p-500.webp"
          alt=""
          className="w-3/5 rounded-3xl object-cover"
        />
        <img
          src="https://cdn.prod.website-files.com/668cb7adec02e140422345de/66c6fb8bbdff100351a1e011_Man%20Image%20Holding%20Graph.webp"
          alt=""
          className="absolute bottom-0 right-0 w-1/2 rounded-3xl border-8 border-white object-cover"
        />
        <div className="absolute left-4 top-4 animate-float rounded-2xl bg-sun p-4 text-center shadow-lg">
          <b className="block text-2xl">500+</b>
          <span className="text-xs">Free courses</span>
        </div>
      </Reveal>
      <div>
        <Reveal>
          <Eyebrow>What we offer</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Personalized learning for your ambitions
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-4 text-slate-600">
            Lorem ipsum dolor sit amet consectetur. Pellentesque id quam mauris
            mus. Vitae diam dolor lacus amet integer ut.
          </p>
        </Reveal>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((t, i) => (
            <Reveal key={t} delay={150 + i * 80}>
              <li className="flex items-center gap-3 font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs text-white">
                  ✓
                </span>
                {t}
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal
          delay={500}
          className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-soft p-5"
        >
          <div>
            <p className="font-bold">Still have questions?</p>
            <p className="text-sm text-slate-600">
              Lorem ipsum dolor sit amet conse ipsum blandit etiam aliquam.
            </p>
          </div>
          <Btn to="/contact-two">Get Started</Btn>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const T = [
    [
      "Linda Grady",
      "Co-assistant manager",
      "Lorem ipsum dolor sit amet consectetur. Adipiscing eget risus tempus facilisis scelerisque vitae consectetur vitae. Amet faucibus venenatis donec mattis.",
      "linda",
    ],
    [
      "Jim Adams",
      "Designer",
      "Lorem ipsum dolor sit amet consectetur. Molestie faucibus nibh felis tempor vel aliquet cursus placerat duis. Est felis pulvinar tortor ut nibh montes.",
      "jim",
    ],
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % T.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="bg-ink py-20 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
        <div>
          <Reveal>
            <Eyebrow>Our testimonials</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Trusted by our successful students
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-6">
            <Reveal>
              <p className="text-5xl font-extrabold text-sun">
                <Counter to={15} suffix="M" />
              </p>
              <p className="mt-1 text-white/70">Successful students</p>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-5xl font-extrabold text-sun">
                <Counter to={120} suffix="K" />
              </p>
              <p className="mt-1 text-white/70">Global job placements</p>
            </Reveal>
          </div>
        </div>
        <Reveal from="translate-x-10">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${i * 100}%)` }}
            >
              {T.map(([n, r, q, s]) => (
                <figure
                  key={n}
                  className="w-full shrink-0 rounded-3xl bg-white/5 p-8"
                >
                  <blockquote className="text-lg leading-relaxed">
                    “{q}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-4">
                    <img
                      src={pic(s, 80, 80)}
                      alt={n}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <b>{n}</b>
                      <p className="text-sm text-white/60">{r}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            {["←", "→"].map((a, k) => (
              <button
                key={a}
                onClick={() => setI((i + (k ? 1 : T.length - 1)) % T.length)}
                className="h-11 w-11 rounded-full bg-sun font-bold text-ink transition hover:scale-110"
              >
                {a}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function Trending() {
  const pts = [
    "Lorem ipsum dolor sit amet consectetur",
    "Lorem ipsum dolor",
    "Lorem ipsum dolor sit",
  ];
  const list = [
    {
      ...COURSES[4],
      image:
        "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66eb9e61096e930736b651e4_Course%20Small%20Image-5-p-800.webp",
    },
    {
      ...COURSES[5],
      image:
        "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66eb9e363f6e47ec5245cf09_Course%20Small%20Image-7-p-800.webp",
    },
    {
      ...COURSES[6],
      image:
        "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66eb9dfb3e87f8984b5a15b6_Course%20Small%20Image-p-800.webp",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <Reveal className="text-center">
        <Eyebrow>Trending courses</Eyebrow>
        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          Explore our top programs
        </h2>
      </Reveal>
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {list.map((c, i) => (
          <Reveal
            key={c.slug}
            delay={i * 100}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="group relative h-[26rem] overflow-hidden rounded-3xl">
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-white/20 px-3 py-1">
                    {c.cat}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star />
                    {c.rating}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug">
                  {c.title}
                </h3>
                <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-52 group-hover:opacity-100">
                  <p className="mt-3 text-sm text-white/80">
                    {c.lessons} Lessons · {c.enrolled} Enrolled
                  </p>
                  {pts.map((p) => (
                    <p key={p} className="mt-1 text-sm">
                      ✓ {p}
                    </p>
                  ))}
                  <Link
                    to={`/course/${c.slug}`}
                    className="mt-4 inline-block rounded-full bg-sun px-5 py-2 text-sm font-bold text-ink"
                  >
                    Course Details
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Why() {
  const F = [
    ["📚", "Learn anything"],
    ["💰", "Save money"],
    ["🗓️", "Flexible courses"],
    ["✅", "Unlimited certificate"],
  ];
  return (
    <section className="bg-soft py-20">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Why we are</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Elevate your professional journey
          </h2>
          <p className="mt-4 text-slate-600">
            Lorem ipsum dolor sit amet consectetur. Pellentesque id quam mauris
            mus. Vitae diam dolor lacus amet integer ut.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {F.map(([ic, t], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="group h-full rounded-3xl bg-white p-6 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sun text-3xl transition duration-500 group-hover:rotate-[360deg]">
                  {ic}
                </span>
                <h3 className="mt-5 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Lorem ipsum dolor sit amet conse non quis id viverra id proin.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="relative mt-16 overflow-hidden rounded-[2rem] bg-brand p-10 text-center text-white">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sun/30 animate-float" />
          <div className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full border-[16px] border-white/10 animate-slow" />
          <h2 className="relative text-3xl font-extrabold">
            Are you ready to start your journey?
          </h2>
          <div className="relative mt-6 flex flex-wrap justify-center gap-4">
            <Btn to="/course-one" dark>
              Browse courses
            </Btn>
            <Btn to="/career">Became a teacher</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    [
      "Quick links",
      [
        ["Home", "/home-one"],
        ["Events", "/events"],
        ["Career", "/career"],
        ["Instructor", "/team"],
      ],
    ],
    [
      "Popular courses",
      [
        ["Finance", "/course-one"],
        ["Management", "/course-one"],
        ["Design", "/course-one"],
        ["Web development", "/course-one"],
      ],
    ],
    [
      "Company",
      [
        ["About", "/about-one"],
        ["Courses", "/course-two"],
        ["Blog", "/blog-one"],
        ["Contact", "/contact-one"],
        ["Pricing", "/pricing-one"],
      ],
    ],
  ];
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-2xl font-extrabold">
            elearna<span className="text-sun">.</span>
          </p>
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Lorem ipsum dolor sit amet consectetur. Posuere vitae lacus quis
            eget amet ut tristique cras.
          </p>
        </div>
        {cols.map(([t, ls]) => (
          <div key={t}>
            <p className="font-bold">{t}</p>
            {ls.map(([l, to]) => (
              <Link
                key={l}
                to={to}
                className="mt-3 block text-sm text-white/70 transition hover:translate-x-1 hover:text-sun"
              >
                {l}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <p className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © Elearna. All rights reserved.
      </p>
    </footer>
  );
}

const Home = () => (
  <>
    <Hero />
    <Categories />
    <TopCourses />
    <Offer />
    <Testimonials />
    <Trending />
    <Why />
  </>
);

/* ---------- placeholder for pages not built yet ---------- */
function Stub() {
  const { pathname } = useLocation();
  const { slug: s } = useParams();
  const title = (s || pathname.slice(1)).replace(/-/g, " ");
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-chalk px-5 pt-24 text-center text-white">
      <h1 className="text-4xl font-extrabold capitalize">{title}</h1>
      <p className="mt-3 text-white/70">
        This page is routed and ready to be built.
      </p>
      <div className="mt-6">
        <Btn to="/home-one">Back home</Btn>
      </div>
    </section>
  );
}

//  home 2

/* ================= HOME TWO ================= */
const H2 = {
  hero: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVISehUIY4UMtC05cBx1flTRocH7u6At6F_gHZj9G-HA&s=10",
  pot: [
    "https://cdn.prod.website-files.com/668cb7adec02e140422345de/66cff274cdd4c2243b9ba324_Woman%20Image-p-500.webp",
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66ebabde3e87f8984b6782a1_Course%20Portrait%20Image-9-p-500.webp",
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66ebabcd61399462d208146a_Course%20Portrait%20Image-p-500.webp",
  ],
  girl: "https://cdn.prod.website-files.com/668cb7adec02e140422345de/66cd64ef67641295ddd2ffc9_Testimonial%20Author%20Image-2.avif",
  blog: [
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66ff7196253a4813606a5f52_Blog%20Small%20Thumbnail-12-p-500.webp",
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66ff6e0a6f9b375fbca970fe_Blog%20Small%20Thumbnail-11-p-500.webp",
    "https://cdn.prod.website-files.com/66cbf9eecd2d43a6644e1854/66ff6a72dd07492f0cbb0a6d_Blog%20Small%20Thumbnail-10-p-500.webp",
  ],
};

function HeroTwo() {
  const F = [
    ["🎓", "150+ online courses"],
    ["🧑‍🏫", "Personalized learning"],
    ["♾️", "Lifetime update"],
  ];
  return (
    <section className="bg-chalk pt-20 text-white">
      <div className="bg-deep px-5 py-2 text-xs text-white/80 sm:text-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p>
            Are you interested in online coaching?{" "}
            <Link
              to="/contact-one"
              className="font-semibold text-sun underline"
            >
              Contact us.
            </Link>
          </p>
          <p className="flex gap-5">
            <span>support@example.com</span>
            <span>Call: (888) 123 4567</span>
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="font-medium uppercase tracking-wide">
              Online learning
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl xl:text-6xl">
              Transform learning with flexible online education
            </h1>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {F.map(([ic, t], k) => (
              <Reveal key={t} delay={200 + k * 100}>
                <div className="group">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl transition duration-300 group-hover:rotate-12 group-hover:bg-sun">
                    {ic}
                  </span>
                  <p className="mt-3 text-lg font-medium">{t}</p>
                  <p className="text-sm text-white/60">
                    Lorem ipsum dolor sit amet
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal
          from="translate-x-10"
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -left-4 top-10 h-20 w-10 animate-float rounded-r-full bg-sun" />
          <img
            src={H2.hero}
            alt=""
            className="relative aspect-[6/7] w-full rounded-[2rem] object-cover"
          />
          <span className="absolute -left-6 top-24 animate-float rounded-full bg-white px-5 py-2 text-sm font-semibold text-chalk shadow-xl">
            personal
          </span>
          <span className="absolute -right-4 bottom-24 animate-float rounded-full bg-sun px-5 py-2 text-sm font-semibold text-chalk shadow-xl [animation-delay:1s]">
            Coach
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function CategoriesTwo() {
  const cats = [
    ["🎨", "Creative web design", 8],
    ["💰", "Finance accounting", 10],
    ["💻", "IT and software", 5],
    ["📣", "Digital marketing", 4],
    ["🌐", "Web development", 8],
    ["✍️", "Content writing", 3],
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Top Categories</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Discover leading categories
          </h2>
        </div>
        <Btn to="/course-one">Get Started</Btn>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        {cats.map(([ic, t, n], k) => (
          <Reveal key={t} delay={k * 70}>
            <Link
              to="/course-one"
              className="group block border border-slate-200 bg-white px-4 py-8 text-center transition duration-300 hover:-translate-y-2 hover:border-sun hover:shadow-xl"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-soft text-2xl transition group-hover:scale-110 group-hover:bg-sun/25">
                {ic}
              </span>
              <h3 className="mt-4 min-h-[3rem] font-medium leading-snug">
                {t}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{n} Courses</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Potential() {
  const P = [
    "Flexibility and convenience",
    "Course accessibility",
    "Cost-effectiveness",
    "Personalized learning",
  ];
  return (
    <section className="bg-soft py-20">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Unlocking Potential</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Discover the boundless advantages and transformative power of
            eLearning for professional growth
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-3 gap-4">
          {H2.pot.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <img
                src={s}
                alt=""
                className="aspect-[4/5] w-full rounded-3xl object-cover transition duration-500 hover:scale-[1.03]"
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {P.map((t, i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="group h-full rounded-3xl bg-white p-6 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <span className="text-4xl font-semibold text-sun transition group-hover:text-brand">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Lorem ipsum dolor sit amet consectetur. Lectus faucibus eu
                  lectus malesuada morbi in quam donec a pellentesque risus.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesTwo() {
  const list = COURSES.slice(0, 6);
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <Reveal className="text-center">
        <Eyebrow>Online learning</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Top online courses
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => (
          <CourseCard key={c.slug} c={c} i={i} />
        ))}
      </div>
      <p className="mt-10 text-center text-slate-600">
        We assist you in finding the ideal tutor at no cost.{" "}
        <Link to="/course-one" className="font-bold text-brand underline">
          Browse all available courses
        </Link>
      </p>
    </section>
  );
}

function WhyTwo() {
  return (
    <section className="bg-chalk py-20 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
        <Reveal from="-translate-x-10">
          <img
            src={H2.girl}
            alt=""
            className="mx-auto w-full max-w-md rounded-[2rem] object-cover"
          />
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow>Why we are</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              World-class learning from anywhere
            </h2>
            <p className="mt-4 text-white/70">
              Lorem ipsum dolor sit amet consectetur. Pellentesque id quam
              mauris mus. Vitae diam dolor lacus amet integer ut.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              [12, "K", "Finish seasons"],
              [45, "K", "Enrolled"],
              [95, "%", "Job placement"],
            ].map(([n, s, l], i) => (
              <Reveal key={l} delay={i * 120}>
                <p className="text-4xl font-semibold text-sun">
                  <Counter to={n} suffix={s} />
                </p>
                <p className="mt-1 text-sm text-white/70">{l}</p>
              </Reveal>
            ))}
          </div>
          <Reveal
            delay={300}
            className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-white/5 p-5"
          >
            <div>
              <p className="font-semibold">Still have questions?</p>
              <p className="text-sm text-white/60">
                Lorem ipsum dolor sit amet conse ipsum blandit etiam aliquam.
              </p>
            </div>
            <Btn to="/contact-two" dark>
              Get Started
            </Btn>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OfferTwo() {
  const logos = ["Northwind", "Lumen", "Orbit", "Vertex", "Helio", "Atlas"];
  return (
    <section className="py-20">
      <Reveal className="mx-auto max-w-2xl px-5 text-center">
        <Eyebrow>What we offer</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Personalized learning for your ambitions
        </h2>
        <p className="mt-4 text-slate-600">
          Lorem ipsum dolor sit amet consectetur. Pellentesque id quam mauris
          mus. Vitae diam dolor lacus amet integer ut.
        </p>
        <div className="mt-6">
          <Btn to="/course-one">Get Course</Btn>
        </div>
      </Reveal>
      <p className="mb-6 mt-14 text-center text-slate-500">
        Learn from 350+ leading universities and companies with us
      </p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-20 whitespace-nowrap">
          {[...logos, ...logos, ...logos, ...logos].map((l, i) => (
            <span key={i} className="text-3xl font-semibold text-slate-300">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsTwo() {
  const T = [
    [
      "Linda Grady",
      "Co-assistant manager",
      "Lorem ipsum dolor sit amet consectetur. Adipiscing eget risus tempus facilisis scelerisque vitae consectetur vitae. Amet faucibus venenatis donec mattis.",
    ],
    [
      "Jim Adams",
      "Designer",
      "Lorem ipsum dolor sit amet consectetur. Est felis pulvinar tortor ut nibh montes ante gravida velit. Molestie faucibus nibh felis tempor vel aliquet cursus placerat duis.",
    ],
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % T.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="bg-soft py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {T.map(([n, r, q]) => (
              <figure key={n} className="w-full shrink-0 px-2">
                <span className="text-6xl text-sun">“</span>
                <blockquote className="text-xl leading-relaxed">{q}</blockquote>
                <figcaption className="mt-6">
                  <b>{n}</b>
                  <p className="text-sm text-slate-500">{r}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          {["←", "→"].map((a, k) => (
            <button
              key={a}
              onClick={() => setI((i + (k ? 1 : T.length - 1)) % T.length)}
              className="h-11 w-11 rounded-full bg-sun font-bold transition hover:scale-110"
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogTwo() {
  const P = [
    [
      "Career",
      "Improve knowledge retention with visual learning",
      "October 4, 2024",
    ],
    [
      "Development",
      "Master online learning with proven strategies",
      "October 4, 2024",
    ],
    [
      "Teaching",
      "How to enhance your learning experience today",
      "October 3, 2024",
    ],
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Education Blog</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Our news and ideas
        </h2>
        <p className="mt-4 text-slate-600">
          Lorem ipsum dolor sit amet consectetur. Adipiscing eget risus tempus
          facilisis scelerisque vitae consectetur vitae. Amet faucibus venenatis
          donec mattis.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {P.map(([c, t, d], i) => (
          <Reveal key={t} delay={i * 100}>
            <Link
              to="/blog-one"
              className="group block overflow-hidden rounded-3xl border border-slate-200 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={H2.blog[i]}
                  alt=""
                  className="aspect-[3/2] w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-soft px-3 py-1 font-semibold text-brand">
                    {c}
                  </span>
                  <span className="text-slate-500">{d}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug transition group-hover:text-brand">
                  {t}
                </h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const HomeTwo = () => (
  <>
    <HeroTwo />
    <CategoriesTwo />
    <Potential />
    <CoursesTwo />
    <WhyTwo />
    <OfferTwo />
    <TestimonialsTwo />
    <BlogTwo />
  </>
);

// contact page
/* ================= CONTACT ONE ================= */
function PageBanner({ title }) {
  return (
    <section className="bg-chalk pb-16 pt-32 text-center text-white">
      <Reveal>
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-white/70">
          <Link to="/home-one" className="transition hover:text-sun">
            Home
          </Link>{" "}
          / {title}
        </p>
      </Reveal>
    </section>
  );
}

function ContactForm() {
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    save: false,
  });
  const [status, setStatus] = useState("idle"); // idle | ok | error
  const set = (k) => (e) =>
    setF({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  const submit = (e) => {
    e.preventDefault();
    const valid =
      f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.message.trim();
    setStatus(valid ? "ok" : "error");
    if (valid)
      setF({ name: "", email: "", phone: "", message: "", save: false });
  };
  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 outline-none transition focus:border-sun focus:ring-4 focus:ring-sun/20";
  return (
    <form onSubmit={submit} className="rounded-3xl bg-soft p-8 sm:p-10">
      <h3 className="text-2xl font-semibold">Fill out for contact</h3>
      <p className="mt-1 text-slate-600">
        Lorem ipsum dolor sit amet consectetur libero donec.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          className={input}
          placeholder="Name"
          value={f.name}
          onChange={set("name")}
        />
        <input
          className={input}
          placeholder="Email"
          value={f.email}
          onChange={set("email")}
        />
        <input
          className={`${input} sm:col-span-2`}
          placeholder="Phone number"
          value={f.phone}
          onChange={set("phone")}
        />
        <textarea
          className={`${input} min-h-[140px] sm:col-span-2`}
          placeholder="Message"
          value={f.message}
          onChange={set("message")}
        />
      </div>
      <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={f.save}
          onChange={set("save")}
          className="h-4 w-4 accent-[#ffb400]"
        />
        Save information for the next time comment.
      </label>
      <button className="mt-6 rounded-md bg-deep px-10 py-3.5 font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-sun hover:text-chalk hover:shadow-lg">
        Submit
      </button>
      {status === "ok" && (
        <p className="mt-4 animate-pop rounded-xl bg-green-100 px-4 py-3 text-green-800">
          Thank you! Your submission has been received!
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 animate-pop rounded-xl bg-red-100 px-4 py-3 text-red-800">
          Oops! Please fill in your name, a valid email and a message.
        </p>
      )}
    </form>
  );
}

function Faq() {
  const Q = [
    "How do I enroll in an online course?",
    "Are there any prerequisites for enrolling in online courses?",
    "What are the technical requirements for online learning?",
    "What if I encounter technical difficulties?",
    "Are there live classes, or can I learn at my own pace?",
  ];
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {Q.map((q, i) => (
        <div
          key={q}
          className={`overflow-hidden rounded-2xl border transition ${open === i ? "border-sun bg-white shadow-lg" : "border-slate-200 bg-white"}`}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold"
          >
            {q}
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sun transition duration-300 ${open === i ? "rotate-45" : ""}`}
            >
              +
            </span>
          </button>
          <div
            className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <p className="overflow-hidden px-6 text-slate-600">
              <span className="block pb-5">
                Lorem ipsum dolor sit amet consectetur. Amet ornare sit leo
                tristique sollicitudin ipsum diam fames. A vel iaculis lorem
                risus sit et. Auctor ipsum amet nibh sagittis accumsan pretium
                pulvinar proin urna ac.
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactOne() {
  const info = [
    ["📍", "Area location", ["410 Sandtown, California 94001, USA"]],
    ["📞", "Contact details", ["888-123-4567", "info@example.com"]],
    ["🕒", "Opening hours", ["Monday-Friday", "10:30a.m-7:00p.m"]],
  ];
  return (
    <>
      <PageBanner title="Contact us" />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2">
        <Reveal from="-translate-x-10">
          <Eyebrow>Contact Us</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Are you interested in online learning? Contact us
          </h2>
          <p className="mt-4 text-slate-600">
            Lorem ipsum dolor sit amet consectetur. Neque libero donec hendrerit
            nam id purus suspendisse. Imperdiet nam lorem tempus in. Tristique
            nullam risus semper habitant urna nisl nam elit at.
          </p>
          <p className="mt-8 text-4xl italic text-brand [font-family:cursive]">
            Brayden Backham
          </p>
          <p className="mt-1 font-semibold">Brayden Backham</p>
          <p className="text-sm text-slate-500">Director</p>
        </Reveal>
        <Reveal from="translate-x-10">
          <ContactForm />
        </Reveal>
      </section>

      <section className="bg-soft py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="text-center">
            <Eyebrow>Contact details</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Find our location
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {info.map(([ic, t, lines], i) => (
              <Reveal key={t} delay={i * 120}>
                <div className="group h-full rounded-3xl bg-white p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sun/20 text-2xl transition duration-500 group-hover:rotate-[360deg] group-hover:bg-sun">
                    {ic}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                  {lines.map((l) => (
                    <p key={l} className="mt-1 text-slate-600">
                      {l}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20">
        <Reveal className="mb-10 text-center">
          <Eyebrow>Contact Us</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-brand p-10 text-center text-white">
          <div className="absolute -left-10 -top-10 h-40 w-40 animate-float rounded-full bg-sun/30" />
          <div className="absolute -bottom-12 -right-8 h-48 w-48 animate-slow rounded-full border-[16px] border-white/10" />
          <h2 className="relative text-3xl font-semibold">
            Are you ready to start your journey?
          </h2>
          <div className="relative mt-6 flex flex-wrap justify-center gap-4">
            <Btn to="/course-one" dark>
              Browse courses
            </Btn>
            <Btn to="/career">Became a teacher</Btn>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home-one" replace />} />
        <Route path="/home-one" element={<Home />} />
        <Route path="/home-two" element={<HomeTwo />} />
        <Route path="/contact-one" element={<ContactOne />} />
        <Route path="*" element={<Stub />} />
      </Routes>
      <Footer />
    </>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <section className="hero">

      <div className="container pad-hero">

        <div className="hero-inner">

          <span className="helo-pill">Learn. Build. Ship.</span>
          <h1 className="hero-title">Practical courses for modern web development</h1>
          <p className="hero-lede">
            LearnHub brings together courses in web development, data analytics, and more.
            <br />
            Enroll, track your progress, and build real projects along the way.
          </p>

          <div className="hero-actions">
            <Link href="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>

        </div>

      </div>

    </section>
  );
}

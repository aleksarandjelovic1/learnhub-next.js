export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseCategory =
  | "Web Development"
  | "Design"
  | "Data"
  | "Mobile"
  | "DevOps";

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string;
  lessonsCount: number;
  instructorSlug: string;
  lessons: string[];
}

export interface Instructor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  shortBio: string;
  bio: string;
}

export const instructors: Instructor[] = [
  {
    id: "i1",
    slug: "ana-peric",
    name: "Ana Perić",
    specialty: "Frontend Development",
    shortBio:
      "Senior frontend engineer focused on React, Next.js and modern web UI.",
    bio: "Ana has been building user interfaces for over 10 years. She is passionate about teaching React and helping beginners write clean, maintainable code. In her free time, she contributes to open-source design systems.",
  },
  {
    id: "i2",
    slug: "marko-jovic",
    name: "Marko Jović",
    specialty: "Backend & APIs",
    shortBio: "Backend engineer who loves Node.js, databases and clean APIs.",
    bio: "Marko has worked on large-scale APIs for fintech and e-commerce platforms. He enjoys simplifying complex backend concepts for students and breaking down how real-world services are architected.",
  },
  {
    id: "i3",
    slug: "jelena-markovic",
    name: "Jelena Marković",
    specialty: "UI/UX Design",
    shortBio:
      "Product designer focused on accessible, user-centred interfaces.",
    bio: "Jelena has designed products used by millions of people. She teaches students how to think about users first, prototype quickly, and translate designs into real, working interfaces.",
  },
  {
    id: "i4",
    slug: "nikola-stojanovic",
    name: "Nikola Stojanović",
    specialty: "Data & Analytics",
    shortBio: "Data engineer and analyst working with Python and SQL.",
    bio: "Nikola has spent the last 8 years turning messy data into actionable insights. He loves teaching practical data skills — SQL, Python, and the thinking patterns that help students solve real problems.",
  },
  {
    id: "i5",
    slug: "milica-petrovic",
    name: "Milica Petrović",
    specialty: "Mobile Development",
    shortBio: "iOS and cross-platform mobile developer.",
    bio: "Milica builds delightful mobile apps for iOS and Android using React Native and Swift. She focuses on helping beginners ship their first real mobile app end-to-end.",
  },
];

export const courses: Course[] = [
  {
    id: "c1",
    slug: "nextjs-fundamentals",
    title: "Next.js Fundamentals",
    shortDescription:
      "Learn the App Router, layouts, pages and data fetching in modern Next.js.",
    description:
      "A beginner-friendly introduction to Next.js using the App Router. You'll learn how routes, layouts and pages work, how to split UI into Server and Client Components, how to fetch and render data, and how to build small, real features end-to-end.",
    category: "Web Development",
    level: "Beginner",
    duration: "6 hours",
    lessonsCount: 8,
    instructorSlug: "ana-peric",
    lessons: [
      "Introduction to the App Router",
      "Pages and Layouts",
      "Static and Dynamic Routes",
      "Server vs Client Components",
      "Loading and Not-Found states",
      "Route Handlers (API routes)",
      "Working with local data",
      "Small project: a course catalog",
    ],
  },
  {
    id: "c2",
    slug: "react-for-beginners",
    title: "React for Beginners",
    shortDescription:
      "Understand components, props, state and hooks from the ground up.",
    description:
      "This course walks you through the fundamentals of React with lots of small, focused examples. By the end, you'll understand components, props, state, hooks and how to structure a small application.",
    category: "Web Development",
    level: "Beginner",
    duration: "5 hours",
    lessonsCount: 7,
    instructorSlug: "ana-peric",
    lessons: [
      "What is React?",
      "Your first component",
      "Props and composition",
      "State with useState",
      "Effects with useEffect",
      "Lists and keys",
      "Building a small app",
    ],
  },
  {
    id: "c3",
    slug: "modern-css-layouts",
    title: "Modern CSS Layouts",
    shortDescription:
      "Flexbox, Grid, and responsive design patterns used in real products.",
    description:
      "Master the CSS techniques that power modern interfaces. You'll build layouts with Flexbox and Grid, learn responsive design patterns, and understand how to translate designs into clean, maintainable CSS.",
    category: "Design",
    level: "Beginner",
    duration: "4 hours",
    lessonsCount: 6,
    instructorSlug: "jelena-markovic",
    lessons: [
      "Box model refresher",
      "Flexbox in practice",
      "CSS Grid essentials",
      "Responsive design patterns",
      "Accessible components",
      "Project: landing page",
    ],
  },
  {
    id: "c4",
    slug: "typescript-essentials",
    title: "TypeScript Essentials",
    shortDescription:
      "Types, interfaces and generics explained with practical examples.",
    description:
      "A hands-on introduction to TypeScript. You'll learn how to add types to JavaScript code, work with interfaces and generics, and avoid common pitfalls when adopting TypeScript in a real project.",
    category: "Web Development",
    level: "Intermediate",
    duration: "5 hours",
    lessonsCount: 8,
    instructorSlug: "ana-peric",
    lessons: [
      "Why TypeScript?",
      "Basic types",
      "Interfaces and type aliases",
      "Union and intersection types",
      "Generics",
      "Working with external libraries",
      "Typing React components",
      "Project: typing a small app",
    ],
  },
  {
    id: "c5",
    slug: "node-api-development",
    title: "Node.js API Development",
    shortDescription:
      "Build clean, well-structured REST APIs with Node.js and Express.",
    description:
      "Learn how to design and build REST APIs with Node.js and Express. You'll cover routing, middleware, validation, error handling, and how to keep your API clean, readable and easy to extend.",
    category: "Web Development",
    level: "Intermediate",
    duration: "7 hours",
    lessonsCount: 9,
    instructorSlug: "marko-jovic",
    lessons: [
      "HTTP and REST basics",
      "Setting up Express",
      "Routing and controllers",
      "Middleware patterns",
      "Validation",
      "Error handling",
      "Authentication basics",
      "Testing your API",
      "Project: task manager API",
    ],
  },
  {
    id: "c6",
    slug: "ui-ux-foundations",
    title: "UI/UX Foundations",
    shortDescription:
      "Design thinking, wireframing and the fundamentals of good UX.",
    description:
      "A practical introduction to UI/UX design. You'll learn how to think about users, sketch and wireframe ideas, and apply visual design principles to build interfaces that feel clear and intuitive.",
    category: "Design",
    level: "Beginner",
    duration: "4 hours",
    lessonsCount: 6,
    instructorSlug: "jelena-markovic",
    lessons: [
      "Design thinking",
      "User research basics",
      "Wireframing",
      "Visual hierarchy",
      "Color and typography",
      "Project: app redesign",
    ],
  },
  {
    id: "c7",
    slug: "sql-for-analysts",
    title: "SQL for Analysts",
    shortDescription:
      "Query data with confidence — SELECT, JOIN, aggregation and beyond.",
    description:
      "Learn SQL the practical way. You'll write real queries against realistic datasets, from simple SELECTs to multi-table JOINs and aggregations, and build the confidence to answer real business questions with data.",
    category: "Data",
    level: "Beginner",
    duration: "5 hours",
    lessonsCount: 7,
    instructorSlug: "nikola-stojanovic",
    lessons: [
      "What is SQL?",
      "SELECT and filtering",
      "Sorting and limiting",
      "Joining tables",
      "Aggregations",
      "Subqueries",
      "Project: analyzing an online shop",
    ],
  },
  {
    id: "c8",
    slug: "python-for-data",
    title: "Python for Data",
    shortDescription:
      "Use Python, Pandas and notebooks to explore and understand data.",
    description:
      "A practical introduction to data work with Python. You'll learn the Python basics you need, explore data with Pandas, and use Jupyter notebooks to tell simple, clear data stories.",
    category: "Data",
    level: "Intermediate",
    duration: "6 hours",
    lessonsCount: 8,
    instructorSlug: "nikola-stojanovic",
    lessons: [
      "Python refresher",
      "Working in notebooks",
      "Intro to Pandas",
      "Loading and cleaning data",
      "Filtering and grouping",
      "Simple visualisations",
      "Putting it together",
      "Project: exploring a dataset",
    ],
  },
  {
    id: "c9",
    slug: "react-native-basics",
    title: "React Native Basics",
    shortDescription: "Build your first cross-platform mobile app with React Native.",
    description:
      "Take your React skills to mobile. You'll learn the core React Native concepts, how navigation works, how to use platform components, and how to ship a small but complete mobile app.",
    category: "Mobile",
    level: "Intermediate",
    duration: "7 hours",
    lessonsCount: 9,
    instructorSlug: "milica-petrovic",
    lessons: [
      "Why React Native?",
      "Setting up your environment",
      "Core components",
      "Styling in React Native",
      "Navigation",
      "Lists and data",
      "Forms and inputs",
      "Platform differences",
      "Project: simple notes app",
    ],
  },
  {
    id: "c10",
    slug: "docker-for-developers",
    title: "Docker for Developers",
    shortDescription:
      "Understand containers and use Docker to run your apps consistently.",
    description:
      "A practical guide to Docker for everyday developers. You'll learn what containers are, how to run and build images, how to use Docker Compose, and how containers fit into a modern dev workflow.",
    category: "DevOps",
    level: "Intermediate",
    duration: "4 hours",
    lessonsCount: 6,
    instructorSlug: "marko-jovic",
    lessons: [
      "What is a container?",
      "Running your first image",
      "Building images with Dockerfile",
      "Volumes and networking",
      "Docker Compose",
      "Project: multi-service app",
    ],
  },
  {
    id: "c11",
    slug: "advanced-nextjs-patterns",
    title: "Advanced Next.js Patterns",
    shortDescription:
      "Server Actions, caching, streaming and production-ready patterns.",
    description:
      "Take your Next.js skills further. You'll explore Server Actions, caching strategies, streaming, advanced data fetching, and the patterns teams use to ship robust Next.js apps to production.",
    category: "Web Development",
    level: "Advanced",
    duration: "8 hours",
    lessonsCount: 10,
    instructorSlug: "ana-peric",
    lessons: [
      "Recap: App Router",
      "Server Actions in depth",
      "Caching strategies",
      "Streaming and Suspense",
      "Parallel and intercepting routes",
      "Error handling patterns",
      "Auth patterns (overview)",
      "Performance tips",
      "Deployment considerations",
      "Capstone project",
    ],
  },
  {
    id: "c12",
    slug: "design-systems-in-practice",
    title: "Design Systems in Practice",
    shortDescription:
      "Build a small design system: tokens, components and documentation.",
    description:
      "Learn how real teams build and maintain design systems. You'll create design tokens, build a small library of reusable components, and document them so they can be used confidently across projects.",
    category: "Design",
    level: "Advanced",
    duration: "6 hours",
    lessonsCount: 8,
    instructorSlug: "jelena-markovic",
    lessons: [
      "What is a design system?",
      "Design tokens",
      "Component API design",
      "Accessibility considerations",
      "Theming",
      "Documentation",
      "Versioning and adoption",
      "Mini project: a button system",
    ],
  },
];

export function getAllCourses(): Course[] {
  return courses;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getAllInstructors(): Instructor[] {
  return instructors;
}

export function getInstructorBySlug(slug: string): Instructor | undefined {
  return instructors.find((i) => i.slug === slug);
}

export function getCoursesByInstructor(instructorSlug: string): Course[] {
  return courses.filter((c) => c.instructorSlug === instructorSlug);
}

export function getCourseCategories(): string[] {
  return Array.from(new Set(courses.map((c) => c.category))).sort();
}

export function getCourseLevels(): string[] {
  return Array.from(new Set(courses.map((c) => c.level)));
}

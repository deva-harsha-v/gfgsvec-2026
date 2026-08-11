export interface ChapterPost {
  id: string;
  title: string;
  image: string;
  text: string;
}

export const CHAPTER_POSTS: ChapterPost[] = [
  {
    id: "01",
    title: "INNOVATION & TECHNOLOGY",
    image: "/chapter1/innovation.jpg",
    text: "At the GFG Sri Vasavi Engineering College chapter, we push the boundaries of technical learning. We host hands-on workshops, hackathons, and bootcamps, focusing on software engineering, web development, AI/ML, and system design."
  },
  {
    id: "02",
    title: "COMPETITIVE PROGRAMMING",
    image: "/chapter1/coding.jpg",
    text: "Join our core coding circles! We conduct regular contests, peer learning sessions, and coding drills to help students build strong data structures and algorithms (DSA) fundamentals and prepare for top tier coding interviews."
  },
  {
    id: "03",
    title: "CREATIVE & BRAND DESIGN",
    image: "/chapter1/design.jpg",
    text: "From UI/UX designs to recruitment poster assets, our design team translates complex technical concepts into engaging visuals. Experience working with Figma, Illustrator, and typography to build the club's visual identity."
  },
  {
    id: "04",
    title: "EVENT MANAGEMENT & PR",
    image: "/chapter1/coding.jpg",
    text: "Learn the craft of organizing large-scale tech events, coordinating public relations, and collaborating with corporate speakers. This domain builds essential leadership, communications, and teamwork skills."
  },
  {
    id: "05",
    title: "SOCIAL MEDIA & CONTENT",
    image: "/chapter1/design.jpg",
    text: "Our voice to the world! Write technical blogs, design copy, capture photography/videography, and coordinate our campus digital outreach campaigns to keep the student body updated and inspired."
  }
];

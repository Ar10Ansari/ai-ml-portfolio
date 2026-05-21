import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: "AI-Powered Medical Diagnosis System",
    category: "Deep Learning / Healthcare AI",
    tools: ["Python", "TensorFlow", "CNN", "OpenCV", "Flask"],
    desc: "Detects diseases from medical scans. Real-time predictions with AI visualization dashboard.",
    metrics: "96% model accuracy",
    image: "/images/project1.png",
    github: "#",
    live: "#"
  },
  {
    name: "Enterprise NLP Intelligence Platform",
    category: "NLP / Generative AI",
    tools: ["Transformers", "Hugging Face", "LangChain", "OpenAI APIs", "PyTorch"],
    desc: "AI summarization, semantic search, and chatbot integration for massive text datasets.",
    metrics: "Sentiment analysis on 1M+ records",
    image: "/images/project2.png",
    github: "#",
    live: "#"
  },
  {
    name: "AI Financial Forecasting Engine",
    category: "Machine Learning / Finance",
    tools: ["XGBoost", "Scikit-learn", "Pandas", "Power BI"],
    desc: "Predictive analytics, business intelligence dashboards, and risk analysis models.",
    metrics: "Time-series forecasting",
    image: "/images/project3.png",
    github: "#",
    live: "#"
  },
  {
    name: "Autonomous Computer Vision System",
    category: "Computer Vision / AI",
    tools: ["YOLO", "OpenCV", "TensorFlow", "CUDA"],
    desc: "Smart surveillance and edge AI optimization for real-time object detection.",
    metrics: "High-speed inference",
    image: "/images/project4.png",
    github: "#",
    live: "#"
  },
  {
    name: "Generative AI Productivity Assistant",
    category: "Generative AI / LLM",
    tools: ["OpenAI API", "LangChain", "Vector Databases", "React", "FastAPI"],
    desc: "AI document generation, context-aware chat, and intelligent workflow automation.",
    metrics: "RAG pipeline integration",
    image: "/images/project5.png",
    github: "#",
    live: "#"
  }
];

const Work = () => {
  useGSAP(() => {
    // Kill any existing trigger with this ID to prevent nested pin-spacers
    const existingTrigger = ScrollTrigger.getById("work");
    if (existingTrigger) {
      existingTrigger.kill(true);
    }

    function getTranslateX() {
      const workFlex = document.querySelector(".work-flex") as HTMLElement;
      if (!workFlex) return 0;
      return workFlex.scrollWidth - workFlex.getBoundingClientRect().width;
    }

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${getTranslateX()}`, // Functional end for dynamic recalculation
        scrub: true,
        pin: true,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: () => -getTranslateX(), // Functional x for dynamic translation
      ease: "none",
    });

    // Refresh ScrollTrigger when everything is loaded
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleLoad);

    // Also run a timer refresh as a fallback for React mounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    // Clean up
    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
      timeline.kill();
      const trigger = ScrollTrigger.getById("work");
      if (trigger) {
        trigger.kill(true); // Force revert/cleanup of pinned element and spacer
      }
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box premium-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3 className="project-number">0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p className="work-category">{project.category}</p>
                  </div>
                </div>
                
                <p className="work-desc">{project.desc}</p>
                <div className="work-metrics-badge">🎯 {project.metrics}</div>

                <div className="work-tech-stack">
                  {project.tools.map((tool, i) => (
                    <span key={i} className="tech-badge">{tool}</span>
                  ))}
                </div>

                <div className="work-links">
                  <a href={project.github} target="_blank" rel="noreferrer" className="btn-secondary">GitHub</a>
                  <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary">Live Demo</a>
                </div>
              </div>
              <WorkImage image={project.image} alt={project.name} link={project.live !== "#" ? project.live : undefined} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

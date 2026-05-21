import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I am an AI & Data Science student passionate about building intelligent systems and solving real-world problems using data. I have experience working with Machine Learning, Deep Learning, NLP, Data Analytics, and Generative AI technologies. I enjoy creating end-to-end AI projects and continuously improving my technical and problem-solving skills.
        </p>
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", display: "inline-block", color: "#a5a5b4", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.9rem" }}>
          🚀 Open to AI/ML Internships and Entry-Level Roles
        </div>
      </div>
    </div>
  );
};

export default About;

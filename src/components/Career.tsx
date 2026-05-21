import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Territory Sales Manager</h4>
                <h5>RNFI Services Limited</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Verified customer KYC documents, managed CRM records, and coordinated with customers and teams to improve communication and operational workflows.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Event Coordinator</h4>
                <h5>Sunday Bricks</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Coordinated events and vendor management, handled execution, and maintained effective communication.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Science in Computer Science</h4>
                <h5>Savitribai Phule Pune University</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Completed comprehensive coursework in computer science and software development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Secondary – Science</h4>
                <h5>Seth M. R. Jaipuria School Lucknow</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>
              Completed 12th grade education with a focus on science and mathematics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

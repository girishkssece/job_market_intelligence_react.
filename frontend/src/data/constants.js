export const TARGET_ROLES = [
  "Data Scientist", "Data Analyst", "Data Engineer", "ML Engineer",
  "AI Engineer", "Software Engineer", "Business Analyst",
  "DevOps/MLOps Engineer", "Cloud Engineer", "Frontend Developer",
  "Full Stack Developer", "Data Science Intern",
  "Software Engineering Intern", "Business Analyst Intern",
];

// ─────────────────────────────────────────────────────────────────────────────
// COURSES — 20+ skills covered
// ─────────────────────────────────────────────────────────────────────────────
export const COURSES = {
  python: [
    { name: "Python for Everybody", platform: "Coursera", provider: "University of Michigan", level: "Beginner", price: "Free to audit", url: "https://www.coursera.org/specializations/python", duration: "8 months" },
    { name: "Python Bootcamp", platform: "Udemy", provider: "Jose Portilla", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/complete-python-bootcamp/", duration: "22 hours" },
    { name: "Python Tutorial", platform: "YouTube", provider: "Corey Schafer", level: "Beginner", price: "Free", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU", duration: "Self-paced" },
    { name: "100 Days of Code", platform: "Udemy", provider: "Dr. Angela Yu", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/100-days-of-code/", duration: "100 days" },
  ],
  "machine learning": [
    { name: "Machine Learning Specialization", platform: "Coursera", provider: "Andrew Ng / Stanford", level: "Intermediate", price: "Free to audit", url: "https://www.coursera.org/specializations/machine-learning-introduction", duration: "3 months" },
    { name: "ML Course — fast.ai", platform: "fast.ai", provider: "Jeremy Howard", level: "Intermediate", price: "Free", url: "https://course.fast.ai", duration: "Self-paced" },
    { name: "Hands-On ML with Scikit-Learn", platform: "GitHub/Book", provider: "Aurélien Géron", level: "Intermediate", price: "Free on GitHub", url: "https://github.com/ageron/handson-ml3", duration: "Self-paced" },
  ],
  "deep learning": [
    { name: "Deep Learning Specialization", platform: "Coursera", provider: "Andrew Ng / DeepLearning.AI", level: "Advanced", price: "Free to audit", url: "https://www.coursera.org/specializations/deep-learning", duration: "5 months" },
    { name: "Practical Deep Learning for Coders", platform: "fast.ai", provider: "Jeremy Howard", level: "Intermediate", price: "Free", url: "https://course.fast.ai", duration: "Self-paced" },
    { name: "Neural Networks: Zero to Hero", platform: "YouTube", provider: "Andrej Karpathy", level: "Advanced", price: "Free", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", duration: "Self-paced" },
  ],
  sql: [
    { name: "SQL for Data Science", platform: "Coursera", provider: "UC Davis", level: "Beginner", price: "Free to audit", url: "https://www.coursera.org/learn/sql-for-data-science", duration: "4 weeks" },
    { name: "SQLZoo Interactive Tutorials", platform: "SQLZoo", provider: "SQLZoo", level: "Beginner", price: "Free", url: "https://sqlzoo.net", duration: "Self-paced" },
    { name: "Mode SQL Tutorial", platform: "Mode", provider: "Mode Analytics", level: "Intermediate", price: "Free", url: "https://mode.com/sql-tutorial/", duration: "Self-paced" },
    { name: "Advanced SQL for Analytics", platform: "Udemy", provider: "Maximilian Schwarzmüller", level: "Advanced", price: "~₹500", url: "https://www.udemy.com/course/sql-mysql-for-data-analytics-and-business-intelligence/", duration: "10 hours" },
  ],
  aws: [
    { name: "AWS Cloud Practitioner Essentials", platform: "AWS", provider: "Amazon", level: "Beginner", price: "Free", url: "https://aws.amazon.com/training/learn-about/cloud-practitioner", duration: "6 hours" },
    { name: "AWS Solutions Architect Associate", platform: "Udemy", provider: "Stephane Maarek", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", duration: "27 hours" },
    { name: "AWS Free Tier Hands-on Labs", platform: "AWS", provider: "Amazon", level: "Beginner", price: "Free", url: "https://aws.amazon.com/free/", duration: "Self-paced" },
  ],
  react: [
    { name: "React Official Docs & Tutorial", platform: "React.dev", provider: "Meta / React", level: "Beginner", price: "Free", url: "https://react.dev/learn", duration: "Self-paced" },
    { name: "Full Stack Open", platform: "University of Helsinki", provider: "U of Helsinki", level: "Intermediate", price: "Free", url: "https://fullstackopen.com", duration: "Self-paced" },
    { name: "React — The Complete Guide", platform: "Udemy", provider: "Maximilian Schwarzmüller", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", duration: "40 hours" },
  ],
  javascript: [
    { name: "JavaScript.info", platform: "javascript.info", provider: "Ilya Kantor", level: "Beginner", price: "Free", url: "https://javascript.info", duration: "Self-paced" },
    { name: "The Odin Project — JS Path", platform: "The Odin Project", provider: "Odin Project", level: "Beginner", price: "Free", url: "https://www.theodinproject.com/paths/full-stack-javascript", duration: "Self-paced" },
    { name: "JavaScript: Understanding the Weird Parts", platform: "Udemy", provider: "Anthony Alicea", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/understand-javascript/", duration: "12 hours" },
  ],
  docker: [
    { name: "Docker & Kubernetes: The Practical Guide", platform: "Udemy", provider: "Maximilian Schwarzmüller", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", duration: "24 hours" },
    { name: "Docker Official Get Started", platform: "Docker", provider: "Docker Inc.", level: "Beginner", price: "Free", url: "https://docs.docker.com/get-started/", duration: "Self-paced" },
    { name: "TechWorld with Nana — Docker", platform: "YouTube", provider: "TechWorld with Nana", level: "Beginner", price: "Free", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", duration: "3 hours" },
  ],
  git: [
    { name: "Pro Git Book", platform: "Git-scm.com", provider: "Scott Chacon", level: "Beginner", price: "Free", url: "https://git-scm.com/book/en/v2", duration: "Self-paced" },
    { name: "Git & GitHub Bootcamp", platform: "Udemy", provider: "Colt Steele", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/git-and-github-bootcamp/", duration: "17 hours" },
  ],
  kubernetes: [
    { name: "Kubernetes for Beginners", platform: "Udemy", provider: "Mumshad Mannambeth", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/learn-kubernetes/", duration: "6 hours" },
    { name: "CKA Certified Kubernetes Administrator", platform: "Udemy", provider: "Mumshad Mannambeth", level: "Advanced", price: "~₹500", url: "https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/", duration: "18 hours" },
  ],
  terraform: [
    { name: "HashiCorp Terraform Associate", platform: "Udemy", provider: "Zeal Vora", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/terraform-beginner-to-advanced/", duration: "12 hours" },
    { name: "Terraform Official Tutorial", platform: "HashiCorp", provider: "HashiCorp", level: "Beginner", price: "Free", url: "https://developer.hashicorp.com/terraform/tutorials", duration: "Self-paced" },
  ],
  spark: [
    { name: "Taming Big Data with Apache Spark", platform: "Udemy", provider: "Frank Kane", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/taming-big-data-with-apache-spark-hands-on/", duration: "7 hours" },
    { name: "Apache Spark 3 — Big Data Essentials", platform: "Udemy", provider: "Rock the JVM", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/spark-essentials/", duration: "11 hours" },
  ],
  tableau: [
    { name: "Tableau 2024 A-Z Hands-On", platform: "Udemy", provider: "Kirill Eremenko", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/tableau10/", duration: "8 hours" },
    { name: "Tableau Public Free Learning", platform: "Tableau", provider: "Salesforce/Tableau", level: "Beginner", price: "Free", url: "https://public.tableau.com/app/learn/how-to-videos", duration: "Self-paced" },
  ],
  statistics: [
    { name: "Statistics with Python Specialization", platform: "Coursera", provider: "University of Michigan", level: "Intermediate", price: "Free to audit", url: "https://www.coursera.org/specializations/statistics-with-python", duration: "5 months" },
    { name: "Khan Academy — Statistics", platform: "Khan Academy", provider: "Khan Academy", level: "Beginner", price: "Free", url: "https://www.khanacademy.org/math/statistics-probability", duration: "Self-paced" },
  ],
  "natural language processing": [
    { name: "NLP Specialization", platform: "Coursera", provider: "DeepLearning.AI", level: "Advanced", price: "Free to audit", url: "https://www.coursera.org/specializations/natural-language-processing", duration: "4 months" },
    { name: "HuggingFace NLP Course", platform: "HuggingFace", provider: "HuggingFace", level: "Intermediate", price: "Free", url: "https://huggingface.co/learn/nlp-course/", duration: "Self-paced" },
  ],
  tensorflow: [
    { name: "TensorFlow Developer Certificate", platform: "Coursera", provider: "DeepLearning.AI", level: "Intermediate", price: "Free to audit", url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice", duration: "4 months" },
    { name: "Zero to Mastery TensorFlow", platform: "Udemy", provider: "Daniel Bourke", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/tensorflow-developer-certificate-machine-learning-zero-to-mastery/", duration: "64 hours" },
  ],
  pytorch: [
    { name: "PyTorch for Deep Learning — freeCodeCamp", platform: "YouTube", provider: "Daniel Bourke", level: "Intermediate", price: "Free", url: "https://www.youtube.com/watch?v=V_xro1bcAuA", duration: "26 hours" },
    { name: "Deep Learning with PyTorch", platform: "Udemy", provider: "Jose Portilla", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/pytorch-for-deep-learning-in-python/", duration: "17 hours" },
  ],
  gcp: [
    { name: "Google Cloud Associate Cloud Engineer", platform: "Udemy", provider: "Dan Sullivan", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/google-cloud-associate-cloud-engineer/", duration: "22 hours" },
    { name: "Google Cloud Skills Boost", platform: "Google Cloud", provider: "Google", level: "Beginner", price: "Free (labs)", url: "https://cloudskillsboost.google/", duration: "Self-paced" },
  ],
  "power bi": [
    { name: "Microsoft Power BI Desktop", platform: "Udemy", provider: "Maven Analytics", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/microsoft-power-bi-up-running-with-power-bi-desktop/", duration: "9 hours" },
    { name: "Power BI Guided Learning", platform: "Microsoft Learn", provider: "Microsoft", level: "Beginner", price: "Free", url: "https://learn.microsoft.com/en-us/power-bi/guided-learning/", duration: "Self-paced" },
  ],
  linux: [
    { name: "Linux Command Line Basics", platform: "Udacity", provider: "Udacity", level: "Beginner", price: "Free", url: "https://www.udacity.com/course/linux-command-line-basics--ud595", duration: "Self-paced" },
    { name: "Linux Fundamentals for DevOps", platform: "Udemy", provider: "Mumshad Mannambeth", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/linux-administration-bootcamp/", duration: "12 hours" },
  ],
  "system design": [
    { name: "System Design Primer", platform: "GitHub", provider: "Donne Martin", level: "Advanced", price: "Free", url: "https://github.com/donnemartin/system-design-primer", duration: "Self-paced" },
    { name: "Grokking System Design Interview", platform: "Educative", provider: "Educative", level: "Advanced", price: "~₹1000/mo", url: "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers", duration: "Self-paced" },
  ],
  agile: [
    { name: "Project Management Professional (PMI)", platform: "PMI", provider: "PMI", level: "Advanced", price: "Paid (~$555)", url: "https://www.pmi.org/certifications/project-management-pmp", duration: "Varies" },
    { name: "Agile & Scrum for Beginners", platform: "Udemy", provider: "Valentin Despa", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/agile-fundamentals-scrum-kanban-scrumban/", duration: "5 hours" },
  ],
  "data analysis": [
    { name: "Google Data Analytics Certificate", platform: "Coursera", provider: "Google", level: "Beginner", price: "Free to audit", url: "https://www.coursera.org/professional-certificates/google-data-analytics", duration: "6 months" },
    { name: "IBM Data Analyst Professional", platform: "Coursera", provider: "IBM", level: "Beginner", price: "Free to audit", url: "https://www.coursera.org/professional-certificates/ibm-data-analyst", duration: "11 months" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLE_COURSES — all 14 roles mapped
// ─────────────────────────────────────────────────────────────────────────────
export const ROLE_COURSES = {
  "Data Scientist":             ["python", "machine learning", "statistics", "sql", "deep learning", "natural language processing"],
  "Data Analyst":               ["sql", "python", "tableau", "power bi", "statistics", "data analysis"],
  "Data Engineer":              ["python", "sql", "spark", "aws", "docker", "git"],
  "ML Engineer":                ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "docker"],
  "AI Engineer":                ["python", "deep learning", "natural language processing", "tensorflow", "pytorch", "gcp"],
  "Software Engineer":          ["python", "javascript", "git", "docker", "sql", "system design"],
  "Business Analyst":           ["sql", "tableau", "power bi", "statistics", "agile", "data analysis"],
  "DevOps/MLOps Engineer":      ["docker", "kubernetes", "terraform", "aws", "linux", "git"],
  "Cloud Engineer":             ["aws", "gcp", "terraform", "docker", "kubernetes", "linux"],
  "Frontend Developer":         ["javascript", "react", "git"],
  "Full Stack Developer":       ["javascript", "react", "python", "sql", "git", "docker"],
  "Data Science Intern":        ["python", "machine learning", "sql", "statistics", "data analysis"],
  "Software Engineering Intern":["python", "javascript", "git", "sql"],
  "Business Analyst Intern":    ["sql", "tableau", "power bi", "data analysis", "agile"],
};

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION_BANK — all 14 roles
// ─────────────────────────────────────────────────────────────────────────────
export const QUESTION_BANK = {
  "Data Scientist": {
    Technical: [
      "Explain the bias-variance tradeoff and how you handle it in practice.",
      "What is the difference between L1 and L2 regularization? When do you use each?",
      "How do you handle imbalanced datasets? Name at least 3 techniques.",
      "Explain how XGBoost works under the hood. What makes it better than a single decision tree?",
      "What is precision vs recall? When would you prioritize one over the other?",
      "Explain the concept of cross-validation and why it matters.",
      "What is the curse of dimensionality and how do you deal with it?",
    ],
    Behavioral: [
      "Tell me about a time you had to explain complex data findings to non-technical stakeholders.",
      "Describe a project where your model didn't perform as expected. What did you do?",
      "How do you decide which features to include in your model?",
    ],
  },
  "Data Analyst": {
    Technical: [
      "What is the difference between INNER JOIN and LEFT JOIN? Give an example.",
      "How do you calculate moving averages in SQL?",
      "Explain the difference between HAVING and WHERE clause.",
      "How do you identify and handle outliers in a dataset?",
      "What is a CTE (Common Table Expression) and when would you use it?",
      "How would you calculate YoY growth rate for a metric in SQL?",
      "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?",
    ],
    Behavioral: [
      "Tell me about a time your analysis directly changed a business decision.",
      "How do you validate the accuracy and trustworthiness of your analysis?",
      "Describe a dashboard you built. What metrics did you track and why?",
    ],
  },
  "Data Engineer": {
    Technical: [
      "What is the difference between a data lake and a data warehouse?",
      "Explain the ETL vs ELT debate. When would you choose each?",
      "How would you design a pipeline to ingest 10 million records per day reliably?",
      "What is Apache Spark? What is the difference between transformations and actions?",
      "Explain partitioning and why it matters in big data systems.",
      "How do you handle schema evolution in a data pipeline?",
      "What is Apache Kafka and when would you use it over a database?",
    ],
    Behavioral: [
      "Describe the most complex data pipeline you've built. What were the bottlenecks?",
      "How do you ensure data quality in your pipelines?",
      "Tell me about a time a pipeline failed in production. How did you fix it?",
    ],
  },
  "ML Engineer": {
    Technical: [
      "What is the difference between model training and model inference?",
      "How do you deploy a machine learning model to production?",
      "What is model drift and how do you detect/fix it?",
      "Explain the difference between online learning and batch learning.",
      "What is feature engineering? Give 3 techniques you've used.",
      "How would you scale a model to serve 1 million predictions per day?",
      "What is A/B testing and how do you use it for ML models?",
    ],
    Behavioral: [
      "Describe a model you deployed to production. What challenges did you face?",
      "How do you monitor model performance after deployment?",
      "Tell me about a time you had to retrain a model due to data drift.",
    ],
  },
  "AI Engineer": {
    Technical: [
      "What is the difference between fine-tuning and RAG (Retrieval-Augmented Generation)?",
      "Explain how transformer architecture works at a high level.",
      "What are embeddings and how do you use them in AI applications?",
      "What is the difference between GPT, BERT, and T5 architectures?",
      "How do you evaluate an LLM-based application?",
      "What is prompt engineering? Give examples of techniques (chain-of-thought, few-shot).",
      "What are vector databases? When would you use Pinecone/ChromaDB?",
    ],
    Behavioral: [
      "Describe an AI application you built. What LLM did you use and why?",
      "How do you handle hallucinations in LLM outputs for a production system?",
      "Tell me about a time you evaluated multiple AI models and chose one. What was your process?",
    ],
  },
  "Software Engineer": {
    Technical: [
      "What is the time and space complexity of common data structures (HashMap, ArrayList, LinkedList)?",
      "Explain SOLID principles. Give an example of each.",
      "What is the difference between a process and a thread?",
      "How does garbage collection work in Java/Python?",
      "Explain REST vs GraphQL. When would you choose GraphQL?",
      "What is a microservices architecture and what problems does it solve?",
      "How do you design a URL shortener (classic system design)?",
    ],
    Behavioral: [
      "Tell me about the most technically complex project you've built.",
      "Describe a time you had a disagreement with a teammate on a technical decision.",
      "How do you approach debugging a production issue at 3am?",
    ],
  },
  "Business Analyst": {
    Technical: [
      "How do you gather and prioritize requirements from multiple stakeholders?",
      "Explain the difference between functional and non-functional requirements.",
      "What is a use case diagram and when do you use it?",
      "How do you write user stories? What is the INVEST criteria?",
      "Explain the difference between Agile, Scrum, and Kanban.",
      "How would you calculate ROI for a new feature request?",
      "What tools do you use for process modeling (BPMN, flowcharts)?",
    ],
    Behavioral: [
      "Describe a time you had to say no to a stakeholder's feature request. How did you handle it?",
      "Tell me about a requirement you misunderstood. What happened and what did you learn?",
      "How do you bridge the gap between technical teams and business users?",
    ],
  },
  "DevOps/MLOps Engineer": {
    Technical: [
      "What is CI/CD? Walk me through a pipeline you've set up.",
      "Explain Infrastructure as Code (IaC). What is Terraform and how does it work?",
      "What is Kubernetes? Explain Pods, Deployments, and Services.",
      "How do you implement blue-green deployment vs canary releases?",
      "What is observability? Explain metrics, logs, and traces.",
      "What is an MLOps pipeline? How is it different from a regular DevOps pipeline?",
      "How do you handle secrets management in a production environment?",
    ],
    Behavioral: [
      "Describe a major production outage you helped resolve. What was your RCA process?",
      "How do you balance speed of deployment with system stability?",
      "Tell me about a CI/CD pipeline you built from scratch.",
    ],
  },
  "Cloud Engineer": {
    Technical: [
      "What is the difference between IaaS, PaaS, and SaaS?",
      "Explain VPC, subnets, and security groups in AWS/GCP.",
      "What is auto-scaling? How do you configure it in AWS?",
      "What is the difference between S3, EFS, and EBS in AWS?",
      "How do you architect a highly available application on AWS?",
      "What is serverless computing? When would you use Lambda over EC2?",
      "How do you estimate and optimize cloud costs?",
    ],
    Behavioral: [
      "Describe a cloud migration project you worked on. What were the biggest challenges?",
      "Tell me about a time you significantly reduced cloud costs.",
      "How do you ensure security compliance in a multi-cloud environment?",
    ],
  },
  "Frontend Developer": {
    Technical: [
      "What is the difference between == and === in JavaScript?",
      "Explain the JavaScript event loop. What is the call stack and callback queue?",
      "What is the Virtual DOM and how does React use it?",
      "What are React hooks? Explain useState, useEffect, and useContext.",
      "What is CSS specificity? How does the cascade work?",
      "Explain the difference between Flexbox and CSS Grid.",
      "What is lazy loading and code splitting in React?",
    ],
    Behavioral: [
      "Describe the most complex UI component you've built.",
      "How do you approach cross-browser compatibility issues?",
      "Tell me about a performance optimization you made on a frontend application.",
    ],
  },
  "Full Stack Developer": {
    Technical: [
      "Explain the request-response lifecycle from browser to database.",
      "What is the difference between REST and GraphQL APIs?",
      "How do you handle authentication in a full stack app (JWT, sessions, OAuth)?",
      "What is CORS and how do you fix it?",
      "How do you prevent SQL injection in a Node.js + PostgreSQL app?",
      "Explain database indexing and when to use composite indexes.",
      "What is the N+1 query problem and how do you solve it?",
    ],
    Behavioral: [
      "Describe a full stack project you built end-to-end.",
      "How do you decide when to put logic in the frontend vs backend?",
      "Tell me about a scalability challenge you solved.",
    ],
  },
  "Data Science Intern": {
    Technical: [
      "What is the difference between supervised and unsupervised learning?",
      "What is pandas and what are the most commonly used operations?",
      "Explain what a confusion matrix is and how to read it.",
      "What is linear regression? What assumptions does it make?",
      "How do you handle missing values in a dataset?",
    ],
    Behavioral: [
      "Why are you interested in data science?",
      "Tell me about a personal project or course where you applied ML/data analysis.",
      "How do you approach a problem when you're stuck and don't know the answer?",
    ],
  },
  "Software Engineering Intern": {
    Technical: [
      "What is the difference between an array and a linked list?",
      "Explain what Object-Oriented Programming is. What are the 4 pillars?",
      "What is Big O notation? What is the O(n²) complexity of bubble sort?",
      "What is version control? Explain the difference between git merge and git rebase.",
      "What is recursion? Give an example and explain the base case.",
    ],
    Behavioral: [
      "Why do you want to be a software engineer?",
      "Tell me about a project you built (personal, college, or hackathon).",
      "Describe a time you had to learn something new quickly. How did you approach it?",
    ],
  },
  "Business Analyst Intern": {
    Technical: [
      "What is a stakeholder? How do you identify them in a project?",
      "What is a SWOT analysis? Walk me through how you'd do one.",
      "Explain what a user story is. Can you write one for an e-commerce checkout feature?",
      "What is the difference between a business requirement and a functional requirement?",
      "How would you use Excel/SQL to analyze customer sales data?",
    ],
    Behavioral: [
      "Why are you interested in business analysis?",
      "Tell me about a time you had to present a finding or analysis to a group.",
      "Describe a situation where you had to work with limited or unclear information.",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATIC_PROJECTS — all 14 roles
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_PROJECTS = {
  "Data Scientist": [
    { title: "Customer Churn Prediction", difficulty: "Intermediate", duration: "2-3 weeks", description: "Build an ML model to predict which customers will leave a subscription service. Use SHAP for explainability.", skills: ["Python", "Scikit-learn", "XGBoost", "SHAP", "Pandas"], dataset: "Telco Customer Churn (Kaggle)", impact: "Reduces churn — saves millions for subscription businesses" },
    { title: "Movie Recommendation System", difficulty: "Intermediate", duration: "2-3 weeks", description: "Build a collaborative filtering recommendation system using matrix factorization on real movie ratings.", skills: ["Python", "Surprise", "Pandas", "Matrix Factorization"], dataset: "MovieLens 100K (GroupLens)", impact: "Used by Netflix, Amazon, Spotify at scale" },
    { title: "Sentiment Analysis Dashboard", difficulty: "Intermediate", duration: "2 weeks", description: "Classify product reviews as positive/negative and build a live dashboard showing sentiment trends over time.", skills: ["Python", "NLTK", "scikit-learn", "Streamlit"], dataset: "Amazon Product Reviews (Kaggle)", impact: "Real-time brand reputation monitoring" },
    { title: "House Price Prediction", difficulty: "Beginner", duration: "1 week", description: "Predict house prices using regression with feature engineering, cross-validation, and a Streamlit UI.", skills: ["Python", "Pandas", "Scikit-learn", "Streamlit"], dataset: "Ames Housing Dataset (Kaggle)", impact: "Classic end-to-end ML project for any portfolio" },
  ],
  "Data Analyst": [
    { title: "Sales Performance Dashboard", difficulty: "Beginner", duration: "1 week", description: "Build an interactive dashboard analyzing sales data with filters, KPIs, and time-series charts.", skills: ["Python", "Plotly", "Streamlit", "Pandas", "SQL"], dataset: "Superstore Sales Dataset (Kaggle)", impact: "Every business needs this — immediate real-world value" },
    { title: "SQL Business Intelligence Report", difficulty: "Intermediate", duration: "2 weeks", description: "Write complex SQL queries (CTEs, window functions, RANK) to answer 10 business questions on a retail database.", skills: ["PostgreSQL", "CTEs", "Window Functions", "Tableau"], dataset: "Northwind Database", impact: "Shows SQL depth to hiring managers" },
    { title: "COVID-19 Data Story", difficulty: "Beginner", duration: "1 week", description: "Create a compelling data story visualizing COVID-19 trends — cases, deaths, vaccinations by country.", skills: ["Python", "Plotly", "Pandas", "Folium (maps)"], dataset: "Our World in Data (free)", impact: "Public data storytelling — shareable and visible" },
    { title: "A/B Test Analysis Report", difficulty: "Intermediate", duration: "2 weeks", description: "Analyze results from a simulated A/B test using statistical hypothesis testing to make a business recommendation.", skills: ["Python", "SciPy", "Pandas", "Statistics"], dataset: "E-commerce A/B Test Dataset (Kaggle)", impact: "Core skill for product and growth analyst roles" },
  ],
  "Data Engineer": [
    { title: "End-to-End ETL Pipeline", difficulty: "Intermediate", duration: "3 weeks", description: "Build a batch pipeline that ingests raw CSV data, transforms it, and loads it into a PostgreSQL warehouse with Airflow.", skills: ["Python", "Apache Airflow", "PostgreSQL", "Docker"], dataset: "NYC Taxi Trips (public)", impact: "Shows production-ready data engineering skills" },
    { title: "Real-Time Streaming Dashboard", difficulty: "Advanced", duration: "4 weeks", description: "Stream live data using Apache Kafka, process with PySpark Streaming, and visualize in real-time.", skills: ["Kafka", "PySpark", "Python", "Docker"], dataset: "Twitter/Reddit API or Wikipedia edits stream", impact: "Rare, high-value skill that companies actively hire for" },
    { title: "Data Lakehouse on AWS S3", difficulty: "Intermediate", duration: "3 weeks", description: "Build a modern data lakehouse using S3 + Glue + Athena + Delta Lake for cheap scalable analytics.", skills: ["AWS S3", "AWS Glue", "Athena", "Python"], dataset: "Public S3 datasets (AWS open data)", impact: "Demonstrates cloud-native data engineering" },
  ],
  "ML Engineer": [
    { title: "ML Model API Deployment", difficulty: "Intermediate", duration: "2 weeks", description: "Train a classification model and deploy it as a production REST API with FastAPI, Docker, and CI/CD.", skills: ["Python", "FastAPI", "Docker", "scikit-learn", "GitHub Actions"], dataset: "Any classification dataset", impact: "Bridges the gap between data science and engineering" },
    { title: "Feature Store Implementation", difficulty: "Advanced", duration: "4 weeks", description: "Build a simple feature store using Feast or custom code to serve features consistently for training and inference.", skills: ["Python", "Feast", "Redis", "PostgreSQL"], dataset: "Credit card fraud (Kaggle)", impact: "Highly valued ML infrastructure skill" },
    { title: "MLflow Experiment Tracker", difficulty: "Intermediate", duration: "2 weeks", description: "Set up MLflow to track experiments, log metrics, compare runs, and register the best model.", skills: ["Python", "MLflow", "scikit-learn", "Pandas"], dataset: "Wine Quality Dataset", impact: "Industry-standard MLOps tool used everywhere" },
  ],
  "AI Engineer": [
    { title: "RAG Chatbot on Your Documents", difficulty: "Intermediate", duration: "3 weeks", description: "Build a chatbot that answers questions about your PDF documents using embeddings + ChromaDB + LLM.", skills: ["Python", "LangChain", "ChromaDB", "OpenAI/Groq API", "FastAPI"], dataset: "Any PDF documents", impact: "The #1 requested AI project in 2024-25" },
    { title: "AI-Powered Resume Screener", difficulty: "Intermediate", duration: "2 weeks", description: "Build a tool that scores resumes against a job description using LLMs and returns structured feedback.", skills: ["Python", "LangChain", "Groq API", "Pydantic", "Streamlit"], dataset: "Kaggle Resume Dataset", impact: "Directly solves a real hiring problem" },
    { title: "Multi-Agent Research Assistant", difficulty: "Advanced", duration: "4 weeks", description: "Build a multi-agent system using LangGraph where agents search the web, summarize content, and write reports.", skills: ["Python", "LangGraph", "Tavily API", "Groq API"], dataset: "Web search (Tavily)", impact: "Cutting-edge agentic AI — top in-demand skill 2025" },
  ],
  "Software Engineer": [
    { title: "URL Shortener (System Design)", difficulty: "Intermediate", duration: "2 weeks", description: "Build a production-grade URL shortener with Redis caching, PostgreSQL storage, FastAPI, and Docker.", skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"], dataset: "Self-generated", impact: "Classic system design interview project" },
    { title: "REST API with Auth & Rate Limiting", difficulty: "Intermediate", duration: "2 weeks", description: "Build a secure REST API with JWT auth, role-based access, rate limiting, and Swagger documentation.", skills: ["Python/Node.js", "JWT", "Redis", "Docker", "Swagger"], dataset: "Self-generated", impact: "Production backend engineering fundamentals" },
    { title: "GitHub Activity Analyzer", difficulty: "Beginner", duration: "1 week", description: "Build a tool that analyzes any GitHub profile's commit patterns, language stats, and productivity trends.", skills: ["Python", "GitHub API", "Streamlit", "Pandas"], dataset: "GitHub REST API (free)", impact: "Easy to demo and share with recruiters" },
  ],
  "Business Analyst": [
    { title: "Power BI Business Dashboard", difficulty: "Beginner", duration: "1 week", description: "Build a multi-page Power BI dashboard with slicers, drill-through, KPIs, and automated refresh.", skills: ["Power BI", "DAX", "Excel", "SQL"], dataset: "Superstore or AdventureWorks", impact: "Hiring managers can immediately see your BI skill" },
    { title: "Requirements Specification Document", difficulty: "Beginner", duration: "1 week", description: "Write a full BRD and FRD for a mock food delivery app, with use cases, user stories, and process flows.", skills: ["BPMN", "User Stories", "Confluence/Notion", "Lucidchart"], dataset: "Self-designed", impact: "Demonstrates core BA documentation skills" },
    { title: "Market Entry Analysis", difficulty: "Intermediate", duration: "2 weeks", description: "Write a strategic analysis for a hypothetical company entering a new market: TAM/SAM/SOM, competitor map, SWOT.", skills: ["Excel", "PowerPoint", "Research", "Financial modeling"], dataset: "Public reports (Statista, McKinsey)", impact: "Shows business thinking — differentiates from analyst interns" },
  ],
  "DevOps/MLOps Engineer": [
    { title: "CI/CD Pipeline with GitHub Actions", difficulty: "Intermediate", duration: "2 weeks", description: "Build a full CI/CD pipeline: lint → test → Docker build → push to registry → deploy to cloud.", skills: ["GitHub Actions", "Docker", "AWS ECR/ECS", "Python"], dataset: "Any existing app", impact: "Core DevOps skill — every company needs this" },
    { title: "Kubernetes Microservices App", difficulty: "Advanced", duration: "4 weeks", description: "Deploy a 3-service app (frontend, backend, database) on Kubernetes with ingress, secrets, and health checks.", skills: ["Kubernetes", "Docker", "Helm", "NGINX Ingress"], dataset: "Self-built app", impact: "K8s is the most in-demand DevOps skill" },
    { title: "MLOps Pipeline with MLflow + Airflow", difficulty: "Advanced", duration: "4 weeks", description: "Orchestrate an end-to-end ML pipeline: data ingestion → training → evaluation → model registration → deployment.", skills: ["MLflow", "Airflow", "Docker", "FastAPI", "Python"], dataset: "Any ML dataset", impact: "Rare — combines ML + DevOps for top-paid roles" },
  ],
  "Cloud Engineer": [
    { title: "3-Tier App on AWS", difficulty: "Intermediate", duration: "2 weeks", description: "Deploy a 3-tier (web + app + db) architecture on AWS using EC2, RDS, Load Balancer, and Auto Scaling.", skills: ["AWS EC2", "RDS", "ALB", "Terraform"], dataset: "Self-built app", impact: "Fundamental cloud architecture project" },
    { title: "Serverless Data Pipeline on GCP", difficulty: "Intermediate", duration: "2 weeks", description: "Build a serverless event-driven pipeline: Cloud Functions → Pub/Sub → BigQuery → Looker Studio.", skills: ["GCP Cloud Functions", "Pub/Sub", "BigQuery", "Python"], dataset: "Public GCP datasets", impact: "Shows multi-service GCP expertise" },
    { title: "Terraform Infrastructure Automation", difficulty: "Intermediate", duration: "2 weeks", description: "Provision a complete AWS infrastructure (VPC, EC2, RDS, S3, IAM) using Terraform modules and remote state.", skills: ["Terraform", "AWS", "HCL", "S3 (state backend)"], dataset: "Self-designed", impact: "IaC is mandatory for any senior cloud role" },
  ],
  "Frontend Developer": [
    { title: "Weather App with API Integration", difficulty: "Beginner", duration: "1 week", description: "Build a beautiful responsive weather app using OpenWeatherMap API with location detection and animated icons.", skills: ["React", "CSS", "REST API", "Geolocation API"], dataset: "OpenWeatherMap API (free)", impact: "Classic project that showcases API + UI skills" },
    { title: "Personal Portfolio Website", difficulty: "Beginner", duration: "1 week", description: "Build a stunning animated portfolio with dark mode, project showcase, skill section, and contact form.", skills: ["React", "CSS Animations", "Framer Motion", "Netlify"], dataset: "Self", impact: "Most important project — your professional face online" },
    { title: "Real-Time Chat App", difficulty: "Intermediate", duration: "2 weeks", description: "Build a WhatsApp-like chat app with real-time messaging using WebSockets, rooms, and read receipts.", skills: ["React", "Socket.io", "Node.js", "CSS"], dataset: "Self-generated", impact: "Demonstrates real-time systems and fullstack capability" },
  ],
  "Full Stack Developer": [
    { title: "Full Stack Task Manager (Trello Clone)", difficulty: "Intermediate", duration: "3 weeks", description: "Build a drag-and-drop task board with user auth, boards, cards, labels, and real-time updates.", skills: ["React", "Node.js", "PostgreSQL", "Socket.io", "JWT"], dataset: "Self-generated", impact: "End-to-end full stack — shows complete capability" },
    { title: "E-Commerce Store", difficulty: "Advanced", duration: "4 weeks", description: "Build a full e-commerce site with product catalog, cart, Stripe payments, order history, and admin panel.", skills: ["React", "Node.js/FastAPI", "PostgreSQL", "Stripe", "Docker"], dataset: "Self-generated", impact: "The gold standard full stack portfolio project" },
    { title: "Job Board Platform", difficulty: "Intermediate", duration: "3 weeks", description: "Build a job listing platform where companies post jobs and candidates apply — with search, filters, and email notifications.", skills: ["React", "Node.js", "PostgreSQL", "Nodemailer", "Redis"], dataset: "Self-generated", impact: "Shows real product-thinking + backend complexity" },
  ],
  "Data Science Intern": [
    { title: "Exploratory Data Analysis (EDA) Report", difficulty: "Beginner", duration: "3-5 days", description: "Perform comprehensive EDA on a real dataset: distributions, correlations, missing data, and business insights.", skills: ["Python", "Pandas", "Seaborn", "Matplotlib", "Jupyter"], dataset: "Titanic or Iris Dataset (Kaggle)", impact: "Fundamental data skill every DS intern must show" },
    { title: "Simple Classifier with Sklearn", difficulty: "Beginner", duration: "1 week", description: "Build and compare 3 classifiers (logistic regression, decision tree, random forest) with proper train/test split.", skills: ["Python", "Scikit-learn", "Pandas", "Matplotlib"], dataset: "Heart Disease Dataset (Kaggle)", impact: "Shows you can build and evaluate basic ML models" },
    { title: "Data Cleaning + Feature Engineering Pipeline", difficulty: "Beginner", duration: "1 week", description: "Take a messy real-world dataset, clean it, engineer meaningful features, and document every decision.", skills: ["Python", "Pandas", "NumPy", "Jupyter"], dataset: "Airbnb NYC Listings (Kaggle)", impact: "80% of real DS work — crucial to demonstrate" },
  ],
  "Software Engineering Intern": [
    { title: "CLI To-Do App in Python", difficulty: "Beginner", duration: "3-5 days", description: "Build a command-line task manager with add/delete/list/complete commands and JSON persistence.", skills: ["Python", "JSON", "argparse", "Git"], dataset: "Self-generated", impact: "Shows clean code, version control, and basic logic" },
    { title: "REST API with Basic CRUD", difficulty: "Beginner", duration: "1 week", description: "Build a simple blog API with FastAPI/Express: create, read, update, delete posts with proper HTTP status codes.", skills: ["Python/Node.js", "FastAPI/Express", "SQLite", "Postman"], dataset: "Self-generated", impact: "Foundation of backend development" },
    { title: "Sorting Algorithm Visualizer", difficulty: "Beginner", duration: "1 week", description: "Build an interactive visualizer showing bubble sort, merge sort, and quicksort animating in real time.", skills: ["JavaScript", "HTML Canvas", "CSS", "React"], dataset: "Self-generated", impact: "Shows DSA knowledge + frontend in one project" },
  ],
  "Business Analyst Intern": [
    { title: "Company Analysis Report", difficulty: "Beginner", duration: "3-5 days", description: "Write a structured competitive analysis of a company (e.g. Swiggy vs Zomato): business model, revenue, strengths/weaknesses.", skills: ["PowerPoint", "Research", "Excel", "SWOT"], dataset: "Public reports (company filings, news)", impact: "Shows business thinking — most wanted intern skill" },
    { title: "SQL Data Analysis for Business", difficulty: "Beginner", duration: "1 week", description: "Answer 8 business questions using SQL on a retail database: top customers, revenue trends, churn flags.", skills: ["SQL", "Excel", "PowerPoint"], dataset: "Northwind or Chinook DB", impact: "Combines SQL + business communication" },
    { title: "Process Improvement Proposal", difficulty: "Beginner", duration: "1 week", description: "Map a current-state process (e.g. food delivery order flow), identify 3 inefficiencies, and propose the future-state.", skills: ["Lucidchart/draw.io", "BPMN", "PowerPoint"], dataset: "Self-designed", impact: "Core BA deliverable — directly mirrors real job tasks" },
  ],
};

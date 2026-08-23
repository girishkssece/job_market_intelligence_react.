export const TARGET_ROLES = [
  "Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "ML Engineer",
  "AI Engineer",
  "Software Engineer",
  "Business Analyst",
  "DevOps/MLOps Engineer",
  "Cloud Engineer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Science Intern",
  "Software Engineering Intern",
  "Business Analyst Intern",
];

export const COURSES = {
  python: [
    { name: "Python for Everybody", platform: "Coursera", provider: "University of Michigan", level: "Beginner", price: "Free to audit", url: "https://www.coursera.org/specializations/python", duration: "8 months" },
    { name: "Python Bootcamp", platform: "Udemy", provider: "Jose Portilla", level: "Beginner", price: "~₹500", url: "https://www.udemy.com/course/complete-python-bootcamp/", duration: "22 hours" },
    { name: "Python Tutorial", platform: "YouTube", provider: "Corey Schafer", level: "Beginner", price: "Free", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU", duration: "Self-paced" },
  ],
  "machine learning": [
    { name: "Machine Learning Specialization", platform: "Coursera", provider: "Andrew Ng / Stanford", level: "Intermediate", price: "Free to audit", url: "https://www.coursera.org/specializations/machine-learning-introduction", duration: "3 months" },
    { name: "ML Course", platform: "fast.ai", provider: "Jeremy Howard", level: "Intermediate", price: "Free", url: "https://course.fast.ai", duration: "Self-paced" },
    { name: "Hands-On ML with Scikit-Learn", platform: "Book/GitHub", provider: "Aurélien Géron", level: "Intermediate", price: "Free on GitHub", url: "https://github.com/ageron/handson-ml3", duration: "Self-paced" },
  ],
  "deep learning": [
    { name: "Deep Learning Specialization", platform: "Coursera", provider: "Andrew Ng / DeepLearning.AI", level: "Advanced", price: "Free to audit", url: "https://www.coursera.org/specializations/deep-learning", duration: "5 months" },
    { name: "Practical Deep Learning", platform: "fast.ai", provider: "Jeremy Howard", level: "Intermediate", price: "Free", url: "https://course.fast.ai", duration: "Self-paced" },
  ],
  sql: [
    { name: "SQL for Data Science", platform: "Coursera", provider: "UC Davis", level: "Beginner", price: "Free to audit", url: "https://www.coursera.org/learn/sql-for-data-science", duration: "4 weeks" },
    { name: "SQLZoo", platform: "SQLZoo", provider: "SQLZoo", level: "Beginner", price: "Free", url: "https://sqlzoo.net", duration: "Self-paced" },
  ],
  aws: [
    { name: "AWS Cloud Practitioner", platform: "AWS", provider: "Amazon", level: "Beginner", price: "Free", url: "https://aws.amazon.com/training/learn-about/cloud-practitioner", duration: "6 hours" },
    { name: "AWS Solutions Architect", platform: "Udemy", provider: "Stephane Maarek", level: "Intermediate", price: "~₹500", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", duration: "27 hours" },
  ],
  react: [
    { name: "React Official Tutorial", platform: "React.dev", provider: "Meta/React", level: "Beginner", price: "Free", url: "https://react.dev/learn", duration: "Self-paced" },
    { name: "Full Stack Open", platform: "University of Helsinki", provider: "U of Helsinki", level: "Intermediate", price: "Free", url: "https://fullstackopen.com", duration: "Self-paced" },
  ]
};

export const ROLE_COURSES = {
  "Data Analyst": ["python", "sql", "tableau", "power bi", "statistics", "data analysis"],
  "Data Scientist": ["python", "machine learning", "statistics", "sql", "deep learning", "natural language processing"],
  "Data Engineer": ["python", "sql", "spark", "aws", "docker", "git"],
  "ML Engineer": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "docker"],
  "AI Engineer": ["python", "deep learning", "natural language processing", "tensorflow", "pytorch"],
  "Software Engineer": ["python", "javascript", "git", "docker", "sql"],
  "Frontend Developer": ["javascript", "react", "git"],
  "Full Stack Developer": ["javascript", "react", "python", "sql", "git", "docker"],
};

export const QUESTION_BANK = {
  "Data Scientist": {
    Technical: [
      "Explain the bias-variance tradeoff and how you handle it.",
      "What is the difference between L1 and L2 regularization?",
      "How do you handle imbalanced datasets?",
      "Explain how XGBoost works under the hood.",
      "What is precision vs recall and when to use each?"
    ],
    Behavioral: [
      "Tell me about a time you had to explain complex data findings to non-technical stakeholders.",
      "Describe a project where your model didn't perform as expected. What did you do?"
    ]
  },
  "Data Analyst": {
    Technical: [
      "What is the difference between INNER JOIN and LEFT JOIN?",
      "How do you calculate moving averages in SQL?",
      "Explain the difference between HAVING and WHERE clause.",
      "How do you identify outliers in a dataset?"
    ],
    Behavioral: [
      "Tell me about a time your analysis changed a business decision.",
      "How do you validate the accuracy of your analysis?"
    ]
  }
};

export const STATIC_PROJECTS = {
  "Data Scientist": [
    {
      title: "Customer Churn Prediction",
      difficulty: "Intermediate",
      duration: "2-3 weeks",
      description: "Build an ML model to predict which customers will leave a subscription service.",
      skills: ["Python", "Scikit-learn", "Pandas", "XGBoost", "SHAP"],
      dataset: "Telco Customer Churn (Kaggle)",
      github_topics: ["machine-learning", "churn-prediction"],
      impact: "High — directly relevant to business problems"
    },
    {
      title: "Movie Recommendation System",
      difficulty: "Intermediate",
      duration: "2-3 weeks",
      description: "Build a collaborative filtering recommendation system using real movie rating data.",
      skills: ["Python", "Surprise", "Pandas", "Matrix Factorization"],
      dataset: "MovieLens Dataset",
      github_topics: ["recommendation-system", "collaborative-filtering"],
      impact: "High — used by Netflix, Amazon, Spotify"
    }
  ],
  "Data Analyst": [
    {
      title: "Sales Performance Dashboard",
      difficulty: "Beginner",
      duration: "1 week",
      description: "Build an interactive dashboard analyzing sales data with filters and KPIs.",
      skills: ["Python", "Plotly", "Streamlit", "Pandas", "SQL"],
      dataset: "Superstore Sales Dataset (Kaggle)",
      github_topics: ["dashboard", "data-visualization"],
      impact: "High — every business needs this"
    }
  ]
};

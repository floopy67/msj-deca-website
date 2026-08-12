import { requireSchoolUser } from "./auth.js?v=20260812-1";

const questions = [
  {
    question: "Which kind of challenge sounds most interesting?",
    options: [
      ["Designing a campaign that persuades an audience", "marketing"],
      ["Analyzing money, risk, and financial decisions", "finance"],
      ["Creating a memorable guest or travel experience", "hospitality"],
      ["Improving how a team or organization operates", "management"],
      ["Turning an original idea into a business", "entrepreneurship"]
    ]
  },
  {
    question: "Which school assignment would you choose first?",
    options: [
      ["Create a brand launch", "marketing"],
      ["Evaluate an investment plan", "finance"],
      ["Plan a major event or trip", "hospitality"],
      ["Solve a workplace conflict", "management"],
      ["Pitch a new product", "entrepreneurship"]
    ]
  },
  {
    question: "What do you most enjoy doing in a presentation?",
    options: [
      ["Explaining what will attract customers", "marketing"],
      ["Using numbers to support a recommendation", "finance"],
      ["Focusing on service and customer experience", "hospitality"],
      ["Building a clear plan for people and processes", "management"],
      ["Defending a creative idea and business model", "entrepreneurship"]
    ]
  },
  {
    question: "Which workplace would you most like to study?",
    options: [
      ["Advertising agency or retail brand", "marketing"],
      ["Bank, accounting firm, or investment company", "finance"],
      ["Hotel, restaurant, entertainment, or tourism company", "hospitality"],
      ["Human resources, operations, or consulting team", "management"],
      ["Startup or small business", "entrepreneurship"]
    ]
  },
  {
    question: "Which strength sounds most like you?",
    options: [
      ["Understanding audiences and communicating creatively", "marketing"],
      ["Thinking carefully with numbers and evidence", "finance"],
      ["Staying calm while helping people", "hospitality"],
      ["Organizing teams and resolving problems", "management"],
      ["Taking initiative and experimenting with ideas", "entrepreneurship"]
    ]
  },
  {
    question: "What kind of competition experience sounds best?",
    options: [
      ["Promote a product, service, or cause", "marketing"],
      ["Recommend a responsible financial strategy", "finance"],
      ["Respond to a guest-service scenario", "hospitality"],
      ["Handle a business operations or leadership scenario", "management"],
      ["Develop and pitch my own concept", "entrepreneurship"]
    ]
  }
];

const results = {
  marketing: {
    title: "Marketing",
    description: "You may enjoy understanding audiences, shaping messages, and creating strategies that influence customer decisions.",
    events: "Explore Marketing Communications Series, Retail Merchandising Series, and Integrated Marketing Campaign events."
  },
  finance: {
    title: "Finance",
    description: "You may enjoy using evidence, numbers, and careful analysis to make responsible business recommendations.",
    events: "Explore Financial Consulting, Finance Operations Research, and Accounting Applications events."
  },
  hospitality: {
    title: "Hospitality & Tourism",
    description: "You may enjoy service, fast-moving situations, event planning, travel, and creating positive guest experiences.",
    events: "Explore Hospitality Services Team Decision Making, Hotel and Lodging Management, and Travel and Tourism events."
  },
  management: {
    title: "Business Management & Administration",
    description: "You may enjoy improving organizations, coordinating people, and solving workplace or operations problems.",
    events: "Explore Human Resources Management, Business Law and Ethics, and Business Services events."
  },
  entrepreneurship: {
    title: "Entrepreneurship",
    description: "You may enjoy building original ideas, experimenting, taking initiative, and explaining how a new venture could succeed.",
    events: "Explore Entrepreneurship Series, Start-Up Business Plan, and Independent Business Plan events."
  }
};

const shell = document.querySelector("[data-quiz-shell]");
const progress = document.querySelector("[data-quiz-progress]");
const stepLabel = document.querySelector("[data-quiz-step]");
const questionHeading = document.querySelector("[data-quiz-question]");
const optionsContainer = document.querySelector("[data-quiz-options]");
const resultContainer = document.querySelector("[data-quiz-result]");
const restartButton = document.querySelector("[data-quiz-restart]");
let currentQuestion = 0;
let scores = { marketing: 0, finance: 0, hospitality: 0, management: 0, entrepreneurship: 0 };

function renderQuestion() {
  const question = questions[currentQuestion];
  stepLabel.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progress.style.width = `${(currentQuestion / questions.length) * 100}%`;
  questionHeading.textContent = question.question;
  optionsContainer.replaceChildren();

  question.options.forEach(([label, cluster]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = label;
    button.addEventListener("click", () => {
      scores[cluster] += 1;
      currentQuestion += 1;
      if (currentQuestion < questions.length) renderQuestion();
      else showResult();
    });
    optionsContainer.appendChild(button);
  });
}

function showResult() {
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const result = results[winner];
  progress.style.width = "100%";
  document.querySelector("[data-quiz-card]").hidden = true;
  resultContainer.hidden = false;
  resultContainer.querySelector("h2").textContent = result.title;
  resultContainer.querySelector("[data-result-description]").textContent = result.description;
  resultContainer.querySelector("[data-result-events]").textContent = result.events;
}

restartButton?.addEventListener("click", () => {
  currentQuestion = 0;
  scores = { marketing: 0, finance: 0, hospitality: 0, management: 0, entrepreneurship: 0 };
  resultContainer.hidden = true;
  document.querySelector("[data-quiz-card]").hidden = false;
  renderQuestion();
});

requireSchoolUser({
  onAllowed: () => {
    shell.hidden = false;
    renderQuestion();
  }
});

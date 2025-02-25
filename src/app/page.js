"use client";
import React, { useState, useEffect } from "react";
import useQuizStore from "../app/stores/quizStore";

// Total questions for the quiz.
const totalQuestions = 13;

// --- Static questions (Questions 1–8) ---
const staticQuestions = [
  {
    section: "Task Complexity Assessment",
    question: "How challenging was this task for you? (Scale 1-5)",
    inputType: "slider",
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 50, // initial value set to 50 (Moderate)
    labels: [
      "Very Easy",
      "Easy",
      "Moderate",
      "Challenging",
      "Very Challenging",
    ],
  },
  {
    section: "Task Complexity Assessment",
    question: "Which aspects were most complex?",
    inputType: "text",
    placeholder: "Describe the most complex aspects of this task...",
  },
  {
    section: "Task Complexity Assessment",
    question: "What prior experience helped you?",
    inputType: "text",
    placeholder: "Share any relevant prior experience...",
  },
  {
    section: "Challenges & Solutions",
    question: "What were your main technical challenges?",
    inputType: "text",
    placeholder: "Describe the technical challenges you faced...",
  },
  {
    section: "Challenges & Solutions",
    question: "How did you overcome these challenges?",
    inputType: "text",
    placeholder: "Explain your approach to solving these challenges...",
  },
  {
    section: "AI Assistance & Usage",
    question:
      "Which AI tools did you use during development? (ChatGPT, Gemini, GitHub Copilot, etc.)",
    inputType: "text",
    placeholder: "List the AI tools you used...",
  },
  {
    section: "AI Assistance & Usage",
    question: "How did you leverage these AI tools?",
    inputType: "text",
    placeholder:
      "Describe how you used AI tools in your development process...",
  },
  {
    section: "AI Assistance & Usage",
    question:
      "On a scale of 1-10, how dependent was your solution on AI assistance?",
    inputType: "slider",
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 50, // initial value set to 50 (maps to "5")
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
];

function QuizPage() {
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    addQuizData,
    updateQuizHistory,
    quizHistory,
  } = useQuizStore();

  // Local state for current question, answer, dynamic loading, error, and messages.
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loadingDynamic, setLoadingDynamic] = useState(false);
  const [error, setError] = useState("");
  // messages state is only used for dynamic questions
  const [messages, setMessages] = useState([
    { role: "user", content: "Dummy Python Code" },
  ]);

  // Load the current question based on the current index.
  useEffect(() => {
    if (currentQuestionIndex < staticQuestions.length) {
      setCurrentQuestion(staticQuestions[currentQuestionIndex]);
    } else {
      const fetchDynamic = async () => {
        setLoadingDynamic(true);
        try {
          const dynamicQuestion = await fetchDynamicQuestion(messages);
          setCurrentQuestion(dynamicQuestion);
          setLoadingDynamic(false);
        } catch (err) {
          setError(err.message);
          setLoadingDynamic(false);
        }
      };
      fetchDynamic();
    }
  }, [currentQuestionIndex, messages]);

  // When answer changes, always update quizHistory.
  // For dynamic questions only (currentQuestionIndex >= staticQuestions.length),
  // also update the messages state.
  useEffect(() => {
    if (currentQuestion) {
      const qNumber = currentQuestionIndex + 1;
      const entry = {
        role: "user",
        content: JSON.stringify({
          questionNumber: qNumber,
          section: currentQuestion.section || "",
          question: currentQuestion.question,
          options: currentQuestion.options || [],
          response: answer,
        }),
      };
      updateQuizHistory({
        questionNumber: qNumber,
        section: currentQuestion.section || "",
        question: currentQuestion.question,
        options: currentQuestion.options || [],
        response: answer,
      });
      if (currentQuestionIndex >= staticQuestions.length) {
        setMessages((prev) => {
          const idx = prev.findIndex((msg) => {
            try {
              const parsed = JSON.parse(msg.content);
              return parsed.questionNumber === qNumber;
            } catch (e) {
              return false;
            }
          });
          if (idx > -1) {
            const newMessages = [...prev];
            newMessages[idx] = entry;
            return newMessages;
          }
          return [...prev, entry];
        });
      }
    }
  }, [answer, currentQuestion, currentQuestionIndex, updateQuizHistory]);

  // Calculate progress percentage.
  const progress = Math.round((currentQuestionIndex / totalQuestions) * 100);

  // On "Next", validate, persist answer in quizData, and advance.
  const handleNext = () => {
    if (currentQuestion.required !== false && !answer) {
      alert("Please provide an answer.");
      return;
    }
    const qNumber = currentQuestionIndex + 1;
    const entry = {
      role: "user",
      content: JSON.stringify({
        questionNumber: qNumber,
        section: currentQuestion.section || "",
        question: currentQuestion.question,
        options: currentQuestion.options || [],
        response: answer,
      }),
    };
    addQuizData(qNumber, {
      questionNumber: qNumber,
      section: currentQuestion.section || "",
      question: currentQuestion.question,
      options: currentQuestion.options || [],
      response: answer,
    });
    // For dynamic questions, you can add the message again if needed.
    if (currentQuestionIndex >= staticQuestions.length) {
      setMessages((prev) => [...prev, entry]);
    }
    setAnswer(""); // Reset answer for next question.
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Quiz completed!");
    }
  };

  // fetchDynamicQuestion sends messages and appends the assistant's reply to messages.
  async function fetchDynamicQuestion(messagesParam) {
    const response = await fetch("/api/generateQuestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesParam }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch dynamic question");
    }
    const data = await response.json();
    // Append a new assistant message with the dynamic question.
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: JSON.stringify({
          question: data.question,
          options: data.options || [],
        }),
      },
    ]);
    return data;
  }

  // Render the input based on question type.
  const renderInput = () => {
    if (!currentQuestion) return null;
    switch (currentQuestion.inputType) {
      case "text":
        return (
          <input
            type="text"
            placeholder={currentQuestion.placeholder || ""}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        );
      case "slider":
        return (
          <div>
            <input
              type="range"
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              value={answer || currentQuestion.defaultValue}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <span style={{ marginLeft: "10px" }}>
              {answer || currentQuestion.defaultValue}
            </span>
          </div>
        );
      case "radio":
        return (
          <div>
            {currentQuestion.options.map((opt, idx) => (
              <label key={idx} style={{ marginRight: "12px" }}>
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={answer === opt}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (
    !currentQuestion ||
    (currentQuestionIndex >= staticQuestions.length && loadingDynamic)
  ) {
    return <div>Loading question...</div>;
  }

  return (
    <div
      style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}
    >
      <h1>Quiz</h1>
      <div style={{ marginBottom: "20px" }}>
        <div>Progress: {progress}%</div>
        <div>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>{currentQuestion.question}</h2>
        {renderInput()}
      </div>
      <button
        onClick={handleNext}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Next
      </button>
      {/* Debug: Render messages state */}
      <pre
        style={{ marginTop: "20px", background: "#f5f5f5", padding: "10px" }}
      >
        {JSON.stringify(messages, null, 2)}
      </pre>
    </div>
  );
}

export default QuizPage;

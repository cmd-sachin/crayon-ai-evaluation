"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Textarea,
  Chip,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import "../app/globals.css";

export default function QuizPage() {
  // State for storing questions fetched from API
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [timer, setTimer] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [answers, setAnswers] = useState({});

  // Message history state
  const [messages, setMessages] = useState([]);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("../api/generateQuestion");

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Calculate progress percentage
  const progressPercentage = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  const hasOptions =
    currentQuestion?.options && currentQuestion.options.length > 0;

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [timer, isTimerActive]);

  // Reset timer and answers when moving to next question
  useEffect(() => {
    setTimer(10);
    setIsTimerActive(true);
    setTextAnswer("");
    setSelectedOption("");
  }, [currentQuestionIndex]);

  // Handle next question button click
  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    // Save the current answer based on question type
    const currentAnswer = hasOptions ? selectedOption : textAnswer;

    // Update answers state
    setAnswers({
      ...answers,
      [currentQuestion.id]: currentAnswer,
    });

    // Create message object for the current Q&A interaction
    const messageObject = {
      role: "user",
      content: JSON.stringify({
        Question: currentQuestion.question,
        ...(hasOptions && { Options: currentQuestion.options }),
        Response: currentAnswer,
      }),
    };

    // Update messages history
    setMessages([...messages, messageObject]);

    // Move to the next question if not at the end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle quiz completion
      alert("Quiz completed! Thank you for your responses.");
      console.log("All messages:", messages);

      // Submit answers and messages to an API endpoint
      submitQuizData(answers, [...messages, messageObject]);
    }
  };

  // Submit quiz data to API
  const submitQuizData = async (answers, messageHistory) => {
    try {
      // Submit complete message history
      const messagesResponse = await fetch("/api/submit-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageHistory }),
      });

      if (!messagesResponse.ok) {
        throw new Error("Failed to submit message history");
      }

      const messagesResult = await messagesResponse.json();
      console.log("Message history submission result:", messagesResult);

      // Also submit answers separately if needed
      const answersResponse = await fetch("/api/submit-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!answersResponse.ok) {
        throw new Error("Failed to submit answers");
      }

      const answersResult = await answersResponse.json();
      console.log("Answers submission result:", answersResult);
    } catch (err) {
      console.error("Error submitting quiz data:", err);
    }
  };

  // Check if the current question is a technical question
  const isTechnicalQuestion = currentQuestionIndex >= 8;

  // If still loading questions
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingText}>Loading questions...</div>
      </div>
    );
  }

  // If there was an error fetching questions
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorText}>Error: {error}</div>
      </div>
    );
  }

  // If no questions were found
  if (!questions.length) {
    return (
      <div className={styles.container}>
        <div className={styles.noQuestionsText}>No questions available.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.quizCard}>
        <CardHeader className={styles.cardHeader}>
          <div className={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className={styles.timerContainer}>
            <span className={timer <= 3 ? styles.timerDanger : styles.timer}>
              {timer}s
            </span>
          </div>
        </CardHeader>

        <CardBody>
          <Progress
            value={progressPercentage}
            color="primary"
            className={styles.progressBar}
            aria-label="Quiz progress"
          />

          <div className={styles.questionTypeContainer}>
            <Chip
              color={isTechnicalQuestion ? "secondary" : "success"}
              variant="flat"
              size="sm"
            >
              {isTechnicalQuestion ? "Technical Question" : "Generic Question"}
            </Chip>
          </div>

          <h3 className={styles.questionText}>{currentQuestion?.question}</h3>

          {hasOptions ? (
            // Render radio buttons for multiple choice
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className={styles.optionsContainer}
            >
              {currentQuestion.options.map((option, index) => (
                <Radio key={index} value={option}>
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          ) : (
            // Render textarea for free-form answers
            <Textarea
              className={styles.answerTextarea}
              placeholder="Type your answer here..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              minRows={4}
            />
          )}

          <div className={styles.buttonContainer}>
            <Button
              color="primary"
              onClick={handleNextQuestion}
              disabled={hasOptions ? !selectedOption : !textAnswer.trim()}
            >
              {currentQuestionIndex === questions.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

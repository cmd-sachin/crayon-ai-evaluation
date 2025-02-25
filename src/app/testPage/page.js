"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Progress,
  Textarea,
  Chip,
  Radio,
  RadioGroup,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Slider,
  Tooltip,
} from "@nextui-org/react";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Info,
  BrainCircuit,
  Award,
  RefreshCw,
  RotateCcw,
  Lightbulb,
  Sparkles,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useQuizStore } from "../app/stores/quizStore";

// Constants
const TOTAL_QUESTIONS = 13;
const DEFAULT_TIMER_SECONDS = 10;

// Section colors
const SECTION_COLORS = {
  "Task Complexity Assessment": "primary",
  "Challenges & Solutions": "secondary",
  "AI Assistance & Usage": "success",
  "Technical Assessment": "warning",
};

// Helper: Returns an icon based on the question section.
const SectionIcon = ({ section, size }) => {
  switch (section) {
    case "Task Complexity Assessment":
      return <BrainCircuit size={size} />;
    case "Challenges & Solutions":
      return <Award size={size} />;
    case "AI Assistance & Usage":
      return <Sparkles size={size} />;
    case "Technical Assessment":
      return <Lightbulb size={size} />;
    default:
      return <Info size={size} />;
  }
};

// Helper: For slider labels.
const getSliderLabel = (value) => {
  if (value >= 1 && value <= 20) return "Very Easy";
  if (value >= 21 && value <= 40) return "Easy";
  if (value >= 41 && value <= 60) return "Moderate";
  if (value >= 61 && value <= 80) return "Challenging";
  if (value >= 81 && value <= 100) return "Very Challenging";
  return "-";
};

// For question 8: map slider values (1-100) to integer labels ("1" to "10").
const getIntSliderLabel = (value) => {
  return Math.ceil(value / 10).toString();
};

// Static questions configuration.
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
    required: true,
  },
  {
    section: "Task Complexity Assessment",
    question: "Which aspects were most complex?",
    inputType: "text",
    placeholder: "Describe the most complex aspects of this task...",
    required: true,
  },
  {
    section: "Task Complexity Assessment",
    question: "What prior experience helped you?",
    inputType: "text",
    placeholder: "Share any relevant prior experience...",
    required: true,
  },
  {
    section: "Challenges & Solutions",
    question: "What were your main technical challenges?",
    inputType: "text",
    placeholder: "Describe the technical challenges you faced...",
    required: true,
  },
  {
    section: "Challenges & Solutions",
    question: "How did you overcome these challenges?",
    inputType: "text",
    placeholder: "Explain your approach to solving these challenges...",
    required: true,
  },
  {
    section: "AI Assistance & Usage",
    question:
      "Which AI tools did you use during development? (ChatGPT, Gemini, GitHub Copilot, etc.)",
    inputType: "text",
    placeholder: "List the AI tools you used...",
    required: true,
  },
  {
    section: "AI Assistance & Usage",
    question: "How did you leverage these AI tools?",
    inputType: "text",
    placeholder:
      "Describe how you used AI tools in your development process...",
    required: true,
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
    required: true,
  },
];

export default function QuizPage() {
  const router = useRouter();
  // Generate a unique sessionId for dynamic question API calls.
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );
  const [questions, setQuestions] = useState(staticQuestions);
  const {
    quizData,
    addQuizData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    timer,
    setTimer,
  } = useQuizStore();

  // Local state variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [sliderValue, setSliderValue] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isTimerWarning, setIsTimerWarning] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [fadeAnimation, setFadeAnimation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState("");
  const [dynamicQuestionsLoaded, setDynamicQuestionsLoaded] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Computed values
  const progressPercentage = useMemo(
    () => ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100,
    [currentQuestionIndex]
  );
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;
  const isQuestionRequired = currentQuestion?.required !== false;
  const sectionColor = useMemo(
    () => SECTION_COLORS[currentQuestion?.section] || "primary",
    [currentQuestion]
  );

  // Determine input type
  const getInputType = useCallback(() => {
    if (!currentQuestion) return null;
    return (
      currentQuestion.inputType ||
      (currentQuestion.options && currentQuestion.options.length > 0
        ? "radio"
        : "text")
    );
  }, [currentQuestion]);
  const inputType = getInputType();

  // Set initial slider value when question changes
  useEffect(() => {
    if (
      currentQuestion &&
      inputType === "slider" &&
      currentQuestion.defaultValue !== undefined
    ) {
      setSliderValue(currentQuestion.defaultValue);
    } else {
      setSliderValue(null);
    }
  }, [currentQuestionIndex, currentQuestion, inputType]);

  // Countdown timer: decrement timer every second when active.
  useEffect(() => {
    if (isTimerActive) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;
          return 0;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isTimerActive, setTimer]);

  // Timer warning: if timer reaches 3 seconds or less.
  useEffect(() => {
    if (timer <= 3) {
      setIsTimerWarning(true);
    } else {
      setIsTimerWarning(false);
    }
  }, [timer]);

  // Auto-submit answer when timer hits 0.
  useEffect(() => {
    if (timer === 0) {
      setIsTimerActive(false);
      handleNextQuestion(true);
    }
  }, [timer, inputType, selectedOption, textAnswer, sliderValue]);

  // Reset UI state when question changes.
  useEffect(() => {
    setTimer(DEFAULT_TIMER_SECONDS);
    setIsTimerActive(true);
    setIsTimerWarning(false);
    setTextAnswer("");
    setSelectedOption("");
    setValidationError("");
    setShowHint(false);
    setHint("");
    setFadeAnimation(true);
    const timeout = setTimeout(() => {
      setFadeAnimation(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex, setTimer]);

  // Load dynamic questions after static ones are done.
  useEffect(() => {
    const shouldLoadDynamicQuestions =
      currentQuestionIndex === staticQuestions.length - 1 &&
      !dynamicQuestionsLoaded &&
      Object.keys(quizData).length === staticQuestions.length - 1;
    if (shouldLoadDynamicQuestions) {
      const loadAllDynamicQuestions = async () => {
        try {
          console.log("Loading dynamic questions...");
          setLoading(true);
          let updatedQuestions = [...questions];
          for (let i = 0; i < TOTAL_QUESTIONS - staticQuestions.length; i++) {
            const dynamicQuestion = await fetchDynamicQuestion();
            if (dynamicQuestion) {
              updatedQuestions.push(dynamicQuestion);
            } else {
              throw new Error("Failed to fetch a dynamic question");
            }
          }
          setQuestions(updatedQuestions);
          setDynamicQuestionsLoaded(true);
          setLoading(false);
          console.log("Dynamic questions loaded.");
        } catch (err) {
          console.error("Error loading dynamic questions:", err);
          setError(`Failed to load dynamic questions: ${err.message}`);
          setLoading(false);
        }
      };
      loadAllDynamicQuestions();
    }
  }, [currentQuestionIndex, dynamicQuestionsLoaded, quizData, questions]);

  // Fetch dynamic question from API.
  const fetchDynamicQuestion = async () => {
    try {
      const response = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousQuestions: questions.map((q) => q.question),
          sessionId,
        }),
      });
      const data = await response.json();
      if (!data || !data.question) {
        throw new Error("Invalid question data received from API");
      }
      return {
        section: data.section || "Technical Assessment",
        question: data.question,
        inputType: data.inputType || "text",
        placeholder: data.placeholder || "Type your answer here...",
        options: data.options || undefined,
        min: data.min,
        max: data.max,
        step: data.step || 1,
        defaultValue: data.defaultValue,
        labels: data.labels,
        required: true,
        hint: data.hint || "",
      };
    } catch (err) {
      console.error("Error fetching dynamic question:", err);
      throw new Error(`Failed to fetch the next question: ${err.message}`);
    }
  };

  // Handle moving to next question.
  // The autoSubmit flag bypasses validation when timer expires.
  const handleNextQuestion = async (autoSubmit = false) => {
    if (!autoSubmit && !validateAnswer()) return;
    setValidationError("");
    const currentAnswer = getCurrentAnswer();
    // Save answer using question number as key.
    addQuizData(currentQuestionIndex + 1, {
      questionNumber: currentQuestionIndex + 1,
      question: currentQuestion.question,
      ...(inputType === "radio" && { options: currentQuestion.options }),
      ...(inputType === "slider" && { options: currentQuestion.labels }),
      response: currentAnswer,
    });
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < TOTAL_QUESTIONS) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      router.push("/results");
    }
  };

  // Handle finish quiz from the review modal.
  const handleFinishQuiz = () => {
    router.push("/results");
  };

  // Get current answer based on input type.
  const getCurrentAnswer = useCallback(() => {
    switch (inputType) {
      case "radio":
        return selectedOption;
      case "slider":
        return sliderValue;
      case "text":
      default:
        return textAnswer;
    }
  }, [inputType, selectedOption, sliderValue, textAnswer]);

  // Validate the current answer.
  const validateAnswer = useCallback(() => {
    if (!currentQuestion) return false;
    if (!isQuestionRequired) return true;
    switch (inputType) {
      case "radio":
        if (!selectedOption) {
          setValidationError("Please select an option to continue.");
          return false;
        }
        break;
      case "slider":
        if ([null, "-"].includes(sliderValue)) {
          setValidationError("Please select a value on the scale.");
          return false;
        }
        break;
      case "text":
      default:
        if (!textAnswer.trim()) {
          setValidationError("Please provide an answer to continue.");
          return false;
        }
        if (textAnswer.trim().length < 2) {
          setValidationError(
            "Your answer is too short. Please provide more details."
          );
          return false;
        }
        break;
    }
    return true;
  }, [
    currentQuestion,
    inputType,
    selectedOption,
    sliderValue,
    textAnswer,
    isQuestionRequired,
  ]);

  const formatTime = (seconds) => {
    const sec = Number(seconds);
    if (isNaN(sec)) return "0:00";
    if (sec < 60) return `${sec}s`;
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Render slider labels below the slider.
  const renderSliderLabels = () => {
    if (!currentQuestion || !currentQuestion.labels) return null;
    return (
      <div className="flex justify-between w-full mt-2 px-2">
        {currentQuestion.labels.map((label, index) => {
          const displayText = label.includes(" - ")
            ? label.split(" - ")[1]
            : label;
          return (
            <div
              key={index}
              className="text-xs text-gray-600 text-center"
              style={{ width: `${100 / currentQuestion.labels.length}%` }}
            >
              {displayText}
            </div>
          );
        })}
      </div>
    );
  };

  // Toggle hint display.
  const toggleHint = () => {
    if (!showHint && currentQuestion?.hint) {
      setHint(currentQuestion.hint || "No hint available for this question.");
    }
    setShowHint(!showHint);
  };

  // Trigger confetti effect.
  const triggerConfetti = () => {
    if (typeof window !== "undefined" && confetti) {
      const end = Date.now() + 1500;
      const colors = ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0"];
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  };

  // Render input component based on question type.
  const renderQuestionInput = () => {
    if (!currentQuestion) return null;
    switch (inputType) {
      case "radio":
        return (
          <RadioGroup
            value={selectedOption}
            onValueChange={(value) => {
              setSelectedOption(value);
              setValidationError("");
            }}
            className="gap-3"
            orientation="vertical"
          >
            {currentQuestion.options.map((option, index) => (
              <Radio
                key={index}
                value={option}
                description={
                  option.includes(" - ") ? option.split(" - ")[1] : null
                }
                classNames={{
                  base: "border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-transform duration-150 transform hover:scale-105",
                }}
              >
                {option.includes(" - ") ? option.split(" - ")[0] : option}
              </Radio>
            ))}
          </RadioGroup>
        );
      case "slider":
        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {currentQuestion.min}
              </span>
              <span className="text-lg font-bold text-primary">
                {sliderValue !== null && currentQuestion.labels
                  ? currentQuestionIndex + 1 === 8
                    ? getIntSliderLabel(sliderValue)
                    : getSliderLabel(sliderValue)
                  : "-"}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {currentQuestion.max}
              </span>
            </div>
            <Slider
              aria-labelledby={`question-${currentQuestionIndex + 1}`}
              step={currentQuestion.step || 1}
              min={currentQuestion.min}
              max={currentQuestion.max}
              defaultValue={currentQuestion.defaultValue}
              value={sliderValue}
              onChange={(value) => {
                setSliderValue(value);
                setValidationError("");
              }}
              className="w-full"
              color={sectionColor}
              size="lg"
              classNames={{
                base: "w-full",
                track: "h-2 bg-gray-300 rounded-full",
                indicator:
                  "rounded-full bg-gradient-to-r from-blue-500 to-blue-700",
                thumb:
                  "w-6 h-6 shadow-lg active:scale-125 transition-transform duration-200 bg-current",
              }}
              marks={currentQuestion.labels?.map((label, index) => {
                const value =
                  currentQuestion.min +
                  index *
                    ((currentQuestion.max - currentQuestion.min) /
                      (currentQuestion.labels.length - 1));
                return { value };
              })}
            />
            {renderSliderLabels()}
          </div>
        );
      case "text":
      default:
        return (
          <Textarea
            aria-labelledby={`question-${currentQuestionIndex + 1}`}
            placeholder={
              currentQuestion.placeholder || "Type your answer here..."
            }
            value={textAnswer}
            onChange={(e) => {
              setTextAnswer(e.target.value);
              setValidationError("");
            }}
            minRows={5}
            maxRows={10}
            className="w-full"
            classNames={{
              input:
                "resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
              base: "border-gray-300 hover:border-gray-400 transition-colors duration-200",
            }}
          />
        );
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">
            {currentQuestionIndex === staticQuestions.length - 1 &&
            !dynamicQuestionsLoaded
              ? "Loading all remaining questions..."
              : "Preparing your next question..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
        <Card className="max-w-md w-full shadow-xl transform transition-all duration-500 hover:scale-105">
          <CardHeader className="flex flex-col gap-1 items-center bg-red-50 text-red-700 border-b border-red-200">
            <AlertCircle size={40} className="text-red-600" />
            <h2 className="text-xl font-bold mt-2">Error Occurred</h2>
          </CardHeader>
          <CardBody className="text-center py-6">
            <p className="mb-4 text-gray-800">{error}</p>
            <Button
              color="primary"
              onClick={() => setError(null)}
              startContent={<RefreshCw size={18} />}
              className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Main quiz UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6 pb-12">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crayon Gen-AI Internship Test
        </h1>
        <p className="text-gray-600">Test your skills and understanding.</p>
      </header>

      {/* Overall Quiz Progress */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            Progress: {Math.round(progressPercentage)}%
          </span>
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
          </span>
        </div>
        <Progress
          value={progressPercentage}
          color={sectionColor}
          size="md"
          radius="full"
          showValueLabel={false}
          aria-label="Quiz progress"
          className="h-2"
          classNames={{
            track: "rounded-full bg-gray-200",
            indicator: `rounded-full bg-gradient-to-r from-${sectionColor}-500 to-${sectionColor}-700`,
          }}
        />
      </div>

      {/* Quiz Card */}
      <Card className="max-w-3xl w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 bg-gray-50 px-6 py-5">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <Chip
              color={sectionColor}
              variant="flat"
              radius="sm"
              size="md"
              className="font-semibold"
              startContent={
                <SectionIcon section={currentQuestion?.section} size={20} />
              }
            >
              {currentQuestion?.section || "Question"}
            </Chip>
          </div>
          <div
            className="flex items-center gap-2 text-gray-600"
            title="Time remaining to answer this question"
          >
            <Clock
              size={18}
              className={isTimerWarning ? "text-red-500 animate-pulse" : ""}
            />
            <span
              className={`font-mono text-sm ${
                isTimerWarning ? "text-red-500 animate-pulse" : ""
              }`}
            >
              {formatTime(timer)}
            </span>
          </div>
        </CardHeader>
        <CardBody className="py-6 px-6">
          <motion.h3
            layout
            className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5"
          >
            {currentQuestion?.question}
          </motion.h3>
          {validationError && (
            <motion.div
              layout
              className="mb-5 p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2 border border-red-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle size={18} />
              <span>{validationError}</span>
            </motion.div>
          )}
          <motion.div layout>{renderQuestionInput()}</motion.div>
          {currentQuestion.hint && (
            <div className="mt-6">
              <Tooltip
                content={<div className="text-sm">{hint}</div>}
                placement="bottom"
              >
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  isIconOnly
                  aria-label="Show hint"
                  className="min-w-[40px] h-[40px] p-0"
                  onPress={toggleHint}
                >
                  <HelpCircle size={20} />
                </Button>
              </Tooltip>
            </div>
          )}
        </CardBody>
        <CardFooter className="flex flex-col sm:flex-row justify-between border-t border-gray-200 px-6 py-5">
          <div
            className="flex items-center text-sm text-gray-500"
            title="Enter a thoughtful response before continuing"
          >
            <div className="flex items-center gap-1">
              <Info size={16} />
              <span>
                {isLastQuestion
                  ? "This is the final question"
                  : "Answer thoughtfully"}
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <Button
              color="primary"
              endContent={
                isLastQuestion ? (
                  <ListChecks size={18} />
                ) : (
                  <ArrowRight size={18} />
                )
              }
              onClick={() => handleNextQuestion()}
              isDisabled={
                isQuestionRequired &&
                ((inputType === "radio" && !selectedOption) ||
                  (inputType === "text" && !textAnswer.trim()) ||
                  (inputType === "slider" && sliderValue === null))
              }
              size="lg"
            >
              {isLastQuestion ? "Review & Finish" : "Next Question"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Review Answers Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        size="lg"
        scrollBehavior="inside"
        className="bg-white rounded-xl shadow-2xl"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-center">
              Review Your Answers
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Please review your responses before submitting the quiz.
            </p>
          </ModalHeader>
          <ModalBody className="px-6 py-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className="mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50"
              >
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Question {index + 1}: {q.question}
                </h4>
                <p className="text-gray-700">
                  <strong>Your Answer:</strong>{" "}
                  {(quizData[index + 1] && quizData[index + 1].response) ||
                    "No answer provided"}
                </p>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={() => setShowReviewModal(false)}
            >
              Back to Edit
            </Button>
            <Button
              color="primary"
              onPress={handleFinishQuiz}
              endContent={<CheckCircle size={18} />}
            >
              Finish Quiz
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

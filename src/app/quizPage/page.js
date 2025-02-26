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
  ArrowRight,
  Info,
  BrainCircuit,
  Award,
  RefreshCw,
  Lightbulb,
  Sparkles,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useQuizStore } from "../stores/quizStore";
import { useFileStore } from "../stores/zipCodeStore";
import { useQuizHistory } from "../stores/quizHistory";

// Constants
const TOTAL_QUESTIONS = 13;
const DEFAULT_TIMER_SECONDS = 10;

// Section colors mapping
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

// Updated static questions with discrete slider values.
const staticQuestions = [
  {
    section: "Task Complexity Assessment",
    question: "How challenging was this task for you? (Scale 1-5)",
    inputType: "slider",
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 0,
    valueToLabel: (value) => {
      if (value <= 20) return "Very Easy";
      if (value <= 40) return "Easy";
      if (value <= 60) return "Moderate";
      if (value <= 80) return "Challenging";
      if (value > 80) return "Very Challenging";
      return null;
    },
    labelMapping: [
      { label: "Very Easy", min: 1, max: 20 },
      { label: "Easy", min: 21, max: 40 },
      { label: "Moderate", min: 41, max: 60 },
      { label: "Challenging", min: 61, max: 80 },
      { label: "Very Challenging", min: 81, max: 100 },
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
    defaultValue: 50,
    valueToLabel: (value) => {
      const rating = Math.ceil(value / 10);
      return String(rating);
    },
    labelMapping: [
      { label: "1", min: 1, max: 10 },
      { label: "2", min: 11, max: 20 },
      { label: "3", min: 21, max: 30 },
      { label: "4", min: 31, max: 40 },
      { label: "5", min: 41, max: 50 },
      { label: "6", min: 51, max: 60 },
      { label: "7", min: 61, max: 70 },
      { label: "8", min: 71, max: 80 },
      { label: "9", min: 81, max: 90 },
      { label: "10", min: 91, max: 100 },
    ],
    required: true,
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );
  const fileStore = useFileStore();

  // Retrieve fileData from the store.
  const fileData = useFileStore((state) => state.fileData);
  console.log(fileData);

  // Quiz store state.
  const {
    quizData,
    addQuizData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    timer,
    setTimer,
    clearStore,
  } = useQuizStore();

  // Quiz history store state.
  const { quizHistory, addHistoryEntry } = useQuizHistory();

  // Initialize messages state with fileData from the store.
  const [messages, setMessages] = useState(() => [
    { role: "user", content: JSON.stringify(fileData) },
  ]);

  // Local state variables.
  const [questions, setQuestions] = useState(staticQuestions);
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
  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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

  useEffect(() => {
    if (isTimerActive) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isTimerActive, setTimer]);

  useEffect(() => {
    setIsTimerWarning(timer <= 3);
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerActive(false);
      handleNextQuestion(true);
    }
  }, [timer]);

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

  const fetchNextDynamicQuestion = async () => {
    try {
      setLoadingNextQuestion(true);
      console.log("Fetching next dynamic question...");
      const response = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousQuestions: questions.map((q) => q.question),
          sessionId,
          messages,
        }),
      });
      const data = await response.json();
      if (!data || !data.question) {
        throw new Error("Invalid question data received from API");
      }
      const newQuestion = {
        section: data.section || "Technical Assessment",
        question: data.question,
        inputType: data.inputType || "text",
        placeholder: data.placeholder || "Type your answer here...",
        options: data.options || undefined,
        min: data.min || 1,
        max: data.max || 100,
        step: data.step || 1,
        defaultValue: data.defaultValue || 50,
        valueToLabel: data.valueToLabel,
        labelMapping: data.labelMapping,
        required: true,
        hint: data.hint || "",
      };
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: JSON.stringify(data) },
      ]);
      setLoadingNextQuestion(false);
      console.log("Dynamic question loaded:", newQuestion);
    } catch (err) {
      console.error("Error fetching dynamic question:", err);
      setError(`Failed to fetch the next question: ${err.message}`);
      setLoadingNextQuestion(false);
    }
  };

  const getSliderLabel = useCallback(
    (value) => {
      if (!currentQuestion || !value) return "";
      if (currentQuestion.valueToLabel)
        return currentQuestion.valueToLabel(value);
      if (currentQuestion.labelMapping) {
        const mappedLabel = currentQuestion.labelMapping.find(
          (item) => value >= item.min && value <= item.max
        );
        return mappedLabel ? mappedLabel.label : "";
      }
      return value.toString();
    },
    [currentQuestion]
  );

  const renderSliderLabels = () => {
    if (!currentQuestion || !currentQuestion.labelMapping) return null;
    return (
      <div className="flex w-full mt-2">
        {currentQuestion.labelMapping.map((item, index) => (
          <div key={index} className="flex-1 text-xs text-gray-600 text-center">
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  const handleNextQuestion = async (autoSubmit = false) => {
    if (!autoSubmit && !validateAnswer()) return;
    setValidationError("");
    const currentAnswer = getCurrentAnswer();
    addQuizData(currentQuestionIndex + 1, {
      questionNumber: currentQuestionIndex + 1,
      question: currentQuestion.question,
      ...(inputType === "radio" && { options: currentQuestion.options }),
      ...(inputType === "slider" && {
        value: sliderValue,
        label: getSliderLabel(sliderValue),
      }),
      response: currentAnswer,
    });
    // Sync with quiz history store.
    addHistoryEntry({
      questionNumber: currentQuestionIndex + 1,
      question: currentQuestion.question,
      options: inputType === "radio" ? currentQuestion.options : undefined,
      response: currentAnswer,
    });
    if (currentQuestionIndex >= staticQuestions.length) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: JSON.stringify({
            options: inputType === "radio" ? currentQuestion.options : [],
            response: currentAnswer,
          }),
        },
      ]);
    }
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < TOTAL_QUESTIONS) {
      if (
        nextIndex >= staticQuestions.length &&
        nextIndex >= questions.length
      ) {
        await fetchNextDynamicQuestion();
      }
      setCurrentQuestionIndex(nextIndex);
    } else {
      router.push("/results");
    }
  };

  const handleFinishQuiz = () => {
    triggerConfetti();
    router.push("/results");
  };

  const getCurrentAnswer = useCallback(() => {
    switch (inputType) {
      case "radio":
        return selectedOption;
      case "slider":
        return getSliderLabel(sliderValue);
      case "text":
      default:
        return textAnswer;
    }
  }, [inputType, selectedOption, sliderValue, textAnswer, getSliderLabel]);

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
        if (sliderValue === null) {
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

  const toggleHint = () => {
    if (!showHint && currentQuestion?.hint) {
      setHint(currentQuestion?.hint || "No hint available for this question.");
    }
    setShowHint(!showHint);
  };

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
                {currentQuestion.labelMapping?.[0]?.label || "Min"}
              </span>
              <span className="text-lg font-bold text-primary">
                {sliderValue !== null ? getSliderLabel(sliderValue) : "-"}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {currentQuestion.labelMapping?.[
                  currentQuestion.labelMapping.length - 1
                ]?.label || "Max"}
              </span>
            </div>
            <Slider
              aria-labelledby={`question-${currentQuestionIndex + 1}`}
              step={currentQuestion.step || 1}
              min={currentQuestion.min || 1}
              max={currentQuestion.max || 100}
              defaultValue={currentQuestion.defaultValue || 50}
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

  if (loading || loadingNextQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">
            {loadingNextQuestion
              ? "Loading your next question..."
              : "Preparing the quiz..."}
          </p>
        </div>
      </div>
    );
  }

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
              onPress={() => setError(null)}
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6 pb-12">
      <header className="w-full max-w-3xl mb-8 text-center">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crayon Gen-AI Internship Test
            </h1>
            <p className="text-gray-600">Test your skills and understanding.</p>
          </div>
          <Button
            color="danger"
            variant="flat"
            size="sm"
            onPress={() => {
              clearStore();
              window.location.reload();
            }}
          >
            Clear Storage
          </Button>
        </div>
      </header>

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
          {currentQuestion?.hint && (
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
              onPress={() => handleNextQuestion()}
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
                className="mb-6 p-4 rounded-lg border border-gray-200"
              >
                <h4 className="text-lg font-semibold">{`Q${index + 1}: ${
                  q.question
                }`}</h4>
                <p className="mt-2 text-gray-700">
                  {quizData[index + 1]
                    ? quizData[index + 1].response
                    : "No answer provided"}
                </p>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleFinishQuiz}>
              Submit Quiz
            </Button>
            <Button
              variant="flat"
              color="secondary"
              onPress={() => setShowReviewModal(false)}
            >
              Edit Answers
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

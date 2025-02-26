"use client";
import React, { useEffect, useState } from "react";
import JSZip from "jszip";
import { useFileStore } from "../stores/zipCodeStore";
import { useRouter } from "next/navigation";
import Loader from "../loader/Loader";
import { useSearchParams } from "next/navigation";
import { usedataStore } from "../stores/taskContent";

export default function Form() {
  // Existing file & video store state
  const zipFiles = useFileStore((state) => state.zipFiles);
  const setZipFiles = useFileStore((state) => state.setZipFiles);
  const fileData = useFileStore((state) => state.fileData);
  const setFileData = useFileStore((state) => state.setFileData);
  const appendFileData = useFileStore((state) => state.appendFileData);
  const videoFile = useFileStore((state) => state.videoFile);
  const setVideoFile = useFileStore((state) => state.setVideoFile);

  // Add task content store logic
  const setAllData = usedataStore((state) => state.setAllData);
  const appendAllData = usedataStore((state) => state.appendAllData);

  const [isLoading, setIsLoading] = useState(true);
  const [isuploadedzip, setisuploadedzip] = useState(false);
  const [isvideouploaded, setisvideouploaded] = useState(false);
  const Router = useRouter();
  // Local state for GitHub URL and System Prompt
  const [githubUrl, setGithubUrl] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  // State for preview modals
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showZipPreview, setShowZipPreview] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const searchParams = useSearchParams();

  // Local states for fetched data (if you want to use them locally as well)
  const [description, setDescription] = useState("");
  const [resources, setResources] = useState("");
  const [title, setTitle] = useState("");
  const taskid = searchParams.get("taskid");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch("/api/airtable/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskid }),
        });
        const result = await data.json();
        console.log(result.formatedData);

        // Update local component state (if needed)
        setDescription(result.formatedData.description);
        setTitle(result.formatedData.title);
        setResources(result.formatedData.resources);

        // Update the usedataStore with the fetched data.
        // Here we wrap the values in arrays to match the store's structure.
        // After updating the store
        setAllData({
          description: [result.formatedData.description],
          resources: [result.formatedData.resources],
          title: [result.formatedData.title],
          totaldata: [result.formatedData],
        });

        // To log the updated state:
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [taskid, setAllData]);

  useEffect(() => {
    console.log("Zustand zipFiles:", zipFiles);
    console.log("Zustand fileData:", fileData);
    console.log("Zustand videoFile:", videoFile);
    const taskData = usedataStore.getState();
    console.log("Task Data:", taskData);
  }, [zipFiles, fileData, videoFile]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  // Allowed programming file extensions
  const programmingFileExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".cs",
    ".rb",
    ".go",
  ];

  // Handle ZIP file upload, extract contents, and store only allowed files in Zustand
  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setisuploadedzip(false);
    if (!file.name.endsWith(".zip")) {
      alert("Please upload a valid .zip file");
      setisuploadedzip(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setisuploadedzip(true);
        const arrayBuffer = event.target.result;
        const zip = await JSZip.loadAsync(arrayBuffer);
        const files = [];
        // Clear any previous file data from the store
        setFileData([]);

        zip.forEach((relativePath, zipEntry) => {
          const lowerPath = relativePath.toLowerCase();
          if (
            programmingFileExtensions.some((ext) => lowerPath.endsWith(ext)) &&
            !lowerPath.includes("__macosx")
          ) {
            files.push(relativePath);
            // Read and store the file data as a string
            zipEntry.async("string").then((data) => {
              appendFileData(`${relativePath}:\n${data}`);
            });
          }
        });

        setZipFiles(files);
      } catch (error) {
        setisuploadedzip(false);
        console.error("Error reading zip file", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle video file upload and store it in Zustand
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setisvideouploaded(false);

    const validTypes = ["video/mp4", "video/avi", "video/mkv"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid video file (MP4, AVI, MKV)");
      setisvideouploaded(false);
      return;
    }

    // Create an object URL for the video preview
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);

    setVideoFile(file);
    setisvideouploaded(true);
    console.log("Video file:", file);
  };

  // Preview zip file content
  const handlePreviewZip = () => {
    if (zipFiles.length > 0) {
      setSelectedFileIndex(0);
      // Parse the fileData string to extract the content
      const fileEntry = fileData[0];
      if (fileEntry) {
        const colonIndex = fileEntry.indexOf(":");
        if (colonIndex !== -1) {
          setSelectedFileContent(fileEntry.substring(colonIndex + 1).trim());
          setShowZipPreview(true);
        }
      }
    }
  };

  // Change the displayed file in the zip preview
  const handleFileChange = (index) => {
    if (index >= 0 && index < fileData.length) {
      setSelectedFileIndex(index);
      const fileEntry = fileData[index];
      if (fileEntry) {
        const colonIndex = fileEntry.indexOf(":");
        if (colonIndex !== -1) {
          setSelectedFileContent(fileEntry.substring(colonIndex + 1).trim());
        }
      }
    }
  };

  const fileurl = "hello";
  const videourl = "usl";
  // Form submit handler that sends fileData, githubUrl, and systemPrompt to your API
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const payload = { fileurl, videourl, githubUrl, systemPrompt };
    try {
      const res = await fetch("/api/airtable/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await res.json();

      Router.push("/quizPage");
      console.log("Response from API:", result);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Upload Your Files
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Inputs Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label htmlFor="githubUrl" className="mb-2 block font-semibold">
                GitHub URL
              </label>
              <input
                type="text"
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="Enter GitHub URL"
                className="w-full px-4 py-2 rounded bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="systemPrompt"
                className="mb-2 block font-semibold"
              >
                System Prompt
              </label>
              <textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter system prompt"
                rows="5"
                className="w-full px-4 py-2 rounded bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              ></textarea>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video File Upload Section */}
            <div className="flex flex-col">
              <label
                htmlFor="videoFile"
                className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-48 transition cursor-pointer ${
                  isvideouploaded
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-16 h-16 mb-2 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g id="SVGRepo_iconCarrier">
                    <path d="M10 1C9.7 1 9.5 1.1 9.3 1.3L3.3 7.3C3.1 7.5 3 7.7 3 8V20C3 21.7 4.3 23 6 23H7C7.6 23 8 22.6 8 22C8 21.4 7.6 21 7 21H6C5.4 21 5 20.6 5 20V9H10C10.6 9 11 8.6 11 8V3H18C18.6 3 19 3.4 19 4V9C19 9.6 19.4 10 20 10C20.6 10 21 9.6 21 9V4C21 2.3 19.7 1 18 1H10ZM9 7H6.4L9 4.4V7ZM14 15.5C14 14.1 15.1 13 16.5 13C17.9 13 19 14.1 19 15.5V16V17H20C21.1 17 22 17.9 22 19C22 20.1 21.1 21 20 21H13C11.9 21 11 20.1 11 19C11 17.9 11.9 17 13 17H14V16V15.5ZM16.5 11C14.1 11 12.2 12.8 12 15.1C10.3 15.6 9 17.1 9 19C9 21.2 10.8 23 13 23H20C22.2 23 24 21.2 24 19C24 17.1 22.7 15.6 21 15.1C20.8 12.8 18.9 11 16.5 11Z" />
                  </g>
                </svg>
                <span className="text-lg">Click to upload video</span>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
              {isvideouploaded && (
                <button
                  type="button"
                  onClick={() => setShowVideoPreview(true)}
                  className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Preview Video
                </button>
              )}
            </div>

            {/* ZIP File Upload Section */}
            <div className="flex flex-col">
              <label
                htmlFor="zipFile"
                className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-48 transition cursor-pointer ${
                  isuploadedzip
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-16 h-16 mb-2 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                </svg>
                <span className="text-lg text-center">
                  Drag &amp; Drop or Browse Zip File
                </span>
                <input
                  type="file"
                  id="zipFile"
                  accept=".zip"
                  onChange={handleZipUpload}
                  className="hidden"
                />
              </label>
              {isuploadedzip && (
                <button
                  type="button"
                  onClick={handlePreviewZip}
                  className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Preview ZIP Contents
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-lg font-semibold text-white"
          >
            Submit
          </button>
        </form>

        {videoFile && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Selected Video:</h3>
            <p>{videoFile.name}</p>
          </div>
        )}

        {zipFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">ZIP File Contents:</h3>
            <ul className="list-disc pl-5">
              {zipFiles.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {showVideoPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Video Preview</h2>
                <button
                  onClick={() => setShowVideoPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <video
                controls
                className="w-full"
                src={videoPreviewUrl}
                type={videoFile?.type}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* ZIP Preview Modal */}
      {showZipPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">ZIP Contents Preview</h2>
                <button
                  onClick={() => setShowZipPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              <div className="border-r overflow-y-auto p-4 md:col-span-1">
                <h3 className="font-semibold mb-2">Files</h3>
                <ul className="space-y-1">
                  {zipFiles.map((fileName, index) => (
                    <li
                      key={index}
                      className={`cursor-pointer p-2 rounded ${
                        selectedFileIndex === index
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleFileChange(index)}
                    >
                      {fileName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 md:col-span-2">
                <h3 className="font-semibold mb-2">
                  {zipFiles[selectedFileIndex]}
                </h3>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm h-96">
                  {selectedFileContent}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import JSZip from "jszip";
import { useRouter } from "next/navigation";
import { useFileStore } from "../stores/zipCodeStore";

export default function Form() {
  const router = useRouter();
  const zipFiles = useFileStore((state) => state.zipFiles);
  const setZipFiles = useFileStore((state) => state.setZipFiles);
  const fileData = useFileStore((state) => state.fileData);
  const setFileData = useFileStore((state) => state.setFileData);
  const appendFileData = useFileStore((state) => state.appendFileData);
  const videoFile = useFileStore((state) => state.videoFile);
  const setVideoFile = useFileStore((state) => state.setVideoFile);

  // Local state for GitHub URL and Task ID
  const [githubUrl, setGithubUrl] = useState("");
  const [taskId, setTaskId] = useState("");

  // Log the Zustand store data whenever it changes
  useEffect(() => {
    console.log("Zustand zipFiles:", zipFiles);
    console.log("Zustand fileData:", fileData);
    console.log("Zustand videoFile:", videoFile);
  }, [zipFiles, fileData, videoFile]);

  // Handle ZIP file upload, extract contents, and store each file's data in Zustand
  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      alert("Please upload a valid .zip file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const zip = await JSZip.loadAsync(arrayBuffer);
        const files = [];
        // Clear any previous file data from the store
        setFileData([]);

        zip.forEach((relativePath, zipEntry) => {
          files.push(relativePath);
          // Read and store the file data as a string (adjust type if needed)
          zipEntry.async("string").then((data) => {
            appendFileData(`${relativePath}:\n${data}`);
          });
        });

        setZipFiles(files);
      } catch (error) {
        console.error("Error reading zip file", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle video file upload and store it in Zustand
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/avi", "video/mkv"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid video file (MP4, AVI, MKV)");
      return;
    }

    setVideoFile(file);
    console.log("Video file:", file);
  };

  // Form submit handler: sends fileData, githubUrl, and taskId to your API,
  // then routes the user to the quiz page.
  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push("/quizPage");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-8">
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
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="taskId" className="mb-2 block font-semibold">
                Task ID
              </label>
              <input
                type="text"
                id="taskId"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                placeholder="Enter Task ID"
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Upload Section */}
            <label
              htmlFor="videoFile"
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/50 rounded-lg h-48 hover:bg-white/20 transition cursor-pointer"
            >
              <svg
                className="w-16 h-16 mb-2 text-white"
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

            {/* ZIP File Upload Section */}
            <label
              htmlFor="zipFile"
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/50 rounded-lg h-48 hover:bg-white/20 transition cursor-pointer"
            >
              <svg
                className="w-16 h-16 mb-2 text-white"
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
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition text-lg font-semibold"
          >
            Submit
          </button>
        </form>

        {/* Display Selected Video Name */}
        {videoFile && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Selected Video:</h3>
            <p>{videoFile.name}</p>
          </div>
        )}

        {/* Display ZIP File Names */}
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
    </div>
  );
}

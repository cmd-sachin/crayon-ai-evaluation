(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_561d90._.js", {

"[project]/src/app/stores/zipCodeStore.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// store.js
__turbopack_esm__({
    "useFileStore": (()=>useFileStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useFileStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        zipFiles: [],
        fileData: [],
        videoFile: null,
        setZipFiles: (files)=>set({
                zipFiles: files
            }),
        setFileData: (data)=>set({
                fileData: data
            }),
        appendFileData: (data)=>set((state)=>({
                    fileData: [
                        ...state.fileData,
                        data
                    ]
                })),
        setVideoFile: (file)=>set({
                videoFile: file
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/form/page.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Form)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/jszip/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/app/stores/zipCodeStore.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
function Form() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const zipFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"])({
        "Form.useFileStore[zipFiles]": (state)=>state.zipFiles
    }["Form.useFileStore[zipFiles]"]);
    const setZipFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"])({
        "Form.useFileStore[setZipFiles]": (state)=>state.setZipFiles
    }["Form.useFileStore[setZipFiles]"]);
    const fileData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"])({
        "Form.useFileStore[fileData]": (state)=>state.fileData
    }["Form.useFileStore[fileData]"]);
    const setFileData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"])({
        "Form.useFileStore[setFileData]": (state)=>state.setFileData
    }["Form.useFileStore[setFileData]"]);
    const appendFileData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"])({
        "Form.useFileStore[appendFileData]": (state)=>state.appendFileData
    }["Form.useFileStore[appendFileData]"]);
    const videoFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"])({
        "Form.useFileStore[videoFile]": (state)=>state.videoFile
    }["Form.useFileStore[videoFile]"]);
    const setVideoFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"])({
        "Form.useFileStore[setVideoFile]": (state)=>state.setVideoFile
    }["Form.useFileStore[setVideoFile]"]);
    // Local state for GitHub URL and Task ID
    const [githubUrl, setGithubUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [taskId, setTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Log the Zustand store data whenever it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Form.useEffect": ()=>{
            console.log("Zustand zipFiles:", zipFiles);
            console.log("Zustand fileData:", fileData);
            console.log("Zustand videoFile:", videoFile);
        }
    }["Form.useEffect"], [
        zipFiles,
        fileData,
        videoFile
    ]);
    // Handle ZIP file upload, extract contents, and store each file's data in Zustand
    const handleZipUpload = async (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        if (!file.name.endsWith(".zip")) {
            alert("Please upload a valid .zip file");
            return;
        }
        const reader = new FileReader();
        reader.onload = async (event)=>{
            try {
                const arrayBuffer = event.target.result;
                const zip = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loadAsync(arrayBuffer);
                const files = [];
                // Clear any previous file data from the store
                setFileData([]);
                zip.forEach((relativePath, zipEntry)=>{
                    files.push(relativePath);
                    // Read and store the file data as a string (adjust type if needed)
                    zipEntry.async("string").then((data)=>{
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
    const handleVideoUpload = (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        const validTypes = [
            "video/mp4",
            "video/avi",
            "video/mkv"
        ];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid video file (MP4, AVI, MKV)");
            return;
        }
        setVideoFile(file);
        console.log("Video file:", file);
    };
    // Form submit handler: sends fileData, githubUrl, and taskId to your API,
    // then routes the user to the quiz page.
    const handleSubmit = async (e)=>{
        e.preventDefault();
        router.push("/quizPage");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-10 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-center mb-6",
                    children: "Upload Your Files"
                }, void 0, false, {
                    fileName: "[project]/src/app/form/page.js",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "githubUrl",
                                            className: "mb-2 block font-semibold",
                                            children: "GitHub URL"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 96,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            id: "githubUrl",
                                            value: githubUrl,
                                            onChange: (e)=>setGithubUrl(e.target.value),
                                            placeholder: "Enter GitHub URL",
                                            className: "w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/form/page.js",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "taskId",
                                            className: "mb-2 block font-semibold",
                                            children: "Task ID"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            id: "taskId",
                                            value: taskId,
                                            onChange: (e)=>setTaskId(e.target.value),
                                            placeholder: "Enter Task ID",
                                            className: "w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/form/page.js",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/form/page.js",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "videoFile",
                                    className: "flex flex-col items-center justify-center border-2 border-dashed border-white/50 rounded-lg h-48 hover:bg-white/20 transition cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-16 h-16 mb-2 text-white",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                id: "SVGRepo_iconCarrier",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M10 1C9.7 1 9.5 1.1 9.3 1.3L3.3 7.3C3.1 7.5 3 7.7 3 8V20C3 21.7 4.3 23 6 23H7C7.6 23 8 22.6 8 22C8 21.4 7.6 21 7 21H6C5.4 21 5 20.6 5 20V9H10C10.6 9 11 8.6 11 8V3H18C18.6 3 19 3.4 19 4V9C19 9.6 19.4 10 20 10C20.6 10 21 9.6 21 9V4C21 2.3 19.7 1 18 1H10ZM9 7H6.4L9 4.4V7ZM14 15.5C14 14.1 15.1 13 16.5 13C17.9 13 19 14.1 19 15.5V16V17H20C21.1 17 22 17.9 22 19C22 20.1 21.1 21 20 21H13C11.9 21 11 20.1 11 19C11 17.9 11.9 17 13 17H14V16V15.5ZM16.5 11C14.1 11 12.2 12.8 12 15.1C10.3 15.6 9 17.1 9 19C9 21.2 10.8 23 13 23H20C22.2 23 24 21.2 24 19C24 17.1 22.7 15.6 21 15.1C20.8 12.8 18.9 11 16.5 11Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/form/page.js",
                                                    lineNumber: 136,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/form/page.js",
                                                lineNumber: 135,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg",
                                            children: "Click to upload video"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 139,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            id: "videoFile",
                                            accept: "video/*",
                                            onChange: handleVideoUpload,
                                            className: "hidden"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 140,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/form/page.js",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "zipFile",
                                    className: "flex flex-col items-center justify-center border-2 border-dashed border-white/50 rounded-lg h-48 hover:bg-white/20 transition cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-16 h-16 mb-2 text-white",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            viewBox: "0 0 640 512",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/form/page.js",
                                                lineNumber: 159,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 154,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg text-center",
                                            children: "Drag & Drop or Browse Zip File"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 161,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            id: "zipFile",
                                            accept: ".zip",
                                            onChange: handleZipUpload,
                                            className: "hidden"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/form/page.js",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/form/page.js",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/form/page.js",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition text-lg font-semibold",
                            children: "Submit"
                        }, void 0, false, {
                            fileName: "[project]/src/app/form/page.js",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/form/page.js",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                videoFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold",
                            children: "Selected Video:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/form/page.js",
                            lineNumber: 185,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: videoFile.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/form/page.js",
                            lineNumber: 186,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/form/page.js",
                    lineNumber: 184,
                    columnNumber: 11
                }, this),
                zipFiles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold",
                            children: "ZIP File Contents:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/form/page.js",
                            lineNumber: 193,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "list-disc pl-5",
                            children: zipFiles.map((fileName, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: fileName
                                }, index, false, {
                                    fileName: "[project]/src/app/form/page.js",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/form/page.js",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/form/page.js",
                    lineNumber: 192,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/form/page.js",
            lineNumber: 88,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/form/page.js",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_s(Form, "mVpvR70nMNarTKv6QbDE1HsczTc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$stores$2f$zipCodeStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFileStore"]
    ];
});
_c = Form;
var _c;
__turbopack_refresh__.register(_c, "Form");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/form/page.js [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_app_561d90._.js.map
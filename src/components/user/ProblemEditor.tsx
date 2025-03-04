// // src/components/user/ProblemEditor.tsx
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiRequest } from "@/utils/axios/ApiRequest";
// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { cpp } from "@codemirror/lang-cpp";
// import { rust } from "@codemirror/lang-rust";
// import { dracula } from "@uiw/codemirror-theme-dracula";
// import { useTheme } from "@/contexts/ThemeContext";
// import { SUPPORTED_LANGUAGES } from "@/config/Languages";

// interface IProblem {
//   _id: string;
//   title: string;
//   slug: string;
//   description: string;
//   difficulty: "EASY" | "MEDIUM" | "HARD";
//   status: "premium" | "free";
//   defaultCodeIds: { _id: string; languageId: number; languageName: string; code: string }[];
//   testCaseIds: { _id: string; input: string; output: string; index: number }[];
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: { problem: IProblem };
// }

// const ProblemEditor: React.FC = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const [problem, setProblem] = useState<IProblem | null>(null);
//   const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0].name);
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { theme } = useTheme();
//   const navigate = useNavigate();

//   // Fetch problem details by slug
//   const fetchProblem = async () => {
//     setLoading(true);
//     try {
//       const response = await apiRequest<ApiResponse>("get", `/problems/slug/${slug}`);
//       if (response.success && response.data.problem) {
//         setProblem(response.data.problem);
//         const defaultCode = response.data.problem.defaultCodeIds.find(
//           (code) => code.languageName === selectedLanguage
//         );
//         setCode(defaultCode?.code || "");
//       } else {
//         setError("Problem not found");
//       }
//     } catch (err) {
//       console.error("Failed to fetch problem:", err);
//       setError("Failed to fetch problem. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProblem();
//   }, [slug]);

//   // Handle language change
//   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLanguage = e.target.value;
//     setSelectedLanguage(newLanguage);
//     if (problem) {
//       const defaultCode = problem.defaultCodeIds.find(
//         (code) => code.languageName === newLanguage
//       );
//       setCode(defaultCode?.code || "");
//     }
//   };

//   // CodeMirror language extensions
//   const getLanguageExtension = () => {
//     switch (selectedLanguage) {
//       case "cpp":
//         return cpp();
//       case "js":
//         return javascript();
//       case "rust":
//         return rust();
//       default:
//         return javascript();
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error || !problem) return <div className="text-red-500">{error || "Problem not found"}</div>;

//   return (
//     <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col">
//       <div className="flex-1 flex gap-6">
//         {/* Left Panel: Problem Description and Test Cases */}
//         <div className="w-1/2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-y-auto">
//           <h1 className="text-2xl font-semibold text-primary mb-4">{problem.title}</h1>
//           <div className="prose dark:prose-invert">
//             <p>{problem.description}</p>
//           </div>
//           <h2 className="text-xl font-semibold text-primary mt-6 mb-2">Example Test Cases</h2>
//           {problem.testCaseIds.slice(0, 2).map((testCase) => (
//             <div key={testCase._id} className="mb-4">
//               <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
//                 <strong>Input:</strong> {testCase.input}
//               </pre>
//               <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
//                 <strong>Output:</strong> {testCase.output}
//               </pre>
//             </div>
//           ))}
//         </div>

//         {/* Right Panel: Code Editor */}
//         <div className="w-1/2 flex flex-col">
//           <div className="mb-4">
//             <label htmlFor="language" className="text-sm font-medium text-foreground mr-2">
//               Language:
//             </label>
//             <select
//               id="language"
//               value={selectedLanguage}
//               onChange={handleLanguageChange}
//               className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-background text-foreground"
//             >
//               {SUPPORTED_LANGUAGES.map((lang) => (
//                 <option key={lang.id} value={lang.name}>
//                   {lang.name.toUpperCase()}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <CodeMirror
//             value={code}
//             height="500px"
//             theme={theme === "dark" ? dracula : "light"}
//             extensions={[getLanguageExtension()]}
//             onChange={(value) => setCode(value)}
//             className="border border-gray-200 dark:border-gray-700 rounded"
//           />
//           <div className="mt-4 flex gap-4">
//             <button
//               className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
//               onClick={() => console.log("Submit code to Judge0")} // Placeholder for Judge0 integration
//             >
//               Submit
//             </button>
//             <button
//               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               onClick={() => navigate("/problems")}
//             >
//               Back to Problems
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemEditor;
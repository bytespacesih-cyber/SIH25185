import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { CharacterCount } from '@tiptap/extension-character-count';
import { ROLES } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navbar from "../../components/Navbar";

function CreateProposalContent() {
  const router = useRouter();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI assistant for coal R&D proposal creation. I can help you with technical writing, coal industry compliance, and research methodology suggestions. How can I assist you today?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [proposalData, setProposalData] = useState({
    projectTitle: '',
    implementingAgency: '',
    projectLeader: '',
    coInvestigators: '',
    issueDefinition: '',
    objectives: '',
    justification: '',
    benefits: '',
    workPlan: '',
    methodology: '',
    organization: '',
    timeSchedule: '',
    outlayTables: '',
    figures: ''
  });

  // Rich text editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: `
      <h2 style="color: black;">1. Problem Statement</h2>
      <p style="color: black;">Describe the coal mining/processing challenge or research gap your project addresses...</p>
      
      <h2 style="color: black;">2. Research Objectives</h2>
      <p style="color: black;">List your primary and secondary research objectives related to coal technology...</p>
      
      <h2 style="color: black;">3. Justification & Significance</h2>
      <p style="color: black;">Explain the importance of this research for the coal sector and mining industry...</p>
      
      <h2 style="color: black;">4. Expected Outcomes & Benefits</h2>
      <p style="color: black;">Describe the anticipated results and their impact on coal production, safety, or efficiency...</p>
      
      <h2 style="color: black;">5. Research Methodology</h2>
      <p style="color: black;">Detail your experimental approach, analytical methods, and technical procedures...</p>
      
      <h2 style="color: black;">6. Work Plan & Implementation</h2>
      <p style="color: black;">Outline project phases, milestones, and implementation strategy...</p>
      
      <h2 style="color: black;">7. Budget Breakdown</h2>
      <p style="color: black;">Insert detailed budget table using the Table button above.</p>
      
      <h2 style="color: black;">8. Project Timeline</h2>
      <p style="color: black;">Provide a comprehensive timeline with key deliverables and milestones...</p>
    `,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Update word and character count when content changes
      if (editor.storage.characterCount) {
        setWordCount(editor.storage.characterCount.words());
        setCharacterCount(editor.storage.characterCount.characters());
      }
    },
  });

  // Update counts when editor is ready
  useEffect(() => {
    if (editor && editor.storage.characterCount) {
      setWordCount(editor.storage.characterCount.words());
      setCharacterCount(editor.storage.characterCount.characters());
    }
  }, [editor]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessages = [...chatMessages, { type: 'user', text: currentMessage }];
    setChatMessages(newMessages);

    // Simulate AI responses with helpful suggestions
    setTimeout(() => {
      const aiResponses = [
        "For coal R&D projects, emphasize the technical innovation and its impact on mining efficiency or safety.",
        "Include equipment costs, field testing expenses, and coal sample analysis in your budget breakdown.",
        "Your methodology should detail experimental procedures, coal characterization methods, and safety protocols.",
        "Consider adding environmental impact assessment and sustainability measures for coal research projects.",
        "Align your timeline with coal production cycles and include pilot testing phases in mining operations.",
        "Highlight how your research addresses current challenges in coal extraction, processing, or utilization.",
        "Include relevant coal industry standards and regulatory compliance requirements in your proposal."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setChatMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
    }, 1000);

    setCurrentMessage('');
  };

  const handleDownload = (filename) => {
    const link = document.createElement('a');
    link.href = `/files/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (field, value) => {
    setProposalData(prev => ({ ...prev, [field]: value }));
  };

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (editor) {
            editor.chain().focus().setImage({ src: e.target.result }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const proposalContent = {
      ...proposalData,
      richContent: editor?.getHTML()
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(proposalContent)
      });

      if (response.ok) {
        alert("Proposal submitted successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to submit proposal");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Error submitting proposal");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section with Government Branding */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Create R&D Proposal</h1>
            <p className="text-blue-700 text-lg">PRISM - Proposal Review & Innovation Support Mechanism</p>
            <p className="text-black mt-2">Submit your R&D proposal for Department of Coal (NaCCER)</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* AI Assistant Toggle */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            title="AI Assistant"
          >
            ⚡
          </button>
        </div>

        <div className={`grid gap-8 ${showAIAssistant ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} transition-all duration-300`}>
          {/* Main Content Section */}
          <div className={showAIAssistant ? 'lg:col-span-2' : 'col-span-1'}>
            {/* Guidelines and Templates Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">■ Guidelines & Templates</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-blue-900 mb-2">S&T Guidelines</h3>
                  <p className="text-black text-sm mb-3">
                    Download the complete R&D guidelines for Department of Coal to understand 
                    the requirements, evaluation criteria, and submission process.
                  </p>
                  <button
                    onClick={() => handleDownload('S&T-Guidelines-MoC.pdf')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    ▣ Download Guidelines (PDF)
                  </button>
                </div>
                
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-green-900 mb-2">Proposal Template</h3>
                  <p className="text-black text-sm mb-3">
                    Use our standardized template to structure your R&D proposal correctly. 
                    This template ensures all required sections for coal research are included.
                  </p>
                  <button
                    onClick={() => handleDownload('proposal-template.docx')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    ▤ Download Template (DOC)
                  </button>
                </div>
              </div>
            </div>

            {/* Proposal Form Section */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">� Proposal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Project Title *</label>
                    <input
                      type="text"
                      value={proposalData.projectTitle}
                      onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your project title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Implementing Agency *</label>
                    <input
                      type="text"
                      value={proposalData.implementingAgency}
                      onChange={(e) => handleInputChange('implementingAgency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Name of implementing organization"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Project Leader *</label>
                    <input
                      type="text"
                      value={proposalData.projectLeader}
                      onChange={(e) => handleInputChange('projectLeader', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Principal investigator name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Co-investigator(s)</label>
                    <input
                      type="text"
                      value={proposalData.coInvestigators}
                      onChange={(e) => handleInputChange('coInvestigators', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Names of co-investigators"
                    />
                  </div>
                </div>
              </div>

              {/* Rich Text Editor Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">▤ Proposal Content</h2>
                  
                  {/* Formatting Toolbar - Two organized rows */}
                  <div className="border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
                    {/* First Row - Basic Formatting */}
                    <div className="flex gap-1 items-center mb-2">
                      {/* Text Formatting */}
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Bold (Ctrl+B)"
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Italic (Ctrl+I)"
                      >
                        <em>I</em>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleUnderline?.().run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Underline (Ctrl+U)"
                      >
                        <u>U</u>
                      </button>
                      
                      <div className="w-px bg-gray-300 mx-2 h-6"></div>
                      
                      {/* Headings */}
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Heading 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().setParagraph().run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('paragraph') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Normal Text"
                      >
                        P
                      </button>
                      
                      <div className="w-px bg-gray-300 mx-2 h-6"></div>
                      
                      {/* Lists */}
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Bullet List"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive('orderedList') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Numbered List"
                      >
                        1. List
                      </button>
                    </div>
                    
                    {/* Second Row - Alignment and Actions */}
                    <div className="flex gap-1 items-center">
                      {/* Alignment */}
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Align Left"
                      >
                        ⬅
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Center"
                      >
                        ↔
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        title="Align Right"
                      >
                        ➡
                      </button>
                      
                      <div className="w-px bg-gray-300 mx-2 h-6"></div>
                      
                      {/* Actions */}
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().undo().run()}
                        className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                        title="Undo (Ctrl+Z)"
                      >
                        ↶
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().redo().run()}
                        className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                        title="Redo (Ctrl+Y)"
                      >
                        ↷
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                        className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                        title="Clear Formatting"
                      >
                        Clear
                      </button>
                      
                      <div className="w-px bg-gray-300 mx-2 h-6"></div>
                      
                      {/* Insert Options */}
                      <button
                        type="button"
                        onClick={insertTable}
                        className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                        title="Insert Table"
                      >
                        ▦ Table
                      </button>
                      <button
                        type="button"
                        onClick={insertImage}
                        className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                        title="Insert Image"
                      >
                        ▣ Image
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                        className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                        title="Insert Horizontal Line"
                      >
                        ─ Line
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <div className="border border-gray-300 rounded-md min-h-[500px] p-6 bg-white">
                    <EditorContent 
                      editor={editor} 
                      className="focus:outline-none min-h-[450px] text-black"
                      style={{ color: 'black' }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <div className="text-sm text-black">
                    <strong>Word Count: {wordCount} words</strong>
                  </div>
                  <div className="text-sm text-black">
                    <strong>Characters: {characterCount}</strong>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-black">
                  <p className="mb-2"><strong>Required sections for Coal R&D proposals:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-black">
                    <li>Problem Statement (coal mining/processing challenges)</li>
                    <li>Research Objectives (technical goals and targets)</li>
                    <li>Justification & Significance (impact on coal sector)</li>
                    <li>Expected Outcomes (technological improvements)</li>
                    <li>Research Methodology (experimental procedures)</li>
                    <li>Work Plan & Implementation Strategy</li>
                    <li>Project Timeline with Key Milestones</li>
                    <li>Detailed Budget Breakdown</li>
                    <li>Technical Figures, Charts, and Data</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-8 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  ▶ Submit R&D Proposal
                </button>
              </div>
            </form>
          </div>

          {/* AI Assistant Sidebar */}
          {showAIAssistant && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="bg-purple-600 text-white p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    ⚡ AI Writing Assistant
                  </h3>
                  <p className="text-purple-100 text-sm">Get help with drafting, suggestions & compliance</p>
                </div>
                
                <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white text-black border'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleChatSubmit} className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask for writing help..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      ▶
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateProposal() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.USER]}>
      <CreateProposalContent />
    </ProtectedRoute>
  );
}

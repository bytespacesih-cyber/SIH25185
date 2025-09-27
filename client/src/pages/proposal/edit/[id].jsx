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
import { useAuth } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";

function EditProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m here to help you edit your coal R&D proposal. I can assist with revisions, technical writing improvements, and compliance checks. What would you like to work on?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Version history dummy data
  const [versionHistory] = useState([
    {
      id: 1,
      version: "Version 3.2",
      date: "2025-09-26",
      time: "14:30",
      author: "Dr. Sarah Chen",
      changes: "Updated methodology section and budget allocation",
      status: "current"
    },
    {
      id: 2,
      version: "Version 3.1", 
      date: "2025-09-25",
      time: "16:45",
      author: "Dr. Sarah Chen",
      changes: "Added environmental impact assessment details",
      status: "saved"
    },
    {
      id: 3,
      version: "Version 3.0",
      date: "2025-09-24",
      time: "11:20",
      author: "Prof. Michael Kumar",
      changes: "Major revision: restructured objectives and timeline",
      status: "saved"
    },
    {
      id: 4,
      version: "Version 2.5",
      date: "2025-09-23",
      time: "09:15",
      author: "Dr. Sarah Chen", 
      changes: "Incorporated reviewer feedback on coal processing methods",
      status: "saved"
    },
    {
      id: 5,
      version: "Version 2.0",
      date: "2025-09-20",
      time: "13:30",
      author: "Dr. Sarah Chen",
      changes: "Initial draft submitted for peer review",
      status: "saved"
    }
  ]);

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
      <h1 style="color: black; text-align: center;">Advanced Coal Gasification Technology for Enhanced Energy Production</h1>
      
      <h2 style="color: black;">1. Problem Statement</h2>
      <p style="color: black;">The coal sector faces significant challenges in optimizing energy extraction while minimizing environmental impact. Traditional coal combustion methods result in only 35-40% energy efficiency, with substantial CO2 emissions and particulate matter release. There is an urgent need for innovative gasification technologies that can improve energy output to 60-65% efficiency while reducing harmful emissions by 40-50%.</p>
      
      <p style="color: black;">Current coal processing facilities in India operate with outdated equipment that struggles to meet environmental compliance standards set by the Ministry of Coal. The lack of advanced gasification infrastructure limits the country's ability to maximize coal utilization for power generation and industrial applications.</p>
      
      <h2 style="color: black;">2. Research Objectives</h2>
      <p style="color: black;"><strong>Primary Objectives:</strong></p>
      <ul style="color: black;">
        <li>Develop an integrated coal gasification system achieving 60%+ energy efficiency</li>
        <li>Design carbon capture mechanisms reducing CO2 emissions by 45%</li>
        <li>Create automated monitoring systems for real-time process optimization</li>
        <li>Establish economic viability models for large-scale implementation</li>
      </ul>
      
      <p style="color: black;"><strong>Secondary Objectives:</strong></p>
      <ul style="color: black;">
        <li>Train technical personnel in advanced gasification operations</li>
        <li>Develop maintenance protocols for extended equipment lifespan</li>
        <li>Create safety standards for gasification plant operations</li>
        <li>Establish environmental monitoring frameworks</li>
      </ul>
      
      <h2 style="color: black;">3. Justification & Significance</h2>
      <p style="color: black;">This research addresses critical national priorities in energy security and environmental sustainability. With India's coal reserves estimated at 350+ billion tonnes, optimizing extraction and utilization efficiency directly impacts economic growth and energy independence.</p>
      
      <p style="color: black;">The proposed gasification technology will:</p>
      <ul style="color: black;">
        <li>Reduce India's carbon footprint from coal-based power generation</li>
        <li>Create employment opportunities in advanced manufacturing and operations</li>
        <li>Position India as a leader in clean coal technologies</li>
        <li>Generate intellectual property and export potential for technology transfer</li>
      </ul>
      
      <h2 style="color: black;">4. Expected Outcomes & Benefits</h2>
      <p style="color: black;"><strong>Technical Outcomes:</strong></p>
      <ul style="color: black;">
        <li>Functional prototype demonstrating 60% energy conversion efficiency</li>
        <li>Integrated carbon capture system with 45% emission reduction</li>
        <li>Automated control systems with predictive maintenance capabilities</li>
        <li>Comprehensive performance databases for optimization</li>
      </ul>
      
      <p style="color: black;"><strong>Economic Benefits:</strong></p>
      <ul style="color: black;">
        <li>₹500 crores potential cost savings annually across coal sector</li>
        <li>20% reduction in operational costs per MW generated</li>
        <li>Export market potential worth ₹2,000 crores over 5 years</li>
        <li>Job creation for 5,000+ technical positions nationwide</li>
      </ul>
      
      <h2 style="color: black;">5. Research Methodology</h2>
      <p style="color: black;"><strong>Phase 1: Laboratory Testing (Months 1-8)</strong></p>
      <ul style="color: black;">
        <li>Coal characterization using X-ray fluorescence and thermogravimetric analysis</li>
        <li>Gasification reactor design using computational fluid dynamics modeling</li>
        <li>Catalyst development for enhanced reaction efficiency</li>
        <li>Small-scale prototype testing under controlled conditions</li>
      </ul>
      
      <p style="color: black;"><strong>Phase 2: Pilot Plant Development (Months 9-18)</strong></p>
      <ul style="color: black;">
        <li>Scaling up reactor design to 10 MW capacity</li>
        <li>Integration of carbon capture and storage systems</li>
        <li>Implementation of automated control and monitoring systems</li>
        <li>Environmental impact assessment and compliance testing</li>
      </ul>
      
      <p style="color: black;"><strong>Phase 3: Field Testing & Validation (Months 19-24)</strong></p>
      <ul style="color: black;">
        <li>Installation at selected coal power plant facility</li>
        <li>6-month continuous operation testing</li>
        <li>Performance optimization and troubleshooting</li>
        <li>Economic viability analysis and cost-benefit evaluation</li>
      </ul>
      
      <h2 style="color: black;">6. Work Plan & Implementation</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Phase</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Duration</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Key Deliverables</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Budget (₹ Cr)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Laboratory Testing</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">8 months</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Reactor design, catalyst development</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">45</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Pilot Plant</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">10 months</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">10 MW pilot system</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">125</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Field Testing</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">6 months</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Performance validation</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">30</td>
          </tr>
        </tbody>
      </table>
      
      <h2 style="color: black;">7. Budget Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Category</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Amount (₹ Cr)</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Equipment & Infrastructure</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">120</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">60%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Personnel & Consulting</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">50</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">25%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Materials & Testing</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">20</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">10%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Administrative & Miscellaneous</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">10</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">5%</td>
          </tr>
          <tr style="background-color: #f9fafb; font-weight: bold;">
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Total Project Cost</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">200</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">100%</td>
          </tr>
        </tbody>
      </table>
      
      <h2 style="color: black;">8. Project Timeline</h2>
      <p style="color: black;"><strong>Year 1 (Months 1-12):</strong> Laboratory testing and reactor design optimization</p>
      <p style="color: black;"><strong>Year 2 (Months 13-24):</strong> Pilot plant construction, testing, and field validation</p>
      
      <p style="color: black;"><strong>Key Milestones:</strong></p>
      <ul style="color: black;">
        <li>Month 6: Complete reactor design and catalyst development</li>
        <li>Month 12: Laboratory prototype demonstrating 55%+ efficiency</li>
        <li>Month 18: Pilot plant operational with integrated systems</li>
        <li>Month 24: Field testing complete with performance validation</li>
      </ul>
    `,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
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

  useEffect(() => {
    if (id) {
      fetchProposal();
    }
  }, [id]);

  const fetchProposal = async () => {
    try {
      // Simulate loading time
      setTimeout(() => {
        const mockData = {
          id: id,
          title: "Advanced Coal Gasification Technology for Enhanced Energy Production",
          projectLeader: "Dr. Sarah Chen",
          implementingAgency: "Indian Institute of Technology Delhi",
          coInvestigators: "Prof. Michael Kumar, Dr. Rajesh Sharma",
          status: "under_review",
          author: user?.name || "Dr. Sarah Chen",
          department: "Department of Coal Mining Engineering",
          createdAt: "2025-09-20",
          lastModified: "2025-09-26",
          version: "3.2"
        };
        setProposal(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      setLoading(false);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessages = [...chatMessages, { type: 'user', text: currentMessage }];
    setChatMessages(newMessages);

    // Simulate AI responses for editing assistance
    setTimeout(() => {
      const aiResponses = [
        "I notice your methodology section is comprehensive. Consider adding more details about quality control measures for coal characterization.",
        "The budget allocation looks well-structured. You might want to include contingency funds (5-10%) for unexpected equipment costs.",
        "Your timeline is realistic. Consider adding specific review milestones for stakeholder feedback at each phase.",
        "The environmental impact section could benefit from more quantitative data on emission reductions.",
        "For better compliance, include references to relevant IS/BIS standards for coal processing equipment.",
        "Consider expanding on the risk mitigation strategies for potential technical challenges.",
        "The economic analysis is strong. You might add job creation estimates for local communities."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setChatMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
    }, 1000);

    setCurrentMessage('');
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

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving with backend
      setTimeout(() => {
        alert('Proposal changes saved successfully! New version 3.3 created.');
        setSaving(false);
        // Update version in proposal data
        setProposal(prev => ({
          ...prev,
          version: "3.3",
          lastModified: new Date().toISOString().split('T')[0]
        }));
      }, 2000);
    } catch (error) {
      console.error("Error saving proposal:", error);
      alert('Error saving proposal. Please try again.');
      setSaving(false);
    }
  };

  const loadVersion = (versionData) => {
    // Simulate loading different version content
    alert(`Loading ${versionData.version}... (Demo: This would load the actual content from that version)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-blue-900">Loading proposal document...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-1">Edit R&D Proposal</h1>
              <p className="text-blue-700">PRISM - Proposal Review & Innovation Support Mechanism</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-black">
                <span>Proposal ID: #{id}</span>
                <span>•</span>
                <span>Version: {proposal?.version || "3.2"}</span>
                <span>•</span>
                <span>Last Modified: {proposal?.lastModified || "2025-09-26"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Version History"
              >
                ◷ Versions
              </button>
              <button
                onClick={() => router.back()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
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

        <div className={`grid gap-8 ${showAIAssistant || showVersionHistory ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} transition-all duration-300`}>
          {/* Main Content Section */}
          <div className={showAIAssistant || showVersionHistory ? 'lg:col-span-2' : 'col-span-1'}>
            {/* Document Editor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-900">▤ Proposal Document</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-black">Auto-save enabled</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Formatting Toolbar */}
                <div className="border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
                  {/* First Row - Basic Formatting */}
                  <div className="flex gap-1 items-center mb-2">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        editor?.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        editor?.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                      title="Italic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleUnderline?.().run()}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        editor?.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                      title="Underline"
                    >
                      <u>U</u>
                    </button>
                    
                    <div className="w-px bg-gray-300 mx-2 h-6"></div>
                    
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
                      title="Paragraph"
                    >
                      P
                    </button>
                    
                    <div className="w-px bg-gray-300 mx-2 h-6"></div>
                    
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
                  
                  {/* Second Row */}
                  <div className="flex gap-1 items-center">
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
                    
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().undo().run()}
                      className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                      title="Undo"
                    >
                      ↶
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().redo().run()}
                      className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                      title="Redo"
                    >
                      ↷
                    </button>
                    
                    <div className="w-px bg-gray-300 mx-2 h-6"></div>
                    
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
                      title="Insert Line"
                    >
                      ─ Line
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Editor Content */}
              <div className="prose max-w-none">
                <div className="border border-gray-300 rounded-md min-h-[600px] p-6 bg-white">
                  <EditorContent 
                    editor={editor} 
                    className="focus:outline-none min-h-[550px] text-black"
                    style={{ color: 'black' }}
                  />
                </div>
              </div>
              
              {/* Stats and Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-black">
                  <span><strong>Words: {wordCount}</strong></span>
                  <span><strong>Characters: {characterCount}</strong></span>
                  <span className="text-green-600">✓ Last saved: Just now</span>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? '⟳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Version History Sidebar */}
          {showVersionHistory && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    ◷ Version History
                  </h3>
                  <p className="text-blue-100 text-sm">Track changes and revisions</p>
                </div>
                
                <div className="max-h-96 overflow-y-auto p-4">
                  {versionHistory.map((version) => (
                    <div key={version.id} className="mb-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => loadVersion(version)}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-black">{version.version}</div>
                        <div className={`px-2 py-1 text-xs rounded-full ${
                          version.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-black'
                        }`}>
                          {version.status === 'current' ? 'Current' : 'Saved'}
                        </div>
                      </div>
                      <div className="text-sm text-black mb-2">
                        {version.date} at {version.time}
                      </div>
                      <div className="text-sm text-black mb-2">
                        <strong>By:</strong> {version.author}
                      </div>
                      <div className="text-xs text-gray-700">
                        {version.changes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Assistant Sidebar */}
          {showAIAssistant && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="bg-purple-600 text-white p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    ⚡ AI Editing Assistant
                  </h3>
                  <p className="text-purple-100 text-sm">Get help with revisions and improvements</p>
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
                      placeholder="Ask for editing suggestions..."
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

export default function EditProposal() {
  return (
    <ProtectedRoute>
      <EditProposalContent />
    </ProtectedRoute>
  );
}
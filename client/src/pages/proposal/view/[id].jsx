import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

function ViewProposalContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        if (id) {
          // Mock data for coal R&D proposal
          const mockProposal = {
            id: id,
            title: "Advanced Coal Gasification Technology for Enhanced Energy Production",
            researcher: "Dr. Raj Patel",
            institution: "Indian Institute of Technology, Delhi",
            description: "Development of an innovative coal gasification system achieving 60%+ energy efficiency with integrated carbon capture mechanisms for sustainable coal utilization in power generation and industrial applications.",
            domain: "Coal Technology & Energy Systems",
            budget: 20000000,
            status: "under_review",
            submittedDate: "2025-09-20",
            createdAt: "2025-09-20T10:00:00Z",
            duration: "24 months",
            keywords: ["Coal Gasification", "Energy Efficiency", "Carbon Capture", "Sustainable Mining", "Clean Coal Technology"],
            projectLeader: "Dr. Raj Patel",
            implementingAgency: "Indian Institute of Technology, Delhi",
            coInvestigators: "Dr. Priya Sharma, Prof. Michael Chen, Dr. Anjali Verma",
            richContent: `
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">1. Problem Statement</h2>
              <p style="color: black; line-height: 1.6; margin-bottom: 1em;">The coal sector faces significant challenges in optimizing energy extraction while minimizing environmental impact. Traditional coal combustion methods result in only 35-40% energy efficiency, with substantial CO2 emissions and particulate matter release. There is an urgent need for innovative gasification technologies that can improve energy output to 60-65% efficiency while reducing harmful emissions by 40-50%.</p>
              
              <p style="color: black; line-height: 1.6; margin-bottom: 1.5em;">Current coal processing facilities in India operate with outdated equipment that struggles to meet environmental compliance standards set by the Ministry of Coal. The lack of advanced gasification infrastructure limits the country's ability to maximize coal utilization for power generation and industrial applications.</p>
              
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">2. Research Objectives</h2>
              <p style="color: black; font-weight: bold; margin-bottom: 0.5em;">Primary Objectives:</p>
              <ul style="color: black; line-height: 1.6; margin-bottom: 1em; padding-left: 2em;">
                <li style="margin-bottom: 0.5em;">Develop an integrated coal gasification system achieving 60%+ energy efficiency</li>
                <li style="margin-bottom: 0.5em;">Design carbon capture mechanisms reducing CO2 emissions by 45%</li>
                <li style="margin-bottom: 0.5em;">Create automated monitoring systems for real-time process optimization</li>
                <li style="margin-bottom: 0.5em;">Establish economic viability models for large-scale implementation</li>
              </ul>
              
              <p style="color: black; font-weight: bold; margin-bottom: 0.5em;">Secondary Objectives:</p>
              <ul style="color: black; line-height: 1.6; margin-bottom: 1.5em; padding-left: 2em;">
                <li style="margin-bottom: 0.5em;">Develop safety protocols for gasification operations</li>
                <li style="margin-bottom: 0.5em;">Create training modules for technical personnel</li>
                <li style="margin-bottom: 0.5em;">Establish environmental compliance frameworks</li>
              </ul>
              
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">3. Justification & Significance</h2>
              <p style="color: black; line-height: 1.6; margin-bottom: 1em;">Coal remains India's primary energy source, accounting for 70% of electricity generation. However, traditional combustion methods are inefficient and environmentally problematic. This research addresses critical national energy security concerns while advancing clean coal technologies.</p>
              
              <p style="color: black; line-height: 1.6; margin-bottom: 1.5em;">The proposed gasification technology aligns with India's commitment to reducing carbon emissions while maintaining energy independence. Successful implementation could revolutionize the coal industry, creating jobs while meeting environmental targets.</p>
              
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">4. Expected Outcomes & Benefits</h2>
              <p style="color: black; line-height: 1.6; margin-bottom: 1em;">The expected outcomes include a 60%+ efficiency coal gasification system with integrated carbon capture, reducing environmental impact while maximizing energy output. The technology will be scalable for both existing and new coal facilities.</p>
              
              <p style="color: black; font-weight: bold; margin-bottom: 0.5em;">Quantifiable Benefits:</p>
              <ul style="color: black; line-height: 1.6; margin-bottom: 1.5em; padding-left: 2em;">
                <li style="margin-bottom: 0.5em;">25% reduction in coal consumption for same energy output</li>
                <li style="margin-bottom: 0.5em;">45% reduction in CO2 emissions compared to traditional methods</li>
                <li style="margin-bottom: 0.5em;">Creation of 500+ skilled jobs in coal technology sector</li>
                <li style="margin-bottom: 0.5em;">Annual cost savings of ₹50 crores for medium-scale operations</li>
              </ul>
              
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">5. Research Methodology</h2>
              <p style="color: black; font-weight: bold; margin-bottom: 0.5em;">Phase 1: Laboratory Testing (Months 1-8)</p>
              <ul style="color: black; line-height: 1.6; margin-bottom: 1em; padding-left: 2em;">
                <li style="margin-bottom: 0.5em;">Coal characterization using X-ray fluorescence and thermogravimetric analysis</li>
                <li style="margin-bottom: 0.5em;">Gasification reactor design using computational fluid dynamics modeling</li>
                <li style="margin-bottom: 0.5em;">Catalyst development for enhanced reaction efficiency</li>
                <li style="margin-bottom: 0.5em;">Small-scale prototype testing under controlled conditions</li>
              </ul>
              
              <p style="color: black; font-weight: bold; margin-bottom: 0.5em;">Phase 2: Pilot Plant Development (Months 9-18)</p>
              <ul style="color: black; line-height: 1.6; margin-bottom: 1.5em; padding-left: 2em;">
                <li style="margin-bottom: 0.5em;">Construction of pilot-scale gasification facility</li>
                <li style="margin-bottom: 0.5em;">Integration of carbon capture systems</li>
                <li style="margin-bottom: 0.5em;">Performance testing with various coal grades</li>
                <li style="margin-bottom: 0.5em;">Environmental impact assessment and monitoring</li>
              </ul>
              
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">6. Work Plan & Implementation</h2>
              <p style="color: black; line-height: 1.6; margin-bottom: 1em;">The project follows a systematic approach from laboratory-scale testing to pilot plant implementation. Each phase includes rigorous testing, data collection, and validation processes to ensure technology readiness for industrial deployment.</p>
              
              <p style="color: black; line-height: 1.6; margin-bottom: 1.5em;">Implementation will be coordinated with coal mining companies and power generation facilities to ensure practical applicability and industry adoption of the developed technology.</p>
              
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">7. Budget Breakdown</h2>
              <table style="width: 100%; border-collapse: collapse; margin: 1.5em 0; color: black;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Category</th>
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Amount (₹ Cr)</th>
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Percentage</th>
                    <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Equipment & Infrastructure</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">120</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">60%</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Gasification reactors, monitoring systems</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Personnel & Consulting</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">50</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">25%</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Research staff, technical consultants</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Materials & Testing</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">20</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">10%</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Coal samples, catalysts, chemicals</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Contingency</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">10</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">5%</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Unforeseen expenses, equipment maintenance</td>
                  </tr>
                  <tr style="background-color: #f9fafb; font-weight: bold;">
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Total Project Cost</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">200</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">100%</td>
                    <td style="border: 1px solid #d1d5db; padding: 12px;">Complete project implementation</td>
                  </tr>
                </tbody>
              </table>
              
              <h2 style="color: black; font-weight: bold; font-size: 1.5em; margin: 1.5em 0 1em 0;">8. Project Timeline</h2>
              <p style="color: black; font-weight: bold; margin-bottom: 0.5em;">Year 1 (Months 1-12): Research & Development Phase</p>
              <ul style="color: black; line-height: 1.6; margin-bottom: 1em; padding-left: 2em;">
                <li style="margin-bottom: 0.5em;">Months 1-3: Coal characterization and catalyst development</li>
                <li style="margin-bottom: 0.5em;">Months 4-8: Laboratory-scale gasification testing</li>
                <li style="margin-bottom: 0.5em;">Months 9-12: Pilot plant design and construction initiation</li>
              </ul>
              
              <p style="color: black; font-weight: bold; margin-bottom: 0.5em;">Year 2 (Months 13-24): Pilot Testing & Validation</p>
              <ul style="color: black; line-height: 1.6; margin-bottom: 1.5em; padding-left: 2em;">
                <li style="margin-bottom: 0.5em;">Months 13-18: Pilot plant construction and commissioning</li>
                <li style="margin-bottom: 0.5em;">Months 19-22: Performance testing and optimization</li>
                <li style="margin-bottom: 0.5em;">Months 23-24: Technology validation and documentation</li>
              </ul>
            `
          };
          setProposal(mockProposal);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const handleExport = async (type) => {
    setIsExporting(true);
    setExportType(type);
    
    // Simulate export process
    setTimeout(() => {
      if (type === 'pdf') {
        // For demo, create a download link to a sample PDF
        const link = document.createElement('a');
        link.href = '/sample-proposal.pdf';
        link.download = `${proposal.title.replace(/\s+/g, '_')}_Proposal.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (type === 'docx') {
        // For demo, create a download link to a sample DOCX
        const link = document.createElement('a');
        link.href = '/sample-proposal.docx';
        link.download = `${proposal.title.replace(/\s+/g, '_')}_Proposal.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setIsExporting(false);
      setExportType('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-black text-xl">Proposal not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section with Government Branding */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-black bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="text-black text-sm">
              Researcher: <span className="font-medium">{proposal.researcher}</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">View R&D Proposal</h1>
            <p className="text-blue-700 text-lg">PRISM - Proposal Review & Innovation Support Mechanism</p>
            <p className="text-black mt-2">Department of Coal (NaCCER) - Research Document</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Export Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">■ Export Options</h2>
              <p className="text-black text-sm">Download this proposal in your preferred format</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {isExporting && exportType === 'pdf' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    📄 Export as PDF
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleExport('docx')}
                disabled={isExporting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {isExporting && exportType === 'docx' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    📝 Export as DOCX
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Proposal Header Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Project Title</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-black">
                {proposal.title}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Implementing Agency</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-black">
                {proposal.institution}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Project Leader</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-black">
                {proposal.projectLeader}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Co-investigator(s)</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-black">
                {proposal.coInvestigators}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-blue-600 text-sm font-semibold mb-1">Domain</div>
              <div className="text-black font-semibold">{proposal.domain}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-green-600 text-sm font-semibold mb-1">Budget</div>
              <div className="text-black font-semibold">₹{proposal.budget.toLocaleString()}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-purple-600 text-sm font-semibold mb-1">Status</div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {proposal.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Rich Text Document Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">▤ Proposal Content</h2>
          
          {/* Read-only Document Viewer */}
          <div className="prose max-w-none">
            <div className="border border-gray-300 rounded-md min-h-[600px] p-6 bg-gray-50">
              <div 
                className="focus:outline-none min-h-[550px] text-black"
                dangerouslySetInnerHTML={{ __html: proposal.richContent }}
                style={{ color: 'black' }}
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">📋 Document Summary:</p>
            <div className="grid md:grid-cols-3 gap-4 mt-2 text-sm text-black">
              <span>Research Domain: <strong>{proposal.domain}</strong></span>
              <span>Budget: <strong>₹{proposal.budget.toLocaleString()}</strong></span>
              <span>Duration: <strong>{proposal.duration}</strong></span>
            </div>
          </div>
        </div>

        {/* Keywords Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            🏷️ Keywords & Research Areas
          </h3>
          <div className="flex flex-wrap gap-3">
            {proposal.keywords.map((keyword, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-blue-100 border border-blue-300 rounded-full text-blue-800 text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push(`/proposal/track/${id}`)}
            className="p-6 bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-black font-semibold text-lg">Track Progress</div>
                <div className="text-black text-sm">Monitor review status and updates</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push(`/proposal/collaborate/${id}`)}
            className="p-6 bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                </svg>
              </div>
              <div>
                <div className="text-black font-semibold text-lg">Collaborate</div>
                <div className="text-black text-sm">Join team discussion and review</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push(`/proposal/edit/${id}`)}
            className="p-6 bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <div className="text-black font-semibold text-lg">Edit Proposal</div>
                <div className="text-black text-sm">Make changes and updates</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ViewProposal() {
  return (
    <ProtectedRoute>
      <ViewProposalContent />
    </ProtectedRoute>
  );
}
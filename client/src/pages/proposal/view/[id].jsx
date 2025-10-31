import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingScreen from '../../../components/LoadingScreen';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Header } from 'docx';

// Custom CSS animations for the view page
const viewAnimationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInUp {
    from { 
      opacity: 0;
      transform: translateY(30px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  .animate-slideInUp {
    animation: slideInUp 0.6s ease-out forwards;
    animation-fill-mode: both;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out forwards;
  }
  
  .animate-pulse-gentle {
    animation: pulse 2s infinite;
  }
`;

function ViewProposalContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportProgress, setExportProgress] = useState(0);

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
    setExportProgress(0);
    
    try {
      if (type === 'pdf') {
        // Generate professionally formatted PDF
        const pdf = new jsPDF();
        const filename = `${proposal.title.replace(/\s+/g, '_')}_Proposal.pdf`;
        let yPosition = 20;
        const pageWidth = pdf.internal.pageSize.width;
        const margin = 20;
        const maxWidth = pageWidth - (2 * margin);
        
        setExportProgress(10);
        
        // Header with logo space and title
        pdf.setFontSize(20);
        pdf.setFont(undefined, 'bold');
        const titleLines = pdf.splitTextToSize(proposal.title, maxWidth);
        pdf.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 8 + 15;
        
        setExportProgress(20);
        
        // Proposal Information Section
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('PROPOSAL INFORMATION', margin, yPosition);
        yPosition += 12;
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        
        // Create info table
        const infoItems = [
          [`Project Leader:`, proposal.projectLeader],
          [`Implementing Agency:`, proposal.implementingAgency],
          [`Co-Investigators:`, proposal.coInvestigators],
          [`Research Domain:`, proposal.domain],
          [`Budget:`, `₹${proposal.budget.toLocaleString()}`],
          [`Duration:`, proposal.duration],
          [`Status:`, proposal.status.replace('_', ' ').toUpperCase()],
          [`Submitted Date:`, proposal.submittedDate]
        ];
        
        infoItems.forEach(([label, value]) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.setFont(undefined, 'bold');
          pdf.text(label, margin, yPosition);
          pdf.setFont(undefined, 'normal');
          const valueLines = pdf.splitTextToSize(value, maxWidth - 60);
          pdf.text(valueLines, margin + 60, yPosition);
          yPosition += Math.max(valueLines.length * 6, 8) + 2;
        });
        
        yPosition += 10;
        setExportProgress(40);
        
        // Content Section
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        if (yPosition > 260) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text('PROPOSAL CONTENT', margin, yPosition);
        yPosition += 15;
        
        // Process HTML content with proper formatting
        const htmlContent = proposal.richContent;
        const contentSections = htmlContent.split(/<h2[^>]*>/);
        
        contentSections.forEach((section, index) => {
          if (index === 0 && !section.trim()) return;
          
          setExportProgress(40 + (index * 30 / contentSections.length));
          
          // Extract heading and content
          const headingMatch = section.match(/^([^<]+)/);
          const heading = headingMatch ? headingMatch[1].trim() : '';
          
          if (heading) {
            // Add heading
            if (yPosition > 260) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text(heading, margin, yPosition);
            yPosition += 10;
          }
          
          // Extract and format content
          const contentPart = section.replace(/^[^<]*<\/h2>/, '');
          let cleanContent = contentPart
            .replace(/<\/h2>/g, '')
            .replace(/<p[^>]*>/g, '\n')
            .replace(/<\/p>/g, '\n')
            .replace(/<ul[^>]*>/g, '\n')
            .replace(/<\/ul>/g, '\n')
            .replace(/<li[^>]*>/g, '• ')
            .replace(/<\/li>/g, '\n')
            .replace(/<strong[^>]*>/g, '')
            .replace(/<\/strong>/g, '')
            .replace(/<table[^>]*>[\s\S]*?<\/table>/g, '[TABLE CONTENT - See online version for detailed table]')
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .replace(/\n\s+/g, '\n')
            .trim();
          
          if (cleanContent) {
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            const contentLines = pdf.splitTextToSize(cleanContent, maxWidth);
            
            contentLines.forEach(line => {
              if (yPosition > 275) {
                pdf.addPage();
                yPosition = 20;
              }
              pdf.text(line, margin, yPosition);
              yPosition += 5;
            });
            yPosition += 5;
          }
        });
        
        setExportProgress(90);
        
        // Add footer to all pages
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setFont(undefined, 'normal');
          pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pdf.internal.pageSize.height - 10);
          pdf.text('Generated by PRISM - MoDoNER portal', margin, pdf.internal.pageSize.height - 10);
        }
        
        setExportProgress(100);
        pdf.save(filename);
        
      } else if (type === 'docx') {
        setExportProgress(10);
        
        // Parse HTML content to extract structured data
        const htmlContent = proposal.richContent;
        const contentSections = htmlContent.split(/<h2[^>]*>/);
        
        const docChildren = [];
        
        // Title
        docChildren.push(
          new Paragraph({
            text: proposal.title,
            heading: HeadingLevel.TITLE,
            alignment: 'center',
            spacing: { after: 400 }
          })
        );
        
        setExportProgress(20);
        
        // Proposal Information
        docChildren.push(
          new Paragraph({
            text: 'PROPOSAL INFORMATION',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 }
          })
        );
        
        const infoItems = [
          [`Project Leader:`, proposal.projectLeader],
          [`Implementing Agency:`, proposal.implementingAgency],
          [`Co-Investigators:`, proposal.coInvestigators],
          [`Research Domain:`, proposal.domain],
          [`Budget:`, `₹${proposal.budget.toLocaleString()}`],
          [`Duration:`, proposal.duration],
          [`Status:`, proposal.status.replace('_', ' ').toUpperCase()],
          [`Submitted Date:`, proposal.submittedDate]
        ];
        
        infoItems.forEach(([label, value]) => {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: label, bold: true }),
                new TextRun({ text: ` ${value}` })
              ],
              spacing: { after: 100 }
            })
          );
        });
        
        setExportProgress(40);
        
        // Content sections
        docChildren.push(
          new Paragraph({
            text: 'PROPOSAL CONTENT',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          })
        );
        
        contentSections.forEach((section, index) => {
          if (index === 0 && !section.trim()) return;
          
          setExportProgress(40 + (index * 40 / contentSections.length));
          
          // Extract heading
          const headingMatch = section.match(/^([^<]+)/);
          const heading = headingMatch ? headingMatch[1].trim() : '';
          
          if (heading) {
            docChildren.push(
              new Paragraph({
                text: heading,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 }
              })
            );
          }
          
          // Process content
          const contentPart = section.replace(/^[^<]*<\/h2>/, '');
          let cleanContent = contentPart
            .replace(/<\/h2>/g, '')
            .replace(/<p[^>]*>/g, '\n\n')
            .replace(/<\/p>/g, '')
            .replace(/<ul[^>]*>/g, '\n')
            .replace(/<\/ul>/g, '\n')
            .replace(/<li[^>]*>/g, '\n• ')
            .replace(/<\/li>/g, '')
            .replace(/<strong[^>]*>(.*?)<\/strong>/g, '$1')
            .replace(/<table[^>]*>[\s\S]*?<\/table>/g, '\n[TABLE CONTENT - Detailed budget and timeline information available in the online version]\n')
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .replace(/\n\s+/g, '\n')
            .trim();
          
          if (cleanContent) {
            // Split content into paragraphs
            const paragraphs = cleanContent.split('\n\n').filter(p => p.trim());
            
            paragraphs.forEach(paragraphText => {
              if (paragraphText.includes('•')) {
                // Handle bullet points
                const bullets = paragraphText.split('\n').filter(b => b.trim());
                bullets.forEach(bullet => {
                  if (bullet.trim().startsWith('•')) {
                    docChildren.push(
                      new Paragraph({
                        text: bullet.replace('•', '').trim(),
                        bullet: { level: 0 },
                        spacing: { after: 100 }
                      })
                    );
                  } else if (bullet.trim()) {
                    docChildren.push(
                      new Paragraph({
                        children: [new TextRun({ text: bullet.trim(), bold: true })],
                        spacing: { before: 100, after: 50 }
                      })
                    );
                  }
                });
              } else if (paragraphText.trim()) {
                docChildren.push(
                  new Paragraph({
                    text: paragraphText.trim(),
                    spacing: { after: 150 }
                  })
                );
              }
            });
          }
        });
        
        setExportProgress(80);
        
        // Create document
        const doc = new Document({
          sections: [{
            properties: {
              page: {
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    text: "PRISM - MoDoNER portal",
                    alignment: 'right',
                    spacing: { after: 200 }
                  })
                ]
              })
            },
            children: docChildren
          }]
        });
        
        setExportProgress(90);
        
        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        
        setExportProgress(100);
        saveAs(blob, filename);
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportType('');
        setExportProgress(0);
      }, 1000);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl">Proposal not found</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{viewAnimationStyles}</style>
      <div className="min-h-screen bg-white">
      {/* Distinctive Header Section - Matching create.jsx and edit.jsx */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-[280px]">
        {/* Animated geometric patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-6 left-10 w-12 h-12 border border-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-10 h-10 border border-indigo-400/20 rounded-lg rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-12 left-32 w-8 h-8 bg-blue-500/10 rounded-full animate-bounce"></div>
          <div className="absolute top-12 right-40 w-4 h-4 bg-indigo-400/20 rounded-full animate-ping"></div>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        
        {/* Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          <div className="group animate-fadeIn">
            <div className="flex items-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-500 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div className="ml-6">
                <div className="flex items-center mb-2">
                  <h1 className="text-white text-4xl font-black tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent animate-slideInUp">
                    View R&D Proposal
                  </h1>
                </div>
                <div className="flex items-center space-x-3 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-3"></div>
                    <span className="text-blue-100 font-semibold text-lg">MoDoNER portal</span>
                  </div>
                  <div className="h-4 w-px bg-blue-300/50"></div>
                  <span className="text-blue-200 font-medium text-sm">Department of Coal</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-blue-200 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                  <span>Proposal ID: #{id}</span>
                  <span>•</span>
                  <span>Researcher: {proposal?.researcher}</span>
                  <span>•</span>
                  <span>Status: {proposal?.status?.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
            </div>
            
            {/* PRISM Banner */}
            <div className="bg-orange-600 backdrop-blur-md rounded-2xl p-4 border border-orange-300/40 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 animate-slideInUp" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-white to-orange-50 rounded-lg flex items-center justify-center shadow-lg overflow-hidden border border-orange-200/50">
                      <img 
                        src="/images/prism brand logo.png" 
                        alt="PRISM Logo" 
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl mb-1 flex items-center">
                      <span className="text-white drop-shadow-md tracking-wide">PRISM</span>
                      <div className="ml-3 px-2 py-0.5 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full flex items-center justify-center border border-green-300/40 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1.5 animate-pulse"></div>
                        <span className="text-white text-xs font-semibold drop-shadow-sm">VIEWING</span>
                      </div>
                    </h2>
                    <p className="text-orange-50 text-sm leading-relaxed font-medium opacity-95 drop-shadow-sm">
                      Proposal Review & Innovation Support Mechanism for Department of Coal's Advanced Research Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        
        {/* Back to Dashboard Button - Separate */}
        <div className="flex justify-start mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-800 border border-green-300 transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl text-sm transform hover:scale-105 animate-fadeIn cursor-pointer"
          >
            <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Back to Dashboard
          </button>
        </div>



        {/* Proposal Information Section - Scaled to Match Create.jsx */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-orange-200 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Proposal Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-black mb-1">Project Title</label>
              <div className="w-full px-2 py-1.5 border border-orange-200 rounded-md bg-orange-50 text-black text-xs">
                {proposal.title}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-black mb-1">Implementing Agency</label>
              <div className="w-full px-2 py-1.5 border border-orange-200 rounded-md bg-orange-50 text-black text-xs">
                {proposal.implementingAgency}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-black mb-1">Project Leader</label>
              <div className="w-full px-2 py-1.5 border border-orange-200 rounded-md bg-orange-50 text-black text-xs">
                {proposal.projectLeader}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-black mb-1">Co-Investigators</label>
              <div className="w-full px-2 py-1.5 border border-orange-200 rounded-md bg-orange-50 text-black text-xs">
                {proposal.coInvestigators}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-black mb-1">Research Domain</label>
              <div className="w-full px-2 py-1.5 border border-orange-200 rounded-md bg-orange-50 text-black text-xs">
                {proposal.domain}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-black mb-1">Budget</label>
              <div className="w-full px-2 py-1.5 border border-orange-200 rounded-md bg-orange-50 text-black text-xs">
                ₹{proposal.budget.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-orange-600 text-xs font-semibold mb-1">Duration</div>
              <div className="text-black font-semibold text-sm">{proposal.duration}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-green-600 text-xs font-semibold mb-1">Status</div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {proposal.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-blue-600 text-xs font-semibold mb-1">Submitted</div>
              <div className="text-black font-semibold text-sm">{proposal.submittedDate}</div>
            </div>
          </div>
        </div>

        {/* Proposal Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-orange-200 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Proposal Content
          </h2>
          
          {/* Read-only Document Viewer */}
          <div className="prose max-w-none">
            <div className="border border-orange-200 rounded-lg min-h-[600px] p-6 bg-orange-50">
              <div 
                className="focus:outline-none min-h-[550px] text-black"
                dangerouslySetInnerHTML={{ __html: proposal.richContent }}
                style={{ color: 'black' }}
              />
            </div>
          </div>
        </div>

        {/* Export Controls - Between Content and Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-orange-200 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2 flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Export Options
              </h2>
              <p className="text-black text-sm">Download this proposal in your preferred format</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer ${
                  isExporting && exportType === 'pdf' 
                    ? 'bg-red-400 text-white cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isExporting && exportType === 'pdf' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating PDF... {exportProgress}%</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Export as PDF
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleExport('docx')}
                disabled={isExporting}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer ${
                  isExporting && exportType === 'docx' 
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isExporting && exportType === 'docx' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating DOCX... {exportProgress}%</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as DOCX
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons - Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInUp" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => router.push(`/proposal/edit/${id}`)}
            className="p-6 bg-white rounded-xl shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105 group cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <div className="text-black font-semibold text-lg">Edit Proposal</div>
                <div className="text-gray-500 text-sm">Make changes and updates</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push(`/proposal/collaborate/${id}`)}
            className="p-6 bg-white rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105 group cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-black font-semibold text-lg">Collaborate</div>
                <div className="text-gray-500 text-sm">Join team discussion</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push(`/proposal/track/${id}`)}
            className="p-6 bg-white rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105 group cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-black font-semibold text-lg">Track Progress</div>
                <div className="text-gray-500 text-sm">Monitor review status</div>
              </div>
            </div>
          </button>
        </div>
      </div>
      </div>
    </>
  );
}

export default function ViewProposal() {
  return (
    <ProtectedRoute>
      <ViewProposalContent />
    </ProtectedRoute>
  );
}
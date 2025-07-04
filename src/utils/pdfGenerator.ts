import jsPDF from 'jspdf';
import { CVData, GenerationOptions, Skill } from '../types/cv';
import Logo from '../img/Logo.png';
import {processDateRange} from '../utils/dateProcessor'

export const generatePDF = async (
  cvData: CVData,
  options: GenerationOptions,
  filename: string
) => {
  const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;

  // Define colors
  const redColor = [185, 25, 47]; // #B9192F
  const grayColor = [188, 190, 192]; // #BCBEC0
  const blackColor = [0, 0, 0];

  // Layout variables for flexibility
  const margin = 15;
  const headerSpacing = 7;
  const sectionSpacing = 10;
  const lineSpacing = 4;
  const smallLineSpacing = 2;
  const contactSpacing = 5;
  const leftColumnRatio = 0.4;
  const leftColumnWidth = (pageWidth - 2 * margin) * leftColumnRatio;
  const rightColumnStart = margin + leftColumnWidth + 8; // 8mm gap
  const rightColumnWidth = pageWidth - rightColumnStart - margin;

  let pagenumber = 1
  let rightpagenumber = 1

  let yPos = margin; // Default value, will be updated if personal info is included

  // Header section
  pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  
  // Name and title (left side)
  if (options.includePersonalInfo) {
    const firstName = cvData.first_name || '';
    const lastName = cvData.last_name || '';
    
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    pdf.text(firstName.toUpperCase(), margin, yPos);
    yPos += headerSpacing;
    pdf.text(lastName.toUpperCase(), margin, yPos);
    yPos += headerSpacing;
  } else {
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    pdf.text('PROFESSIONAL CV', margin, yPos);
    yPos += headerSpacing + 2;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
  const titleText = (cvData.title || '').toUpperCase();
  const maxTitleWidth = pageWidth * 0.5;
  const titleWidth = pdf.getTextWidth(titleText);
  if (titleWidth > maxTitleWidth) {
    // Split into two lines
    const splitTitle = pdf.splitTextToSize(titleText, maxTitleWidth);
    pdf.text(splitTitle, margin, yPos);
    yPos += splitTitle.length * headerSpacing / 1.5; // Adjust spacing for multiple lines
  } else {
    pdf.text(titleText, margin, yPos);
    yPos += headerSpacing;
  }
  
  pdf.addImage(Logo, 'PNG', pageWidth - 38, 10, 28, 0);
  // Contact info (right side)
  if (options.includePersonalInfo && options.includePrivateInfo && cvData.contact) {
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(10);
    let contactY = margin + 10;
    const contactX = pageWidth - margin - 60;
    
    if (cvData.contact.location) {
      pdf.text(cvData.contact.location, contactX, contactY);
      contactY += contactSpacing;
    }
    if (cvData.contact.email) {
      pdf.text(cvData.contact.email, contactX, contactY);
      contactY += contactSpacing;
    }
  }

  // Red separator line
  pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
  pdf.setLineWidth(1);
  pdf.line(0, yPos, pageWidth, yPos);

  yPos += sectionSpacing;

  // Helper function for section headers
  const addSectionHeader = (title: string, x: number, y: number, isLeftColumn = false) => {
    pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, x, y);
    
    // Underline
    const headerWidth = isLeftColumn ? 15 : 20;
    const grayWidth = isLeftColumn ? leftColumnWidth - 15 : rightColumnWidth - 20;
    
    pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(x, y + 1, x + headerWidth, y + 1);
    
    pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2]);
    pdf.line(x + headerWidth, y + 1, x + headerWidth + grayWidth, y + 1);
    
    return y + sectionSpacing / 2;
  };

  // LEFT COLUMN
  let leftY = yPos;
  let rightY = yPos; // <-- Start both columns just after the header

  // Draw vertical separator line on the first page
  pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(margin + leftColumnWidth + 2, yPos-sectionSpacing, margin + leftColumnWidth + 2, pageHeight - margin);

  // Helper function to check and add new page for left column
  const checkLeftPageOverflow = (nextBlockHeight: number) => {
    if (leftY + nextBlockHeight > pageHeight - margin) {
      pdf.addPage();
      pagenumber += 1
      leftY = margin;
      // Draw separator line on new page
      pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin + leftColumnWidth + 2, margin, margin + leftColumnWidth + 2, pageHeight - margin);
    }
  };

  // About Me
  if (cvData.summary) {
    const summaryLines = pdf.splitTextToSize(cvData.summary, leftColumnWidth - 5);
    checkLeftPageOverflow(summaryLines.length * lineSpacing + sectionSpacing + 6);
    leftY = addSectionHeader('ABOUT ME', margin, leftY, true);
    pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(summaryLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
    leftY += summaryLines.length * lineSpacing + sectionSpacing;
  }

  // Skills
  if (Array.isArray(cvData.skills) && cvData.skills.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('SKILLS', margin, leftY, true);
    cvData.skills.forEach((skill: Skill) => {
      checkLeftPageOverflow(lineSpacing * 2 + smallLineSpacing);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const skillTextLines = pdf.splitTextToSize(skill.skills.join(', '), leftColumnWidth - 5);
      pdf.text(skillTextLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      // Skill level bar
      // const linesofskills = skillTextLines*9/1.618/(leftColumnWidth - 5)
      leftY += (skillTextLines.length - 1)*lineSpacing + smallLineSpacing*0.5
      const barWidth = leftColumnWidth - 5;
      const skillLevel = skill.level === 'Expert' ? 1.0 : skill.level === 'Advanced' ? 0.9 : skill.level === 'Intermediate' ? 0.7 : 0.5;
      pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
      pdf.rect(margin, leftY + 1, barWidth, 2, 'F');
      pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
      pdf.rect(margin, leftY + 1, barWidth * skillLevel, 2, 'F');
      leftY += lineSpacing + smallLineSpacing*2;
    });
    leftY += sectionSpacing / 2;
  }

  // Links
  if (cvData.contact?.links && (cvData.contact.links.LinkedIn || cvData.contact.links.GitHub || cvData.contact.links.website)) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('LINKS', margin, leftY, true);
    if (cvData.contact.links.LinkedIn) {
      checkLeftPageOverflow(lineSpacing * 2 + smallLineSpacing);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('LINKEDIN:', margin, leftY);
      leftY += lineSpacing + 1;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const linkedInLines = pdf.splitTextToSize(cvData.contact.links.LinkedIn, leftColumnWidth - 5);
      pdf.text(linkedInLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      leftY += linkedInLines.length * lineSpacing + smallLineSpacing;
    }
    if (cvData.contact.links.GitHub) {
      checkLeftPageOverflow(lineSpacing * 2 + smallLineSpacing);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('GITHUB:', margin, leftY);
      leftY += lineSpacing + 1;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      const githubLines = pdf.splitTextToSize(cvData.contact.links.GitHub, leftColumnWidth - 5);
      pdf.text(githubLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      leftY += githubLines.length * lineSpacing + smallLineSpacing;
    }
    if (cvData.contact.links.website) {
      checkLeftPageOverflow(lineSpacing * 2 + smallLineSpacing);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('WEBSITE:', margin, leftY);
      leftY += lineSpacing + 1;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      const websiteLines = pdf.splitTextToSize(cvData.contact.links.website, leftColumnWidth - 5);
      pdf.text(websiteLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      leftY += websiteLines.length * lineSpacing + smallLineSpacing;
    }
  }

  // Languages
  if (cvData.languages_spoken && cvData.languages_spoken.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('LANGUAGES', margin, leftY, true);
    cvData.languages_spoken.forEach((language) => {
      const lang = typeof language === 'string' ? language : language.name || '';
      const level = typeof language === 'string' ? 'Intermediate' : language.level || 'Intermediate';
      checkLeftPageOverflow(lineSpacing * 2 + smallLineSpacing);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      const langLines = pdf.splitTextToSize(lang.toUpperCase(), leftColumnWidth - 5);
      pdf.text(langLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      const barWidth = leftColumnWidth - 10;
      const levelValue = level === 'Native' ? 1.0 : level === 'Advanced' ? 0.9 : level === 'Intermediate' ? 0.7 : 0.5;
      pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2]);
      pdf.rect(margin, leftY + 1, barWidth, 2, 'F');
      pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
      pdf.rect(margin, leftY + 1, barWidth * levelValue, 2, 'F');
      leftY += langLines.length * lineSpacing + lineSpacing + smallLineSpacing;
    });
  }

  // Certifications
  if (cvData.certifications && cvData.certifications.length > 0) {
    checkLeftPageOverflow(sectionSpacing);
    leftY = addSectionHeader('CERTIFICATIONS', margin, leftY, true);
    cvData.certifications.forEach((cert) => {
      checkLeftPageOverflow(lineSpacing * 2 + smallLineSpacing);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const certNameLines = pdf.splitTextToSize((cert.name || '').toUpperCase(), leftColumnWidth - 5);
      pdf.text(certNameLines, margin, leftY, { maxWidth: leftColumnWidth - 5 });
      leftY += (certNameLines.length-1) * lineSpacing;
      if (cert.issuer) {
        pdf.setFontSize(9);
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        const issuerLines = pdf.splitTextToSize(cert.issuer, leftColumnWidth - 5);
        pdf.text(issuerLines, margin, leftY + lineSpacing, { maxWidth: leftColumnWidth - 5 });
        leftY += issuerLines.length * lineSpacing;
      }
      leftY += lineSpacing + smallLineSpacing;
    });
  }

  // RIGHT COLUMN
  
  pdf.setPage(1)

  // Helper function to check and add new page for right column
  const checkRightPageOverflow = (nextBlockHeight: number) => {
    if (rightY + nextBlockHeight > pageHeight - margin) {
      rightpagenumber += 1
      if (rightpagenumber <= pagenumber){
        pdf.setPage(rightpagenumber)
      } else{
        pdf.addPage();
      }
      rightY = margin;
      // Draw separator line on new page
      pdf.setDrawColor(redColor[0], redColor[1], redColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin + leftColumnWidth + 2, margin, margin + leftColumnWidth + 2, pageHeight - margin);
    }
  };
  // Work Experience
  if (Array.isArray(cvData.experience) && cvData.experience.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    console.log("rightY", rightY)
    rightY = addSectionHeader('WORK EXPERIENCE', rightColumnStart, rightY);
    cvData.experience.forEach((exp) => {
      let blockHeight = lineSpacing * 4;
      checkRightPageOverflow(blockHeight);
      // Company and dates
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const companyLines = pdf.splitTextToSize((exp.company || '').toUpperCase(), rightColumnWidth - 5);
      pdf.text(companyLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      const dateRange = processDateRange(exp.start_date, exp.end_date)

      if (exp.start_date){
        pdf.text(dateRange, pageWidth - margin - 30, rightY);
      } else {
        pdf.text(dateRange, pageWidth - margin - 10, rightY);
      }
      pdf.setFontSize(9);
      
      
      rightY += companyLines.length * lineSpacing + 1;
      // Position
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      const titleLines = pdf.splitTextToSize(exp.title || '', rightColumnWidth - 5);
      pdf.text(titleLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      rightY += titleLines.length * lineSpacing + 1;
      // Location
      if (exp.location) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const locationLines = pdf.splitTextToSize(exp.location, rightColumnWidth - 5);
        pdf.text(locationLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
        rightY += lineSpacing;
      }
      // Summary
      if (exp.summary) blockHeight = pdf.splitTextToSize(exp.summary, rightColumnWidth - 5).length * lineSpacing;
      checkRightPageOverflow(blockHeight);
      if (exp.summary) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const summaryLines = pdf.splitTextToSize(exp.summary, rightColumnWidth - 5);
        pdf.text(summaryLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
        rightY += summaryLines.length * lineSpacing;
      }
      // Description
      if (Array.isArray(exp.description) && exp.description.length > 0) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFont('helvetica', 'normal');
        exp.description.forEach((desc) => {
          checkRightPageOverflow(lineSpacing * 2);
          const descLines = pdf.splitTextToSize(`• ${desc}`, rightColumnWidth - 5);
          pdf.setFontSize(9);
          pdf.text(descLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
          rightY += descLines.length * lineSpacing;
        });
        rightY += smallLineSpacing*2;
      }
    });
  }

  // Education
  if (Array.isArray(cvData.education) && cvData.education.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('EDUCATION', rightColumnStart, rightY);
    cvData.education.forEach((edu) => {
      checkRightPageOverflow(lineSpacing * 4);
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      const degreeLines = pdf.splitTextToSize(edu.degree || '', rightColumnWidth - 30);
      pdf.text(degreeLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 30 });
      
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(9);
      const dateRange = processDateRange(edu.start_date, edu.end_date)
      if (edu.start_date){
        pdf.text(dateRange, pageWidth - margin - 30, rightY);
      } else {
        pdf.text(dateRange, pageWidth - margin - 10, rightY);
      }

      rightY += degreeLines.length * lineSpacing + 1;
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(9);
      const institutionLines = pdf.splitTextToSize((edu.institution || ''), rightColumnWidth - 30);
      pdf.text(institutionLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 30});
      
      pdf.setFontSize(9);
      rightY += institutionLines.length * lineSpacing + 1;
      
      
      if (edu.field) {
        pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        pdf.setFontSize(9);
        const fieldLines = pdf.splitTextToSize(edu.field, rightColumnWidth - 30);
        pdf.text(fieldLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 30});
        rightY += fieldLines.length * lineSpacing * 2;
      }
    });
  }

  // Projects
  if (Array.isArray(cvData.projects) && cvData.projects.length > 0) {
    checkRightPageOverflow(sectionSpacing);
    rightY = addSectionHeader('PROJECTS', rightColumnStart, rightY);
    cvData.projects.forEach((project) => {
      let blockHeight = lineSpacing * 4;
      checkRightPageOverflow(blockHeight);
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const projectNameLines = pdf.splitTextToSize((project.project_name || '').toUpperCase(), rightColumnWidth - 5);
      pdf.text(projectNameLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      const startDate = project.start_date ? new Date(project.start_date + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }).toUpperCase() : '';
      const endDate = project.end_date ? new Date(project.end_date + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }).toUpperCase() : 'PRESENT';
      const dateRange = `${startDate} - ${endDate}`;
      pdf.text(dateRange, pageWidth - margin - 50, rightY);
      rightY += projectNameLines.length * lineSpacing + 1;
      pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
      pdf.setFontSize(9);
      const orgLines = pdf.splitTextToSize(project.organization || '', rightColumnWidth - 5);
      pdf.text(orgLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      rightY += orgLines.length * lineSpacing + 1;


      if (project.description) blockHeight = pdf.splitTextToSize(project.description, rightColumnWidth - 5).length * lineSpacing;
      checkRightPageOverflow(blockHeight);
      
      pdf.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(project.description || '', rightColumnWidth - 5);
      pdf.setFontSize(9);
      pdf.text(descLines, rightColumnStart, rightY, { maxWidth: rightColumnWidth - 5 });
      rightY += descLines.length * lineSpacing + smallLineSpacing;
    });
  }

  // Download the PDF
  pdf.save(filename);
};
import React from 'react';
import { CVData, GenerationOptions } from '../types/cv';
import { Download, FileText } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

interface DownloadPanelProps {
  cvData: CVData;
  options: GenerationOptions;
}

export const DownloadPanel: React.FC<DownloadPanelProps> = ({ cvData, options }) => {
  const generateFilename = (includeFullName: boolean, includePersonal: boolean) => {
    if (!includePersonal) {
      return 'CV_Commit_Offshore.pdf';
    }

    const firstName = cvData.first_name || '';
    const lastName = cvData.last_name || '';
    
    if (!firstName || !lastName) {
      return 'CV_Commit_Offshore.pdf';
    }

    if (includeFullName) {
      return `${firstName}${lastName}_Commit_Offshore.pdf`;
    } else {
      return `${firstName}_${lastName.charAt(0)}_Commit_Offshore.pdf`;
    }
  };

  const handleDownload = async (includeFullName: boolean, includePrivate: boolean) => {
    try {
      const filename = generateFilename(includeFullName, options.includePersonalInfo);
      const downloadOptions = {
        ...options,
        includePrivateInfo: includePrivate,
      };
      
      await generatePDF(cvData, downloadOptions, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a toast notification here
    }
  };

  // Check if we have valid CV data
  const hasValidData = cvData && (cvData.first_name || cvData.last_name || cvData.title);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Download Options
      </h3>

      {!hasValidData && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-sm text-yellow-800">
            Please ensure you have entered at least a name or title before downloading.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Full Information CV</span>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Download CV with complete personal and contact information
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleDownload(true, true)}
              disabled={!hasValidData}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Full Name Version
            </button>
            <button
              onClick={() => handleDownload(false, true)}
              disabled={!hasValidData}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Short Name Version
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="font-medium text-slate-800">Privacy-Safe CV</span>
          </div>
          <p className="text-sm text-slate-700 mb-3">
            Download CV without sensitive personal information
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleDownload(true, false)}
              disabled={!hasValidData}
              className="bg-slate-600 hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Full Name Version (No Private Info)
            </button>
            <button
              onClick={() => handleDownload(false, false)}
              disabled={!hasValidData}
              className="bg-slate-600 hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Short Name Version (No Private Info)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Filename formats:</strong><br />
          • Full: {generateFilename(true, options.includePersonalInfo)}<br />
          • Short: {generateFilename(false, options.includePersonalInfo)}
        </p>
      </div>
    </div>
  );
};
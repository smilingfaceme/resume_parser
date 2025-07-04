import React from 'react';
import { GenerationOptions } from '../types/cv';
import { Settings, Eye, EyeOff } from 'lucide-react';

interface GenerationOptionsPanelProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
}

export const GenerationOptionsPanel: React.FC<GenerationOptionsPanelProps> = ({
  options,
  onChange,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        Generation Options
      </h3>

      <div className="space-y-4">
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={options.includePersonalInfo}
            onChange={(e) =>
              onChange({ ...options, includePersonalInfo: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <div className="flex items-center gap-2 flex-1">
            <Eye className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-medium text-slate-800">Include Full Personal Information</div>
              <div className="text-sm text-slate-600">Generate CV with complete contact details and personal info</div>
            </div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={options.includePrivateInfo}
            onChange={(e) =>
              onChange({ ...options, includePrivateInfo: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <div className="flex items-center gap-2 flex-1">
            <EyeOff className="w-4 h-4 text-slate-600" />
            <div>
              <div className="font-medium text-slate-800">Include Private Information</div>
              <div className="text-sm text-slate-600">Include sensitive details like address and phone number</div>
            </div>
          </div>
        </label>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> You can generate multiple versions of your CV with different privacy settings using the download buttons.
        </p>
      </div>
    </div>
  );
};
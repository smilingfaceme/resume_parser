import React from 'react';
import { PersonalInfo, Contact } from '../types/cv';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Github, Twitter } from 'lucide-react';

interface PersonalInfoEditorProps {
  personalInfo: PersonalInfo;
  onChange: (personalInfo: PersonalInfo) => void;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  personalInfo,
  onChange,
}) => {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...personalInfo, [field]: value });
  };

  const updateContactField = (field: keyof Contact, value: string) => {
    const currentContact = personalInfo.contact || {
      location: '',
      phone: '',
      email: '',
      links: {},
    };
    onChange({
      ...personalInfo,
      contact: { ...currentContact, [field]: value }
    });
  };

  const updateLinksField = (field: keyof NonNullable<Contact['links']>, value: string) => {
    const currentContact = personalInfo.contact || {
      location: '',
      phone: '',
      email: '',
      links: {},
    };
    const currentLinks = currentContact.links || {};
    onChange({
      ...personalInfo,
      contact: { 
        ...currentContact, 
        links: { 
          ...currentLinks, 
          [field]: value 
        } 
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
        <User className="w-5 h-5" />
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={personalInfo.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={personalInfo.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Doe"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Professional Title
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Software Engineer"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Professional Summary
          </label>
          <textarea
            value={personalInfo.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Professional summary..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <input
            type="text"
            value={personalInfo.contact?.location || ''}
            onChange={(e) => updateContactField('location', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="New York, United States"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            type="email"
            value={personalInfo.contact?.email || ''}
            onChange={(e) => updateContactField('email', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Phone className="w-4 h-4" />
            Phone
          </label>
          <input
            type="tel"
            value={personalInfo.contact?.phone || ''}
            onChange={(e) => updateContactField('phone', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Linkedin className="w-4 h-4" />
            LinkedIn (Optional)
          </label>
          <input
            type="url"
            value={personalInfo.contact?.links?.LinkedIn || ''}
            onChange={(e) => updateLinksField('LinkedIn', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Github className="w-4 h-4" />
            GitHub (Optional)
          </label>
          <input
            type="url"
            value={personalInfo.contact?.links?.GitHub || ''}
            onChange={(e) => updateLinksField('GitHub', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Twitter className="w-4 h-4" />
            Twitter (Optional)
          </label>
          <input
            type="url"
            value={personalInfo.contact?.links?.twitter || ''}
            onChange={(e) => updateLinksField('twitter', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://twitter.com/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Globe className="w-4 h-4" />
            Website (Optional)
          </label>
          <input
            type="url"
            value={personalInfo.contact?.links?.website || ''}
            onChange={(e) => updateLinksField('website', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://johndoe.com"
          />
        </div>
      </div>
    </div>
  );
};
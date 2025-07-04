import React from 'react';
import { CVData, GenerationOptions } from '../types/cv';
import { MapPin, Mail, Linkedin, User, Briefcase, GraduationCap, Award, Languages, BookOpen } from 'lucide-react';
import { processDateRange } from '../utils/dateProcessor';
import Logo from '../img/Logo.png';


interface CVPreviewProps {
  cvData: CVData;
  options: GenerationOptions;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData, options }) => {

  const getSkillLevel = (level?: string) => {
    switch (level) {
      case 'Expert': return 100;
      case 'Advanced': return 90;
      case 'Intermediate': return 70;
      case 'Beginner': return 50;
      default: return 70;
    }
  };

  const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div 
        className="bg-red-600 h-1.5 rounded-full" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  const SectionHeader = ({ icon, title, isLeftColumn = false }: { icon: React.ReactNode, title: string, isLeftColumn?: boolean }) => (
    <div className="mb-2">
      <div className={`flex items-center gap-2 mb-3 ${isLeftColumn ? 'justify-start' : 'justify-start'}`}>
        <div className="text-red-600">{icon}</div>
        <h3 className="font-bold text-black text-xs">{title}</h3>
      </div>
      <div className="flex items-center">
        <div className={`h-0.5 bg-red-600 ${isLeftColumn ? 'w-8' : 'w-10'}`}></div>
        <div className={`h-0.5 bg-gray-300 flex-1 ${isLeftColumn ? 'ml-0' : 'ml-0'}`}></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-2xl border border-gray-200 w-full mx-auto" style={{ width: '794px', height: '1123px', minHeight: '1123px' }}>
      {/* Header Section */}
      <div className="p-4 pb-3">
        <div className="flex justify-between items-start h-full">
          <div className="flex-1 pl-6">
            {options.includePersonalInfo ? (
              <>
                <h1 className="text-2xl font-bold text-red-600 leading-tight mb-1">
                  {(cvData.first_name || '').toUpperCase()}
                </h1>
                <h1 className="text-2xl font-bold text-red-600 leading-tight mb-2">
                  {(cvData.last_name || '').toUpperCase()}
                </h1>
                <p className="text-sm font-bold text-black">
                  {(cvData.title || '').toUpperCase()}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-red-600 leading-tight mb-2">
                  PROFESSIONAL CV
                </h1>
                <p className="text-sm font-bold text-black">
                  {(cvData.title || '').toUpperCase()}
                </p>
              </>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            {/* Company Logo */}
            <img src={Logo} alt="Company Logo" className="w-24 object-contain mb-3 bg-white rounded" />
            
            {options.includePersonalInfo && options.includePrivateInfo && cvData.contact && (
              <div className="text-xs text-black space-y-1 text-right">
                {cvData.contact.location && (
                  <div className="flex items-center justify-start gap-2">
                    <MapPin className="w-3 h-3 text-red-600 flex-shrink-0" />
                    <span className="break-all">{cvData.contact.location}</span>
                  </div>
                )}
                {cvData.contact.email && (
                  <div className="flex items-center justify-start gap-2">
                    <Mail className="w-3 h-3 text-red-600 flex-shrink-0" />
                    <span className="break-all">{cvData.contact.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Red separator line */}
      <div className="h-1 bg-red-600"></div>

      {/* Two-column layout */}
      <div className="flex h-full">
        {/* Left Column (40%) */}
        <div className="w-2/5 p-4 space-y-4 text-xs">
          {/* About Me */}
          {cvData.summary && (
            <div>
              <SectionHeader icon={<User className="w-3 h-3" />} title="ABOUT ME" isLeftColumn />
              <p className="text-black leading-relaxed text-xs">{cvData.summary}</p>
            </div>
          )}

          {/* Skills */}
          {cvData.skills && typeof cvData.skills === 'object' && Object.keys(cvData.skills).length > 0 && (
            <div>
              <SectionHeader icon={<Award className="w-3 h-3" />} title="SKILLS" isLeftColumn />
              <div className="space-y-2">
                {Object.entries(cvData.skills).map(([, skillObj], index) => (
                  <div key={index}>
                    <div className="text-xs font-medium text-black mb-1">
                      {skillObj.skills.join(', ')}
                    </div>
                    <ProgressBar percentage={getSkillLevel(skillObj.level || 'Intermediate')} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {cvData.contact?.links && (
            <div>
              <SectionHeader icon={<Linkedin className="w-3 h-3" />} title="LINKS" isLeftColumn />
              <div className="space-y-2">
                {cvData.contact.links.LinkedIn && (
                  <div>
                    <p className="text-xs font-bold text-black mb-1">LINKEDIN:</p>
                    <p className="text-xs text-black break-all leading-relaxed">
                      <a href={cvData.contact.links.LinkedIn} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {cvData.contact.links.LinkedIn}
                      </a>
                    </p>
                  </div>
                )}
                {cvData.contact.links.GitHub && (
                  <div>
                    <p className="text-xs font-bold text-black mb-1">GITHUB:</p>
                    <p className="text-xs text-black break-all leading-relaxed">
                      <a href={cvData.contact.links.GitHub} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {cvData.contact.links.GitHub}
                      </a>
                    </p>
                  </div>
                )}
                {cvData.contact.links.website && (
                  <div>
                    <p className="text-xs font-bold text-black mb-1">WEBSITE:</p>
                    <p className="text-xs text-black break-all leading-relaxed">
                      <a href={cvData.contact.links.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {cvData.contact.links.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {cvData.languages_spoken && cvData.languages_spoken.length > 0 && (
            <div>
              <SectionHeader icon={<Languages className="w-3 h-3" />} title="LANGUAGES" isLeftColumn />
              <div className="space-y-2">
                {cvData.languages_spoken.map((language, index) => {
                  const lang = typeof language === 'string' ? language : language.name || '';
                  const level = typeof language === 'string' ? 'Intermediate' : language.level || 'Intermediate';
                  return (
                    <div key={index}>
                      <div className="text-xs font-medium text-black mb-1">{lang.toUpperCase()}</div>
                      <ProgressBar percentage={level === 'Native' ? 100 : level === 'Advanced' ? 90 : level === 'Intermediate' ? 70 : 50} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certifications */}
          {cvData.certifications && cvData.certifications.length > 0 && (
            <div>
              <SectionHeader icon={<BookOpen className="w-3 h-3" />} title="CERTIFICATIONS" isLeftColumn />
              <div className="space-y-2">
                {cvData.certifications.map((cert, index) => (
                  <div key={index} className="text-xs text-black">
                    <p className="font-bold leading-relaxed mb-1">{(cert.name || '').toUpperCase()}</p>
                    {cert.issuer && <p className="text-xs text-gray-600">{cert.issuer}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical separator */}
        <div className="w-0.5 bg-red-600"></div>

        {/* Right Column (60%) */}
        <div className="w-3/5 p-4 space-y-4 text-xs">
          {/* Work Experience */}
          {cvData.experience && cvData.experience.length > 0 && (
            <div>
              <SectionHeader icon={<Briefcase className="w-3 h-3" />} title="WORK EXPERIENCE" />
              <div className="space-y-3">
                {cvData.experience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-3">
                        <h4 className="font-bold text-black text-xs mb-1">{(exp.company || '').toUpperCase()}</h4>
                        <p className="text-xs text-black">{exp.location || ''}</p>
                      </div>
                      <div className="text-xs font-bold text-black text-right flex-shrink-0">
                        {`${processDateRange(exp.start_date, exp.end_date)}`}
                      </div>
                    </div>
                    <p className="font-bold text-red-600 text-xs">{exp.title || ''}</p>
                    {exp.summary && (
                      <p className="text-xs text-black mb-2">{exp.summary}</p>
                    )}
                    {exp.description && exp.description.length > 0 && (
                      <div className="text-xs text-black leading-relaxed">
                        {exp.description.map((desc, descIndex) => (
                          <p key={descIndex} className="mb-1">• {desc.trim()}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <div>
              <SectionHeader icon={<GraduationCap className="w-3 h-3" />} title="EDUCATION" />
              <div className="space-y-3">
                {cvData.education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-3">
                        <h4 className="font-bold text-black text-xs mb-1">{(edu.institution || '').toUpperCase()}</h4>
                        {edu.field && <p className="text-xs text-black">{edu.field}</p>}
                      </div>
                      <div className="text-xs font-bold text-black text-right flex-shrink-0">
                        {`${processDateRange(edu.start_date, edu.end_date)}`}
                      </div>
                    </div>
                    <p className="font-bold text-red-600 text-xs">{edu.degree || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cvData.projects && cvData.projects.length > 0 && (
            <div>
              <SectionHeader icon={<Briefcase className="w-3 h-3" />} title="PROJECTS" />
              <div className="space-y-3">
                {cvData.projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-3">
                        <h4 className="font-bold text-black text-xs mb-1">{(project.project_name || '').toUpperCase()}</h4>
                        <p className="text-xs text-black">{project.organization || ''}</p>
                      </div>
                      <div className="text-xs font-bold text-black text-right flex-shrink-0">
                        {`${processDateRange(project.start_date, project.end_date)}`}
                      </div>
                    </div>
                    <p className="text-xs text-black leading-relaxed">{project.description || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, FileText, Sparkles, Briefcase, GraduationCap } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [step, setStep] = useState<'template' | 'form' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [latexCode, setLatexCode] = useState('');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('form');
  };

  const handleFormComplete = (data: Record<string, any>, latex: string) => {
    setFormData(data);
    setLatexCode(latex);
    setStep('preview');
  };

  const handleBack = () => {
    if (step === 'preview') {
      setStep('form');
    } else if (step === 'form') {
      setStep('template');
    }
  };

  const handleStartOver = () => {
    setStep('template');
    setSelectedTemplate('');
    setFormData({});
    setLatexCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ResumeAI
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {step === 'template' && 'Choose Your Template'}
                {step === 'form' && 'Build Your Resume'}
                {step === 'preview' && 'Your Resume'}
              </h2>
              <p className="text-gray-600 mt-1">
                {step === 'template' && 'Select a professional template to get started'}
                {step === 'form' && 'Fill in your details or use AI to auto-fill'}
                {step === 'preview' && 'Preview and download your resume'}
              </p>
            </div>

            {step !== 'template' && (
              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Back
                </button>
                {step === 'preview' && (
                  <button
                    onClick={handleStartOver}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                  >
                    Start Over
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                step === 'template'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-400'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Template</span>
            </div>
            <div className="h-1 w-12 bg-gray-300 rounded"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                step === 'form'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : step === 'preview'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-400'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Details</span>
            </div>
            <div className="h-1 w-12 bg-gray-300 rounded"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                step === 'preview'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-400'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Preview</span>
            </div>
          </div>
        </div>

        <div className="animate-fade-in">
          {step === 'template' && <TemplateSelector onSelect={handleTemplateSelect} />}
          {step === 'form' && (
            <ResumeForm
              templateId={selectedTemplate}
              onComplete={handleFormComplete}
              initialData={formData}
            />
          )}
          {step === 'preview' && <ResumePreview latexCode={latexCode} formData={formData} />}
        </div>
      </div>
    </div>
  );
}

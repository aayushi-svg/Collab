import { useState } from 'react';
import { Wand2, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { autoFillForm, generateResume } from '../lib/api';

interface ResumeFormProps {
  templateId: string;
  onComplete: (data: Record<string, any>, latex: string) => void;
  initialData?: Record<string, any>;
}

export default function ResumeForm({ templateId, onComplete, initialData = {} }: ResumeFormProps) {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    education: initialData.education || [''],
    experience: initialData.experience || [''],
    skills: initialData.skills || [''],
    projects: initialData.projects || [''],
  });

  const handleAIFill = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);

    try {
      const response = await autoFillForm(aiPrompt);
      const details = response.extracted_details;

      setFormData({
        name: details.name || '',
        email: details.email || '',
        phone: details.phone || '',
        education: details.education || [''],
        experience: details.experience || [''],
        skills: details.skills || [''],
        projects: details.projects || [''],
      });
      setMode('manual');
    } catch (error) {
      console.error('AI Fill Error:', error);
      alert('Failed to auto-fill form. Please try again or fill manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (field: keyof typeof formData) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] as string[]), ''],
    });
  };

  const handleRemoveField = (field: keyof typeof formData, index: number) => {
    const values = formData[field] as string[];
    if (values.length > 1) {
      setFormData({
        ...formData,
        [field]: values.filter((_, i) => i !== index),
      });
    }
  };

  const handleArrayChange = (field: keyof typeof formData, index: number, value: string) => {
    const values = [...(formData[field] as string[])];
    values[index] = value;
    setFormData({ ...formData, [field]: values });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await generateResume(templateId, formData);
      onComplete(formData, response.latex_code);
    } catch (error) {
      console.error('Generate Resume Error:', error);
      alert('Failed to generate resume. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
            mode === 'manual'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setMode('ai')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
            mode === 'ai'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          AI Auto-Fill
        </button>
      </div>

      {mode === 'ai' ? (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">AI-Powered Auto-Fill</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Describe yourself in natural language and let AI extract your details automatically.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Hi, my name is John Doe. I studied Computer Science at MIT from 2015-2019. I worked at Google as a Software Engineer for 3 years, where I built scalable systems. My skills include Python, React, AWS, and Docker. I've built several projects including..."
              className="w-full h-48 px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
            />
            <button
              onClick={handleAIFill}
              disabled={loading || !aiPrompt.trim()}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Auto-Fill with AI
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
            />
          </div>

          {(['education', 'experience', 'skills', 'projects'] as const).map((field) => (
            <div key={field} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 capitalize">
                  {field}
                </label>
                <button
                  type="button"
                  onClick={() => handleAddField(field)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {(formData[field] as string[]).map((value, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={value}
                    onChange={(e) => handleArrayChange(field, index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 resize-none"
                    rows={2}
                    placeholder={`Enter ${field.slice(0, -1)} details...`}
                  />
                  {(formData[field] as string[]).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field, index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Resume...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Generate Resume
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

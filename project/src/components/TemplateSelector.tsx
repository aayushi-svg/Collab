import { Briefcase, Award, Zap, Crown, Check } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and creative roles',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    features: ['ATS-Friendly', 'Two-Column Layout', 'Skills Highlight'],
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    description: 'Traditional format ideal for corporate and executive positions',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    features: ['Single Column', 'Professional', 'Detailed Experience'],
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Bold and artistic layout for designers and creative professionals',
    icon: Award,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    features: ['Unique Design', 'Portfolio Focus', 'Visual Appeal'],
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Comprehensive format for researchers and academics',
    icon: Crown,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    features: ['Publications', 'Research Focus', 'Detailed CV'],
  },
];

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template, index) => {
        const Icon = template.icon;
        return (
          <div
            key={template.id}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-[1.02] animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onSelect(template.id)}
          >
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${template.color}`}></div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${template.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-gray-700" />
                </div>
                <div className={`px-3 py-1 bg-gradient-to-r ${template.color} text-white text-xs font-semibold rounded-full`}>
                  Popular
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>

              <div className="space-y-2 mb-6">
                {template.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-semibold bg-gradient-to-r ${template.color} text-white hover:shadow-lg transform transition-all duration-300 group-hover:scale-[1.02]`}
              >
                Choose Template
              </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
          </div>
        );
      })}
    </div>
  );
}

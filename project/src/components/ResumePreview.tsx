import { Download, CreditCard as Edit } from 'lucide-react';

interface ResumePreviewProps {
  latexCode: string;
  formData: Record<string, any>;
}

export default function ResumePreview({ latexCode, formData }: ResumePreviewProps) {
  const renderLatexToHtml = (latex: string): string => {
    let html = latex;

    html = html.replace(/\\documentclass\[.*?\]\{.*?\}/g, '');
    html = html.replace(/\\usepackage(\[.*?\])?\{.*?\}/g, '');
    html = html.replace(/\\pagestyle\{.*?\}/g, '');
    html = html.replace(/\\begin\{document\}/g, '');
    html = html.replace(/\\end\{document\}/g, '');

    html = html.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, '<div class="text-center mb-6">$1</div>');

    html = html.replace(/\{\\LARGE\s+\\textbf\{(.*?)\}\}/g, '<h1 class="text-3xl font-bold">$1</h1>');
    html = html.replace(/\{\\large\s+(.*?)\}/g, '<h2 class="text-xl mt-2">$1</h2>');
    html = html.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');

    html = html.replace(/\\section\*\{(.*?)\}/g, '<h3 class="text-xl font-bold mt-6 mb-3 border-b-2 border-gray-300 pb-1">$1</h3>');

    html = html.replace(/\\begin\{itemize\}(\[.*?\])?([\s\S]*?)\\end\{itemize\}/g, (_, opts, content) => {
      const items = content
        .split('\\item')
        .slice(1)
        .map((item: string) => `<li class="ml-6 mb-1">${item.trim()}</li>`)
        .join('');
      return `<ul class="list-disc mb-3">${items}</ul>`;
    });

    html = html.replace(/\\hfill/g, '<span class="float-right"></span>');
    html = html.replace(/\\\\\[.*?\]/g, '<br>');
    html = html.replace(/\\\\/g, '<br>');
    html = html.replace(/\$\|/g, '|');
    html = html.replace(/\|\$/g, '|');

    html = html.replace(/\\%/g, '%');

    html = html.split('\n')
      .filter(line => line.trim())
      .map(line => {
        if (line.includes('<h') || line.includes('<div') || line.includes('<ul') || line.includes('</')) {
          return line;
        }
        return `<p class="mb-2">${line}</p>`;
      })
      .join('\n');

    return html;
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([latexCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `resume_${formData.name?.replace(/\s+/g, '_') || 'document'}.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          Download LaTeX
        </button>
        <button
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
        >
          <Edit className="w-5 h-5" />
          Edit Details
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            LaTeX Source Code
          </h3>
          <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-[600px]">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {latexCode}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Preview
          </h3>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 overflow-auto max-h-[600px] shadow-inner">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderLatexToHtml(latexCode) }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-gray-900 mb-2">Next Steps:</h4>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Download the LaTeX file and compile it using Overleaf or a local LaTeX compiler</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>Export to PDF for professional distribution</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Customize further by editing the LaTeX code directly</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

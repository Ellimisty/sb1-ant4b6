import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { Upload, Download, Eye, EyeOff, FileText, Code as CodeIcon } from "lucide-react";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";
// import { io } from "socket.io-client";

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [preview, setPreview] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);
  // const [socket, setSocket] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    const savedMarkdown = loadFromLocalStorage('markdownContent');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }

    // Commented out socket connection for now
    // const newSocket = io('http://localhost:3001');
    // setSocket(newSocket);

    // return () => {
    //   newSocket.disconnect();
    // };
  }, []);

  useEffect(() => {
    saveToLocalStorage('markdownContent', markdown);
    // if (socket) {
    //   socket.emit('markdownUpdate', markdown);
    // }
  }, [markdown]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('markdownUpdate', (updatedMarkdown: string) => {
  //       setMarkdown(updatedMarkdown);
  //     });

  //     socket.on('collaboratorsUpdate', (updatedCollaborators: string[]) => {
  //       setCollaborators(updatedCollaborators);
  //     });
  //   }
  // }, [socket]);

  const handleExport = async (format: 'pdf' | 'docx' | 'html' | 'markdown') => {
    if (!previewRef.current) return;

    switch (format) {
      case 'pdf':
        const canvas = await html2canvas(previewRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('markdown_export.pdf');
        break;
      case 'docx':
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(markdown)],
              }),
            ],
          }],
        });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, 'markdown_export.docx');
        break;
      case 'html':
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Export</title>
          </head>
          <body>
            ${previewRef.current.innerHTML}
          </body>
          </html>
        `;
        const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        saveAs(htmlBlob, 'markdown_export.html');
        break;
      case 'markdown':
        const markdownBlob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        saveAs(markdownBlob, 'markdown_export.md');
        break;
    }
  };

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fontFace = new FontFace('CustomFont', `url(${e.target?.result})`);
        fontFace.load().then((loadedFace) => {
          document.fonts.add(loadedFace);
          document.body.style.fontFamily = 'CustomFont, sans-serif';
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold">Markdown Editor</h1>
        <div className="flex space-x-2">
          <button onClick={() => handleExport('pdf')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Download className="inline-block mr-2" size={20} />
            Export PDF
          </button>
          <button onClick={() => handleExport('docx')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            <FileText className="inline-block mr-2" size={20} />
            Export DOCX
          </button>
          <button onClick={() => handleExport('html')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            <CodeIcon className="inline-block mr-2" size={20} />
            Export HTML
          </button>
          <button onClick={() => handleExport('markdown')} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            <FileText className="inline-block mr-2" size={20} />
            Export Markdown
          </button>
          <label className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer">
            <Upload className="inline-block mr-2" size={20} />
            Upload Font
            <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} className="hidden" />
          </label>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className={`w-1/2 p-4 ${preview ? 'hidden' : ''}`}>
          <textarea
            className="w-full h-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter your markdown here..."
          />
        </div>
        <div ref={previewRef} className={`w-1/2 p-4 overflow-auto markdown-preview ${preview ? 'w-full' : ''}`}>
          <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          />
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={() => setPreview(!preview)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          {preview ? <EyeOff className="inline-block mr-2" size={20} /> : <Eye className="inline-block mr-2" size={20} />}
          {preview ? 'Edit' : 'Preview'}
        </button>
        <div>
          <span className="mr-2">Collaborators:</span>
          {collaborators.map((collaborator, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1">{collaborator}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
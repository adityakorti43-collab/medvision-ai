import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadCardProps {
  onFileSelected: (file: File) => void;
}

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

function isAcceptedFile(file: File): boolean {
  const nameLower = file.name.toLowerCase();
  const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((ext) => nameLower.endsWith(ext));
  const hasAcceptedType = file.type === '' || ACCEPTED_MIME_TYPES.includes(file.type);
  return hasAcceptedExtension && hasAcceptedType;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    if (!isAcceptedFile(file)) {
      setLocalError('Please upload a JPG, JPEG or PNG chest X-ray.');
      return;
    }

    setLocalError(null);
    onFileSelected(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload a chest X-ray image"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 px-6 py-10 sm:py-12 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-400/[0.05] scale-[1.01]'
            : 'border-white/[0.12] hover:border-cyan-400/40 bg-white/[0.02] hover:bg-white/[0.035]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="p-3.5 rounded-full bg-cyan-400/10 text-cyan-300 transition-transform group-hover:scale-105">
            <UploadCloud className="w-6 h-6" strokeWidth={1.75} />
          </div>

          <div>
            <p className="text-white font-medium">Drop your chest X-ray here</p>
            <p className="text-slate-500 text-sm mt-1">or click to choose a file</p>
          </div>

          <p className="text-[11px] text-slate-600 tracking-wide mt-1">JPG, JPEG or PNG</p>
        </div>
      </div>

      {localError && <p className="mt-3 text-sm text-rose-400 text-center">{localError}</p>}
    </div>
  );
};

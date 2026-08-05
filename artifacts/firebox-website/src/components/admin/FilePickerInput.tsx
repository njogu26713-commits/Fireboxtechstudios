import React, { useRef } from 'react';
import { Upload, X, Film, Image as ImageIcon } from 'lucide-react';
import { useUpload } from '@workspace/object-storage-web';

interface FilePickerInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** file accept string, e.g. "image/*" or "video/*" or ".mp4,video/mp4" */
  accept?: string;
  /** show a small image thumbnail when a value is set */
  previewType?: 'image' | 'video' | 'none';
  optional?: boolean;
}

/**
 * Drop-in replacement for a URL text input.
 * Shows a "Choose File" button → uploads to object storage → writes the
 * resulting serving URL back to the form via `onChange`.
 */
export function FilePickerInput({
  label,
  value,
  onChange,
  accept = 'image/*',
  previewType = 'image',
  optional = true,
}: FilePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (response: { objectPath: string; metadata?: { name?: string } }) => {
      onChange(`/api/storage${response.objectPath}`);
    },
  });

  // Human-readable label for the current value
  const displayName = value
    ? value.startsWith('/api/storage')
      ? decodeURIComponent(value.split('/').pop() ?? value)
      : value.length > 42
      ? '…' + value.slice(-39)
      : value
    : '';

  const PreviewIcon = previewType === 'video' ? Film : ImageIcon;

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
        {label}
        {optional && (
          <span className="text-muted-foreground/50 ml-1 font-normal">(optional)</span>
        )}
      </label>

      <div className="flex items-center gap-2">
        {/* Hidden native file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            await uploadFile(file);
            e.target.value = '';
          }}
        />

        {/* Styled trigger button */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 hover:bg-muted/80 border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-60 shrink-0 whitespace-nowrap"
        >
          <Upload
            size={13}
            className={isUploading ? 'animate-pulse text-primary' : 'text-muted-foreground'}
          />
          {isUploading ? `Uploading ${progress}%` : 'Choose File'}
        </button>

        {/* Current value display */}
        {value ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Thumbnail preview */}
            {previewType === 'image' ? (
              <img
                src={value}
                alt=""
                className="w-7 h-7 rounded object-cover border border-border shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : previewType === 'video' ? (
              <div className="w-7 h-7 rounded bg-muted/60 border border-border flex items-center justify-center shrink-0">
                <PreviewIcon size={13} className="text-muted-foreground" />
              </div>
            ) : null}

            <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
              {displayName}
            </span>

            <button
              type="button"
              title="Remove"
              onClick={() => onChange('')}
              className="p-1 hover:bg-muted/70 rounded shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/50 italic">No file chosen</span>
        )}
      </div>
    </div>
  );
}

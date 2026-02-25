'use client';

import { useState } from 'react';
import { Pencil, Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditableFieldProps {
  label: string;
  value?: string | number;
  isMoney?: boolean;
  onSave: (value: string) => void;
  source?: 'ai' | 'user';
  updatedBy?: string;
}

function getInitials(email?: string): string {
  if (!email) return '?';
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(email?: string): string {
  if (!email) return 'bg-muted-foreground';
  const colors = [
    'bg-orange-500',
    'bg-teal-500',
    'bg-violet-500',
    'bg-rose-500',
    'bg-sky-500',
    'bg-emerald-500',
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function EditableField({ 
  label, 
  value, 
  isMoney = false, 
  onSave,
  source = 'ai',
  updatedBy
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '');

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || '');
    setIsEditing(false);
  };

  const formatValue = (val?: string | number) => {
    if (val == null || val === '') return '\u2014';
    if (isMoney) {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) return val;
      return `Rp ${num.toLocaleString('id-ID')}`;
    }
    return val;
  };

  const SourceIndicator = () => {
    if (source === 'user') {
      return (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex items-center justify-center h-3.5 w-3.5 rounded-full text-white text-[7px] font-bold leading-none cursor-default ${getAvatarColor(updatedBy)}`}
              >
                {getInitials(updatedBy)}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs px-2.5 py-1.5">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{updatedBy || 'Unknown'}</span>
                <span className="text-muted-foreground">Manually updated</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center cursor-default">
              <Sparkles className="h-3 w-3 text-amber-500" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs px-2.5 py-1.5">
            <span className="text-muted-foreground">AI parsed</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <SourceIndicator />
        <label className="text-xs text-muted-foreground">{label}</label>
      </div>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ) : (
        <div className="group flex items-center gap-2">
          <span className="text-sm font-medium">{formatValue(value)}</span>
          <button
            onClick={() => {
              setEditValue(value?.toString() || '');
              setIsEditing(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}

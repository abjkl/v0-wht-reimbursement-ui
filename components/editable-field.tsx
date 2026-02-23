'use client';

import { useState } from 'react';
import { Pencil, Check, X, Sparkles, User } from 'lucide-react';
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
  updatedBy?: string; // user email
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
    if (val == null || val === '') return '—';
    if (isMoney) {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) return val;
      return `Rp ${num.toLocaleString('id-ID')}`;
    }
    return val;
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                {source === 'ai' && (
                  <Sparkles className="h-3 w-3 text-blue-500" />
                )}
                {source === 'user' && (
                  <User className="h-3 w-3 text-purple-500" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {source === 'ai' && <p>AI 解析</p>}
              {source === 'user' && <p>用户更新: {updatedBy || 'Unknown'}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

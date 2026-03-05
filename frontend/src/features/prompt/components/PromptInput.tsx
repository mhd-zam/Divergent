import React, { useRef, useEffect } from 'react';
import { Button } from '../../../shared/ui';

interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isStreaming: boolean;
    disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
    value,
    onChange,
    onSubmit,
    isStreaming,
    disabled,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!isStreaming && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isStreaming]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!isStreaming && value.trim()) {
                onSubmit();
            }
        }
    };

    return (
        <div className="animate-fade-in-up animation-delay-2">
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    id="prompt-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe the app you want to build..."
                    disabled={isStreaming || disabled}
                    rows={5}
                    aria-label="Prompt input"
                    className={`
            w-full resize-none rounded-2xl border bg-bg-input p-5 pr-5
            text-text-primary text-base leading-relaxed
            placeholder:text-text-tertiary
            transition-all duration-200
            font-[inherit]
            ${isStreaming
                            ? 'opacity-60 cursor-not-allowed border-border-subtle'
                            : 'border-border-subtle focus:border-accent focus:shadow-glow-accent'
                        }
            focus:outline-none
          `}
                />

                <div className="flex items-center justify-between mt-3">
                    <span className="text-text-tertiary text-xs">
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary text-[10px] font-mono">
                            {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}
                        </kbd>
                        {' + '}
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary text-[10px] font-mono">
                            Enter
                        </kbd>
                        {' to submit'}
                    </span>

                    <Button
                        id="generate-button"
                        variant="primary"
                        size="lg"
                        onClick={onSubmit}
                        disabled={!value.trim() || isStreaming || disabled}
                        isLoading={isStreaming}
                    >
                        {isStreaming ? (
                            'Generating...'
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                                </svg>
                                Generate
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

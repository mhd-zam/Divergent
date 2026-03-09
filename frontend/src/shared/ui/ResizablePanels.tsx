import React, { useCallback, useRef, useState } from 'react';

interface ResizablePanelsProps {
    left: React.ReactNode;
    right: React.ReactNode;
    defaultLeftWidth?: number; // percentage 0-100
    minLeftWidth?: number;     // percentage
    maxLeftWidth?: number;     // percentage
}

export const ResizablePanels: React.FC<ResizablePanelsProps> = ({
    left,
    right,
    defaultLeftWidth = 45,
    minLeftWidth = 25,
    maxLeftWidth = 75,
}) => {
    const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            let pct = (x / rect.width) * 100;
            pct = Math.max(minLeftWidth, Math.min(maxLeftWidth, pct));
            setLeftWidth(pct);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [minLeftWidth, maxLeftWidth]);

    return (
        <div ref={containerRef} className="flex h-full w-full min-h-0 overflow-hidden">
            {/* Left Panel */}
            <div
                className="h-full overflow-hidden flex flex-col"
                style={{ width: `${leftWidth}%` }}
            >
                {left}
            </div>

            {/* Drag Handle */}
            <div
                className="shrink-0 w-[5px] cursor-col-resize relative group"
                onMouseDown={handleMouseDown}
            >
                <div className="absolute inset-0 bg-border-subtle group-hover:bg-accent/50 transition-colors duration-150" />
                {/* Grip dots */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    <span className="w-1 h-1 rounded-full bg-accent" />
                </div>
            </div>

            {/* Right Panel */}
            <div
                className="h-full overflow-hidden flex flex-col flex-1 min-w-0"
            >
                {right}
            </div>
        </div>
    );
};

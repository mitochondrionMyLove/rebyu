import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-10 p-4">
            <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1.5 h-10 items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primarylw animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primarylw animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primarylw animate-bounce"></div>
                </div>
                <span className="text-xs text-muted-foreground">Dots</span>
            </div>

        </div>
    );
}
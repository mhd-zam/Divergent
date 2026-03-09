import React from 'react';

export interface ShowcaseItem {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
}

interface ShowcaseCardProps {
    item: ShowcaseItem;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ item }) => {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer">
            <div className="rounded-2xl border border-border-subtle overflow-hidden bg-bg-elevated relative aspect-16/10 transition-transform duration-300 group-hover:scale-[1.02] group-hover:border-white/20">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
            </div>
            <div>
                <h3 className="text-text-primary font-medium text-base mb-1">{item.title}</h3>
                <p className="text-text-tertiary text-sm">{item.category}</p>
            </div>
        </div>
    );
};

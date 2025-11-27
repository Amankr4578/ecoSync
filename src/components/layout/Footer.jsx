import React from 'react';

export default function Footer() {
    return (
        <footer className="py-12 px-4 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-500" />
                    <span className="font-bold text-zinc-500">ECOSYNC INC.</span>
                </div>

                <div className="flex gap-8 text-sm text-zinc-600 font-medium">
                    <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
                    <a href="#" className="hover:text-white transition-colors">TERMS</a>
                    <a href="#" className="hover:text-white transition-colors">CONTACT</a>
                </div>

                <div className="text-zinc-800 text-sm">
                    © 2025
                </div>
            </div>
        </footer>
    );
}

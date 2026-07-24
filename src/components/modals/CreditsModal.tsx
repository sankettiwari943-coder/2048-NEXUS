import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Heart, Code2, Sparkles } from 'lucide-react';
import { ModalContainer } from '../ui/ModalContainer';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  const developers = [
    { name: 'Sanket Tiwari', role: 'Lead Architect & Core Systems' },
    { name: 'Vansh Bhardwaj', role: 'UI/UX & AI Solver Engineer' },
    { name: 'Kunal Sharma', role: 'Game Engine & Physics Developer' },
    { name: 'Tushar Singh', role: 'Audio & Cloud Infrastructure' },
  ];

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Game Credits"
      subtitle="The creators behind 2048 Nexus"
      icon={<Award className="w-6 h-6 text-purple-400" />}
      maxWidth="md"
    >
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        {/* Project Header */}
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">
            2048 NEXUS
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">Beyond the Classic Puzzle Experience</p>
        </div>

        {/* Developers List */}
        <div className="w-full space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center justify-center gap-1.5">
            <Code2 className="w-4 h-4" />
            Development Team
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {developers.map((dev) => (
              <div
                key={dev.name}
                className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-left shadow-glass"
              >
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {dev.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{dev.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Institution / College */}
        <div className="w-full p-4 bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center justify-center gap-1.5 mb-1">
            <GraduationCap className="w-4 h-4" />
            Institution
          </h4>
          <p className="text-sm font-extrabold text-white">Noida Institute of Engineering and Technology (NIET)</p>
          <p className="text-xs text-slate-400 mt-0.5">Greater Noida, Uttar Pradesh, India</p>
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for puzzle lovers worldwide.
        </div>
      </div>
    </ModalContainer>
  );
};

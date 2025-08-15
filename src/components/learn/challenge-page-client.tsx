'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChallengeEditor } from '@/components/learn/challenge-editor';
import { ChallengeHeader } from '@/components/learn/challenge-header';
import { ChallengeSidebar } from '@/components/learn/challenge-sidebar-fixed';
import { ComponentChallenge, ComponentSubmission } from '@/types/challenge.types';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

interface ChallengePageClientProps {
  pathId: string;
  challenge: ComponentChallenge;
  latestSubmission?: ComponentSubmission | null;
}

export const ChallengePageClient: React.FC<ChallengePageClientProps> = ({
  pathId,
  challenge,
  latestSubmission,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Fermé par défaut

  // Raccourci clavier pour ouvrir/fermer la sidebar (Ctrl/Cmd + \)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
        event.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <ChallengeHeader
            pathId={pathId}
            challenge={challenge}
            latestSubmission={latestSubmission}
          />

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <ChallengeEditor
              challenge={challenge}
              latestSubmission={latestSubmission}
            />
          </div>
        </div>

        {/* Sidebar Toggle Button - Desktop */}
        <div className="hidden lg:block">
          {!isSidebarOpen && (
            <div className="fixed top-1/2 right-4 z-40 -translate-y-1/2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-full w-10 h-10 p-0 shadow-lg bg-background border-2 hover:bg-muted"
                title="Open sidebar (Ctrl+\)"
              >
                <PanelRightOpen className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar - Hidden on mobile, collapsible on desktop */}
        <div className={`hidden lg:block border-l bg-muted/30 flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:w-96 xl:w-[400px]' : 'w-0 overflow-hidden'
        }`}>
          {isSidebarOpen && (
            <div className="w-96 xl:w-[400px]">
              <ChallengeSidebar
                pathId={pathId}
                challenge={challenge}
                latestSubmission={latestSubmission}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar - Bottom sheet or modal */}
      <div className="lg:hidden">
        <ChallengeSidebar
          pathId={pathId}
          challenge={challenge}
          latestSubmission={latestSubmission}
          isMobile={true}
        />
      </div>
    </div>
  );
};
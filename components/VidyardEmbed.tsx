"use client";

import Script from "next/script";
import { introVideo } from "@/content/intro-video";

declare global {
  interface Window {
    VidyardV4?: {
      api: {
        renderDOMPlayers: () => void;
      };
    };
  }
}

// The Vidyard inline player. Script-based rather than an iframe on purpose:
// only the script embed reports view counts and drop-off back to the Vidyard
// dashboard, which is the reason for hosting there in the first place.
export default function VidyardEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      {/* This <img> is an embed handle, not a picture: v4.js finds every
          img.vidyard-player-embed and swaps it for a player. next/image would
          rewrite src and drop the data-* attributes, so it can't be used —
          which is also why next.config.ts needs no remotePatterns entry.
          width/height reserve the thumbnail's real 16:9 box, so the swap
          doesn't shift the content below it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="vidyard-player-embed block h-auto w-full"
        src={`https://play.vidyard.com/${introVideo.uuid}.jpg`}
        alt={introVideo.title}
        width={1280}
        height={720}
        data-uuid={introVideo.uuid}
        data-v="4"
        data-type="inline"
      />

      <noscript>
        <p className="type-small p-4">
          <a href={introVideo.shareUrl} target="_blank" rel="noopener noreferrer">
            Watch the video on Vidyard →
          </a>
        </p>
      </noscript>

      <Script
        src="https://play.vidyard.com/embed/v4.js"
        // afterInteractive guarantees the <img> is in the DOM before the script
        // scans for it; beforeInteractive would race it.
        strategy="afterInteractive"
        // onReady rather than onLoad: it also fires on a client-side remount,
        // where next/script reuses the cached file and Vidyard's own startup
        // scan doesn't run again. Rescanning is free — the scan marks each
        // image data-rendered="true" and skips it thereafter.
        onReady={() => window.VidyardV4?.api.renderDOMPlayers()}
      />
    </div>
  );
}

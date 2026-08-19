import { shortIntro } from "@/content/short-intro";

// The /intro player. A plain <video> served from public/, so unlike
// components/VidyardEmbed.tsx there is no third-party script to wait on and
// nothing forces this to the client.
export default function SelfHostedVideo() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      {/* aspect-video holds the 16:9 box open before the metadata lands, so the
          link and CTA below it don't shift once the video sizes itself. */}
      <video
        className="aspect-video block h-auto w-full"
        controls
        // metadata, not auto: enough for the first frame and the duration
        // without pulling all 20MB for someone who never presses play. "none"
        // would leave a blank box, since there is no poster image.
        preload="metadata"
        // iOS Safari otherwise hijacks playback into its fullscreen player.
        playsInline
        width={shortIntro.width}
        height={shortIntro.height}
        aria-label={shortIntro.title}
      >
        <source src={shortIntro.src} type="video/mp4" />
        <p className="type-small p-4">
          Your browser can&rsquo;t play this video.{" "}
          <a href={shortIntro.src} download>
            Download it instead →
          </a>
        </p>
      </video>
    </div>
  );
}

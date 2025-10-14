interface FadeSettings {
  /** Fade in range as percentage of depth range (0-1) */
  fadeIn: {
    start: number;
    end: number;
  };
  /** Fade out range as percentage of depth range (0-1) */
  fadeOut: {
    start: number;
    end: number;
  };
}

interface BlurSettings {
  /** Blur in range as percentage of depth range (0-1) */
  blurIn: {
    start: number;
    end: number;
  };
  /** Blur out range as percentage of depth range (0-1) */
  blurOut: {
    start: number;
    end: number;
  };
  /** Maximum blur amount (0-10, higher values = more blur) */
  maxBlur: number;
}
interface ImageItem {
  src: string;
  alt: string;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  /** Speed multiplier applied to scroll delta (default: 1) */
  speed?: number;
  /** Spacing between images along Z in world units (default: 2.5) */
  zSpacing?: number;
  /** Number of visible planes (default: clamp to images.length, min 8) */
  visibleCount?: number;
  /** Near/far distances for opacity/blur easing (default: { near: 0.5, far: 12 }) */
  falloff?: { near: number; far: number };
  /** Fade in/out settings with ranges based on depth range percentage (default: { fadeIn: { start: 0.05, end: 0.15 }, fadeOut: { start: 0.85, end: 0.95 } }) */
  fadeSettings?: FadeSettings;
  /** Blur in/out settings with ranges based on depth range percentage (default: { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.9, end: 1.0 }, maxBlur: 3.0 }) */
  blurSettings?: BlurSettings;
  /** Optional className for outer container */
  className?: string;
  /** Optional style for outer container */
  style?: React.CSSProperties;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number; // Added y property for vertical positioning
}

export type { ImageItem, InfiniteGalleryProps, PlaneData };

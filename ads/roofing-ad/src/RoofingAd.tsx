import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./fonts";

export type RoofingAdProps = {
  readonly hook: string;
  readonly hookSub: string;
  readonly offer: string;
  readonly offerSub: string;
  readonly services: string[];
  readonly ctaLines: string[];
  readonly ctaButton: string;
  readonly businessName: string;
  readonly phone: string;
  readonly accentColor: string;
  readonly darkColor: string;
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Meta covers the top and the bottom third of a 9:16 Reel/Story with its own UI,
// so tall formats keep the content in the middle band.
const SafeArea: React.FC<{ children: React.ReactNode; gap: number }> = ({
  children,
  gap,
}) => {
  const { height } = useVideoConfig();
  const tall = height / 1080 > 1.5;

  return (
    <AbsoluteFill
      style={{
        paddingTop: tall ? 260 : 100,
        paddingBottom: tall ? 620 : 100,
        paddingLeft: 80,
        paddingRight: 80,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap,
        textAlign: "center",
        fontFamily,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const House: React.FC<{
  progress: number;
  accentColor: string;
  size: number;
}> = ({ progress, accentColor, size }) => {
  const dash = { pathLength: 1, strokeDasharray: 1 };

  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 400 300"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M90 150 L90 280 L310 280 L310 150"
        stroke="white"
        strokeWidth={18}
        {...dash}
        strokeDashoffset={1 - progress}
      />
      <path
        d="M260 72 L260 30 L295 30 L295 102"
        stroke="white"
        strokeWidth={18}
        {...dash}
        strokeDashoffset={1 - progress}
      />
      <path
        d="M30 170 L200 30 L370 170"
        stroke={accentColor}
        strokeWidth={30}
        {...dash}
        strokeDashoffset={1 - progress}
      />
      <path
        d="M175 280 L175 210 L225 210 L225 280"
        stroke="white"
        strokeWidth={14}
        {...dash}
        strokeDashoffset={1 - progress}
      />
    </svg>
  );
};

const Check: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4.5 12.5l5 5L19.5 7"
      stroke={color}
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Rain: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ rotate: "14deg", scale: 1.3 }}>
      {new Array(44).fill(true).map((_, i) => {
        const speed = 55 + random(`speed-${i}`) * 35;
        const y =
          ((random(`y-${i}`) * (height + 300) + frame * speed) %
            (height + 300)) -
          300;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`x-${i}`) * width,
              top: y,
              width: 4,
              height: 110,
              borderRadius: 2,
              background: "rgba(255,255,255,0.28)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const HookScene: React.FC<RoofingAdProps> = ({
  hook,
  hookSub,
  accentColor,
  darkColor,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, #24364f 0%, ${darkColor} 70%)`,
      }}
    >
      <Rain />
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: interpolate(frame, [3, 5, 8, 12], [0, 0.75, 0.15, 0], clamp),
        }}
      />
      <SafeArea gap={36}>
        <House
          size={420}
          accentColor={accentColor}
          progress={interpolate(frame, [0, 20], [0, 1], {
            ...clamp,
            easing: easeOut,
          })}
        />
        <div
          style={{
            color: "white",
            fontSize: 150,
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: -2,
            textTransform: "uppercase",
            scale: interpolate(frame, [6, 18], [0.6, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 12 }),
            }),
            opacity: interpolate(frame, [6, 10], [0, 1], clamp),
          }}
        >
          {hook}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: 50,
            fontWeight: 600,
            opacity: interpolate(frame, [16, 26], [0, 1], clamp),
            translate: interpolate(frame, [16, 26], ["0px 30px", "0px 0px"], {
              ...clamp,
              easing: easeOut,
            }),
          }}
        >
          {hookSub}
        </div>
      </SafeArea>
    </AbsoluteFill>
  );
};

const OfferScene: React.FC<RoofingAdProps> = ({
  offer,
  offerSub,
  services,
  accentColor,
  darkColor,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: accentColor,
        translate: interpolate(frame, [0, 9], ["-100% 0%", "0% 0%"], {
          ...clamp,
          easing: easeOut,
        }),
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: `repeating-linear-gradient(135deg, ${darkColor} 0 6px, transparent 6px 60px)`,
        }}
      />
      <SafeArea gap={10}>
        <div
          style={{
            color: darkColor,
            fontSize: 280,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: -6,
            textTransform: "uppercase",
            scale: interpolate(frame, [6, 16], [1.6, 1], {
              ...clamp,
              easing: easeOut,
            }),
            opacity: interpolate(frame, [6, 9], [0, 1], clamp),
          }}
        >
          {offer}
        </div>
        <div
          style={{
            color: darkColor,
            fontSize: 82,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: "uppercase",
            opacity: interpolate(frame, [12, 18], [0, 1], clamp),
          }}
        >
          {offerSub}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            marginTop: 50,
          }}
        >
          {services.map((service, i) => (
            <div
              key={service}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                backgroundColor: darkColor,
                color: "white",
                fontSize: 50,
                fontWeight: 800,
                padding: "18px 44px 18px 32px",
                borderRadius: 999,
                opacity: interpolate(frame, [18 + i * 5, 24 + i * 5], [0, 1], clamp),
                translate: interpolate(
                  frame,
                  [18 + i * 5, 24 + i * 5],
                  ["60px 0px", "0px 0px"],
                  { ...clamp, easing: easeOut },
                ),
              }}
            >
              <Check color={accentColor} size={50} />
              {service}
            </div>
          ))}
        </div>
      </SafeArea>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<RoofingAdProps> = ({
  ctaLines,
  ctaButton,
  businessName,
  phone,
  accentColor,
  darkColor,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, #24364f 0%, ${darkColor} 70%)`,
        translate: interpolate(frame, [0, 9], ["0% 100%", "0% 0%"], {
          ...clamp,
          easing: easeOut,
        }),
      }}
    >
      <SafeArea gap={30}>
        <House size={230} accentColor={accentColor} progress={1} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -2,
            textTransform: "uppercase",
          }}
        >
          {ctaLines.map((line, i) => (
            <div
              key={line}
              style={{
                color: i === 1 ? accentColor : "white",
                opacity: interpolate(frame, [6 + i * 4, 12 + i * 4], [0, 1], clamp),
                translate: interpolate(
                  frame,
                  [6 + i * 4, 12 + i * 4],
                  ["0px 40px", "0px 0px"],
                  { ...clamp, easing: easeOut },
                ),
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            backgroundColor: accentColor,
            color: darkColor,
            fontSize: 64,
            fontWeight: 900,
            textTransform: "uppercase",
            padding: "28px 80px",
            borderRadius: 999,
            boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
            opacity: interpolate(frame, [20, 26], [0, 1], clamp),
            scale:
              interpolate(frame, [20, 28], [0.7, 1], {
                ...clamp,
                easing: Easing.spring({ damping: 10 }),
              }) *
              (1 + 0.05 * Math.max(0, Math.sin((frame - 28) / 4))),
          }}
        >
          {ctaButton}
        </div>
        {businessName || phone ? (
          <div
            style={{
              color: "white",
              opacity: interpolate(frame, [26, 32], [0, 1], clamp),
            }}
          >
            {businessName ? (
              <div style={{ fontSize: 52, fontWeight: 800 }}>
                {businessName}
              </div>
            ) : null}
            {phone ? (
              <div style={{ fontSize: 46, fontWeight: 600, opacity: 0.85 }}>
                {phone}
              </div>
            ) : null}
          </div>
        ) : null}
      </SafeArea>
    </AbsoluteFill>
  );
};

export const RoofingAd: React.FC<RoofingAdProps> = (props) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: props.darkColor }}>
      <Sequence name="Hook" durationInFrames={1.7 * fps} premountFor={fps}>
        <HookScene {...props} />
      </Sequence>
      <Sequence
        name="Offer"
        from={1.5 * fps}
        durationInFrames={1.9 * fps}
        premountFor={fps}
      >
        <OfferScene {...props} />
      </Sequence>
      <Sequence name="Call to action" from={3.2 * fps} premountFor={fps}>
        <CtaScene {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};

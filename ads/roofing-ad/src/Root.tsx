import { Composition } from "remotion";
import { RoofingAd } from "./RoofingAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 for Reels and Stories */}
      <Composition
        id="RoofingAd-Reels"
        component={RoofingAd}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hook: "Roof damage?",
          hookSub: "Don't wait for the next storm.",
          offer: "Free",
          offerSub: "Roof inspection",
          services: ["Repairs", "Replacements", "Storm damage"],
          ctaLines: ["Get your", "free quote", "today"],
          ctaButton: "Call now",
          businessName: "",
          phone: "",
          accentColor: "#FF7A1A",
          darkColor: "#0E1A2B",
        }}
      />
      {/* 4:5 for Facebook and Instagram Feed */}
      <Composition
        id="RoofingAd-Feed"
        component={RoofingAd}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          hook: "Roof damage?",
          hookSub: "Don't wait for the next storm.",
          offer: "Free",
          offerSub: "Roof inspection",
          services: ["Repairs", "Replacements", "Storm damage"],
          ctaLines: ["Get your", "free quote", "today"],
          ctaButton: "Call now",
          businessName: "",
          phone: "",
          accentColor: "#FF7A1A",
          darkColor: "#0E1A2B",
        }}
      />
    </>
  );
};

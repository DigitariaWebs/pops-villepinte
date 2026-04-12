import { useCallback, useEffect, useRef } from "react";
import { Pressable, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoVideo = require("../../../assets/video/logo.mp4") as number;

const VIDEO_START_SECONDS = 1;
const AUTO_COMPLETE_MS = 5000;

export type AnimatedSplashProps = {
  onComplete: () => void;
};

export default function AnimatedSplash({
  onComplete,
}: AnimatedSplashProps): React.ReactElement {
  const completingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;
    onComplete();
  }, [onComplete]);

  const player = useVideoPlayer(logoVideo, (p) => {
    p.muted = true;
    p.loop = false;
    p.currentTime = VIDEO_START_SECONDS;
    p.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      finish();
    });

    timeoutRef.current = setTimeout(finish, AUTO_COMPLETE_MS);

    return () => {
      subscription.remove();
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = useCallback(() => {
    finish();
  }, [finish]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Passer l'introduction"
      onPress={handleSkip}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VideoView
          player={player}
          nativeControls={false}
          allowsPictureInPicture={false}
          contentFit="contain"
          style={{ width: 280, height: 280 }}
        />
      </View>
    </Pressable>
  );
}

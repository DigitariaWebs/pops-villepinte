import { ScrollView, View } from "react-native";
import {
  type Edge,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import GuestSignInBanner from "@/components/common/GuestSignInBanner";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth.store";

// Street food brand: warm off-white base
export type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: readonly Edge[];
  stickyHeaderIndices?: number[];
  /**
   * Optional element rendered as an absolute-positioned sibling above the
   * scroll region — useful for floating bars (e.g. cart summary) that should
   * stay pinned to the bottom of the screen regardless of scroll position.
   */
  floatingBottom?: React.ReactNode;
};

const DEFAULT_EDGES: readonly Edge[] = ["top"];

// SafeAreaView is from react-native-safe-area-context (third-party). NativeWind
// v5 only auto-wraps the core RN components — so the className prop is dropped
// here and the view collapses to 0 height. We pass an explicit inline style
// instead. First-party components below (View, ScrollView, Pressable) still
// use className normally.
const SAFE_AREA_STYLE = { flex: 1, backgroundColor: colors.white } as const;

export default function Screen({
  children,
  scroll = true,
  edges = DEFAULT_EDGES,
  stickyHeaderIndices,
  floatingBottom,
}: ScreenProps): React.ReactElement {
  const hasFloating = floatingBottom !== undefined && floatingBottom !== null;
  const insets = useSafeAreaInsets();
  // Guest browsing → true only for an unauthenticated customer who chose to
  // explore without an account. Authed users (incl. drivers) never see it.
  const showGuestBanner = useAuthStore((s) => !s.authed && s.guestMode);

  // When the guest strip is shown it owns the top safe area (its ink fills the
  // status bar / notch), so the content below must NOT re-apply the top inset —
  // otherwise screens that opt out of the top edge themselves (e.g. menu) would
  // render twice-padded. We strip "top" from the content edges in that case.
  const contentEdges = showGuestBanner
    ? edges.filter((e) => e !== "top")
    : edges;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {showGuestBanner ? (
        <View style={{ paddingTop: insets.top, backgroundColor: colors.ink }}>
          <GuestSignInBanner />
        </View>
      ) : null}
      <SafeAreaView edges={contentEdges} style={SAFE_AREA_STYLE}>
        <View style={{ flex: 1 }}>
          {scroll ? (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{ paddingBottom: 128 }}
              stickyHeaderIndices={stickyHeaderIndices}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>{children}</View>
          )}
          {hasFloating ? (
            <View
              pointerEvents="box-none"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {floatingBottom}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

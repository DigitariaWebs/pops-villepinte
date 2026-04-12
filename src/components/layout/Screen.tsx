import { ScrollView, View } from "react-native";
import { type Edge, SafeAreaView } from "react-native-safe-area-context";

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

export default function Screen({
  children,
  scroll = true,
  edges = DEFAULT_EDGES,
  stickyHeaderIndices,
  floatingBottom,
}: ScreenProps): React.ReactElement {
  const hasFloating = floatingBottom !== undefined && floatingBottom !== null;

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-surface">
      <View className="flex-1">
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 128 }}
            stickyHeaderIndices={stickyHeaderIndices}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1">{children}</View>
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
  );
}

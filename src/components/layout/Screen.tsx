import { ScrollView, View } from "react-native";
import { type Edge, SafeAreaView } from "react-native-safe-area-context";

export type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: readonly Edge[];
};

const DEFAULT_EDGES: readonly Edge[] = ["top"];

export default function Screen({
  children,
  scroll = true,
  edges = DEFAULT_EDGES,
}: ScreenProps): React.ReactElement {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-surface">
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 128 }}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </SafeAreaView>
  );
}

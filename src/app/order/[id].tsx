import { View, Text } from "react-native";

export default function Screen(): React.ReactNode {
  return (
    <View className="flex-1 bg-surface items-center justify-center">
      <Text className="font-display text-4xl text-on-surface">Pop's</Text>
    </View>
  );
}

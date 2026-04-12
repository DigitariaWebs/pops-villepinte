import { Text, View } from "react-native";

export type MenuSectionTitleProps = {
  name: string;
  count: number;
};

export default function MenuSectionTitle({
  name,
  count,
}: MenuSectionTitleProps): React.ReactElement {
  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 28 }}>
      <Text
        className="font-sans-extrabold-italic text-on-surface"
        style={{ fontSize: 42, lineHeight: 44, letterSpacing: -2 }}
      >
        {name}
      </Text>
      <View
        className="bg-primary"
        style={{ width: 32, height: 2, marginTop: 12, marginBottom: 12 }}
      />
      <Text
        className="font-sans-semibold text-on-surface-variant uppercase"
        style={{ fontSize: 11, letterSpacing: 2 }}
      >
        {count} créations
      </Text>
    </View>
  );
}

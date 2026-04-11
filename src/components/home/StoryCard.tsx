import { Text, View } from "react-native";

export default function StoryCard(): React.ReactElement {
  return (
    <View
      className="bg-surface-container rounded-xl"
      style={{ paddingHorizontal: 28, paddingVertical: 32 }}
    >
      <Text
        className="font-sans-bold text-on-surface-variant uppercase"
        style={{ fontSize: 10, letterSpacing: 3 }}
      >
        Notre maison
      </Text>

      <Text
        className="font-sans-extrabold-italic text-on-surface"
        style={{
          fontSize: 28,
          lineHeight: 32,
          letterSpacing: -1,
          marginTop: 12,
        }}
      >
        Villepinte, depuis 2024.
      </Text>

      <Text
        className="font-sans text-on-surface-variant"
        style={{ fontSize: 14, lineHeight: 22, marginTop: 12 }}
      >
        Abdoullah en cuisine, une cuisine de quartier faite main. Smash burgers,
        bowls, tacos — tout est pensé pour que vous repartiez le cœur content.
      </Text>
    </View>
  );
}

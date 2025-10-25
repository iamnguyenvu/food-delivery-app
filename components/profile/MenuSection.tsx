import Card from "@/components/common/Card";
import { View } from "react-native";
import MenuItem, { type MenuItemProps } from "./MenuItem";

export type MenuSectionProps = {
  items: MenuItemProps[];
  marginBottom?: number;
};

export default function MenuSection({
  items,
  marginBottom = 12,
}: MenuSectionProps) {
  return (
    <Card className="mx-2 overflow-hidden" style={{ marginBottom }}>
      {items.map((item, index) => (
        <View key={index}>
          <MenuItem {...item} />
          {index < items.length - 1 && (
            <View className="h-[1px] bg-gray-100 ml-14" />
          )}
        </View>
      ))}
    </Card>
  );
}

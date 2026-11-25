export default function FoodTypeBadge({ isVeg }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border ${
        isVeg ? "border-emerald-500" : "border-rose-500"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isVeg ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
    </span>
  );
}
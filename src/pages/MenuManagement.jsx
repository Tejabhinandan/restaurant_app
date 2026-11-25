import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useMenu } from "../hooks/useMenu";
import { menuCategories } from "../data/mockMenu";
import FoodTypeBadge from "@/components/ui/FoodTypeBadge.";
import MenuFormModal from "@/components/MenuFromModal";

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, toggleAvailability, deleteMenuItem } = useMenu();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dietFilter, setDietFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchesDiet =dietFilter === "ALL" || (dietFilter === "VEG" && item.isVeg) || (dietFilter === "NON_VEG" && !item.isVeg);
      return matchesCat && matchesDiet;
    });
  }, [menuItems, selectedCategory, dietFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (editingItem) {
      updateMenuItem(editingItem._id, formData);
    } else {
      addMenuItem(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Menu Management</h1>
          <p className="mt-1 text-sm text-stone-400">
            Manage dishes, pricing, GST slabs, and live POS stock availability
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-[#f0643b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d9532c] sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Category Pills & Veg/Non-Veg Filter */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#3a2218] text-white ring-1 ring-[#f0643b]/50"
                  : "border border-white/10 bg-[#161210] text-stone-400 hover:text-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-white/10 bg-[#161210] p-1">
          {[
            { id: "ALL", label: "All Items" },
            { id: "VEG", label: "Veg Only" },
            { id: "NON_VEG", label: "Non-Veg" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDietFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                dietFilter === tab.id
                  ? "bg-[#261f1b] text-stone-100"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className={`flex flex-col justify-between rounded-2xl border p-5 transition ${
              item.isAvailable
                ? "border-white/10 bg-[#161210]"
                : "border-white/5 bg-[#13100e] opacity-65"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FoodTypeBadge isVeg={item.isVeg} />
                  <span className="rounded-md bg-[#261f1b] px-2 py-0.5 text-[11px] font-medium text-stone-300">
                    {item.category}
                  </span>
                </div>

                <span className="text-xs text-stone-500">
                  GST {item.taxRate}%
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold text-stone-100">
                {item.name}
              </h3>

              <div className="mt-2">
                <span className="text-lg font-bold tabular-nums text-[#f0643b]">
                  ₹{item.price}
                </span>
              </div>
            </div>

            {/* Footer Controls: Availability Switch + Edit/Delete */}
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3.5">
              <button
                type="button"
                onClick={() => toggleAvailability(item._id)}
                className="flex items-center gap-2 text-xs font-medium"
              >
                <span
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                    item.isAvailable ? "bg-emerald-500" : "bg-stone-700"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                      item.isAvailable ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </span>
                <span
                  className={
                    item.isAvailable ? "text-emerald-400" : "text-stone-400"
                  }
                >
                  {item.isAvailable ? "In Stock" : "Sold Out"}
                </span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-white/5 hover:text-stone-100"
                  title="Edit item"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMenuItem(item._id)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-500/10 hover:text-rose-400"
                  title="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <MenuFormModal
        key={editingItem ? editingItem._id : `new-${isModalOpen}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingItem={editingItem}
      />
    </div>
  );
}
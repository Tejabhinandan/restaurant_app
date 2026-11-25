import { useState } from "react";
import { X } from "lucide-react";
import { menuCategories } from "../data/mockMenu";

const editableCategories = menuCategories.filter((c) => c !== "All");

const defaultFormState = {
  name: "",
  category: "Starters",
  price: "",
  taxRate: 5,
  isVeg: true,
  isAvailable: true,
};

export default function MenuFormModal({ isOpen, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState(editingItem || defaultFormState);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161210] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold text-stone-100">
            {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-400">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Paneer Tikka Roll"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#1e1815] px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-[#f0643b] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-400">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#1e1815] px-3 py-2.5 text-sm text-stone-100 focus:border-[#f0643b] focus:outline-none"
              >
                {editableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="180"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#1e1815] px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-[#f0643b] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400">
              GST Slab (%)
            </label>
            <select
              value={formData.taxRate}
              onChange={(e) =>
                setFormData({ ...formData, taxRate: Number(e.target.value) })
              }
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#1e1815] px-3 py-2.5 text-sm text-stone-100 focus:border-[#f0643b] focus:outline-none"
            >
              <option value={0}>0% (Exempt)</option>
              <option value={5}>5% (Standard Restaurant)</option>
              <option value={12}>12%</option>
              <option value={18}>18% (Packaged / Aerated)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400">
              Dietary Type
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isVeg: true })}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                  formData.isVeg
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-[#1e1815] text-stone-400"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Veg
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isVeg: false })}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                  !formData.isVeg
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                    : "border-white/10 bg-[#1e1815] text-stone-400"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Non-Veg
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-stone-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#f0643b] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d9532c]"
            >
              {editingItem ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
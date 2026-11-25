import { useState } from "react";
import { MenuContext } from "./MenuContext";
import { initialMenuItems } from "../data/mockMenu";

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const addMenuItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      _id: `menu_${Date.now()}`,
      price: Number(newItem.price),
      taxRate: Number(newItem.taxRate || 5),
    };
    setMenuItems((prev) => [itemWithId, ...prev]);
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              ...updatedFields,
              price: Number(updatedFields.price),
              taxRate: Number(updatedFields.taxRate || 5),
            }
          : item
      )
    );
  };

  const toggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleAvailability,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
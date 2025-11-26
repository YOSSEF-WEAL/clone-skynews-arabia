import { BASE_URL, API_HEADERS, handleApiResponse } from "./apisConfig";
const NEXT_MENU_ID = process.env.NEXT_PUBLIC_MENU_ID;
const apiMenu = async (menuId = NEXT_MENU_ID) => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/menu-items?menus=${menuId}&per_page=100`,
      {
        headers: API_HEADERS,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    const data = await handleApiResponse(res);

    if (!Array.isArray(data)) {
      return [];
    }

    // Build hierarchical menu structure
    const menuItems = data.map((item) => ({
      id: item.db_id || item.ID,
      title: item.title,
      url: item.url,
      parentId: parseInt(item.menu_item_parent) || 0,
      objectId: item.object_id,
      object: item.object, // 'category', 'page', etc.
      type: item.type, // 'taxonomy', 'post_type', etc.
      menuOrder: item.menu_order,
      description: item.description || "",
      megaMenu: item.mega_menu || "",
    }));

    // Sort by menu_order
    menuItems.sort((a, b) => a.menuOrder - b.menuOrder);

    // Organize into parent-child structure
    const topLevelItems = menuItems.filter((item) => item.parentId === 0);
    const childItems = menuItems.filter((item) => item.parentId !== 0);

    // Attach children to parents
    topLevelItems.forEach((parent) => {
      parent.children = childItems.filter(
        (child) => child.parentId === parent.id
      );
    });

    return topLevelItems;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

export default apiMenu;

export const createSlug = (name) => {
  // Convert the name to lowercase
  let slug = name.toLowerCase();

  // Remove special characters and replace spaces with hyphens
  slug = slug.replace(/[^\w\s-]/g, ""); // Removes any characters that are not word characters, spaces, or hyphens
  slug = slug.replace(/\s+/g, "-"); // Replaces spaces with hyphens

  // Trim leading and trailing hyphens, if any
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
};

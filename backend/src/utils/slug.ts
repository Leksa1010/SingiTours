import slugify from "slugify";

export const makeSlug = (title: string) => slugify(title, { lower: true, strict: true });

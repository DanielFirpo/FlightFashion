import qs from "qs";
import { Media } from "@strapiTypes/schemas-to-ts/Media";

export function getSmallestImageResponse(
  image: Media | undefined,
  noSmallerThan:
    | "thumbnail"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge" = "thumbnail",
): string | undefined {
  const formats = ["thumbnail", "xsmall", "small", "medium", "large", "xlarge"];
  for (const format of formats) {
    console.log("a", noSmallerThan, format);
    if ((image?.attributes?.formats as any)[format]) {
      return (
        process.env.NEXT_PUBLIC_API_URL +
        (image?.attributes.formats as any)[format].url
      );
    }
  }
}

/**
 * Get a specific image URL by size, will return the closest size if unavailable.
 * @param {Media} image - The image.
 * @param {"thumbnail" | "xsmall" | "small" | "medium" | "large" | "xlarge"} [size="medium"] - The size, default medium.
 * @returns {string} The URL of the selected image.
 */
export function getImageURLBySize(
  image: Media,
  size:
    | "thumbnail"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge" = "medium",
): string | undefined {
  const formats = ["thumbnail", "xsmall", "small", "medium", "large", "xlarge"];

  const requestedImage = (image.attributes.formats as any)[size]?.url;
  if (requestedImage) return process.env.NEXT_PUBLIC_API_URL + requestedImage;

  let smaller = formats.indexOf(size) - 1;
  let larger = formats.indexOf(size) + 1;

  for (; formats[smaller] || formats[larger]; smaller--, larger++) {
    const smallerFormat = formats[smaller];
    const largerFormat = formats[larger];

    if ((image.attributes.formats as any)[smallerFormat]) {
      return (
        process.env.NEXT_PUBLIC_API_URL +
        (image.attributes.formats as any)[smallerFormat].url
      );
    } else if ((image.attributes.formats as any)[largerFormat]) {
      return (
        process.env.NEXT_PUBLIC_API_URL +
        (image.attributes.formats as any)[largerFormat].url
      );
    }
  }
}

export function getLargestImageResponse(
  image: Media | undefined,
): string | undefined {
  const formats = ["thumbnail", "xsmall", "small", "medium", "large", "xlarge"];
  for (let i = formats.length - 1; i >= 0; i--) {
    if ((image?.attributes?.formats as any)[formats[i]]) {
      return (
        process.env.NEXT_PUBLIC_API_URL +
        (image?.attributes.formats as any)[formats[i]]?.url
      );
    }
  }
}

export function getStrapiURL(path = "") {
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"}${path}`;
}

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {},
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN ? process.env.API_TOKEN : process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`,
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens.`,
    );
  }
}

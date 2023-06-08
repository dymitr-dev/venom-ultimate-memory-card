const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

interface PixelCrop {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param imageSrc - Image file URL
 * @param pixelCrop - PixelCrop object provided by react-easy-crop
 * @param rotation - Optional rotation parameter
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // Set each dimension to double the largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Translate canvas context to a central location on image to allow rotating around the center.
  ctx?.translate(safeArea / 2, safeArea / 2);
  ctx?.rotate(getRadianAngle(rotation));
  ctx?.translate(-safeArea / 2, -safeArea / 2);

  // Draw rotated image and store data.
  ctx?.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data: any = ctx?.getImageData(0, 0, safeArea, safeArea);

  // Set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste generated rotate image with correct offsets for x,y crop values.
  ctx?.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // Return as a blob
  return new Promise((resolve) => {
    canvas.toBlob((file: any) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
}

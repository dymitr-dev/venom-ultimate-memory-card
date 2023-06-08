import React, { useCallback, useContext, useState } from "react";
import getCroppedImg from "./cropImage";

const AppContext = React.createContext<any>({});

const AppProvider = ({ children }: any) => {
  // Modal's state
  const [showModal, setShowModal] = useState(false);
  // Cropper's state
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [croppedImage, setCroppedImage] = useState<any>(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      console.log("cropped moved");
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage: any = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  // handling input
  const [imageSrc, setImageSrc] = useState<any>(null);
  const onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl: any = await readFile(file);
      setImageSrc(imageDataUrl);
      setShowModal(true);
    }
  };

  function readFile(file: any) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        resolve(reader.result as string | ArrayBuffer)
      );
      reader.readAsDataURL(file);
    });
  }
  // ending handling input

  return (
    <AppContext.Provider
      value={{
        zoom,
        setZoom,
        crop,
        setCrop,
        rotation,
        setRotation,
        croppedAreaPixels,
        setCroppedAreaPixels,
        croppedImage,
        setCroppedImage,
        onCropComplete,
        showCroppedImage,
        onFileChange,
        imageSrc,
        showModal,
        setShowModal,
        setImageSrc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext: any = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppContext, AppProvider };

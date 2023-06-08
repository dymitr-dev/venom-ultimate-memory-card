import { useState } from "react";
import ReactDOM from "react-dom";
import { useGlobalContext } from "./context";
import Crop from "./cropper";
import { Modal as AntModal, Button } from 'antd';

interface ModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
}

export const Modal: React.FC<ModalProps> = ({ setShowModal, showModal }) => {
  const { showCroppedImage } = useGlobalContext();

  const doneCropHandling = () => {
    setShowModal(false);
    showCroppedImage();
  };
  const cancelCropHandling = () => {
    setShowModal(false);
  };

  return (
    <AntModal
      visible={showModal}
      onCancel={cancelCropHandling}
      footer={[
        <Button key="cancel" onClick={cancelCropHandling}>
          Cancel
        </Button>,
        <Button key="done" type="primary" onClick={doneCropHandling}>
          Done Cropping
        </Button>
      ]}
    >
      <div className="w-9/12 flex-col justify-center items ">
        <header className="bg-pink-500  text-white text-xl text-center">
          Lets Crop Something
        </header>
        <div className="bg-white text-center w-full ">
          <div className="bg-red-600 h-48 w-full relative">
            <Crop />
          </div>
        </div>
      </div>
    </AntModal>
  );
};

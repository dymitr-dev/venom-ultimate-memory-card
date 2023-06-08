import { useEffect } from "react";
import { useGlobalContext } from "./context";
import { Modal } from "./Modal";
import { Button, Image, Input, Space } from "antd";

export default function App(): JSX.Element {
  const {
    croppedImage,
    onFileChange,
    showModal,
    setShowModal,
    setCroppedImage,
  } = useGlobalContext();

  useEffect(() => {
    console.log(showModal);
  }, [showModal]);

  return (
    <div style={{ textAlign: "center" }}>
      <Space direction="horizontal" align="center">
        <div>
          {croppedImage ? (
            <Image style={{ height: 192 }} src={croppedImage} alt="crop" />
          ) : (
            <label htmlFor="upload-image">
              <Image
                style={{ height: 192 }}
                alt="upload-placeholder"
                src="https://via.placeholder.com/150"
              />
            </label>
          )}
          <Input
            style={{ display: "none" }}
            type="file"
            onChange={onFileChange}
            accept="image/*"
            id="upload-image"
          />
        </div>
      </Space>
      <Space direction="horizontal">
        <Button
          style={{
            backgroundColor: "#1890ff",
            color: "white",
            borderRadius: "16px",
            padding: "12px 24px",
            marginTop: "20px",
          }}
          onClick={() => setShowModal(true)}
        >
          edit cropping
        </Button>
        <Button
          style={{
            backgroundColor: "#1890ff",
            color: "white",
            borderRadius: "16px",
            padding: "12px 24px",
            marginTop: "20px",
          }}
          onClick={() => setCroppedImage(null)}
        >
          Clear Image
        </Button>
      </Space>
      <Modal setShowModal={setShowModal} showModal={showModal} />
    </div>
  );
}

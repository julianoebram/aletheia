/* eslint-disable @next/next/no-img-element */
import { UploadOutlined } from "@ant-design/icons";
import { Col, message, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadProps } from "antd/lib/upload";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import AletheiaButton from "./Button";
import { AletheiaModal } from "./Modal/AletheiaModal.style";

import type { UploadFile } from "antd/lib/upload/interface";
const ImageUpload = ({ onChange }) => {
    const { t } = useTranslation();
    const UPLOAD_LIMIT = 1;
    const ONE_MB = 1048576;
    const ALLOWED_MB = 10;
    const MAX_SIZE = ALLOWED_MB * ONE_MB;
    const ALLOWED_FORMATS = ["png", "jpg", "webp"];

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const getBase64 = (file: RcFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name);
    };

    const validateBeforeUpload = (file: RcFile) => {
        const isAllowedFormat = ALLOWED_FORMATS.includes(
            file.type.split("/")[1]
        );

        if (!isAllowedFormat) {
            message.error(
                t("claimForm:fileTypeError", {
                    types: ALLOWED_FORMATS.join("/"),
                })
            );
        }
        const isAllowedSize = file.size < MAX_SIZE;
        if (!isAllowedSize) {
            message.error(
                t("claimForm:fileSizeError", { size: `${ALLOWED_MB}MB` })
            );
        }
        return isAllowedFormat && isAllowedSize;
    };

    const handleChange: UploadProps["onChange"] = async ({
        file,
        fileList,
    }: UploadChangeParam<UploadFile>) => {
        if (file.originFileObj && validateBeforeUpload(file.originFileObj)) {
            setFileList(fileList);
        }
    };

    useEffect(() => {
        onChange(fileList);
    }, [onChange, fileList]);

    const uploadButton = (
        <AletheiaButton icon={<UploadOutlined />}>
            {t("claimForm:fileInputButton")}
        </AletheiaButton>
    );

    return (
        <Col span={24}>
            <Upload
                listType="picture"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={validateBeforeUpload}
            >
                {fileList.length >= UPLOAD_LIMIT ? null : uploadButton}
            </Upload>
            <AletheiaModal
                visible={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                width={"fit-content"}
            >
                <img
                    alt={`preview uploaded file ${previewTitle}`}
                    width="auto"
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                    src={previewImage}
                />
            </AletheiaModal>
        </Col>
    );
};

export default ImageUpload;
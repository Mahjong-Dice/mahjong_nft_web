'use client'
import { Button, Form, Input, InputNumber, Upload, message, Space, Card, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, memo } from 'react';
import { uploadFile, uploadMetadata } from "@/utils/ipfs";
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';

interface CreateNFTFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (metadataUri: string) => void;
}

const CreateNFTForm = ({ open, onClose, onSuccess }: CreateNFTFormProps) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件！');
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('图片大小不能超过 10MB！');
            return false;
        }
        // 设置文件名（不包含扩展名）作为 NFT 名称
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        form.setFieldValue('name', fileName);
        return false;
    };

    const handleSubmit = async (values: any) => {
        if (fileList.length === 0) {
            message.error('请上传 NFT 图片！');
            return;
        }

        try {
            setUploading(true);
            const file = fileList[0].originFileObj as File;
            const { path: imagePath } = await uploadFile([file], file.name);
            const imageUrl = `${process.env.NEXT_PUBLIC_IPFS_Gateway}/${imagePath}`;
            console.log("imageUrl", imageUrl)
            const metadata = {
                name: values.name,
                description: values.description,
                image: imageUrl,
                attributes: [
                    {
                        trait_type: "Price",
                        value: values.price
                    }
                ]
            };

            const { path: metadataCid } = await uploadMetadata(metadata);

            message.success('NFT 元数据上传成功！');
            onSuccess(metadataCid);

            handleCancel()
        } catch (error) {
            console.error('上传失败:', error);
            message.error('上传失败，请重试！');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onClose();
    };


    return (
        <Modal
            title="创建 NFT"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="NFT 图片"
                    required
                    tooltip="支持 jpg、png、gif 格式，大小不超过 10MB"
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={({ fileList }) => setFileList(fileList)}
                        maxCount={1}
                    >
                        {fileList.length === 0 && (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>上传</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="NFT 名称"
                    name="name"
                    rules={[{ required: true, message: '请输入 NFT 名称' }]}
                >
                    <Input placeholder="给你的 NFT 起个名字" />
                </Form.Item>

                <Form.Item
                    label="NFT 描述"
                    name="description"
                    rules={[{ required: true, message: '请输入 NFT 描述' }]}
                >
                    <Input.TextArea
                        placeholder="描述一下你的 NFT"
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    label="价格 (ETH)"
                    name="price"
                    rules={[{ required: true, message: '请输入 NFT 价格' }]}
                >
                    <InputNumber
                        min={0}
                        step={0.01}
                        placeholder="设置 NFT 价格"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={uploading}
                        block
                    >
                        创建 NFT
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default memo(CreateNFTForm);
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    Table,
    Upload,
} from "antd";
import React, { useState } from "react";

const Index = () => {
    const { categories, errors } = usePage().props;
    const [editCategory, setEditCategory] = useState(null);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const closeModal = () => {
        setVisible(false);
        setEditCategory(null);
        form.resetFields();
    };

    const handleNewBtn = () => {
        setVisible(true);
        setEditCategory(null);
    };

    const onFinish = (values) => {
        const formdata = new FormData();
        formdata.append("name", values.name);
        if (values.image_path && values.image_path.length > 0) {
            formdata.append("image_path", values.image_path[0].originFileObj);
        }
        if (editCategory) {
            formdata.append("_method", "PATCH");
            router.post(route("category.update", editCategory.id), formdata, {
                onSuccess: () => {
                    message.success("Category updated successfully");
                    closeModal();
                },
                onError: () => {
                    message.error("Failed to update category");
                }
            });
        } else {

            router.post(route("category.store"), formdata, {
                onSuccess: () => {
                    message.success("Category created successfully");
                    closeModal();
                },
                onError: () => {
                    message.error("Failed to create category");
                }
            });
        }
    }
    const handleUpdateBtn = (category) => {
        setVisible(true);
        setEditCategory(category);
        form.setFieldsValue({
            name: category.name,
            image_path: [],
        });
    };

    const handleDeleteBtn = (category) => {
        router.delete(route("category.destroy", category.id), {
            onSuccess: () => {
                message.success("Category deleted successfully");
            },
            onError: () => {
                message.error("Failed to delete category");
            }
        });
    }
    const confirmDelete = (category) => {
        Modal.confirm({
            title: "Are you sure you want to delete this category?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => handleDeleteBtn(category),
        });
    }
    return (
        <AuthenticatedLayout header={<h1>Category</h1>}>
            <Head title="Category" />

            <Modal
                footer={null}
                title={editCategory ? "Edit Category" : "Create Category"}
                open={visible}
                onCancel={closeModal}
            >
                <Form onFinish={onFinish} form={form} layout="vertical">
                    <Form.Item
                        label="Category Name"
                        name="name"
                        validateStatus={errors.name ? "error" : ""}
                        help={errors.name}
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="Select Category">
                            <Select.Option value="men">Men</Select.Option>
                            <Select.Option value="women">Women</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Image"
                        name="image_path"
                        validateStatus={errors.image_path ? "error" : ""}
                        help={errors.image_path}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        rules={[
                            {
                                required: !editCategory,
                            },
                        ]}
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false} // prevent auto upload
                        >
                            <Button>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button danger onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button htmlType="submit" type="primary">
                                {editCategory ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Row justify="space-between" align="middle">
                <Col>
                    <Input.Search />
                </Col>
                <Col>
                    <Button type="primary" onClick={handleNewBtn}>
                        + Create
                    </Button>
                </Col>
            </Row>

            <Table
                className="mt-5"
                dataSource={categories}
                rowKey="id"
                columns={[
                    {
                        title: "#",
                        key: "number",
                        render: (_, __, index) => index + 1,
                    },
                    {
                        title: "Category Name",
                        key: "name",
                        dataIndex: "name",
                        render: (text) => (<p className="capitalize">{text}</p>)
                    },
                    {
                        title: "Category Image",
                        key: "image_path",
                        dataIndex: "image_path",
                         render: (text) => (
                            <img
                                src={`/storage/${text}`}
                                alt="Category Image"
                                style={{ width: "100px",objectFit: "cover", }}
                            />
                        ),
                    },
                    {
                        title: "Action",
                        key: "action",
                        render: (record) => (
                            <Space>
                                <Button type="primary" onClick={()=>handleUpdateBtn(record)}>Edit</Button>
                                <Button danger onClick={()=>confirmDelete(record)}>Delete</Button>
                            </Space>
                        ),
                    },
                ]}
            />
        </AuthenticatedLayout>
    );
};

export default Index;

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
    Space,
    Table,
    Upload,
} from "antd";
import React, { useState } from "react";

const Index = () => {
    const { products, errors, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");

    const [editProduct, setEditProduct] = useState(null);
    const [formRef] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("product.index"),
            { search },
            { preserveState: true, replace: true }
        );
    };

    const closeModal = () => {
        setVisible(false);
        setEditProduct(null);
        formRef.resetFields();
    };

    const handleNewBtn = () => {
        setVisible(true);
        setEditProduct(null);
    };
    const hangleEditBtn = (product) => {
        setVisible(true);
        setEditProduct(product);
        formRef.setFieldsValue({
            name: product.name,
            price: product.price,
            description: product.description,
            image_path: [],
        });
    };

    const handleDeleteBtn = (productId) => {
        router.delete(route("product.destroy", productId), {
            onSuccess: () => message.success("Product deleted successfully"),
            onError: () => message.error("Failed to delete product."),
        });
    };
    const confirmDelete = (productId) => {
        Modal.confirm({
            title: "Are you sure you want to delete this product?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => handleDeleteBtn(productId),
        });
    };
    const onFinish = (values) => {
        const fromdata = new FormData();
        fromdata.append("name", values.name);
        fromdata.append("price", values.price);
        fromdata.append("description", values.description);

        if (values.image_path && values.image_path.length > 0) {
            fromdata.append("image_path", values.image_path[0].originFileObj);
        }
        if (editProduct) {
            // Update product logic here
            fromdata.append("_method", "PATCH");

            router.post(route("product.update", editProduct.id), fromdata, {
                forceFormData: true,
                onSuccess: () => {
                    message.success("Product updated successfully");
                    closeModal();
                },
                onError: () => message.error("Failed to update product."),
            });
        } else {
            // Create product logic here
            router.post(route("product.store"), fromdata, {
                forceFormData: true,
                onSuccess: () => {
                    message.success("Product created successfully");
                    closeModal();
                },
                onError: () => message.error("Failed to create product."),
            });
        }
    };
    return (
        <AuthenticatedLayout header={<h1>Product</h1>}>
            <Head title="Product" />

            <Row align="middle" justify="space-between">
                <Col>
                    <form onSubmit={handleSearch}>
                        <Input
                            placeholder="Search Product Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleNewBtn}>
                        + Create
                    </Button>
                </Col>
            </Row>

            <Modal
                footer={null}
                title={editProduct ? "Edit Product" : "New Product"}
                open={visible}
                onCancel={closeModal}
            >
                <Form layout="vertical" form={formRef} onFinish={onFinish}>
                    <Form.Item
                        label="Name"
                        name="name"
                        validateStatus={errors.name ? "error" : ""}
                        help={errors.name}
                        rules={[
                            {
                                required: true,
                                message: "Please input the product name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        validateStatus={errors.price ? "error" : ""}
                        help={errors.price}
                        rules={[
                            {
                                required: true,
                                message: "Please input the product price!",
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        validateStatus={errors.description ? "error" : ""}
                        help={errors.description}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input the product description!",
                            },
                        ]}
                    >
                        <Input.TextArea rows={4} />
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
                                required: !editProduct,
                                message: "Image is required",
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editProduct ? "Update" : "Create"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                className="mt-5"
                dataSource={products.data}
                rowKey="id"
                pagination={{
                    total: products.total,
                    current: products.current_page,
                    pageSize: products.per_page,
                    showLessItems: true,
                    onChange: (page) => {
                        router.get(
                            route("product.index"),
                            { page, search },
                            { preserveState: true }
                        );
                    },
                }}
                columns={[
                    {
                        title: "#",
                        key: "index",
                        render: (_, __, index) => index + 1,
                    },
                    {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                        render: (text) => <p className="capitalize">{text}</p>,
                    },
                    {
                        title: "Price",
                        dataIndex: "price",
                        key: "price",
                    },
                    {
                        title: "Decription",
                        dataIndex: "description",
                        key: "description",
                    },
                    {
                        title: "Image",
                        dataIndex: "image_path",
                        key: "image_path",
                        render: (image) => (
                            <img
                                src={`/storage/${image}`}
                                alt="Product"
                                style={{
                                    width: 100,
                                    objectFit: "cover",
                                }}
                            />
                        ),
                    },
                    {
                        title: "Action",
                        key: "action",
                        render: (record) => (
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => hangleEditBtn(record)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    danger
                                    onClick={() => confirmDelete(record)}
                                >
                                    Delete
                                </Button>
                            </Space>
                        ),
                    },
                ]}
            />
        </AuthenticatedLayout>
    );
};

export default Index;

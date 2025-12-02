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
    const { carousels, errors, filters } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [visible, setVisible] = useState(false);
    const [formRef] = Form.useForm();
    const [editingCarousel, setEditingCarousel] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("carousels.index"),
            { search },
            { preserveState: true, replace: true }
        );
    };

    const hancleNewBtn = () => {
        setVisible(true);
        setEditingCarousel(null);
    };
    const closeModal = () => {
        setVisible(false);
        setEditingCarousel(null);
        formRef.resetFields();
    };

    const onFinish = (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("order", values.order);

        // Handle image upload
        if (values.image_path && values.image_path.length > 0) {
            formData.append("image_path", values.image_path[0].originFileObj);
        }

        if (editingCarousel) {
            // UPDATE
            formData.append("_method", "PATCH");

            router.post(
                route("carousels.update", editingCarousel.id),
                formData,
                {
                    forceFormData: true,
                    onSuccess: () => closeModal(),
                    onError: () => message.error("Failed to update carousel."),
                }
            );
        } else {
            // CREATE
            router.post(route("carousels.store"), formData, {
                forceFormData: true,
                onSuccess: () => closeModal(),
                onError: () => message.error("Failed to create carousel."),
            });
        }
    };

    const handleUpdateBtn = (carousel) => {
        setEditingCarousel(carousel);

        formRef.setFieldsValue({
            name: carousel.name,
            order: carousel.order,
            image_path: [], // must be empty
        });

        setVisible(true);
    };

    const handleDeleteBtn = (carousel) => {
        router.delete(route("carousels.destroy", carousel.id), {
            onSuccess: () =>
                message.success("Carousel item deleted successfully."),
            onError: () => message.error("Failed to delete carousel item."),
        });
    };

    const confirmDelete = (carousel) => {
        Modal.confirm({
            title: "Are you sure you want to delete this carousel item?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => handleDeleteBtn(carousel),
        });
    };

    return (
        <AuthenticatedLayout header={<h1>Carousel</h1>}>
            <Head title="Carousel" />

            <Row justify="space-between" align="middle">
                <Col>
                    <form onSubmit={handleSearch}>
                        <Input
                        placeholder="Search Carousel Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </Col>
                <Col>
                    <Button type="primary" onClick={hancleNewBtn}>
                        + Create
                    </Button>
                </Col>
            </Row>

            <Modal
                onCancel={closeModal}
                open={visible}
                title={editingCarousel ? "Edit Carousel" : "Create Carousel"}
                footer={null}
            >
                <Form layout="vertical" form={formRef} onFinish={onFinish}>
                    <Form.Item
                        label="Carousel Name"
                        name="name"
                        validateStatus={errors.name ? "error" : ""}
                        help={errors.name}
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Order"
                        name="order"
                        validateStatus={errors.order ? "error" : ""}
                        help={errors.order}
                        rules={[{ required: true }]}
                    >
                        <Input type="number" min={1} />
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
                                required: !editingCarousel,
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

                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={closeModal} danger>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingCarousel ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Table
            className="mt-5"
                dataSource={carousels.data}
                rowKey="id"
                pagination={{
                    total: carousels.total,
                    current: carousels.current_page,
                    pageSize: carousels.per_page,
                    showLessItems: true,
                    onChange: (page) => {
                        router.get(
                            route("carousels.index"),
                            { search, page },
                            { preserveState: true, replace: true }
                        );
                    },
                }}
                columns={[
                    {
                        title: "#",
                        key: "number",
                        render: (_, __, index) => index + 1,
                    },
                    {
                        title: "Carousel Name",
                        dataIndex: "name",
                        key: "name",
                    },
                    {
                        title: "Image",
                        dataIndex: "image_path",
                        key: "image_path",
                        render: (text) => (
                            <img
                                src={`/storage/${text}`}
                                alt="Carousel Image"
                                style={{ width: "100px", objectFit: "cover" }}
                            />
                        ),
                    },
                    {
                        title: "Order",
                        dataIndex: "order",
                        key: "order",
                    },
                    {
                        title: "Action",
                        key: "action",
                        render: (carousel) => (
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => handleUpdateBtn(carousel)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    danger
                                    onClick={() => confirmDelete(carousel)}
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

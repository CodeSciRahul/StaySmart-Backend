export const handleSuccessRes = (data, res, message, meta) => {
    const response = {
        message,
        data
    };

    // Add meta to response only if it's provided
    if (meta) {
        response.meta = meta;
    }

    return res.status(200).send(response);
}

export const handleSuccessRes = (data, res, message) => {
    return res.status(200).send({
        message,
        data,
    })

}
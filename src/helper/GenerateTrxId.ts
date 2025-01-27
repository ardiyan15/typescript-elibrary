import orderRepository from "@repositories/orderRepository"

export const GenerateTrxId = async () => {
    const { transactionId } = await orderRepository.findLasTrx()
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hour = String(now.getHours()).padStart(2, "0")
    const minute = String(now.getMinutes()).padStart(2, "0")
    const second = String(now.getSeconds()).padStart(2, "0")

    const lastSuffix = parseInt(transactionId.slice(-5), 10)
    const newSuffix = String(lastSuffix + 1).padStart(5, "0")
    const trxId = `B${year}${month}${day}${hour}${minute}${second}${newSuffix}`;

    return trxId
}
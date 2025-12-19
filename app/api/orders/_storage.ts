// Shared in-memory storage for orders during development
// This allows the track endpoint to find orders created by the POST endpoint

export const ordersStorage = new Map<string, any>()

export function addOrder(order: any) {
  ordersStorage.set(order.id, order)
}

export function getOrder(id: string) {
  return ordersStorage.get(id)
}

export function getOrderByEmail(email: string) {
  for (const order of ordersStorage.values()) {
    if (order.email === email) {
      return order
    }
  }
  return null
}

export function getAllOrders() {
  return Array.from(ordersStorage.values())
}

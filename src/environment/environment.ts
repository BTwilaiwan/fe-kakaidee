const localhost = "https://poc-api.ops-nexus.com/api"

// const localhost = "http://localhost:3000/api"
export const environment = {
    apis: {
      basic: `${localhost}`,
      v2: `${localhost}/v2`,
      product: `${localhost}/products`,
      prdStock: `${localhost}/product-stocks`,
    }
}

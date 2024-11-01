export const useMacsApi = (request, opts) => {
    const config = useRuntimeConfig()
    return useFetch(request, {
        baseURL: "http://127.0.0.1:8080", 
        ...opts})
}
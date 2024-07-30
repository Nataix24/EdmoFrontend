// Receive data from the server
export interface Value<T = any> {
    Value: T;
}

export async function fetchData<T = any>(endpoint: string, options?: RequestInit) {
    try {
        const response = await fetch(endpoint, options);

        if (!response.ok)
            return null;

        const data: T | null = await response.json();

        return data;
    }
    catch {
        return null;
    }
}

export async function fetchEDMOs() {
    const data = await fetchData<string[]>(relativeURLWithPort("edmos", "8080"));

    return data ?? [];
}

export function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

export function relativeURLWithPort(relativeURLFromRoot: string, port: string = window.location.port, protocol: string | null = window.location.protocol) {
    return `${protocol}//${window.location.hostname}:${port}/${relativeURLFromRoot}`;
}
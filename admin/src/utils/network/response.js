export const handleError = (error) => {
    console.error("API Error:", error);

    // Request cancelled
    if (error.code === "ERR_CANCELED") {
        return "Request was cancelled";
    }

    // Timeout
    if (error.code === "ECONNABORTED") {
        return "Request timeout. Please try again.";
    }

    // Server responded with error status
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return data?.message || "Bad Request";
            case 401:
                return data?.message || "Unauthorized";
            case 403:
                return data?.message || "Forbidden";
            case 404:
                return data?.message || "Resource not found";
            case 409:
                return data?.message || "Conflict occurred";
            case 422:
                return data?.message || "Validation failed";
            case 429:
                return data?.message || "Too many requests";
            case 500:
                return data?.message || "Internal server error";
            case 502:
                return data?.message || "Bad gateway";
            case 503:
                return data?.message || "Service unavailable";
            default:
                return data?.message || "Something went wrong";
        }
    }

    // No response from server
    if (error.request) {
        return "Network error. Unable to connect to server.";
    }

    return error?.message || "An unexpected error occurred";
};

/**
 * Normalise une réponse API Axios en un objet standardisé.
 *
 * La spec API Astroway attend :
 *   Success: { success: true, data: { items: [], total, page, limit } }
 *   Error:   { success: false, message: "..." }
 *
 * On gère également les retours non-paginés (tableau direct, objet unique)
 * et les cas où le helper HTTP a déjà rattrapé l'erreur.
 */
export const handleResponse = (response) => {
    // ── Cas où le helper HTTP a déjà catché une erreur ────────────────
    if (!response || (!response.status && response.json)) {
        return {
            success: false,
            data: [],
            item: null,
            pagination: null,
            message: response?.json?.message || "Request failed",
            status: response?.response?.status || 0,
        };
    }

    const { status, data } = response;

    // ── Erreur HTTP ───────────────────────────────────────────────────
    if (status < 200 || status >= 300) {
        return {
            success: false,
            data: [],
            item: null,
            pagination: null,
            message: data?.message || "Request failed",
            status,
        };
    }

    // ── Succès 2xx ────────────────────────────────────────────────────
    const body = data?.data;          // { items, total, page, limit } ou tableau ou objet

    // 1. Tableau direct (GET /items => [ ... ])
    if (Array.isArray(body)) {
        return {
            success: true,
            data: body,
            item: null,
            pagination: null,
            total: body.length,
            message: data?.message || "Success",
            status,
        };
    }

    // 2. Objet paginé (GET /items => { items: [...], total: N, page: P, limit: L })
    if (body && Array.isArray(body.items)) {
        return {
            success: true,
            data: body.items,
            item: null,
            pagination: {
                total: body.total ?? 0,
                page: body.page ?? 1,
                limit: body.limit ?? body.items.length,
            },
            total: body.total ?? 0,
            message: data?.message || "Success",
            status,
        };
    }

    // 3. Objet unique (POST/PUT → body = l'entité créée/mise à jour)
    if (body && typeof body === "object") {
        return {
            success: true,
            data: body,
            item: body,
            pagination: null,
            total: 1,
            message: data?.message || "Success",
            status,
        };
    }

    // 4. Fallback : on retourne data brut tel quel
    return {
        success: true,
        data: data ?? [],
        item: null,
        pagination: null,
        total: 0,
        message: data?.message || "Success",
        status,
    };
};

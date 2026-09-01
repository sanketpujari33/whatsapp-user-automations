import axiosInstance from './axiosInstance';
import { getSession } from 'utils/auth/jwt';

const getToken = (tokenArg) => tokenArg || getSession();

// POST Request
async function POST(url, info, token, type) {
    const actualToken = getToken(token);
    const headers = {
        Accept: "application/json",
    };
    if (actualToken) {
        headers.Authorization = `Bearer ${actualToken}`;
    }

    if (type !== "formData") {
        headers["Content-Type"] = "application/json";
    }

    const response = await axiosInstance.post(url, info, { headers });
    return response;
}

// PUT Request
async function PUT(url, info, token, type) {
    const actualToken = getToken(token);
    const headers = {
        Accept: "application/json",
    };
    if (actualToken) {
        headers.Authorization = `Bearer ${actualToken}`;
    }

    if (type !== "formData") {
        headers["Content-Type"] = "application/json";
    }

    const response = await axiosInstance.put(url, info, { headers });
    return response;
}

// DELETE Request
async function DELETE(url, token) {
    const actualToken = getToken(token);
    const headers = {
        Accept: "application/json",
    };
    if (actualToken) {
        headers.Authorization = `Bearer ${actualToken}`;
    }

    const response = await axiosInstance.delete(url, { headers });
    return response;
}

// GET Request
async function GET(url, token) {
    const actualToken = getToken(token);
    const headers = {
        Accept: "application/json",
    };
    if (actualToken) {
        headers.Authorization = `Bearer ${actualToken}`;
    }

    const response = await axiosInstance.get(url, { headers });
    return response;
}

// PATCH Request
async function PATCH(url, info, token, type) {
    const actualToken = getToken(token);
    const headers = {
        Accept: "application/json",
    };
    if (actualToken) {
        headers.Authorization = `Bearer ${actualToken}`;
    }

    if (type === "formData") {
        headers["Content-Type"] = "multipart/form-data";
    } else {
        headers["Content-Type"] = "application/json";
    }

    const response = await axiosInstance.patch(url, info, { headers });
    return response;
}

export { POST, PUT, DELETE, GET, PATCH };

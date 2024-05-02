import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";

interface Ipaginate {
    page_number: number,
    page_size: number
}

interface IRateCreateParams {
    unique_id: string;
    customer: string;
    partner_name: string;
    state_name: string;
    installer_name: string;
    sys_size: number;
    bl: string;
    epc: number;
    date: string;
    notes: string;
    amount: number;
}

export const getAdjustments = createAsyncThunk("fetch/rate-adjustments", async (params: Ipaginate, { rejectWithValue }) => {
    try {
        const data = await postCaller("get_adjustments", params)
        return data.data.adjustments_list
    } catch (error) {
        return rejectWithValue((error as Error).message)
    }

})

export const createAdjustments = createAsyncThunk("create/rate-adjustments", async (params: IRateCreateParams, { rejectWithValue, dispatch }) => {
    try {
        const data = await postCaller("create_adjustments", params)
        await dispatch(getAdjustments({ page_number: 1, page_size: 10 }))
        return data.data
    } catch (error) {
        return rejectWithValue((error as Error).message)
    }

})
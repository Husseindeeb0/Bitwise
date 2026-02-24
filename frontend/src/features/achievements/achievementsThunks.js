import { createAsyncThunk } from "@reduxjs/toolkit";
import {addAchievementsAPI, 
    deleteAchievementsAPI, 
    getAchievementByIdAPI, 
    getAchievementsAPI,
    editAchievementsAPI} from "./achievementsAPI"

export const addAchievements = createAsyncThunk(
    "/achievements/addAchievements",
    async (newAchievements, thunkAPI) =>{
        try {
            const res = await addAchievementsAPI(newAchievements);
            return res.data;
        }catch (error) {
            console.log(`Error in add achievements thunk: ${error} `);
           if (
            error.response &&
            error.response.data &&
            error.response.data.message
           ){
            return thunkAPI.rejectWithValue(error.response.data.message);
           }
           return thunkAPI.rejectWithValue(
            "Add Achievements thunk failed due to unknown error"
           );
        };
    }
);

export const editAchievements = createAsyncThunk(
    "/achievements/editAchievements",
    async (editAchievement, thunkAPI) => {
        try {
            const res = await editAchievementsAPI(editAchievement);
            return res.data;
        } catch (error) {
            console.log(`Error in edit achievements thunk: ${error}`);
            if (
                error.response &&
                error.response.data &&
                error.response.message
            ) {
                return thunkAPI.rejectWithValue(error.response.data.message);
            }
            return thunkAPI.rejectWithValue(
                "Edit Achievements thunk failed due to unknown error"
            );
        }
    }
);

export const getAchievementById = createAsyncThunk(
  "/achievements/getAchievementsById",
  async (id, thunkAPI) => {
    try {
      const res = await getAchievementByIdAPI(id);
      return res.data.achievementData;
    } catch (error) {
      console.log(`Error in get achievement by Id thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Get achievement by Id thunk failed due to unknown error"
      );
    }
  }
);

export const deleteAchievements = createAsyncThunk(
    "/achievements/deleteAchievements/",
    async(id, thunkAPI) => {
        try {
            const res = await deleteAchievementsAPI(id);
             return {
                id,
                data: res.data,
            };
        } catch(error) {
            console.log(`Error in delete achievements thunk: ${error}`);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                return thunkAPI.rejectWithValue(error.response.data.message);
            }
            return thunkAPI.rejectWithValue(
                "Delete achievements thunk failed due to uknown error"
            );
        }
    }
);

export const getAchievements = createAsyncThunk(
    "/achievements/getAchievements",
    async (_, thunkAPI) => {
        try{
            const res = await getAchievementsAPI();
            return res.data;
        } catch (error) {
            console.log(`Error in get achievements thunk: ${error}`);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                return thunkAPI.rejectWithValue(error.response.data.message);
            }
            return thunkAPI.rejectWithValue(
                "Get Achievements thunk failed due to unknown error"
            );
        }
    }
);


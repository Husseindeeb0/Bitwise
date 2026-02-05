import { createSlice } from "@reduxjs/toolkit";
import { addAchievements, deleteAchievements , getAchievements, editAchievements, getAchievementById } from "./achievementsThunks";
import { backOut } from "framer-motion";


const initialState = {
  achievementsData: [],  
    achievementById: null,
   lastestAchievement: null,
    isLoading: false,
    error: null,
};

const achievementSlice  = createSlice ({
    name: "achievements",
    initialState,
    reducers: {
        clearError: (state) =>{
            state.error = null;
        },
    },
     extraReducers: (builder) => {
        // addAchievements
        builder
          .addCase(addAchievements.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(addAchievements.fulfilled, (state, action) => {
            state.isLoading = false;
            state.achievementsData.unshift(action.payload);
          })
          .addCase(addAchievements.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          });

        //   get Achievements
          builder
            .addCase(getAchievements.pending, (state)=>{
                state.isLoading = true; 
                state.error = null;
            })
            .addCase(getAchievements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.achievementsData = action.payload.achievementsData || [];
            })
            .addCase(getAchievements.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
            
            // delete achievement
            builder
            .addCase(deleteAchievements.pending, (state)=>{
                state.isLoading = true;
                state.error = null;
            })
           .addCase(deleteAchievements.fulfilled, (state, action) => {
            state.isLoading = false;    
            state.achievementsData = state.achievementsData.filter(
                (a) => a._id !== action.payload.id
            );
            })
            .addCase(deleteAchievements.rejected, (state, action)=>{
                state.isLoading = false;
                state.error = action.payload;
            })
            // edit achievement
            builder
            .addCase(editAchievements.pending, (state)=>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editAchievements.fulfilled, (state, action)=>{
                state.isLoading = false;
                // const index = state.achievementsData.findIndex(
                //     (a) => a._id === action.payload._id
                // );
                // if(index !== -1){
                //     state.achievementsData[index] = action.payload;
                // }
            })
            .addCase(editAchievements.rejected, (state, action)=>{
                state.isLoading = false;
                state.error = action.payload;
            })

             builder
                  .addCase(getAchievementById.pending, (state) => {
                    state.isLoading = true;
                    state.error = null;
                  })
                  .addCase(getAchievementById.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.achievementById = action.payload;
                  })
                  .addCase(getAchievementById.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                  });
            


}})

export const achievementsActions = achievementSlice.actions;
export default achievementSlice.reducer;
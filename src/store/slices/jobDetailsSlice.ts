

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {
//   VIEW_ALL_DESIGNATION,
//   VIEW_ALL_SKILL,
//   VIEW_ROLE_AND_SKILL,
// } from "api/apiRoutes";
// import { authServices } from "api/apiServices";
// // import { toast } from "react-toastify";
// import { RootState } from "store/store";


// interface JobDetailsState {
//   jobData: Partial<{
//     currentPkg: string;
//     expectedPkg: string;
//     negotiation: string;
//     noticePeriod: string;
//     workPreference: string;
//     practicalUrl: string;
//     practicalFeedback: string;
//     comment: string;
//     communicationSkill: string;
//     currentCompanyName: string;
//     anyHandOnOffers: boolean;
//     lastFollowUpDate: string;
//     totalExperience: string;
//     relevantSkillExperience: string;
//     otherSkills: string[];
//     referral: string;
//     resumeUrl: string;
//     rating: string;
//     portfolioUrl: string;
//     currentCompanyDesignation: string;
//     preferredLocations: string;
//     linkedinUrl: string;
//     clientCvUrl: string;
//     clientFeedback: string;
//     meta: Record<string, any>;
//   }>;
//   appliedSkills: string[];
//   currentCompanyDesignation: string[];
//   appliedRole: string[];
//   roleSkillMap: Record<string, string[]>;
//   loading: boolean;
//   error: string | null;
// }


// const initialState: JobDetailsState = {
//   jobData: {
//     currentPkg: "",
//     expectedPkg: "",
//     negotiation: "",
//     noticePeriod: "",
//     workPreference: "",
//     practicalUrl: "",
//     practicalFeedback: "",
//     comment: "",
//     communicationSkill: "",
//     currentCompanyName: "",
//     anyHandOnOffers: false,
//     lastFollowUpDate: "",
//     totalExperience: "",
//     relevantSkillExperience: "",
//     otherSkills: [],
//     referral: "",
//     resumeUrl: "",
//     rating: "",
//     portfolioUrl: "",
//     // currentCompanyDesignation: "",
//     preferredLocations: "",
//     linkedinUrl: "",
//     clientCvUrl: "",
//     clientFeedback: "",
//     meta: {},
//   },
//   appliedSkills: [],
//   currentCompanyDesignation: [],
//   appliedRole: [],
//   roleSkillMap: {},
//   loading: false,
//   error: null,
// };

// // Async Thunks

// export const fetchAppliedSkills = createAsyncThunk(
//   "job/fetchAppliedSkills",
//   async (params: { page?: number; pageSize?: number; limit?: number } = {}) => {
//     const response = await authServices.get(VIEW_ALL_SKILL, { params });
//     return response?.data?.data?.data || [];
//   }
// );

// export const fetchCurrentDesignations = createAsyncThunk(
//   "job/fetchCurrentDesignations",
//   async (params: { page?: number; pageSize?: number; limit?: number }) => {
//     const response = await authServices.get(VIEW_ALL_DESIGNATION, { params });
//     return response?.data?.data?.data || [];
//   }
// );

// // export const fetchAppliedRoles = createAsyncThunk(
// //   "job/fetchAppliedRoles",
// //   async (params: { page?: number; pageSize?: number; limit?: number } = {}) => {
// //     const response = await authServices.get(VIEW_ALL_DESIGNATION, { params });
// //     return response?.data?.data;
// //   }
// // );

// const viewRoleSkill = async (
//   params: {
//     page?: number;
//     pageSize?: number;
//     limit?: number;
//     search?: string;
//   } = {}
// ) => {
//   if (params.search) {
//     const { limit, ...searchParams } = params;
//     params = { ...searchParams };
//   }
//   const response = await authServices.get(VIEW_ROLE_AND_SKILL, { params });
//   return response?.data;
// };


// export const fetchRoleSkills = createAsyncThunk(
//   "job/fetchRoleSkills",
//   async (_, thunkAPI) => {
//     try {
//       const response = await viewRoleSkill({ limit: 500 });
//       const allRoleSkills = response.data.data;
//       const state = thunkAPI.getState() as RootState;

//       const skillMap: Record<string, string[]> = {};

//       allRoleSkills.forEach((role: any) => {
//         const skillIds = role.skill || [];
//         const skillLabels = skillIds
//           .map((id: string) => {
//             const skill = state.job.appliedSkills.find(
//               (s: any) => s._id === id
//             );
//             return skill?.skills; // Get the skill label
//           })
//           .filter(Boolean); // Remove any undefined/null entries
//         skillMap[role._id] = skillLabels;
//       });

//       return skillMap;
//     } catch (err: any) {
//       console.log("err", err);
//       return thunkAPI.rejectWithValue("Failed to fetch role skills");
//     }
//   }
// );

// export const fetchAppliedRoles = createAsyncThunk(
//   "job/fetchAppliedRoles",
//   async (params: { page?: number; pageSize?: number; limit?: number } = {}) => {
//     const response = await authServices.get(VIEW_ROLE_AND_SKILL, {
//       params,
//     });
//     // Adjust based on actual API response structure:
//     return response.data.data.data || []; // Modified line
//   }
// );

// const jobSlice = createSlice({
//   name: "job",
//   initialState,
//   reducers: {
//     setJobData: (state, action: PayloadAction<JobDetailsState["jobData"]>) => {
//       state.jobData = { ...state.jobData, ...action.payload };
//     },
//     clearJobData: (state) => {
//       state.jobData = initialState.jobData;
//     },
//     setRoleSkills: (
//       state,
//       action: PayloadAction<{ roleId: string; skills: string[] }>
//     ) => {
//       const { roleId, skills } = action.payload;
//       state.roleSkillMap[roleId] = skills;
//     },
//     clearRoleSkills: (state, action: PayloadAction<string>) => {
//       delete state.roleSkillMap[action.payload];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAppliedSkills.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAppliedSkills.fulfilled, (state, action) => {
//         state.appliedSkills = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAppliedSkills.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Error fetching applied skills";
//       })
//       .addCase(fetchCurrentDesignations.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCurrentDesignations.fulfilled, (state, action) => {
//         state.currentCompanyDesignation = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchCurrentDesignations.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.error.message || "Error fetching current designations";
//       })
//       .addCase(fetchAppliedRoles.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAppliedRoles.fulfilled, (state, action) => {
//         state.appliedRole = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAppliedRoles.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Error fetching applied roles";
//       })
     
//       .addCase(fetchRoleSkills.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchRoleSkills.fulfilled, (state, action) => {
//         state.roleSkillMap = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchRoleSkills.rejected, (state, action) => {
//         state.loading = false;
//         state.error = String(action.payload) || "Failed to fetch role skills";
//       });
//   },
// });

// export const { setJobData, clearJobData, setRoleSkills, clearRoleSkills } =
//   jobSlice.actions;

// export default jobSlice.reducer;


// store/slices/jobDetailsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { viewAllDesignation } from "api/designation";
import { viewRoleSkill } from "api/roleApi";
import { ViewAppliedSkills } from "api/skillsApi";
import { RootState ,AppDispatch} from "store/store";
// import {
//   ViewAppliedSkills,
//   viewAllDesignation,
//   viewRoleSkill,
// } from "../../api/applicantApi";

interface JobDetailsState {
  jobData: any;
  appliedSkills: any[];
  currentDesignations: any[];
  appliedRoles: any[];
  roleSkills: Record<string, any[]>;
  loading: boolean;
  error: string | null;
}

const initialState: JobDetailsState = {
  jobData: {},
  appliedSkills: [],
  currentDesignations: [],
  appliedRoles: [],
  roleSkills: {},
  loading: false,
  error: null,
};

export const fetchAppliedSkills = createAsyncThunk(
  "jobDetails/fetchAppliedSkills",
  async () => {
    const response = await ViewAppliedSkills({ page: 1, pageSize: 50, limit: 1000 });
    return response.data.data;
  }
);

export const fetchCurrentDesignations = createAsyncThunk(
  "jobDetails/fetchCurrentDesignations",
  async () => {
    const response = await viewAllDesignation({ limit: 1000 });
    return response.data.data;
  }
);

export const fetchRoleSkills = createAsyncThunk(
  "jobDetails/fetchRoleSkills",
  async (roleId: string) => {
    const response = await viewRoleSkill({ page: 1, pageSize: 50, limit: 5000 });
    return { roleId, data: response.data.data };
  }
);

export const jobDetailsSlice = createSlice({
  name: "jobDetails",
  initialState,
  reducers: {
    setJobData: (state, action) => {
      state.jobData = { ...state.jobData, ...action.payload };
    },
    resetJobData: (state) => {
      state.jobData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppliedSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppliedSkills.fulfilled, (state, action) => {
        state.appliedSkills = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppliedSkills.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch skills";
        state.loading = false;
      })
      .addCase(fetchCurrentDesignations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentDesignations.fulfilled, (state, action) => {
        state.currentDesignations = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentDesignations.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch designations";
        state.loading = false;
      })
      .addCase(fetchRoleSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoleSkills.fulfilled, (state, action) => {
        state.roleSkills[action.payload.roleId] = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchRoleSkills.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch role skills";
        state.loading = false;
      });
  },
});

export const { setJobData, resetJobData } = jobDetailsSlice.actions;

export const selectJobDetails = (state: RootState) => state.jobDetails;

export default jobDetailsSlice.reducer;
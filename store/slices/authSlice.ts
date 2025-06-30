import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/lib/indexedDB';
import { loginUser as apiLoginUser, logoutUser as apiLogoutUser, getCurrentUser, createDemoUser } from '@/lib/auth';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await apiLoginUser(email, password);
    return user;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await apiLogoutUser();
    return createDemoUser();
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      return createDemoUser();
    }
  }
);

export const setDemoMode = createAsyncThunk(
  'auth/setDemoMode',
  async () => {
    return createDemoUser();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isLoading = false;
      })
      .addCase(setDemoMode.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
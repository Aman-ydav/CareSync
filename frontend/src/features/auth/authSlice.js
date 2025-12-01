import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInterceptor";
import { toast } from "sonner";

// Register User - SIMILAR TO ROOMEZY but supports email verification flow
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const form = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value);
        }
      });

      const response = await api.post("/users/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Assume backend returns { user, accessToken, refreshToken, requiresVerification? }
      const { user, accessToken, refreshToken, requiresVerification } =
        response.data.data || {};

      // Store in localStorage - LIKE ROOMEZY
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "caresync_tokens",
        JSON.stringify({ accessToken, refreshToken })
      );

      if (accessToken) {
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      }

      // If backend requires verification, prompt user to verify via modal
      if (requiresVerification) {
        toast.success(
          "Account created successfully! Please verify your email."
        );
        return { user, requiresVerification: true, email: user?.email };
      } else {
        toast.success("Account created successfully!");
        return user;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Verify Email (from first slice)
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/verify-email", verificationData, {
        withCredentials: true,
      });

      toast.success("Email verified successfully!");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Verification failed"
      );
    }
  }
);

// Resend Verification Code (from first slice)
export const resendVerificationCode = createAsyncThunk(
  "auth/resendVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/users/resend-verification",
        { email },
        {
          withCredentials: true,
        }
      );

      toast.success("Verification code resent to your email!");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend code"
      );
    }
  }
);

// Update loginUser thunk in authSlice.js
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/users/login", credentials, {
        withCredentials: true,
      });

      const payload = response.data?.data;
      const user = payload?.user;
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;
      const requiresVerification = payload?.requiresVerification || false;

      if (!user || !accessToken) {
        throw new Error("Login response missing user or tokens");
      }

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "caresync_tokens",
        JSON.stringify({ accessToken, refreshToken })
      );

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // If verification required, show modal
      if (requiresVerification) {
        toast.success("Please verify your email to continue");
        // Dispatch action to show verification modal
        return {
          user,
          requiresVerification: true,
          email: user?.email,
        };
      } else {
        toast.success("Welcome to CareSync!");
        return user;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Refresh Token - SIMILAR TO ROOMEZY
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      // Get refresh token from localStorage
      const tokens = JSON.parse(
        localStorage.getItem("caresync_tokens") || "{}"
      );
      const refreshToken = tokens.refreshToken;

      const response = await api.post(
        "/users/refresh-token",
        { refreshToken },
        { withCredentials: true }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data.data || {};

      // Update localStorage
      localStorage.setItem(
        "caresync_tokens",
        JSON.stringify({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("caresync_tokens");
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token"
      );
    }
  }
);

// Logout User - SIMILAR TO ROOMEZY
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true });

      // Clear localStorage - LIKE ROOMEZY
      localStorage.removeItem("user");
      localStorage.removeItem("caresync_tokens");
      delete api.defaults.headers.common.Authorization;

      toast.success("Logged out successfully!");
      return true;
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("caresync_tokens");
      delete api.defaults.headers.common.Authorization;
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

// Get Current User
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me", { withCredentials: true });
      const user = response.data.data?.user || response.data.data;

      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      toast.success("Password reset link sent to your email");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/reset-password/${token}`, {
        password,
      });
      toast.success("Password reset successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

// Update User Data (sync helper)
export const updateUserData = (userData) => (dispatch) => {
  dispatch(updateUser(userData));

  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  } else {
    localStorage.removeItem("user");
  }
};

const savedUser = localStorage.getItem("user");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
  isAuthenticated: !!savedUser,
  // New states for verification (merged from first slice)
  verification: {
    email: null,
    showModal: false,
    verifying: false,
    resending: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;

      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    forceLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // also clear verification modal/values
      state.verification.showModal = false;
      state.verification.email = null;
      state.verification.verifying = false;
      state.verification.resending = false;

      localStorage.removeItem("user");
      localStorage.removeItem("caresync_tokens");
      delete api.defaults.headers.common.Authorization;
    },
    clearError: (state) => {
      state.error = null;
    },
    // New reducers for verification UI
    showVerificationModal: (state, action) => {
      state.verification.showModal = true;
      state.verification.email = action.payload;
    },
    hideVerificationModal: (state) => {
      state.verification.showModal = false;
      state.verification.email = null;
      state.verification.verifying = false;
      state.verification.resending = false;
    },
    setVerificationEmail: (state, action) => {
      state.verification.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // registration may return either user object or { user, requiresVerification, email }
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          if (action.payload.requiresVerification) {
            state.verification.showModal = true;
            state.verification.email = action.payload.email;
          }
        } else {
          // payload is just user
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.verification.verifying = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verification.verifying = false;
        state.verification.showModal = false;
        state.verification.email = null;
        // Update user verification status
        if (state.user) {
          state.user.isVerified = true;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verification.verifying = false;
        state.error = action.payload;
      })

      // Resend Verification Code
      .addCase(resendVerificationCode.pending, (state) => {
        state.verification.resending = true;
        state.error = null;
      })
      .addCase(resendVerificationCode.fulfilled, (state) => {
        state.verification.resending = false;
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.verification.resending = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        // ensure verification cleared too
        state.verification.showModal = false;
        state.verification.email = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Refresh Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateUser,
  forceLogout,
  clearError,
  showVerificationModal,
  hideVerificationModal,
  setVerificationEmail,
} = authSlice.actions;
export default authSlice.reducer;

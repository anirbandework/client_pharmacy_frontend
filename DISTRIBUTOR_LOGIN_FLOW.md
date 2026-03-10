# Distributor First-Time Login Flow

## Summary
Distributors follow the exact same first-time login flow as Staff and Admin users.

## Flow Overview

### 1. Super Admin Creates Distributor
**Minimum Required Fields:**
- Company Name
- Distributor Code
- Contact Person
- Phone Number

**Backend:** Distributor is created with `is_password_set = False`

### 2. First-Time Login (New Distributor)

**Step 1: Access Login Page**
- Navigate to login page
- Select "Distributor" role

**Step 2: Create Account**
- Click "First time here? Create Account"
- Enter phone number (provided by Super Admin)
- Set password (minimum 6 characters)
- Confirm password
- Click "Set Password & Send OTP"

**Step 3: Verify OTP**
- Receive 6-digit OTP on phone
- Enter OTP
- Click "Verify & Sign In"

**Step 4: First Login**
- Automatically logged in
- Redirected to `/distributor` dashboard
- `is_password_set = True` in database

### 3. Subsequent Logins

**Option A: Phone + Password + OTP**
- Select "Distributor" role
- Enter phone number
- Enter password
- Click "Send OTP"
- Enter OTP
- Click "Verify & Sign In"

**Option B: Direct OTP (if password not required)**
- Select "Distributor" role
- Enter phone number
- Click "Send OTP"
- Enter OTP
- Click "Verify & Sign In"

## Technical Implementation

### Backend Endpoints

**Signup (First-Time):**
```
POST /api/auth/distributors/signup
Body: { phone, password }
Response: { message: "Password set successfully. OTP sent for verification." }
```

**Request OTP:**
```
POST /api/auth/distributors/request-otp
Body: { phone }
Response: { message: "OTP sent successfully" }
```

**Verify OTP:**
```
POST /api/auth/distributors/verify-otp
Body: { phone, otp }
Response: { access_token, user_type, distributor_id, company_name }
```

### Frontend Implementation

**AuthContext Functions:**
- `distributorSignup(phone, password)` - First-time password setup
- `distributorSendOTP(phone)` - Request OTP for login
- `distributorVerifyOTP(phone, otp)` - Verify OTP and login

**Welcome Page:**
- Role selector includes "Distributor" option
- "First time here? Create Account" toggle
- Password setup form (new users)
- OTP verification flow
- Automatic redirect to `/distributor` after login

## User Experience

### For New Distributors:
1. ✅ Receive phone number from Super Admin
2. ✅ Visit login page
3. ✅ Select "Distributor" role
4. ✅ Click "Create Account"
5. ✅ Set password with phone number
6. ✅ Verify OTP
7. ✅ Access distributor dashboard
8. ✅ Complete profile information

### For Existing Distributors:
1. ✅ Visit login page
2. ✅ Select "Distributor" role
3. ✅ Enter phone + password
4. ✅ Verify OTP
5. ✅ Access distributor dashboard

## Security Features

- ✅ Phone number validation (Indian format: +91XXXXXXXXXX)
- ✅ Password minimum 6 characters
- ✅ Password confirmation required
- ✅ OTP verification (6 digits)
- ✅ 30-second resend cooldown
- ✅ Rate limiting on OTP requests
- ✅ Secure password hashing (bcrypt)
- ✅ JWT token authentication

## Database Fields

**Distributor Model:**
- `phone` - Required, unique
- `password_hash` - Nullable (set during signup)
- `is_password_set` - Boolean (tracks if password is set)
- `is_active` - Boolean (can be deactivated by Super Admin)
- `last_login` - Timestamp (updated on each login)

## Comparison with Staff/Admin

| Feature | Staff | Admin | Distributor |
|---------|-------|-------|-------------|
| First-time signup | ✅ | ✅ | ✅ |
| Phone + Password | ✅ | ✅ | ✅ |
| OTP Verification | ✅ | ✅ | ✅ |
| Profile completion | ✅ | ✅ | ✅ |
| Password change | ✅ | ✅ | ✅ |

**All three user types follow the identical authentication flow!**

## Notes

- Distributors cannot register themselves (must be created by Super Admin)
- Phone number must match the one provided by Super Admin
- After first login, distributors can complete their profile with additional details
- Distributors can update their profile anytime from `/distributor/profile`
- Password can be changed from profile settings

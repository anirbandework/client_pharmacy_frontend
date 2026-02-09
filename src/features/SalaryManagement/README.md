# Salary Management System

Complete salary management system for admin and staff with payment tracking, QR code support, and automated alerts.

## Features

### Admin Features
- **Dashboard Overview**: Total staff, pending/overdue/upcoming payments
- **Salary Records Management**: View, filter, and pay salaries
- **Payment Tracking**: Mark salaries as paid with admin notes
- **QR Code Access**: View staff payment QR codes for easy payments
- **Automated Alerts**: 5-day advance alerts for upcoming payments
- **Monthly Summary**: View salary summary by month/year
- **Payment History**: Complete payment history for all staff

### Staff Features
- **Salary Profile**: View monthly salary and payment status
- **Payment Information**: Add/update UPI ID, bank account details
- **QR Code Upload**: Upload payment QR code for admin
- **Salary History**: View complete payment history
- **Status Tracking**: See paid, pending, and overdue months
- **Payment Stats**: Total paid, pending amounts

## API Endpoints (16 Total)

### Admin APIs (11)
1. `GET /api/salary/dashboard` - Dashboard stats
2. `POST /api/salary/records` - Create salary record
3. `GET /api/salary/records` - Get salary records with filters
4. `PUT /api/salary/records/{record_id}/pay` - Mark salary as paid
5. `GET /api/salary/staff/{staff_id}/profile` - Staff salary profile
6. `GET /api/salary/staff/{staff_id}/history` - Staff salary history
7. `GET /api/salary/staff/{staff_id}/payment-info` - Staff payment info
8. `GET /api/salary/staff/{staff_id}/qr-code` - Download staff QR code
9. `GET /api/salary/alerts` - Get active alerts
10. `PUT /api/salary/alerts/{alert_id}/dismiss` - Dismiss alert
11. `GET /api/salary/monthly-summary/{year}/{month}` - Monthly summary

### Staff APIs (5)
1. `GET /api/salary/my-profile` - My salary profile
2. `GET /api/salary/my-history` - My salary history
3. `GET /api/salary/my-payment-info` - My payment information
4. `PUT /api/salary/my-payment-info` - Update payment information
5. `POST /api/salary/my-qr-code` - Upload QR code

## File Structure

```
src/features/SalaryManagement/
├── AdminSalaryManagement.jsx    # Admin dashboard & management
├── StaffSalaryProfile.jsx       # Staff salary profile & history
├── services/
│   ├── axios.js                 # Axios instance with auth
│   └── salaryApi.js             # All 16 API endpoints
└── README.md                    # This file
```

## Components

### AdminSalaryManagement.jsx
**Purpose**: Complete admin interface for salary management

**Features**:
- Dashboard with 4 stat cards (Total Staff, Pending, Overdue, Upcoming)
- Active alerts section with dismiss functionality
- Month/Year filter for salary records
- Salary records table with pay and QR view actions
- Pay confirmation modal
- QR code display modal with UPI/Bank details

**State Management**:
- `dashboard` - Dashboard statistics
- `records` - Filtered salary records
- `alerts` - Active salary alerts
- `showPayModal` - Pay confirmation modal state
- `showQRModal` - QR code display modal state

### StaffSalaryProfile.jsx
**Purpose**: Staff interface for viewing and managing salary information

**Features**:
- Profile summary with 4 stat cards (Monthly Salary, Paid, Pending, Overdue)
- Payment information display and edit
- QR code upload functionality
- Complete salary history table
- Payment info update modal

**State Management**:
- `profile` - Staff salary profile
- `history` - Salary payment history
- `paymentInfo` - Payment information
- `showEditModal` - Edit payment info modal state

## Usage

### Admin Workflow

1. **View Dashboard**
   - See total staff count
   - Check pending/overdue payments
   - View upcoming payments (5 days)
   - Review active alerts

2. **Manage Salary Records**
   - Filter by month/year
   - View all salary records
   - Mark salaries as paid
   - View staff payment QR codes

3. **Process Payments**
   - Click "Pay" button on pending salary
   - Confirm payment
   - System marks as paid with timestamp
   - Admin name recorded

4. **View Payment Info**
   - Click "QR" button to view staff payment details
   - See UPI ID, QR code, or bank account
   - Make payment using displayed information

### Staff Workflow

1. **View Profile**
   - See monthly salary amount
   - Check paid/pending/overdue months
   - View last payment date
   - See next due date

2. **Update Payment Information**
   - Click "Edit Payment Info"
   - Add/update UPI ID
   - Add/update bank account details
   - Select preferred payment method
   - Save changes

3. **Upload QR Code**
   - Click "Upload QR Code" button
   - Select QR code image
   - System uploads and saves
   - Admin can now view QR for payments

4. **View History**
   - See complete payment history
   - Check payment dates
   - View due dates
   - Track payment status

## Payment Status Colors

- **Paid**: Green - Salary has been paid
- **Pending**: Yellow - Payment is pending but not overdue
- **Overdue**: Red - Payment is past due date

## Alert System

**5-Day Advance Alerts**:
- System generates alerts 5 days before due date
- Alerts appear on admin dashboard
- Admin can dismiss alerts after reviewing
- Alerts include staff name, month/year, and amount

## Payment Methods Supported

1. **UPI**: Staff provides UPI ID
2. **QR Code**: Staff uploads payment QR code
3. **Bank Transfer**: Staff provides account details
4. **Cash**: Manual cash payment tracking

## Security Features

- JWT authentication required for all endpoints
- Staff can only access their own salary information
- Admin has full access to all salary data
- Payment information encrypted in transit
- QR codes stored securely on server

## Integration Points

### With Staff Management
- Uses existing staff records
- Links to staff_id from staff table
- Displays staff names in records

### With Authentication
- Uses JWT tokens for API calls
- Role-based access (admin vs staff)
- User identification for payment tracking

## Future Enhancements

1. **Automated Salary Generation**: Auto-create monthly salary records
2. **Bulk Payment**: Pay multiple salaries at once
3. **Payment Gateway Integration**: Direct UPI/bank payments
4. **Salary Slip Generation**: PDF salary slips
5. **Tax Calculations**: TDS and other deductions
6. **Bonus/Incentive Tracking**: Additional payments
7. **Attendance Integration**: Salary based on attendance
8. **Email Notifications**: Payment confirmation emails
9. **SMS Alerts**: Payment reminders via SMS
10. **Analytics Dashboard**: Salary trends and insights

## Troubleshooting

### Common Issues

**1. "Not authenticated" error**
- Ensure user is logged in
- Check JWT token in localStorage
- Verify token is not expired

**2. QR code not displaying**
- Check file upload was successful
- Verify image path in database
- Ensure server has read permissions

**3. Payment info not updating**
- Check form validation
- Verify API endpoint is correct
- Check network console for errors

**4. Alerts not showing**
- Verify alerts are not dismissed
- Check date calculations
- Ensure salary records exist

## API Response Examples

### Dashboard Response
```json
{
  "total_staff": 10,
  "pending_payments": 5,
  "overdue_payments": 2,
  "upcoming_payments": 3,
  "total_pending_amount": 50000,
  "total_overdue_amount": 20000,
  "alerts": [...]
}
```

### Salary Record Response
```json
{
  "id": 1,
  "staff_id": 5,
  "month": 2,
  "year": 2026,
  "salary_amount": 10000,
  "payment_status": "pending",
  "due_date": "2026-02-05",
  "payment_date": null,
  "paid_by_admin": null
}
```

### Staff Profile Response
```json
{
  "id": 5,
  "name": "John Doe",
  "monthly_salary": 10000,
  "paid_months": 3,
  "pending_months": 1,
  "overdue_months": 0,
  "last_payment_date": "2026-01-05",
  "next_due_date": "2026-02-05",
  "payment_info": {...}
}
```

## Testing Checklist

### Admin Tests
- [ ] Dashboard loads with correct stats
- [ ] Alerts display and can be dismissed
- [ ] Salary records filter by month/year
- [ ] Pay salary marks record as paid
- [ ] QR code modal displays payment info
- [ ] Payment history shows all records

### Staff Tests
- [ ] Profile displays correct salary info
- [ ] Payment info can be updated
- [ ] QR code can be uploaded
- [ ] History shows all salary records
- [ ] Status colors display correctly
- [ ] Modal forms work properly

## Support

For issues or questions:
1. Check this README
2. Review API documentation at `/docs`
3. Check browser console for errors
4. Verify backend is running
5. Contact development team

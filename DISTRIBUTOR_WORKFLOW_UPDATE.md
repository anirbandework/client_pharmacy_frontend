# Distributor Workflow Update - Deployment Instructions

## Overview
Changed distributor workflow from shop assignment to search-based invoice creation.

## Database Migration Required

Run this migration before deploying:

```bash
python migrate_distributor_external_shops.py
```

This will:
- Make `shop_id` nullable in `distributor_invoices`
- Add external shop fields for non-registered shops

## Changes Summary

### Backend Changes:
1. **Removed endpoints:**
   - `GET /api/auth/distributors/shops/all`
   - `POST /api/auth/distributors/shops/assign`
   - `GET /api/auth/distributors/shops/my`

2. **Added endpoint:**
   - `GET /api/auth/distributors/shops/search?q={query}` - Search shops by name, phone, DL, GST

3. **Updated model:**
   - `DistributorInvoice` now supports external shops with fields:
     - `external_shop_name`
     - `external_shop_phone`
     - `external_shop_address`
     - `external_shop_license`
     - `external_shop_gst`

### Frontend Changes:
1. **Removed:**
   - Shop assignment UI
   - Location-based filtering
   - "Currently Serving" section
   - `ShopManagement.jsx` (old)

2. **Added:**
   - `ShopSearch.jsx` - New search-based interface
   - Search by: shop name, phone, DL number, GST number
   - Support for creating invoices for non-registered shops

### New Workflow:
1. Distributor opens dashboard
2. Searches for shop (name/phone/DL/GST)
3. If found → Create invoice for registered shop
4. If not found → Create invoice for new shop (saves details)
5. All invoices stored with shop information for history

## Testing Checklist

- [ ] Run database migration
- [ ] Search for registered shops works
- [ ] Create invoice for registered shop
- [ ] Create invoice for new shop
- [ ] Shop details saved in invoice
- [ ] Invoice history shows all invoices
- [ ] External shop details display correctly

## Rollback Plan

If needed, restore:
- `index_old.jsx` → `index.jsx`
- Restore old API endpoints in backend
- Revert database migration

# TODO - Address/Payment/Wishlist/Reviews/Notifications + Analytics (DB-backed)

## Phase 1 (Backend foundation)
- [x] Add `PUT /api/auth/me` for profile update.

- [ ] Extend `POST /api/orders` and `GET /api/orders/[id]` (and buyer orders listing) to persist:
  - addressId / paymentMethodId
  - shipping + payment status/type
  - courierId + trackingNumber (optional)
- [x] Create new DB-backed API routes:

  - [ ] `/api/addresses` (+ `/api/addresses/[id]`)
  - [ ] `/api/payment-methods` (+ `/api/payment-methods/[id]`)
  - [ ] `/api/couriers`
  - [ ] `/api/wishlist` (+ `/api/wishlist/[productId]`)
  - [ ] `/api/reviews` (GET by productId, POST)
  - [ ] `/api/notifications` (+ mark-as-read)

## Phase 2 (UI modules)
- [ ] Update `ecommerce/src/app/profile/page.jsx` with working edit form.
- [ ] Replace `ecommerce/src/app/checkout/page.jsx` with DB-backed address/payment/courier selection.
- [ ] Add buyer pages:
  - [ ] `/buyer/addresses`
  - [ ] `/buyer/payment-methods`
  - [ ] `/buyer/wishlist`
  - [ ] `/buyer/notifications`
- [ ] Update orders pages to show tracking + courier.
- [ ] Add product reviews UI + rating display in `ecommerce/src/app/products/[id]/page.jsx`.

## Phase 3 (Seller/Admin analytics + shipping UI)
- [ ] Create seller analytics API + update `ecommerce/src/app/seller/page.jsx`.
- [ ] Extend seller orders UI to input `courierId` and `trackingNumber`.
- [ ] Extend admin analytics API + update `ecommerce/src/app/admin/page.jsx`.

## Phase 4 (Invoice download)
- [ ] Add buyer order detail page with “Download invoice” (HTML/CSV download).


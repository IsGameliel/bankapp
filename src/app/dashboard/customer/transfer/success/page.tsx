// app/dashboard/customer/transfer/success/page.tsx
import { Suspense } from "react";
import TransferSuccessPage from "./TransferSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferSuccessPage />
    </Suspense>
  );
}

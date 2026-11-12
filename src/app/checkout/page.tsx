import CheckoutFlow from "./CheckoutFlow";

// /checkout defaults to Pro; plan-specific pages live at /checkout/[plan].
export default function CheckoutPage() {
  return <CheckoutFlow planId="pro" />;
}

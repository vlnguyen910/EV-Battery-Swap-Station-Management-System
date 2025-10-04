export interface VNPayConfig {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_Url: string;
  vnp_ReturnUrl: string;
}

export const vnpayConfig: VNPayConfig = {
  // VNPAY Sandbox credentials
  vnp_TmnCode: process.env.VNP_TMN_CODE || 'YOUR_TMN_CODE',
  vnp_HashSecret: process.env.VNP_HASH_SECRET || 'YOUR_HASH_SECRET',
  vnp_Url: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:3000/payments/vnpay-return',
};

// // Dummy payment processing
// export const processPayment = async (req, res) => {
//     try {
//       const { amount, currency, paymentMethodId } = req.body;
  
//       // Simulate validation of the payment method ID and amount
//       if (!amount || !currency || !paymentMethodId) {
//         return res.status(400).json({ message: "Missing required payment details" });
//       }
  
//       // Simulate a successful payment processing
//       const isPaymentSuccessful = Math.random() > 0.2; // 80% chance of success, 20% of failure
  
//       if (!isPaymentSuccessful) {
//         return res.status(500).json({ message: "Payment processing failed, try again" });
//       }
  
//       // Simulate a payment response
//       const paymentResponse = {
//         paymentIntent: {
//           id: "dummy-payment-id-123456", // Dummy payment ID
//           status: "succeeded",  // Payment succeeded
//           amount: amount * 100, // Amount in cents
//           currency: currency,
//         },
//       };
  
//       res.status(200).json({ message: "Payment successful", paymentIntent: paymentResponse.paymentIntent });
//     } catch (error) {
//       res.status(500).json({ message: "Payment processing failed", error: error.message });
//     }
//   };
  
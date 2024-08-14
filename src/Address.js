import React, { useEffect, useState } from 'react';

const Address = () => {
  const [isReadyToPay, setIsReadyToPay] = useState(false);

  useEffect(() => {
    const loadGooglePay = () => {
      if (window.google) {
        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: 'TEST' // Use 'PRODUCTION' for live environment
        });

        const paymentDataRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'UPI',
              parameters: {
                pa: 'BCR2DN4TSXULPFAQ', // Your VPA
                pn: 'Raunak', // Your merchant name
                tn: 'Order payment', // Transaction note
                am: '1', // Amount
                cu: 'INR', // Currency code
                url: `upi://pay?pa=merchant-vpa@bank&pn=Merchant Name&am=1&cu=INR&tid=12345` // UPI link
              }
            }
          ],
          merchantInfo: {
            merchantId: 'BCR2DN4TSXULPFAQ', // Replace with your merchant ID
            merchantName: 'Raunak'
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '500', // Amount
            currencyCode: 'INR',
            countryCode: 'IN'
          }
        };

        paymentsClient.isReadyToPay({
          allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods
        }).then(response => {
          setIsReadyToPay(response.result);
          if (response.result) {
            const googlePayButton = paymentsClient.createButton({
              onClick: () => onGooglePayClick(paymentsClient, paymentDataRequest)
            });
            document.getElementById('google-pay-button-container').appendChild(googlePayButton);
          }
        }).catch(error => {
          console.error('Error checking readiness to use Google Pay:', error);
        });
      }
    };

    loadGooglePay();
  }, []);

  const onGooglePayClick = (paymentsClient, paymentDataRequest) => {
    paymentsClient.loadPaymentData(paymentDataRequest)
      .then(paymentData => {
        // Process payment success
        console.log('Payment successful!', paymentData);
        alert('Payment successful!');
        // You can send paymentData to your server here for further processing
      })
      .catch(error => {
        // Process payment failure
        console.error('Payment failed', error);
        alert('Payment failed. Please try again.');
      });
  };

  return (
    <div>
      <h1>Google Pay UPI Payment</h1>
      {isReadyToPay ? (
        <div id="google-pay-button-container"></div>
      ) : (
        <p>Google Pay is not available on this device.</p>
      )}
    </div>
  );
};

export default Address;

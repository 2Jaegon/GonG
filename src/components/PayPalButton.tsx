import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: string;
  onSuccess: (details: any) => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <div>
      {isPending ? <p>⏳ 결제 버튼 로딩 중...</p> : null}
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (!actions.order) return;
          const details = await actions.order.capture();
          onSuccess(details);
        }}
      />
    </div>
  );
}

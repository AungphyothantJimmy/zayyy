import type { OrderDto } from "@/types";

type ShippingFormProps = {
  order: OrderDto;
};

export default function ShippingForm({ order }: ShippingFormProps) {
  return (
    <div className="space-y-2 text-sm">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">
        Shipping Information
      </h3>
      <p>
        <span className="text-gray-500">Name:</span> {order.shippingName}
      </p>
      <p>
        <span className="text-gray-500">Phone:</span> {order.shippingPhone}
      </p>
      <p>
        <span className="text-gray-500">City:</span> {order.shippingCity}
      </p>
      <p>
        <span className="text-gray-500">Township:</span>{" "}
        {order.shippingTownship}
      </p>
      {order.shippingInstructions && (
        <p>
          <span className="text-gray-500">Instructions:</span>{" "}
          {order.shippingInstructions}
        </p>
      )}
      <p className="pt-2">
        <span className="text-gray-500">Payment Method:</span>{" "}
        {order.paymentMethod.replace("_", " ")}
      </p>
      <p className="pt-2">
        <span className="text-gray-500">Payment Status:</span>{" "}
        <span className="capitalize">{order.paymentStatus}</span>
      </p>
      <p>
        <span className="text-gray-500">Order Status:</span>{" "}
        <span className="capitalize">{order.orderStatus}</span>
      </p>
    </div>
  );
}
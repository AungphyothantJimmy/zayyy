import Badge from "@/components/ui/Badge";

type OrderStatusProps = {
  status: string;
};

const STATUS_VARIANT: Record<string, "default" | "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export default function OrderStatus({ status }: OrderStatusProps) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "default"}>
      {status}
    </Badge>
  );
}
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

type ComingSoonProps = {
  title: string;
  description: string;
  phase: string;
};

export default function ComingSoon({
  title,
  description,
  phase,
}: ComingSoonProps) {
  return (
    <EmptyState
      title={title}
      description={`${description} This section arrives in ${phase}.`}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}

export function ComingSoonWithBack({ ...props }: ComingSoonProps) {
  return (
    <div>
      <ComingSoon {...props} />
      <div className="flex justify-center -mt-6">
        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
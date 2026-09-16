import Card from "@/components/ui/Card";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-md">
        <Card className="!p-6 sm:!p-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </div>
  );
}
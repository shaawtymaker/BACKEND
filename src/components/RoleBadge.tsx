import type { Role } from "@/lib/mockApi";
import { Shield, Eye } from "lucide-react";

interface RoleBadgeProps {
  role: Role;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const isTeller = role === "teller";

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-semibold tracking-widest uppercase
        glass border
        ${isTeller
          ? "border-primary/40 text-primary glow-border"
          : "border-secondary/40 text-secondary glow-secondary"
        }
      `}
    >
      {isTeller ? <Shield className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      {role}
    </div>
  );
};

export default RoleBadge;

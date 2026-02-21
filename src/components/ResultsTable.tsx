import { motion } from "framer-motion";
import type { TellerResult, AuditorResult, Role } from "@/lib/mockApi";
import { Lock, Unlock, Search } from "lucide-react";

interface ResultsTableProps {
  results: TellerResult[] | AuditorResult[];
  role: Role;
  isLoading: boolean;
  hasSearched: boolean;
}

function SkeletonRows() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <tr key={i}>
          {[...Array(4)].map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div
                className="h-4 rounded bg-muted animate-shimmer"
                style={{
                  backgroundImage: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(220 15% 20%) 50%, hsl(var(--muted)) 100%)",
                  backgroundSize: "200% 100%",
                  width: `${60 + Math.random() * 40}%`,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

const ResultsTable = ({ results, role, isLoading, hasSearched }: ResultsTableProps) => {
  const isTeller = role === "teller";

  if (!hasSearched && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      {/* Header label */}
      <div className="flex items-center gap-2 mb-4">
        {isTeller ? (
          <Unlock className="w-4 h-4 text-primary" />
        ) : (
          <Lock className="w-4 h-4 text-secondary" />
        )}
        <span className={`text-sm font-semibold tracking-wide ${isTeller ? "text-primary" : "text-secondary"}`}>
          {isTeller ? "Decrypted View (Authorized)" : "Restricted View (Unauthorized)"}
        </span>
      </div>

      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {isTeller ? (
                <>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">Account Number</th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Account Type</th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium text-xs uppercase tracking-wider hidden md:table-cell">Branch Code</th>
                </>
              ) : (
                <>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">Record ID</th>
                  <th className="px-5 py-3 text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">Status / Note</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows />
            ) : results.length === 0 ? (
              <tr>
                <td colSpan={isTeller ? 4 : 2} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No matches found</p>
                    <p className="text-xs text-muted-foreground/60 font-mono">
                      Try searching "Rahul" or "ACC123456"
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              (results as any[]).map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors duration-200"
                >
                  {isTeller ? (
                    <>
                      <td className="px-5 py-4 font-medium text-foreground">{(row as TellerResult).name}</td>
                      <td className="px-5 py-4 font-mono text-primary/90 text-xs">{(row as TellerResult).accountNumber}</td>
                      <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{(row as TellerResult).accountType}</td>
                      <td className="px-5 py-4 font-mono text-muted-foreground text-xs hidden md:table-cell">{(row as TellerResult).branchCode}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4 font-mono text-secondary text-xs">{(row as AuditorResult).recordId}</td>
                      <td className="px-5 py-4 text-muted-foreground flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-secondary/60" />
                        {(row as AuditorResult).status}
                      </td>
                    </>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ResultsTable;

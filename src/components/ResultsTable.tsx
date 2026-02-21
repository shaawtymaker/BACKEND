import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { StaffResult, ComplianceResult, Role } from "@/lib/api";
import { Lock, Unlock, Search, Pencil, Plus } from "lucide-react";

interface ResultsTableProps {
  results: StaffResult[] | ComplianceResult[];
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
                  backgroundImage:
                    "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--border)) 50%, hsl(var(--muted)) 100%)",
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

const ResultsTable = ({
  results,
  role,
  isLoading,
  hasSearched,
}: ResultsTableProps) => {
  const isStaff = role === "bank_staff";

  const [rows, setRows] = useState<StaffResult[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<StaffResult | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isStaff) {
      setRows(results as StaffResult[]);
    }
  }, [results, isStaff]);

  if (!hasSearched && !isLoading) return null;

  const startEdit = (row: StaffResult, index: number) => {
    setEditingIndex(index);
    setFormData({ ...row });
  };

  const saveEdit = () => {
    if (editingIndex === null || !formData) return;
    const updated = [...rows];
    updated[editingIndex] = formData;
    setRows(updated);
    setEditingIndex(null);
  };

  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      name: "",
      accountNumber: "",
      accountType: "",
      branchCode: "",
    });
  };

  const saveAdd = () => {
    if (!formData) return;
    setRows([...rows, formData]);
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        {isStaff ? (
          <Unlock className="w-4 h-4 text-primary" />
        ) : (
          <Lock className="w-4 h-4 text-secondary" />
        )}
        <span
          className={`text-sm font-semibold tracking-wide ${
            isStaff ? "text-primary" : "text-secondary"
          }`}
        >
          {isStaff ? "Full View (Authorized)" : "Limited View (Restricted)"}
        </span>
      </div>

      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {isStaff ? (
                <>
                  <th className="px-5 py-3 text-left text-xs uppercase">Name</th>
                  <th className="px-5 py-3 text-left text-xs uppercase">
                    Account Number
                  </th>
                  <th className="px-5 py-3 text-left text-xs uppercase hidden sm:table-cell">
                    Account Type
                  </th>
                  <th className="px-5 py-3 text-left text-xs uppercase hidden md:table-cell">
                    Branch Code
                  </th>
                  <th className="px-5 py-3 text-xs uppercase">Edit</th>
                </>
              ) : (
                <>
                  <th className="px-5 py-3 text-left text-xs uppercase">
                    Record ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs uppercase">
                    Status / Note
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <SkeletonRows />
            ) : !isStaff ? (
              (results as ComplianceResult[]).map((row, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="px-5 py-4 font-mono text-secondary text-xs">
                    {row.recordId}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-secondary/60" />
                    {row.status}
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center">
                  <Search className="w-6 h-6 mx-auto text-muted-foreground/50" />
                  <p className="text-muted-foreground mt-2">
                    No matches found
                  </p>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border/30 hover:bg-muted/30"
                >
                  {editingIndex === index ? (
                    <>
                      <td className="px-5 py-4">
                        <input
                          value={formData?.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData!,
                              name: e.target.value,
                            })
                          }
                          className="bg-input px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <input
                          value={formData?.accountNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData!,
                              accountNumber: e.target.value,
                            })
                          }
                          className="bg-input px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <input
                          value={formData?.accountType}
                          onChange={(e) =>
                            setFormData({
                              ...formData!,
                              accountType: e.target.value,
                            })
                          }
                          className="bg-input px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <input
                          value={formData?.branchCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData!,
                              branchCode: e.target.value,
                            })
                          }
                          className="bg-input px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-4 flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-400 text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="text-red-400 text-xs"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4">{row.name}</td>
                      <td className="px-5 py-4 font-mono text-primary text-xs">
                        {row.accountNumber}
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {row.accountType}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {row.branchCode}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => startEdit(row, index)}
                          className="text-primary hover:scale-110 transition"
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isStaff && !isAdding && (
        <button
          onClick={startAdd}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg btn-glow"
        >
          <Plus size={16} />
          Add New Entry
        </button>
      )}

      {isStaff && isAdding && (
        <div className="glass p-4 rounded-lg mt-4 space-y-3">
          <input
            placeholder="Name"
            value={formData?.name}
            onChange={(e) =>
              setFormData({ ...formData!, name: e.target.value })
            }
            className="w-full p-2 rounded bg-input"
          />
          <input
            placeholder="Account Number"
            value={formData?.accountNumber}
            onChange={(e) =>
              setFormData({
                ...formData!,
                accountNumber: e.target.value,
              })
            }
            className="w-full p-2 rounded bg-input"
          />
          <input
            placeholder="Account Type"
            value={formData?.accountType}
            onChange={(e) =>
              setFormData({
                ...formData!,
                accountType: e.target.value,
              })
            }
            className="w-full p-2 rounded bg-input"
          />
          <input
            placeholder="Branch Code"
            value={formData?.branchCode}
            onChange={(e) =>
              setFormData({
                ...formData!,
                branchCode: e.target.value,
              })
            }
            className="w-full p-2 rounded bg-input"
          />

          <div className="flex gap-3">
            <button
              onClick={saveAdd}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResultsTable;
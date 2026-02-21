import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Send, Key, Database } from "lucide-react";

const HowItWorks = () => {
  const [open, setOpen] = useState(false);

  const steps = [
    { icon: Send, title: "Client submits query", desc: "The search term is encrypted client-side before leaving the browser." },
    { icon: Key, title: "Backend creates secure search token", desc: "A trapdoor token is generated using searchable encryption, enabling matching without decryption." },
    { icon: Database, title: "DB matches encrypted index", desc: "The database finds matches on encrypted data; only authorized roles can decrypt the results." },
  ];

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        <span>How It Works</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-lg p-6 mt-3 space-y-4">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HowItWorks;

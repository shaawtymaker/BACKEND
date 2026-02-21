import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import GridBackground from "@/components/GridBackground";
import LoginView from "@/components/LoginView";
import SearchView from "@/components/SearchView";
import { AnimatePresence, motion } from "framer-motion";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchView />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LoginView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Index = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default Index;

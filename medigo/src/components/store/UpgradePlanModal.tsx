import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
}

export function UpgradePlanModal({ isOpen, onClose, reason }: UpgradePlanModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative pointer-events-auto"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
                <p className="text-gray-600 mb-8">{reason || "Please upgrade your plan to purchase medicines"}</p>

                <div className="flex flex-col gap-3">
                  <Link href="/pricing" onClick={onClose} className="w-full">
                    <Button className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20 rounded-xl gradient-cta">
                      Upgrade Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

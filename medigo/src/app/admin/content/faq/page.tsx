"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: "Published" | "Draft";
  sortOrder: number;
}

export default function FAQCMSPage() {
  const { show } = useToast();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.get('/api/v1/faqs');
        if (res.success && res.data) {
          setFaqs(res.data);
        }
      } catch (err) {
        console.error("Failed to load FAQs", err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [category, setCategory] = useState("Medication");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) {
      show("Please fill out both question and answer fields.", "error");
      return;
    }

    const newFaq: FAQItem = {
      id: `${faqs.length + 1}`,
      question: newQuestion,
      answer: newAnswer,
      category,
      status,
      sortOrder: faqs.length + 1
    };

    setFaqs([...faqs, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
    setStatus("Draft");
    show("FAQ item created successfully.", "success");
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
    show("FAQ deleted from CMS.", "warning");
  };

  const columns: TableColumn<FAQItem>[] = [
    {
      key: "question",
      label: "Question / Answer",
      sortable: true,
      render: (row) => (
        <div className="max-w-md">
          <span className="font-bold text-text-primary block text-sm">{row.question}</span>
          <span className="text-xs text-text-secondary block mt-1 leading-relaxed truncate" title={row.answer}>
            {row.answer}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (row) => <Badge variant="neutral" size="sm">{row.category}</Badge>,
    },
    {
      key: "sortOrder",
      label: "Sort Order",
      sortable: true,
      render: (row) => <span className="text-xs font-mono font-bold">{row.sortOrder}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "Published" ? "success" : "neutral"} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <button
          onClick={() => handleDeleteFAQ(row.id)}
          className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
          title="Delete FAQ"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: FAQs List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-1">
              {loading ? (
                <div className="p-8 text-center text-text-secondary text-sm">Loading FAQs...</div>
              ) : (
                <AdvancedTable
                  data={faqs}
                  columns={columns}
                  rowKey={(row) => row.id}
                  searchKeys={["question", "category"]}
                  searchPlaceholder="Search questions..."
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Add form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
            Create FAQ Item
          </h3>

          <form onSubmit={handleAddFAQ} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="faq-question" className="text-xs font-bold text-text-secondary uppercase">Question</label>
              <input
                id="faq-question"
                type="text"
                required
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. Do side effects pass?"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="faq-category" className="text-xs font-bold text-text-secondary uppercase">FAQ Category</label>
              <select
                id="faq-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              >
                <option value="Medication">Medication</option>
                <option value="Billing">Billing</option>
                <option value="Medical">Medical</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="faq-status" className="text-xs font-bold text-text-secondary uppercase">Publishing Status</label>
              <select
                id="faq-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "Draft" | "Published")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="faq-answer" className="text-xs font-bold text-text-secondary uppercase">Answer Content</label>
              <textarea
                id="faq-answer"
                rows={3}
                required
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="e.g. Yes, side effects usually diminish after 2 weeks..."
                className="w-full p-3 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              />
            </div>

            <Button type="submit" size="sm" className="w-full font-bold">
              Add FAQ
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

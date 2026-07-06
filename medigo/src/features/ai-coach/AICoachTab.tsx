"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, AlertTriangle, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Message {
  sender: "ai" | "user";
  text: string;
}

export function AICoachTab() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! I am your MediGo AI Coach. How are you feeling today after your latest dose of Semaglutide?" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    "Manage nausea side effects",
    "Semaglutide dosing schedule",
    "Hydration rules during titration",
    "Log weight details"
  ];

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newMsgs: Message[] = [...messages, { sender: "user", text: textToSend }];
    setMessages(newMsgs);
    setInputVal("");
    setIsSending(true);

    // AI Response Mock
    setTimeout(() => {
      setIsSending(false);
      let reply = "I am processing your inquiry. Make sure to maintain healthy protein intake and drink at least 80 oz of water daily.";
      
      const lower = textToSend.toLowerCase();
      if (lower.includes("nausea")) {
        reply = "Nausea is a common side effect of GLP-1 titration. Try eating smaller, more frequent meals, avoiding fatty foods, and sipping ginger tea. If nausea persists or is severe, consult Dr. Mitchell immediately.";
      } else if (lower.includes("dose") || lower.includes("schedule")) {
        reply = "Semaglutide is injected once weekly, on the same day each week. If you miss a dose and it is within 5 days of your scheduled day, take it as soon as you remember. Otherwise, skip the missed dose and resume on your next scheduled day.";
      } else if (lower.includes("water") || lower.includes("hydration")) {
        reply = "Staying hydrated is crucial to support kidney health and reduce mild GLP-1 side effects. Target at least 2.5 liters of water daily.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      
      {/* Clinician Escalation warning banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 text-xs text-amber-850">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-text-primary">Clinical Disclaimer:</span>
          <p className="text-text-secondary leading-relaxed text-[11px]">
            AI Coach provides nutritional guidance and supportive suggestions. It is NOT a substitute for professional medical advice. If you experience severe symptoms, schedule a physician visit.
          </p>
          <button
            onClick={() => window.location.href = "/doctors"}
            className="text-primary font-bold hover:underline flex items-center gap-0.5 pt-0.5 text-[10px]"
          >
            Consult Board Doctor
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Chat Thread Panel */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-border/50 shadow-sm flex flex-col h-[520px] justify-between overflow-hidden">
          
          {/* Panel Header */}
          <div className="px-6 py-4 bg-background border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-cta text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-text-primary">AI Companion Coach</h3>
                <span className="text-[10px] text-success font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                  Online
                </span>
              </div>
            </div>
            <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">v1.2.0</span>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin bg-gradient-to-b from-white to-background/10">
            {messages.map((msg, idx) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={idx}
                  className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                    isAi
                      ? "bg-white border-border-light text-text-primary rounded-tl-none"
                      : "bg-primary text-white border-primary rounded-tr-none"
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-white border border-border-light text-text-secondary text-xs flex gap-2 items-center rounded-tl-none shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            )}
            
            <div ref={threadEndRef} />
          </div>

          {/* Prompt chips and input form footer */}
          <div className="p-4 bg-white border-t border-border-light space-y-3 shrink-0">
            
            {/* Suggestion Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary text-text-secondary hover:text-primary text-[10px] font-bold transition-all shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about hydration guidelines, dosage schedules, side effects..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isSending}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                id="coach-send-msg-btn"
                disabled={isSending}
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shrink-0 shadow-sm"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Right side daily tips panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-text-primary flex items-center gap-1.5">
            <Lightbulb className="w-5 h-5 text-primary shrink-0" />
            AI Dailys Tip
          </h3>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50/50 to-primary-50/15 border border-primary-200/30 space-y-3">
            <h4 className="text-xs font-bold text-primary flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Protein intake guidelines
            </h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              When titrating Semaglutide, you may experience reduced appetite. Aim for at least 80g of high-quality protein (chicken, tofu, eggs) daily to maintain lean muscle tissue.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border/40 space-y-3">
            <h4 className="text-xs font-bold text-text-primary flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-primary" />
              Weekly check-ins
            </h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Titration guidelines advise logging side effects and weight weekly. Click check-in above to update logs before doctor review.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

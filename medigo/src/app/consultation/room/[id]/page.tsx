"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Video, Phone, MessageSquare, Loader2, Link as LinkIcon, Send, 
  AlertCircle, ArrowLeft, ArrowRight, User, Clipboard, FileText, 
  Plus, Trash2, CheckCircle2, ShieldAlert, Heart, Calendar, Clock, Printer
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRole } from "@/features/shared/RoleProvider";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export default function ConsultationRoom() {
  const { id } = useParams();
  const { user } = useRole();
  const { show } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [patientJoined, setPatientJoined] = useState(false);
  
  // Reschedule state
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  // Patient detailed medical history & assessment logs
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalFindings, setClinicalFindings] = useState("");
  const [treatmentRecommendation, setTreatmentRecommendation] = useState("Approved for Treatment");
  const [lifestyleAdvice, setLifestyleAdvice] = useState("");
  const [dietRecommendation, setDietRecommendation] = useState("");
  const [exerciseRecommendation, setExerciseRecommendation] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prescription builder state
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medDuration, setMedDuration] = useState("");
  const [medInstructions, setMedInstructions] = useState("");
  const [prescriptionList, setPrescriptionList] = useState<Medicine[]>([
    { name: "Semaglutide (Compounded)", dosage: "0.25 mg once weekly", duration: "4 weeks", instructions: "Inject subcutaneously once weekly" }
  ]);

  const isDoctor = user?.role === "Doctor";

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const res = await api.get(`/api/v1/appointments/${id}/messages`);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/api/v1/appointments/${id}`);
      if (res.success && res.data) {
        setAppointment(res.data);
        if (res.data.meetingLink && !meetingLink) {
          setMeetingLink(res.data.meetingLink);
        }
        if (res.data.consultationType?.toLowerCase().includes("chat")) {
          fetchMessages();
        }

        if (isDoctor && res.data.status !== "Completed") {
          api.post(`/api/v1/appointments/${id}/ping`, {}).catch(() => {});
        }
      }
    } catch (err) {
      show("Failed to load consultation room", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDoctor && appointment?.patientId && !patientDetails) {
      setLoadingPatient(true);
      api.get(`/api/v1/doctor/patient/${appointment.patientId}`)
        .then((patientRes) => {
          if (patientRes.success && patientRes.data) {
            setPatientDetails(patientRes.data);
          }
        })
        .catch((pErr) => {
          console.error("Failed to load patient dossier", pErr);
        })
        .finally(() => {
          setLoadingPatient(false);
        });
    }
  }, [isDoctor, appointment?.patientId]);

  useEffect(() => {
    fetchDetails();

    // Poll for updates (e.g. if doctor completes consultation or adds link)
    const interval = setInterval(() => {
      fetchDetails();
      if (appointment?.consultationType?.toLowerCase().includes("chat")) {
        fetchMessages();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [id, isDoctor]);

  useEffect(() => {
    if (!user) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const sseUrl = `${baseUrl}/api/v1/realtime/events?userId=${user.id}&role=${user.role}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.event === "chat.new_message" && parsed.data?.message?.appointmentId === id) {
          fetchMessages();
          setPatientJoined(true);
        }
      } catch (e) {}
    };
    return () => eventSource.close();
  }, [user, id]);

  useEffect(() => {
    if (loading || appointment?.status === "Completed" || patientJoined) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, appointment, patientJoined]);

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      show("Please select new date and time", "error");
      return;
    }
    try {
      const res = await api.patch(`/api/v1/appointments/${id}`, { 
        appointmentDate: rescheduleDate, 
        appointmentTime: rescheduleTime 
      });
      if (res.success) {
        show("Patient rescheduled and notified", "success");
        router.push("/doctor/dashboard");
      }
    } catch (err) {
      show("Failed to reschedule", "error");
    }
  };

  const handleUpdateLink = async () => {
    try {
      await api.patch(`/api/v1/appointments/${id}/meeting-link`, { meetingLink });
      show("Meeting link shared with patient", "success");
      fetchDetails();
    } catch (err) {
      show("Failed to update meeting link", "error");
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    try {
      await api.post(`/api/v1/appointments/${id}/messages`, { text: chatMessage });
      setChatMessage("");
      fetchMessages();
    } catch (err) {
      show("Failed to send message", "error");
    }
  };

  const handleAddMedicine = () => {
    if (!medName.trim() || !medDosage.trim()) {
      show("Medicine Name and Dosage are required.", "error");
      return;
    }
    const newMed: Medicine = {
      name: medName.trim(),
      dosage: medDosage.trim(),
      duration: medDuration.trim() || "As directed",
      instructions: medInstructions.trim() || "Take as directed by doctor",
    };
    setPrescriptionList([...prescriptionList, newMed]);
    setMedName("");
    setMedDosage("");
    setMedDuration("");
    setMedInstructions("");
  };

  const handleRemoveMedicine = (index: number) => {
    setPrescriptionList(prescriptionList.filter((_, i) => i !== index));
  };

  const handleCompleteConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiefComplaint.trim() || !diagnosis.trim() || !clinicalFindings.trim()) {
      show("Please fill out Chief Complaint, Diagnosis, and Clinical Findings.", "error");
      return;
    }
    if (prescriptionList.length === 0) {
      show("Please add at least one medication in the prescription builder.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const medicationsStr = JSON.stringify(prescriptionList);
      const instructionsSummary = prescriptionList.map(m => `${m.name}: ${m.instructions}`).join("; ");

      const payload = {
        chiefComplaint,
        diagnosis,
        clinicalFindings,
        treatmentRecommendation,
        medications: medicationsStr,
        instructions: instructionsSummary,
        lifestyleAdvice,
        dietRecommendation,
        exerciseRecommendation,
        followUpDate: followUpDate || null,
        additionalNotes,
      };

      await api.post(`/api/v1/appointments/${id}/complete`, payload);
      show("Consultation completed and report submitted successfully!", "success");
      fetchDetails();
    } catch (err: any) {
      show(err.message || "Failed to complete consultation.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-text-secondary">Connecting to secure consultation room...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold text-text-primary">Consultation Not Found</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const type = appointment.consultationType?.toLowerCase() || "";
  const patientName = `${appointment.patient?.firstName} ${appointment.patient?.lastName}`;
  const doctorName = `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`;
  const isCompleted = appointment.status === "Completed";

  // RENDER COMPLETED REPORT VIEW
  if (isCompleted) {
    let parsedMedications: Medicine[] = [];
    try {
      parsedMedications = JSON.parse(appointment.prescription?.medications || "[]");
    } catch {
      parsedMedications = [{ name: appointment.prescription?.medications || "Prescribed Medicine", dosage: "", duration: "", instructions: appointment.prescription?.instructions || "" }];
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6 pt-28 px-4 animate-fade-in text-left">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Portal
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary">Clinical Consultation Summary</h1>
            <p className="text-xs text-text-secondary mt-1">
              Completed on {new Date(appointment.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} variant="outline" size="sm" className="font-bold gap-1.5 rounded-xl">
              <Printer className="w-4 h-4" /> Print Report
            </Button>
            <Badge variant="success">Completed</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-6">
            <Card padding="md" className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Clinical Case Record
              </h3>
              
              <div className="space-y-3.5 text-xs text-text-primary leading-relaxed">
                <div>
                  <span className="block font-bold text-text-tertiary uppercase text-[9px] tracking-wider">Chief Complaint</span>
                  <p className="font-medium mt-1">{appointment.consultation?.chiefComplaint || "No complaint logged."}</p>
                </div>
                <div>
                  <span className="block font-bold text-text-tertiary uppercase text-[9px] tracking-wider">Clinical Diagnosis</span>
                  <p className="font-medium mt-1 p-2 rounded-xl bg-slate-50 border border-border-light">{appointment.consultation?.diagnosis || "No diagnosis logged."}</p>
                </div>
                <div>
                  <span className="block font-bold text-text-tertiary uppercase text-[9px] tracking-wider">Clinical Findings</span>
                  <p className="font-medium mt-1 whitespace-pre-line">{appointment.consultation?.clinicalFindings || "No findings logged."}</p>
                </div>
              </div>
            </Card>

            <Card padding="md" className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light flex items-center gap-2">
                <Clipboard className="w-4 h-4 text-primary" />
                Treatment Plan & Advice
              </h3>
              <div className="space-y-3.5 text-xs text-text-primary leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block font-bold text-text-tertiary uppercase text-[9px] tracking-wider">Dietary Directives</span>
                    <p className="font-medium mt-1">{appointment.consultation?.dietRecommendation || "None."}</p>
                  </div>
                  <div>
                    <span className="block font-bold text-text-tertiary uppercase text-[9px] tracking-wider">Physical Exercise Plan</span>
                    <p className="font-medium mt-1">{appointment.consultation?.exerciseRecommendation || "None."}</p>
                  </div>
                </div>
                <div>
                  <span className="block font-bold text-text-tertiary uppercase text-[9px] tracking-wider">Lifestyle Recommendations</span>
                  <p className="font-medium mt-1">{appointment.consultation?.lifestyleAdvice || "None."}</p>
                </div>
                {appointment.consultation?.followUpDate && (
                  <div className="p-3 bg-primary-50 rounded-xl flex items-center justify-between border border-primary-100">
                    <span className="font-bold text-primary-800">Suggested Follow Up Date</span>
                    <span className="font-bold text-primary">
                      {new Date(appointment.consultation.followUpDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card padding="md" className="border-primary/20 bg-primary-50/10">
              <h3 className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider pb-2 border-b border-border-light mb-3">
                Treatment Authorization
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">Recommendation</span>
                  <Badge variant={appointment.consultation?.treatmentRecommendation === "Approved for Treatment" ? "success" : "error"}>
                    {appointment.consultation?.treatmentRecommendation || "Reviewed"}
                  </Badge>
                </div>

                {appointment.consultation?.treatmentRecommendation === "Approved for Treatment" && !isDoctor && (
                  <div className="pt-2">
                    <Button onClick={() => router.push("/pharmacy/checkout")} className="w-full font-bold shadow-lg shadow-primary/20">
                      Buy Prescribed Medicines
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card padding="md" className="space-y-4">
              <h3 className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider pb-2 border-b border-border-light flex items-center gap-2">
                Active Prescription
              </h3>
              <div className="space-y-3">
                {parsedMedications.length > 0 ? (
                  parsedMedications.map((med, index) => (
                    <div key={index} className="p-3 bg-white border border-border/80 rounded-xl space-y-1.5">
                      <span className="font-bold text-xs text-text-primary block">{med.name}</span>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-text-secondary">
                        <span><strong className="text-text-primary">Dosage:</strong> {med.dosage}</span>
                        <span><strong className="text-text-primary">Duration:</strong> {med.duration}</span>
                      </div>
                      <p className="text-[10px] text-text-tertiary italic mt-1">{med.instructions}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-secondary">No medications prescribed.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ACTIVE CONSULTATION WORKSPACE
  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6 pt-28 px-4 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Portal
          </button>
          <h1 className="text-2xl font-extrabold text-text-primary capitalize">{appointment.consultationType} Consultation Room</h1>
          <p className="text-xs text-text-secondary mt-1">
            {isDoctor ? `Patient: ${patientName}` : `Clinician: ${doctorName}`} • {appointment.appointmentDate} at {appointment.appointmentTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded font-bold flex items-center gap-1 select-none">
            <ShieldAlert className="w-3.5 h-3.5" />
            HIPAA SECURE
          </span>
          <Badge variant="success" className="animate-pulse">Active Session</Badge>
        </div>
      </div>

      {!isCompleted && !patientJoined && type.includes("chat") && isDoctor && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between gap-3 max-w-lg mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
            <div>
              <span className="text-[10px] text-amber-700 font-bold uppercase block">Waiting for Patient</span>
              <span className="text-xl font-mono font-black text-amber-600">
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
              </span>
            </div>
          </div>
          {timeLeft === 0 && (
            <Button size="sm" variant="outline" className="border-error text-error bg-white hover:bg-error/10" onClick={() => setShowReschedule(true)}>
              No Show - Reschedule
            </Button>
          )}
        </div>
      )}

      {showReschedule ? (
        <Card padding="md" className="border-error/30 bg-error/5 max-w-lg">
          <div className="flex items-center gap-2 text-error mb-4">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold">Reschedule Patient (No Show)</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text-secondary">New Date</label>
              <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full mt-1 p-2 border border-border bg-white rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary">New Time</label>
              <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full mt-1 p-2 border border-border bg-white rounded-xl text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowReschedule(false)}>Cancel</Button>
              <Button onClick={handleReschedule} className="bg-error hover:bg-error/90 text-white font-bold">Confirm Reschedule</Button>
            </div>
          </div>
        </Card>
      ) : (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE CONSULTATION TELEHEALTH ROOM */}
        <div className={isDoctor ? "xl:col-span-5 space-y-6" : "xl:col-span-12 space-y-6"}>
          
          {/* Main Interaction Room Card */}
          {type.includes("video") && (
            <Card padding="md" className="border-primary/40 shadow-xl shadow-primary/5 bg-gradient-to-b from-white to-primary-50/20 flex flex-col items-center justify-center min-h-[250px] text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-5 shadow-inner">
                <Video className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-base font-bold text-text-primary mb-1">Secure Video Room</h2>
              <p className="text-xs text-text-secondary max-w-sm mb-6">
                {isDoctor 
                  ? "Generate a Google Meet or Zoom link and share below for the patient."
                  : "Waiting for the clinician to provide the secure meeting link."}
              </p>

              {isDoctor ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-xs bg-white shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <Button onClick={handleUpdateLink} size="sm" disabled={!meetingLink} className="py-2.5 shadow-md">
                    Share Link
                  </Button>
                </div>
              ) : (
                <div>
                  {appointment.meetingLink ? (
                    <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="font-bold shadow-md shadow-primary/20">
                        Join Meeting Now
                      </Button>
                    </a>
                  ) : (
                    <Badge variant="neutral" className="py-1.5 px-4">Waiting for link...</Badge>
                  )}
                </div>
              )}
            </Card>
          )}

          {type.includes("voice") && (
            <Card padding="md" className="border-amber-500/20 shadow-md bg-amber-50/20 flex flex-col items-center justify-center min-h-[250px] text-center">
              <Phone className="w-10 h-10 text-amber-600 mb-4" />
              <h2 className="text-base font-bold text-text-primary mb-1">Voice Consultation</h2>
              <p className="text-xs text-text-secondary mb-6">Use the verified lines to connect.</p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-3 rounded-xl border border-border bg-white text-center">
                  <span className="text-[9px] uppercase font-bold text-text-tertiary">Clinician Line</span>
                  <p className="font-mono text-xs font-bold text-text-primary mt-1">{appointment.doctor?.user?.phone || "+1 (555) 000-0000"}</p>
                </div>
                <div className="p-3 rounded-xl border border-border bg-white text-center">
                  <span className="text-[9px] uppercase font-bold text-text-tertiary">Patient Line</span>
                  <p className="font-mono text-xs font-bold text-text-primary mt-1">{appointment.patient?.user?.phone || "+1 (555) 111-1111"}</p>
                </div>
              </div>
            </Card>
          )}

          {type.includes("chat") && (
            <div className="flex flex-col h-[400px] rounded-2xl border border-border overflow-hidden bg-slate-50 shadow-sm">
              <div className="bg-white border-b border-border p-3 flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-xs text-text-primary">{isDoctor ? patientName : doctorName}</h3>
                  <span className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {messages.map((msg: any) => {
                  const isMine = msg.sender.id === user?.id;
                  return (
                    <div key={msg.id} className={`p-2.5 rounded-xl border max-w-[85%] shadow-sm flex flex-col ${isMine ? 'bg-primary/10 border-primary/20 rounded-tr-none self-end' : 'bg-white border-border rounded-tl-none self-start'}`}>
                      <p className="text-xs text-text-primary">{msg.text}</p>
                      <span className="text-[8px] text-text-tertiary mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 bg-white border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 py-1.5 px-3 rounded-full border border-border outline-none text-xs"
                  />
                  <Button onClick={handleSendMessage} disabled={!chatMessage.trim()} className="rounded-full w-8 h-8 p-0 flex items-center justify-center shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* DOCTOR: View Patient Dossier & Medical Logs */}
          {isDoctor && (
            <Card padding="md" className="space-y-4">
              <div className="border-b border-border-light pb-2">
                <h3 className="font-heading text-sm font-bold text-text-primary">Patient Intake & Vitals</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">Demographics and intake assessment summary</p>
              </div>

              {loadingPatient ? (
                <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
              ) : patientDetails ? (
                <div className="space-y-4">
                  {/* Demographics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-b border-border-light pb-4">
                    <div className="p-2.5 bg-slate-50 border border-border-light rounded-xl">
                      <span className="text-[9px] text-text-tertiary uppercase font-bold block mb-0.5">Gender / Age</span>
                      <span className="font-extrabold text-text-primary">{patientDetails.gender || "Not specified"} / {patientDetails.dob ? `${Math.floor((new Date().getTime() - new Date(patientDetails.dob).getTime()) / 3.15576e+10)} yrs` : "N/A"}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-border-light rounded-xl">
                      <span className="text-[9px] text-text-tertiary uppercase font-bold block mb-0.5">Height / Weight</span>
                      <span className="font-extrabold text-text-primary">{patientDetails.height ? `${patientDetails.height} cm` : "N/A"} / {patientDetails.weight ? `${patientDetails.weight} kg` : "N/A"}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-border-light rounded-xl">
                      <span className="text-[9px] text-text-tertiary uppercase font-bold block mb-0.5">Blood Group</span>
                      <span className="font-extrabold text-text-primary">{patientDetails.bloodGroup || "N/A"}</span>
                    </div>
                  </div>

                  {/* Latest Assessment */}
                  {patientDetails.assessments?.length > 0 && (
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-800">Latest Intake Assessment</span>
                        <Badge variant="success">Score: {patientDetails.assessments[0].assessmentScore}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-emerald-950">
                        <span><strong>BMI:</strong> {patientDetails.assessments[0].bmi}</span>
                        <span><strong>Result:</strong> {patientDetails.assessments[0].result}</span>
                      </div>
                      <p className="text-[10px] text-emerald-800"><strong>Recommendation:</strong> {patientDetails.assessments[0].recommendation}</p>
                    </div>
                  )}

                  {/* Previous Assessment History */}
                  {patientDetails.assessments?.length > 1 && (
                    <div>
                      <span className="font-bold text-[9px] text-text-tertiary uppercase block mb-1">Previous Intake History</span>
                      <div className="max-h-24 overflow-y-auto space-y-1.5">
                        {patientDetails.assessments.slice(1).map((as: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-[10px] border-b border-border-light pb-1">
                            <span className="text-text-secondary">{new Date(as.submittedAt).toLocaleDateString()}</span>
                            <span className="font-semibold text-text-primary">BMI {as.bmi} (Score: {as.assessmentScore})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Previous Consultation History */}
                  {patientDetails.appointments?.length > 0 && (
                    <div>
                      <span className="font-bold text-[9px] text-text-tertiary uppercase block mb-1">Consultation History</span>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {patientDetails.appointments.map((app: any, idx: number) => (
                          <div key={idx} className="p-2 border border-border-light rounded-lg space-y-1 text-[10px] bg-slate-50">
                            <div className="flex justify-between font-bold">
                              <span className="text-text-primary">{app.consultationType} Call</span>
                              <Badge variant={app.status === "Completed" ? "success" : "neutral"} size="sm">{app.status}</Badge>
                            </div>
                            <p className="text-text-secondary">{app.appointmentDate} at {app.appointmentTime}</p>
                            {app.consultation?.diagnosis && (
                              <p className="text-text-primary"><strong>Diagnosis:</strong> {app.consultation.diagnosis}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-text-secondary">No additional patient details available.</p>
              )}
            </Card>
          )}

        </div>

        {/* RIGHT COLUMN: DOCTOR CONSULTATION REPORT FORM & PRESCRIPTION BUILDER */}
        {isDoctor && (
          <div className="xl:col-span-7">
            <form onSubmit={handleCompleteConsultation} className="space-y-6">
              
              {/* Card 1: Case Overview */}
              <Card padding="md" className="border-t-4 border-t-primary shadow-md">
                <div className="pb-4 mb-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-extrabold text-text-primary">Clinical Consultation Report</h2>
                    <p className="text-[11px] text-text-secondary mt-0.5">Please fill all required clinical metrics to complete the session</p>
                  </div>
                  <ShieldAlert className="w-6 h-6 text-primary shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Chief Complaint *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weight loss assistance, metabolic health review"
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Clinical Diagnosis *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Obesity (BMI 31.0), metabolic syndrome risk"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Clinical Findings / Notes *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter detailed clinical findings, symptoms, and physiological indicators..."
                      value={clinicalFindings}
                      onChange={(e) => setClinicalFindings(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Treatment Recommendation Status *</label>
                    <select
                      value={treatmentRecommendation}
                      onChange={(e) => setTreatmentRecommendation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors font-semibold appearance-none"
                    >
                      <option value="Approved for Treatment">Approved for Treatment</option>
                      <option value="Requires Further Evaluation">Requires Further Evaluation</option>
                      <option value="Treatment Rejected">Treatment Rejected</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Card 2: Prescription Builder */}
              <Card padding="md" className="border-t-4 border-t-emerald-500 shadow-md">
                <div className="pb-3 mb-4 border-b border-border-light flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Prescription Builder
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Added medicines list */}
                  <div className="space-y-3">
                    {prescriptionList.length > 0 ? (
                      prescriptionList.map((med, idx) => (
                        <div key={idx} className="flex justify-between items-start p-3.5 rounded-xl bg-emerald-50/30 border border-emerald-100 shadow-sm relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
                          <div className="ml-2">
                            <span className="font-bold text-sm text-emerald-950 block mb-1">{med.name} <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md ml-1">{med.dosage}</span></span>
                            <span className="text-xs text-text-secondary block"><strong>Duration:</strong> {med.duration} &nbsp;&bull;&nbsp; <strong>Notes:</strong> {med.instructions}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(idx)}
                            className="text-error hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-text-tertiary text-center py-4 bg-slate-50 rounded-xl border border-dashed border-border">No medications added yet.</p>
                    )}
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-border-light rounded-xl mt-2">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-text-secondary uppercase block tracking-wide">Medicine Name</span>
                      <input
                        type="text"
                        placeholder="e.g. Semaglutide"
                        value={medName}
                        onChange={(e) => setMedName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-text-secondary uppercase block tracking-wide">Dosage</span>
                      <input
                        type="text"
                        placeholder="e.g. 0.25mg weekly"
                        value={medDosage}
                        onChange={(e) => setMedDosage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-text-secondary uppercase block tracking-wide">Duration</span>
                      <input
                        type="text"
                        placeholder="e.g. 4 weeks"
                        value={medDuration}
                        onChange={(e) => setMedDuration(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-text-secondary uppercase block tracking-wide">Instructions</span>
                      <input
                        type="text"
                        placeholder="e.g. Inject subcutaneously"
                        value={medInstructions}
                        onChange={(e) => setMedInstructions(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <Button type="button" onClick={handleAddMedicine} size="sm" variant="outline" className="w-full text-xs font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300">
                        <Plus className="w-4 h-4 mr-1.5" /> Add Medication to List
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 3: Advice & Follow Up */}
              <Card padding="md" className="border-t-4 border-t-amber-400 shadow-md">
                <div className="pb-3 mb-4 border-b border-border-light flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Advice & Follow-Up
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Advice Section */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Diet Recommendation</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. High protein, calorie deficit"
                      value={dietRecommendation}
                      onChange={(e) => setDietRecommendation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Exercise Recommendation</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 150 mins cardio weekly"
                      value={exerciseRecommendation}
                      onChange={(e) => setExerciseRecommendation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Lifestyle & Behavioral Advice</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 7-8 hours sleep, stress management codes"
                      value={lifestyleAdvice}
                      onChange={(e) => setLifestyleAdvice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Follow up date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Follow Up Date</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Additional notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Additional Notes</label>
                    <input
                      type="text"
                      placeholder="Private clinical logs"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </Card>

              {/* Submit CTA */}
              <div className="pt-2 sticky bottom-4 z-20">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  fullWidth
                  className="py-4 text-sm font-extrabold shadow-xl shadow-primary/25 gradient-cta text-white hover:scale-[1.01] transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Complete Consultation & Transmit Report
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
      )}
    </div>
  );
}

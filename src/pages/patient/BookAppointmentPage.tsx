import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DatePicker from "@/components/booking/DatePicker";
import TimeSlots from "@/components/booking/TimeSlots";
import AppointmentForm from "@/components/booking/AppointmentForm";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";

export function BookAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
    setSelectedAdminId(null);
    setStep(2);
  };

  const handleSelectSlot = (startTime: Date, endTime: Date, adminId: string) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setSelectedAdminId(adminId);
    setStep(3);
  };

  const handleReset = () => {
    if (step === 3) {
      // Keep the date, reset time slot
      setSelectedStartTime(null);
      setSelectedEndTime(null);
      setSelectedAdminId(null);
      setStep(2);
    } else {
      // Reset everything
      setSelectedDate(null);
      setSelectedStartTime(null);
      setSelectedEndTime(null);
      setSelectedAdminId(null);
      setStep(1);
    }
  };

  return (
    <AuthGuard patientOnly>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Book an Appointment</h1>
            
            {/* Steps indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-medical-600 text-white' : 'bg-medical-100 text-medical-600'} font-semibold`}>
                  1
                </div>
                <div className={`w-20 h-1 ${step > 1 ? 'bg-medical-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-medical-600 text-white' : step > 2 ? 'bg-medical-100 text-medical-600' : 'bg-gray-300 text-gray-500'} font-semibold`}>
                  2
                </div>
                <div className={`w-20 h-1 ${step > 2 ? 'bg-medical-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-medical-600 text-white' : 'bg-gray-300 text-gray-500'} font-semibold`}>
                  3
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Step 1: Select Date */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Select a Date for Your Appointment
                  </h2>
                  <DatePicker
                    onSelectDate={handleSelectDate}
                    selectedDate={selectedDate}
                  />
                </div>
              )}
              
              {/* Step 2: Select Time Slot */}
              {step === 2 && selectedDate && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" onClick={handleReset} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
                      Back
                    </Button>
                    <h2 className="text-xl font-semibold">Select a Time Slot</h2>
                    <div className="w-24"></div> {/* Spacer for layout balance */}
                  </div>
                  <TimeSlots
                    selectedDate={selectedDate}
                    onSelectSlot={handleSelectSlot}
                  />
                </div>
              )}
              
              {/* Step 3: Confirm Appointment */}
              {step === 3 && selectedDate && selectedStartTime && selectedEndTime && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" onClick={handleReset} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
                      Back
                    </Button>
                    <h2 className="text-xl font-semibold">Confirm Your Booking</h2>
                    <div className="w-24"></div> {/* Spacer for layout balance */}
                  </div>
                  <AppointmentForm
                    selectedDate={selectedDate}
                    selectedStartTime={selectedStartTime}
                    selectedEndTime={selectedEndTime}
                    adminId={selectedAdminId}
                    onReset={handleReset}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

export default BookAppointmentPage;

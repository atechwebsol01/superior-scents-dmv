import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, MapPin, User, Calendar, ArrowLeft, Phone, Mail } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Badge, Modal, Input, Select, TextArea } from '@/components';
import { cn } from '@/lib/cn';

interface ServiceAppointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  assignedTo: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  color: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ServiceSchedulingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });
  const [selectedAppointment, setSelectedAppointment] = useState<ServiceAppointment | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [view, setView] = useState<'week' | 'day'>('week');

  // Mock appointments
  const appointments: ServiceAppointment[] = [
    { id: '1', customerId: '1', customerName: 'ABC Corporation', customerPhone: '(202) 555-0101', customerEmail: 'contact@abc.com', serviceType: 'Monthly Service', location: '123 Main St, Washington DC', date: new Date(2026, 0, 5), startTime: '09:00', endTime: '10:30', assignedTo: 'John Smith', status: 'scheduled', notes: 'Regular monthly service', color: 'bg-blue-500' },
    { id: '2', customerId: '2', customerName: 'XYZ Industries', customerPhone: '(202) 555-0102', customerEmail: 'service@xyz.com', serviceType: 'Installation', location: '456 Oak Ave, Arlington VA', date: new Date(2026, 0, 5), startTime: '14:00', endTime: '17:00', assignedTo: 'Sarah Johnson', status: 'confirmed', notes: 'New diffuser installation', color: 'bg-green-500' },
    { id: '3', customerId: '3', customerName: 'Tech Solutions', customerPhone: '(202) 555-0103', customerEmail: 'info@techsol.com', serviceType: 'Maintenance', location: '789 Pine Rd, Bethesda MD', date: new Date(2026, 0, 7), startTime: '10:00', endTime: '11:30', assignedTo: 'Mike Wilson', status: 'scheduled', notes: 'Quarterly maintenance check', color: 'bg-purple-500' },
    { id: '4', customerId: '4', customerName: 'Metro Office', customerPhone: '(202) 555-0104', customerEmail: 'admin@metro.com', serviceType: 'Scent Refill', location: '321 Elm St, Washington DC', date: new Date(2026, 0, 8), startTime: '11:00', endTime: '12:00', assignedTo: 'John Smith', status: 'scheduled', notes: 'Monthly refill', color: 'bg-orange-500' },
    { id: '5', customerId: '5', customerName: 'City Hall', customerPhone: '(202) 555-0105', customerEmail: 'services@cityhall.gov', serviceType: 'Consultation', location: '100 Gov Plaza, Washington DC', date: new Date(2026, 0, 9), startTime: '15:00', endTime: '16:00', assignedTo: 'Sarah Johnson', status: 'confirmed', notes: 'New service consultation', color: 'bg-teal-500' },
  ];

  const getWeekDays = () => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const navigateWeek = (direction: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(newStart);
  };

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    setCurrentWeekStart(new Date(today.setDate(diff)));
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(a => 
      a.date.getFullYear() === date.getFullYear() &&
      a.date.getMonth() === date.getMonth() &&
      a.date.getDate() === date.getDate()
    );
  };

  const getTimeSlot = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return hour - 8; // 8am is index 0
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <PageContainer
      title="Service Scheduling"
      subtitle="Schedule and manage service appointments"
      breadcrumbs={[
        { label: 'Services', path: '/services' },
        { label: 'Scheduling' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/services')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => setShowNewModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      }
    >
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigateWeek(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
              <Button variant="ghost" size="sm" onClick={() => navigateWeek(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={cn('px-3 py-1 text-sm rounded-md transition-colors', view === 'week' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500')}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={cn('px-3 py-1 text-sm rounded-md transition-colors', view === 'day' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500')}
            >
              Day
            </button>
          </div>
        </div>

        {/* Week View */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-neutral-200 dark:border-neutral-700">
              <div className="p-2 text-center text-sm font-medium text-neutral-500">Time</div>
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'p-2 text-center border-l border-neutral-200 dark:border-neutral-700',
                    isToday(day) && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  <p className="text-xs text-neutral-500">{DAYS_OF_WEEK[day.getDay()].slice(0, 3)}</p>
                  <p className={cn(
                    'text-lg font-bold',
                    isToday(day) ? 'text-primary-600' : 'text-neutral-900 dark:text-white'
                  )}>
                    {day.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {HOURS.map((hour, hourIdx) => (
                <div key={hour} className="grid grid-cols-8 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="p-2 text-xs text-neutral-500 text-center">{hour}</div>
                  {weekDays.map((day, dayIdx) => {
                    const dayAppointments = getAppointmentsForDay(day).filter(a => {
                      const slot = getTimeSlot(a.startTime);
                      return slot === hourIdx;
                    });
                    return (
                      <div
                        key={dayIdx}
                        className={cn(
                          'min-h-[60px] p-1 border-l border-neutral-100 dark:border-neutral-800 relative',
                          isToday(day) && 'bg-primary-50/30 dark:bg-primary-900/10'
                        )}
                      >
                        {dayAppointments.map(apt => (
                          <button
                            key={apt.id}
                            onClick={() => setSelectedAppointment(apt)}
                            className={cn(
                              'w-full text-left p-2 rounded text-xs text-white mb-1',
                              apt.color
                            )}
                          >
                            <p className="font-medium truncate">{apt.customerName}</p>
                            <p className="opacity-80">{apt.startTime} - {apt.endTime}</p>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Monthly Service</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Installation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Scent Refill</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-teal-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Consultation</span>
          </div>
        </div>
      </Card>

      {/* Appointment Detail Modal */}
      <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} title="Appointment Details" size="md">
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn('w-4 h-4 rounded', selectedAppointment.color)} />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{selectedAppointment.serviceType}</h3>
              <Badge className={statusColors[selectedAppointment.status]}>{selectedAppointment.status}</Badge>
            </div>
            
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <p className="font-medium text-neutral-900 dark:text-white mb-2">{selectedAppointment.customerName}</p>
              <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" />{selectedAppointment.customerPhone}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{selectedAppointment.customerEmail}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span>{selectedAppointment.date.toLocaleDateString()} | {selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4" />
                <span>{selectedAppointment.location}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <User className="w-4 h-4" />
                <span>Assigned to: {selectedAppointment.assignedTo}</span>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-sm text-neutral-500 mb-1">Notes</p>
                <p className="text-neutral-900 dark:text-white">{selectedAppointment.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedAppointment(null)}>Close</Button>
              <Button variant="outline" className="flex-1">Reschedule</Button>
              <Button className="flex-1">Edit</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Appointment Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Schedule New Appointment" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Customer"
              options={[
                { value: '', label: 'Select customer...' },
                { value: '1', label: 'ABC Corporation' },
                { value: '2', label: 'XYZ Industries' },
                { value: '3', label: 'Tech Solutions' },
              ]}
            />
            <Select
              label="Service Type"
              options={[
                { value: '', label: 'Select service...' },
                { value: 'monthly', label: 'Monthly Service' },
                { value: 'installation', label: 'Installation' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'refill', label: 'Scent Refill' },
                { value: 'consultation', label: 'Consultation' },
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Date" type="date" />
            <Input label="Start Time" type="time" />
            <Input label="End Time" type="time" />
          </div>
          <Select
            label="Assign To"
            options={[
              { value: '', label: 'Select employee...' },
              { value: '1', label: 'John Smith' },
              { value: '2', label: 'Sarah Johnson' },
              { value: '3', label: 'Mike Wilson' },
            ]}
          />
          <Input label="Location" placeholder="Service address..." />
          <TextArea label="Notes" placeholder="Additional notes..." rows={3} />
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button className="flex-1">Schedule Appointment</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ServiceSchedulingPage;

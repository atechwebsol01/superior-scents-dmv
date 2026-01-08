import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Calendar, ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Badge, Avatar, Modal } from '@/components';
import { cn } from '@/lib/cn';

interface ScheduleEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  title: string;
  customer: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  color: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const EmployeeSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // Mock schedule data
  const events: ScheduleEvent[] = [
    { id: '1', employeeId: '1', employeeName: 'John Smith', title: 'Service Call', customer: 'ABC Corp', location: '123 Main St', date: new Date(2026, 0, 8), startTime: '09:00', endTime: '11:00', status: 'scheduled', color: 'bg-blue-500' },
    { id: '2', employeeId: '2', employeeName: 'Sarah Johnson', title: 'Installation', customer: 'XYZ Inc', location: '456 Oak Ave', date: new Date(2026, 0, 8), startTime: '14:00', endTime: '17:00', status: 'in-progress', color: 'bg-green-500' },
    { id: '3', employeeId: '1', employeeName: 'John Smith', title: 'Maintenance', customer: 'Tech Solutions', location: '789 Pine Rd', date: new Date(2026, 0, 10), startTime: '10:00', endTime: '12:00', status: 'scheduled', color: 'bg-purple-500' },
    { id: '4', employeeId: '3', employeeName: 'Mike Wilson', title: 'Consultation', customer: 'Metro Office', location: '321 Elm St', date: new Date(2026, 0, 12), startTime: '13:00', endTime: '14:30', status: 'scheduled', color: 'bg-orange-500' },
    { id: '5', employeeId: '2', employeeName: 'Sarah Johnson', title: 'Service Call', customer: 'City Hall', location: '100 Gov Plaza', date: new Date(2026, 0, 15), startTime: '09:00', endTime: '11:00', status: 'scheduled', color: 'bg-blue-500' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(e => 
      e.date.getFullYear() === date.getFullYear() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getDate() === date.getDate()
    );
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'in-progress': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <PageContainer
      title="Employee Schedule"
      subtitle="Manage and view employee work schedules"
      breadcrumbs={[
        { label: 'Employees', path: '/employees' },
        { label: 'Schedule' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      }
    >
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={cn('px-3 py-1 text-sm rounded-md transition-colors', view === 'month' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500')}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={cn('px-3 py-1 text-sm rounded-md transition-colors', view === 'week' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500')}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-700 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {DAYS.map(day => (
            <div key={day} className="bg-neutral-50 dark:bg-neutral-800 p-3 text-center">
              <span className="text-sm font-semibold text-neutral-500">{day}</span>
            </div>
          ))}

          {/* Day Cells */}
          {days.map((date, idx) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div
                key={idx}
                className={cn(
                  'bg-white dark:bg-neutral-900 min-h-[120px] p-2',
                  !date && 'bg-neutral-50 dark:bg-neutral-800/50'
                )}
              >
                {date && (
                  <>
                    <div className={cn(
                      'w-7 h-7 flex items-center justify-center rounded-full text-sm mb-1',
                      isToday(date) ? 'bg-primary-500 text-white font-bold' : 'text-neutral-700 dark:text-neutral-300'
                    )}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={cn('w-full text-left px-2 py-1 rounded text-xs text-white truncate', event.color)}
                        >
                          {event.startTime} {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-xs text-neutral-500 px-2">+{dayEvents.length - 2} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Service Call</span>
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
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Consultation</span>
          </div>
        </div>
      </Card>

      {/* Upcoming Events Sidebar */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events.slice(0, 5).map(event => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer" onClick={() => setSelectedEvent(event)}>
              <Avatar name={event.employeeName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 dark:text-white truncate">{event.title}</p>
                <p className="text-sm text-neutral-500 truncate">{event.customer}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {event.date.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.startTime}
                  </span>
                </div>
              </div>
              <Badge className={statusColors[event.status]}>{event.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Event Detail Modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details" size="md">
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn('w-4 h-4 rounded', selectedEvent.color)} />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{selectedEvent.title}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <User className="w-4 h-4" />
                <span>{selectedEvent.employeeName}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span>{selectedEvent.date.toLocaleDateString()} | {selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 mb-1">Customer</p>
              <p className="font-medium text-neutral-900 dark:text-white">{selectedEvent.customer}</p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedEvent(null)}>Close</Button>
              <Button className="flex-1">Edit Event</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default EmployeeSchedulePage;
